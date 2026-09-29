<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PropertyController extends Controller
{
    /**
     * Display a listing of properties belonging to the authenticated user.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        Log::info('Fetching property portfolio', [
            'user_id' => $request->user()->id,
        ]);

        $properties = $request->user()
            ->properties()
            ->withCount('rooms')
            ->latest()
            ->get();

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
        ]);
    }

    /**
     * Show the form for creating a new property.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Properties/Create');
    }

    /**
     * Store a newly created property in storage.
     *
     * @param StorePropertyRequest $request
     * @return RedirectResponse
     */
    public function store(StorePropertyRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $property = $request->user()->properties()->create($validated);

            Log::info('Property created successfully', [
                'property_id' => $property->id,
                'user_id' => $request->user()->id,
                'name' => $property->name,
            ]);

            return redirect()->route('properties.index')
                ->with('success', 'Property added successfully.');
        } catch (Throwable $e) {
            Log::error('Failed to create property', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
                'payload' => $validated,
            ]);

            return back()->withInput()->with('error', 'Failed to create property. Please try again.');
        }
    }

    /**
     * Display the specified property.
     *
     * @param Property $property
     * @return Response
     */
    public function show(Property $property): Response
    {
        $this->authorize('view', $property);

        $property->load(['rooms' => function ($query) {
            $query->latest();
        }]);

        return Inertia::render('Properties/Show', [
            'property' => $property,
        ]);
    }

    /**
     * Show the form for editing the specified property.
     *
     * @param Property $property
     * @return Response
     */
    public function edit(Property $property): Response
    {
        $this->authorize('update', $property);

        return Inertia::render('Properties/Edit', [
            'property' => $property,
        ]);
    }

    /**
     * Update the specified property in storage.
     *
     * @param UpdatePropertyRequest $request
     * @param Property $property
     * @return RedirectResponse
     */
    public function update(UpdatePropertyRequest $request, Property $property): RedirectResponse
    {
        $this->authorize('update', $property);

        $validated = $request->validated();

        try {
            $property->update($validated);

            Log::info('Property updated successfully', [
                'property_id' => $property->id,
                'user_id' => $request->user()->id,
            ]);

            return redirect()->route('properties.index')
                ->with('success', 'Property updated successfully.');
        } catch (Throwable $e) {
            Log::error('Failed to update property', [
                'property_id' => $property->id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withInput()->with('error', 'Failed to update property. Please try again.');
        }
    }

    /**
     * Remove the specified property from storage.
     *
     * @param Request $request
     * @param Property $property
     * @return RedirectResponse
     */
    public function destroy(Request $request, Property $property): RedirectResponse
    {
        $this->authorize('delete', $property);

        try {
            $propertyId = $property->id;
            $property->delete();

            Log::info('Property deleted successfully', [
                'property_id' => $propertyId,
                'user_id' => $request->user()->id,
            ]);

            return redirect()->route('properties.index')
                ->with('success', 'Property deleted successfully.');
        } catch (Throwable $e) {
            Log::error('Failed to delete property', [
                'property_id' => $property->id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to delete property. Please try again.');
        }
    }
}
