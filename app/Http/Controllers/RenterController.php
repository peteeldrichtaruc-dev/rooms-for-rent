<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRenterRequest;
use App\Http\Requests\UpdateRenterRequest;
use App\Models\Renter;
use App\Notifications\InvoiceGeneratedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Class RenterController
 *
 * Handles HTTP requests for managing renter directory records and profiles.
 *
 * @package App\Http\Controllers
 */
class RenterController extends Controller
{
    /**
     * Display a paginated list of renters owned by the authenticated user.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $search = trim($request->input('search', ''));

        $renters = $request->user()
            ->renters()
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

        return Inertia::render('Renters/Index', [
            'renters' => $renters,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Dispatch payment & overdue reminders to active renters with pending balances.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function sendBulkReminders(Request $request): RedirectResponse
    {
        $rentersWithOverdueInvoices = Renter::whereHas('leases.invoices', function ($query) {
            $query->where('status', 'unpaid')
                ->where('due_date', '<=', now());
        })->with(['leases.invoices' => function ($query) {
            $query->where('status', 'unpaid')
                ->where('due_date', '<=', now());
        }])->get();

        if ($rentersWithOverdueInvoices->isEmpty()) {
            return redirect()->back()->with('info', 'No renters currently have overdue invoices.');
        }

        $sentCount = 0;

        foreach ($rentersWithOverdueInvoices as $renter) {
            foreach ($renter->leases as $lease) {
                foreach ($lease->invoices as $invoice) {
                    $renter->notify(new InvoiceGeneratedNotification($invoice));
                }
            }
            $sentCount++;
        }

        Log::info('Bulk payment reminders dispatched', [
            'triggered_by' => $request->user()->id,
            'recipients_count' => $sentCount,
        ]);

        return redirect()->back()->with('success', "Dispatched payment reminders to {$sentCount} renter(s).");
    }

    /**
     * Render the form view to create a new renter profile.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Renters/Create');
    }

    /**
     * Store a newly created renter record in storage.
     *
     * @param \App\Http\Requests\StoreRenterRequest $request
     * @return RedirectResponse
     */
    public function store(StoreRenterRequest $request): RedirectResponse
    {
        $request->user()->renters()->create($request->validated());

        return redirect()->route('renters.index')
            ->with('success', 'Renter added successfully.');
    }

    /**
     * Display the detailed profile and lease history of a specific renter.
     *
     * @param Renter $renter
     * @return Response
     */
    public function show(Renter $renter): Response
    {
        $this->authorize('view', $renter);

        $renter->load(['leases.room.property']);

        return Inertia::render('Renters/Show', [
            'renter' => $renter,
        ]);
    }

    /**
     * Render the form view to edit an existing renter's information.
     *
     * @param Renter $renter
     * @return Response
     */
    public function edit(Renter $renter): Response
    {
        $this->authorize('update', $renter);

        return Inertia::render('Renters/Edit', [
            'renter' => $renter,
        ]);
    }

    /**
     * Update the specified renter record in storage.
     *
     * @param UpdateRenterRequest $request
     * @param Renter $renter
     * @return RedirectResponse
     */
    public function update(UpdateRenterRequest $request, Renter $renter): RedirectResponse
    {
        $renter->update($request->validated());

        return redirect()->route('renters.show', $renter->id)
            ->with('success', 'Renter updated successfully.');
    }

    /**
     * Remove the specified renter record from storage.
     *
     * @param Renter $renter
     * @return RedirectResponse
     */
    public function destroy(Renter $renter): RedirectResponse
    {
        $this->authorize('delete', $renter);

        $renter->delete();

        return redirect()->route('renters.index')
            ->with('success', 'Renter deleted successfully.');
    }
}
