<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaseRequest;
use App\Models\Lease;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaseController extends Controller
{
    /**
     * Display a listing of leases across landlord properties.
     */
    public function index(Request $request): Response
    {
        $leases = Lease::whereHas('room.property', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->with(['room.property', 'tenant'])
            ->latest()
            ->get();

        return Inertia::render('Leases/Index', [
            'leases' => $leases,
        ]);
    }

    /**
     * Show the form for creating a new lease agreement.
     */
    public function create(Request $request): Response
    {
        $rooms = Room::whereHas('property', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->where('status', 'available')
            ->with('property:id,name')
            ->get();

        // Select all registered users (acting as potential tenants)
        $tenants = User::select('id', 'name', 'email')->get();

        return Inertia::render('Leases/Create', [
            'rooms' => $rooms,
            'tenants' => $tenants,
            'selectedRoomId' => $request->query('room_id'),
        ]);
    }

    /**
     * Store a new lease and update the room's status to 'occupied'.
     */
    public function store(StoreLeaseRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $lease = Lease::create($request->validated());

            if ($lease->status === 'active') {
                $lease->room()->update(['status' => 'occupied']);
            }
        });

        return redirect()->route('leases.index')
            ->with('success', 'Lease agreement created successfully.');
    }

    /**
     * Display specific lease details.
     */
    public function show(Lease $lease): Response
    {
        $this->authorize('view', $lease);

        return Inertia::render('Leases/Show', [
            'lease' => $lease->load(['room.property', 'tenant']),
        ]);
    }

    /**
     * Show the form for editing an existing lease.
     */
    public function edit(Request $request, Lease $lease): Response
    {
        $this->authorize('update', $lease);

        $rooms = Room::whereHas('property', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->with('property:id,name')->get();

        $tenants = User::select('id', 'name', 'email')->get();

        return Inertia::render('Leases/Edit', [
            'lease' => $lease->load(['room', 'tenant']),
            'rooms' => $rooms,
            'tenants' => $tenants,
        ]);
    }

    /**
     * Update the lease and sync room status accordingly.
     */
    public function update(StoreLeaseRequest $request, Lease $lease): RedirectResponse
    {
        $this->authorize('update', $lease);

        DB::transaction(function () use ($request, $lease) {
            $lease->update($request->validated());

            // If status changed to ended/terminated, make room available
            if (in_array($lease->status, ['ended', 'terminated'])) {
                $lease->room()->update(['status' => 'available']);
            } else if ($lease->status === 'active') {
                $lease->room()->update(['status' => 'occupied']);
            }
        });

        return redirect()->route('leases.show', $lease->id)
            ->with('success', 'Lease updated successfully.');
    }

    /**
     * Delete the lease agreement and make room available again.
     */
    public function destroy(Lease $lease): RedirectResponse
    {
        $this->authorize('delete', $lease);

        DB::transaction(function () use ($lease) {
            $room = $lease->room;
            $lease->delete();
            $room->update(['status' => 'available']);
        });

        return redirect()->route('leases.index')
            ->with('success', 'Lease agreement terminated and removed.');
    }
}
