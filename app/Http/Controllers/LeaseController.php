<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaseRequest;
use App\Http\Requests\UpdateLeaseRequest;
use App\Models\Lease;
use App\Models\Room;
use App\Models\Renter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaseController extends Controller
{
    /**
     * Display a listing of leases across landlord properties.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $search = trim($request->input('search', ''));

        $leases = Lease::query()
            ->whereHas('room.property', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->with(['room.property', 'renter'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('renter', function ($renterQuery) use ($search) {
                        $renterQuery->where('first_name', 'ilike', "%{$search}%")
                            ->orWhere('last_name', 'ilike', "%{$search}%");
                    })
                        ->orWhereHas('room', function ($roomQuery) use ($search) {
                            $roomQuery->where('room_number', 'ilike', "%{$search}%")
                                ->orWhereHas('property', function ($propertyQuery) use ($search) {
                                    $propertyQuery->where('name', 'ilike', "%{$search}%");
                                });
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Leases/Index', [
            'leases' => $leases,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new lease agreement.
     *
     * @param Request $request
     * @return Response
     */
    public function create(Request $request): Response
    {
        $rooms = Room::whereHas('property', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->where('status', 'available')
            ->with('property:id,name')
            ->get();

        // Select all registered users (acting as potential renters)
        $renters = Renter::where('user_id', $request->user()->id)
            ->select('id', 'first_name', 'last_name', 'email')
            ->get();

        return Inertia::render('Leases/Create', [
            'rooms' => $rooms,
            'renters' => $renters,
            'selectedRoomId' => $request->query('room_id'),
        ]);
    }

    /**
     * Store a new lease and update the room's status to 'occupied'.
     *
     * @param StoreLeaseRequest $request
     * @return RedirectResponse
     * @throws \Throwable
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
            'lease' => $lease->load(['room.property', 'renter']),
        ]);
    }

    /**
     * Show the form for editing an existing lease.
     *
     * @param Request $request
     * @param Lease $lease
     * @return Response
     */
    public function edit(Request $request, Lease $lease): Response
    {
        $this->authorize('update', $lease);

        $rooms = Room::whereHas('property', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->with('property:id,name')->get();

        $renters = Renter::where('user_id', $request->user()->id)
            ->select('id', 'first_name', 'last_name', 'email')
            ->get();

        return Inertia::render('Leases/Edit', [
            'lease' => $lease->load(['room', 'renter']),
            'rooms' => $rooms,
            'renters' => $renters,
        ]);
    }

    /**
     * Update the lease and sync room status accordingly.
     *
     * @param UpdateLeaseRequest $request
     * @param Lease $lease
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(UpdateLeaseRequest $request, Lease $lease): RedirectResponse
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
     *
     * @param Lease $lease
     * @return RedirectResponse
     * @throws \Throwable
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
