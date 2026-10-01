<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Lease;
use App\Models\Property;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class DashboardController
 *
 * Handles live metrics and activity streams using room-property relationships.
 *
 * @package App\Http\Controllers
 */
class DashboardController extends Controller
{
    /**
     * Display the application dashboard with real-time stats.
     *
     * @param Request $request
     * @return Response
     */
    public function __invoke(Request $request): Response
    {
        $userId = $request->user()->id;

        // 1. Properties Stats
        $totalProperties = Property::where('user_id', $userId)->count();
        $newPropertiesThisMonth = Property::where('user_id', $userId)
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        // 2. Rooms & Occupancy
        $totalRooms = Room::whereHas('property', fn($q) => $q->where('user_id', $userId))->count();
        $occupiedRooms = Room::whereHas('property', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'occupied')
            ->count();

        $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

        // 3. Lease Metrics via Room -> Property Relationship
        $activeLeases = Lease::whereHas('room.property', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'active')
            ->count();

        $expiringSoonLeases = Lease::whereHas('room.property', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'active')
            ->whereBetween('end_date', [now(), now()->addDays(30)])
            ->count();

        $pendingRenewals = Lease::whereHas('room.property', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'pending_renewal')
            ->count();

        // 4. Monthly Revenue (Paid invoices linked to user's properties)
        $monthlyRevenue = Invoice::whereHas('lease.room.property', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'paid')
            ->where('paid_at', '>=', now()->startOfMonth())
            ->sum('amount');

        // 5. Recent Activity Stream
        $recentPayments = Invoice::query()
            ->whereHas('lease.room.property', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'paid')
            ->with(['lease.renter:id,first_name,last_name', 'lease.room:id,room_number'])
            ->latest('paid_at')
            ->take(3)
            ->get();

        $recentLeases = Lease::query()
            ->whereHas('room.property', fn($q) => $q->where('user_id', $userId))
            ->with(['renter:id,first_name,last_name', 'room:id,room_number'])
            ->latest('created_at')
            ->take(3)
            ->get();

        $activities = collect();

        foreach ($recentPayments as $payment) {
            $activities->push([
                'id' => 'pay-' . $payment->id,
                'type' => 'payment',
                'title' => 'Room ' . ($payment->lease?->room?->room_number ?? 'N/A') . ' — Payment Received',
                'subtitle' => 'Renter: ' . ($payment->lease?->renter?->first_name ?? '') . ' ' . ($payment->lease?->renter?->last_name ?? '') . ' • ₱' . number_format($payment->amount, 2),
                'timestamp' => $payment->paid_at ? $payment->paid_at->diffForHumans() : $payment->updated_at->diffForHumans(),
                'sort_date' => $payment->paid_at ?? $payment->updated_at,
            ]);
        }

        foreach ($recentLeases as $lease) {
            $activities->push([
                'id' => 'lease-' . $lease->id,
                'type' => 'lease',
                'title' => 'New Lease Signed — Room ' . ($lease->room?->room_number ?? 'N/A'),
                'subtitle' => 'Renter: ' . ($lease->renter?->first_name ?? '') . ' ' . ($lease->renter?->last_name ?? ''),
                'timestamp' => $lease->created_at->diffForHumans(),
                'sort_date' => $lease->created_at,
            ]);
        }

        $sortedActivities = $activities->sortByDesc('sort_date')->values()->take(5)->toArray();

        return Inertia::render('Dashboard', [
            'stats' => [
                'properties_count' => $totalProperties,
                'new_properties_count' => $newPropertiesThisMonth,
                'rooms_count' => $totalRooms,
                'occupied_rooms_count' => $occupiedRooms,
                'occupancy_rate' => $occupancyRate,
                'active_leases_count' => $activeLeases,
                'expiring_soon_count' => $expiringSoonLeases,
                'pending_renewals_count' => $pendingRenewals,
                'monthly_revenue' => $monthlyRevenue,
            ],
            'recentActivities' => $sortedActivities,
        ]);
    }
}
