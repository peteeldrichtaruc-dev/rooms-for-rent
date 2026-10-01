<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\Invoice;
use App\Models\Lease;
use App\Notifications\InvoiceGeneratedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
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
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $search = trim($request->input('search', ''));

        $invoices = Invoice::query()
            ->where('user_id', $user->id)
            ->with(['lease.tenant', 'lease.room.property'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'ilike', "%{$search}%")
                        ->orWhereHas('lease.tenant', function ($tQuery) use ($search) {
                            $tQuery->where('first_name', 'ilike', "%{$search}%")
                                ->orWhere('last_name', 'ilike', "%{$search}%");
                        })
                        ->orWhereHas('lease.room', function ($rQuery) use ($search) {
                            $rQuery->where('room_number', 'ilike', "%{$search}%")
                                ->orWhereHas('property', function ($pQuery) use ($search) {
                                    $pQuery->where('name', 'ilike', "%{$search}%");
                                });
                        });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total_billed' => Invoice::where('user_id', $user->id)->sum('amount'),
            'total_paid' => Invoice::where('user_id', $user->id)->where('status', 'paid')->sum('amount'),
            'total_pending' => Invoice::where('user_id', $user->id)->whereIn('status', ['pending', 'overdue'])->sum('amount'),
            'overdue_count' => Invoice::where('user_id', $user->id)->where('status', 'overdue')->count(),
        ];

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
            ],
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
     * Generate monthly invoices for all active leases belonging to the landlord.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function generateMonthly(Request $request): RedirectResponse
    {
        $user = $request->user();
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $activeLeases = Lease::whereHas('room.property', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->where('status', 'active')
            ->with(['tenant', 'room'])
            ->get();

        if ($activeLeases->isEmpty()) {
            return redirect()->back()->with('warning', 'No active leases found to generate invoices.');
        }

        $generatedCount = 0;
        $skippedCount = 0;

        foreach ($activeLeases as $lease) {
            // 2. Prevent duplicate invoice generation for the current month
            $existingInvoice = Invoice::where('lease_id', $lease->id)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->exists();

            if ($existingInvoice) {
                $skippedCount++;
                continue;
            }

            // 3. Create the monthly invoice
            $invoice = Invoice::create([
                'user_id' => $user->id,
                'lease_id' => $lease->id,
                'invoice_number' => 'INV-' . strtoupper(uniqid()),
                'amount' => $lease->rent_amount,
                'due_date' => $now->copy()->addDays(5), // Set due date (e.g., 5 days from generation)
                'status' => 'pending',
                'description' => "Monthly Rent for {$now->format('F Y')}",
            ]);

            // 4. Send notification (Email + SMS) to tenant
            if ($lease->tenant) {
                $lease->tenant->notify(new InvoiceGeneratedNotification($invoice));
            }

            $generatedCount++;
        }

        if ($generatedCount === 0) {
            return redirect()->back()->with('info', "Invoices for {$now->format('F Y')} have already been generated for all active leases.");
        }

        return redirect()->back()->with('success', "Successfully generated {$generatedCount} invoice(s)." . ($skippedCount > 0 ? " {$skippedCount} skipped (already generated)." : ''));
    }

    /**
     * Initiate Stripe Checkout Session for online invoice settlement.
     *
     * @param Invoice $invoice
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws ApiErrorException
     */
    public function checkout(Invoice $invoice): \Symfony\Component\HttpFoundation\Response
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
     * Display a public, unauthenticated invoice view via signed URL.
     *
     * @param Invoice $invoice
     * @return Response
     */
    public function publicShow(Invoice $invoice): Response
    {
        $invoice->load(['lease.tenant', 'lease.room.property']);

        return Inertia::render('Invoices/PublicShow', [
            'invoice' => $invoice,
            'checkoutUrl' => URL::temporarySignedRoute(
                'invoices.public-checkout',
                now()->addDays(7),
                ['invoice' => $invoice->id]
            ),
        ]);
    }

    /**
     * Initiate Stripe Checkout from a public signed URL.
     *
     * @param Invoice $invoice
     * @return \Symfony\Component\HttpFoundation\Response|Response
     * @throws ApiErrorException
     */
    public function publicCheckout(Invoice $invoice): \Symfony\Component\HttpFoundation\Response|Response
    {
        if ($invoice->status === 'paid') {
            return Inertia::render('Public/CheckoutPaid', [
                'invoiceNumber' => $invoice->invoice_number,
                'amount' => $invoice->amount,
                'paidAt' => $invoice->updated_at->format('M d, Y h:i A'),
            ]);
        }

        $stripe = new StripeClient(config('services.stripe.secret'));

        // Generate signed URLs so public outcome routes remain secure
        $signedSuccessUrl = URL::signedRoute('checkout.success', [
            'invoice_number' => $invoice->invoice_number,
        ]);

        $successUrl = $signedSuccessUrl . '&session_id={CHECKOUT_SESSION_ID}';

        $cancelUrl = URL::signedRoute('checkout.cancel', [
            'invoice_id' => $invoice->id,
            'checkout_url' => URL::temporarySignedRoute(
                'invoices.public-show',
                now()->addDays(7),
                ['invoice' => $invoice->id]
            ),
        ]);

        $checkoutSession = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'customer_email' => $invoice->lease?->tenant?->email,
            'line_items' => [[
                'price_data' => [
                    'currency' => 'php',
                    'product_data' => [
                        'name' => 'Rental Invoice #' . $invoice->invoice_number,
                        'description' => $invoice->description ?? 'Monthly Rent Payment',
                    ],
                    'unit_amount' => (int)($invoice->amount * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
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
