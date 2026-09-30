<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;

/**
 * Class InvoiceController
 *
 * Manages billing statements, invoice generation, status tracking, and checkout.
 *
 * @package App\Http\Controllers
 */
class InvoiceController extends Controller
{
    /**
     * Display a listing of all invoices with summary stats.
     *
     * @return Response
     */
    public function index(): Response
    {
        $user = auth()->user();

        $invoices = Invoice::where('user_id', $user->id)
            ->with(['lease.tenant', 'lease.room.property'])
            ->latest()
            ->paginate(10);

        $stats = [
            'total_billed' => Invoice::where('user_id', $user->id)->sum('amount'),
            'total_paid' => Invoice::where('user_id', $user->id)->where('status', 'paid')->sum('amount'),
            'total_pending' => Invoice::where('user_id', $user->id)->whereIn('status', ['pending', 'overdue'])->sum('amount'),
            'overdue_count' => Invoice::where('user_id', $user->id)->where('status', 'overdue')->count(),
        ];

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'stats' => $stats,
        ]);
    }

    /**
     * Render creation form with available active leases.
     *
     * @return Response
     */
    public function create(): Response
    {
        $leases = auth()->user()->leases()
            ->with(['tenant', 'room.property'])
            ->where('status', 'active')
            ->get();

        return Inertia::render('Invoices/Create', [
            'leases' => $leases,
        ]);
    }

    /**
     * Store a new invoice record.
     *
     * @param StoreInvoiceRequest $request
     * @return RedirectResponse
     */
    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $invoiceNumber = 'INV-' . strtoupper(Str::random(8));

        $request->user()->invoices()->create([
            'lease_id' => $request->lease_id,
            'invoice_number' => $invoiceNumber,
            'amount' => $request->amount,
            'due_date' => $request->due_date,
            'status' => 'pending',
            'description' => $request->description,
        ]);

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice generated successfully.');
    }

    /**
     * Display specific invoice details.
     *
     * @param Invoice $invoice
     * @return Response
     */
    public function show(Invoice $invoice): Response
    {
        $this->authorize('view', $invoice);

        $invoice->load(['lease.tenant', 'lease.room.property']);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Initiate Stripe Checkout Session for online invoice settlement.
     *
     * @param Invoice $invoice
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws ApiErrorException
     */
    public function checkout(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        if ($invoice->status === 'paid') {
            return redirect()->back()->with('error', 'This invoice has already been paid.');
        }

        $stripe = new StripeClient(config('services.stripe.secret'));

        $checkoutSession = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'php',
                    'product_data' => [
                        'name' => 'Rental Invoice ' . $invoice->invoice_number,
                        'description' => $invoice->description ?? 'Monthly Rent Payment',
                    ],
                    'unit_amount' => (int)($invoice->amount * 100), // Amount in cents/centavos
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('invoices.show', $invoice->id) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('invoices.show', $invoice->id),
            'metadata' => [
                'invoice_id' => $invoice->id,
            ],
        ]);

        return Inertia::location($checkoutSession->url);
    }

    /**
     * Mark an invoice as paid directly (Cash).
     *
     * @param Invoice $invoice
     * @return RedirectResponse
     */
    public function markAsPaid(Invoice $invoice): RedirectResponse
    {
        $this->authorize('update', $invoice);

        $invoice->update([
            'status' => 'paid',
            'paid_at' => now()->toDateString(),
            'payment_method' => 'Cash',
        ]);

        return redirect()->back()
            ->with('success', 'Invoice marked as paid.');
    }

    /**
     * Delete an invoice.
     *
     * @param Invoice $invoice
     * @return RedirectResponse
     */
    public function destroy(Invoice $invoice): RedirectResponse
    {
        $this->authorize('delete', $invoice);

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }
}
