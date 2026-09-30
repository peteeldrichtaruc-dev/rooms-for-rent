<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms across user properties.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $search = trim($request->input('search', ''));

        $rooms = $request->user()
            ->rooms()
            ->with('property')
            ->when($search !== '', function ($roomQuery) use ($search) {
                $roomQuery->where(function ($q) use ($search) {
                    $q->where('room_number', 'ilike', "%{$search}%")
                        ->orWhereHas('property', function ($propertyQuery) use ($search) {
                            $propertyQuery->where('name', 'ilike', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Rooms/Index', [
            'rooms' => $rooms,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new room.
     *
     * @param Request $request
     * @return Response
     */
    public function create(Request $request): Response
    {
        $properties = $request->user()->properties()->select('id', 'name')->get();

        return Inertia::render('Rooms/Create', [
            'properties' => $properties,
            'selectedPropertyId' => $request->query('property_id'),
        ]);
    }

    /**
     * Store a newly created room in storage.
     *
     * @param StoreRoomRequest $request
     * @return RedirectResponse
     */
    public function store(StoreRoomRequest $request): RedirectResponse
    {
        Room::create($request->validated());

        return redirect()->route('properties.show', $request->property_id)
            ->with('success', 'Room added successfully.');
    }

    /**
     * Display the specified room.
     *
     * @param Room $room
     * @return Response
     */
    public function show(Room $room): Response
    {
        $this->authorize('view', $room);

        $room->load('property');

        return Inertia::render('Rooms/Show', [
            'room' => $room,
        ]);
    }

    /**
     * Show the form for editing the specified room.
     *
     * @param Request $request
     * @param Room $room
     * @return Response
     */
    public function edit(Request $request, Room $room): Response
    {
        $this->authorize('update', $room);

        $properties = $request->user()->properties()->select('id', 'name')->get();

        return Inertia::render('Rooms/Edit', [
            'room' => $room->load('property'),
            'properties' => $properties,
        ]);
    }

    /**
     * Update the specified room in storage.
     *
     * @param UpdateRoomRequest $request
     * @param Room $room
     * @return RedirectResponse
     */
    public function update(UpdateRoomRequest $request, Room $room): RedirectResponse
    {
        $this->authorize('update', $room);

        $room->update($request->validated());

        return redirect()->route('rooms.show', $room->id)
            ->with('success', 'Room details updated.');
    }

    /**
     * Remove the specified room from storage.
     *
     * @param Room $room
     * @return RedirectResponse
     */
    public function destroy(Room $room): RedirectResponse
    {
        $this->authorize('delete', $room);

        $propertyId = $room->property_id;
        $room->delete();

        return redirect()->route('properties.show', $propertyId)
            ->with('success', 'Room deleted successfully.');
    }
}
