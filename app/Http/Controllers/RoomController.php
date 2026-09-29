<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms across user properties.
     */
    public function index(Request $request): Response
    {
        $rooms = $request->user()
            ->rooms()
            ->with('property')
            ->latest()
            ->get();

        return Inertia::render('Rooms/Index', [
            'rooms' => $rooms,
        ]);
    }

    /**
     * Show the form for creating a new room.
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
     */
    public function store(StoreRoomRequest $request): RedirectResponse
    {
        Room::create($request->validated());

        return redirect()->route('properties.show', $request->property_id)
            ->with('success', 'Room added successfully.');
    }

    /**
     * Display the specified room.
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
     */
    public function update(StoreRoomRequest $request, Room $room): RedirectResponse
    {
        $this->authorize('update', $room);

        $room->update($request->validated());

        return redirect()->route('rooms.show', $room->id)
            ->with('success', 'Room details updated.');
    }

    /**
     * Remove the specified room from storage.
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
