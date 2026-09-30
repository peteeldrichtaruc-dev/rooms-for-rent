<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTenantRequest;
use App\Http\Requests\UpdateTenantRequest;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class TenantController
 *
 * Handles HTTP requests for managing tenant directory records and profiles.
 *
 * @package App\Http\Controllers
 */
class TenantController extends Controller
{
    /**
     * Display a paginated list of tenants owned by the authenticated user.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $search = trim($request->input('search', ''));

        $tenants = $request->user()
            ->tenants()
            ->withCount('leases')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'ilike', "%{$search}%")
                        ->orWhere('last_name', 'ilike', "%{$search}%")
                        ->orWhere('email', 'ilike', "%{$search}%")
                        ->orWhere('phone', 'ilike', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Tenants/Index', [
            'tenants' => $tenants,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Render the form view to create a new tenant profile.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Tenants/Create');
    }

    /**
     * Store a newly created tenant record in storage.
     *
     * @param \App\Http\Requests\StoreTenantRequest $request
     * @return RedirectResponse
     */
    public function store(StoreTenantRequest $request): RedirectResponse
    {
        $request->user()->tenants()->create($request->validated());

        return redirect()->route('tenants.index')
            ->with('success', 'Tenant added successfully.');
    }

    /**
     * Display the detailed profile and lease history of a specific tenant.
     *
     * @param Tenant $tenant
     * @return Response
     */
    public function show(Tenant $tenant): Response
    {
        $this->authorize('view', $tenant);

        $tenant->load(['leases.room.property']);

        return Inertia::render('Tenants/Show', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Render the form view to edit an existing tenant's information.
     *
     * @param Tenant $tenant
     * @return Response
     */
    public function edit(Tenant $tenant): Response
    {
        $this->authorize('update', $tenant);

        return Inertia::render('Tenants/Edit', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Update the specified tenant record in storage.
     *
     * @param UpdateTenantRequest $request
     * @param Tenant $tenant
     * @return RedirectResponse
     */
    public function update(UpdateTenantRequest $request, Tenant $tenant): RedirectResponse
    {
        $tenant->update($request->validated());

        return redirect()->route('tenants.show', $tenant->id)
            ->with('success', 'Tenant updated successfully.');
    }

    /**
     * Remove the specified tenant record from storage.
     *
     * @param Tenant $tenant
     * @return RedirectResponse
     */
    public function destroy(Tenant $tenant): RedirectResponse
    {
        $this->authorize('delete', $tenant);

        $tenant->delete();

        return redirect()->route('tenants.index')
            ->with('success', 'Tenant deleted successfully.');
    }
}
