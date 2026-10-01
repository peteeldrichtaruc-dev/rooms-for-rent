<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class PaymentController extends Controller
{
    /**
     * Create a Stripe Checkout Session for a given invoice.
     *
     * @param Request $request
     * @param Invoice $invoice
     * @return RedirectResponse
     */
    public function checkout(Request $request, Invoice $invoice): RedirectResponse
    {
        if ($invoice->status === 'paid') {
            return back()->with('error', 'Invoice is already paid.');
        }

        $secretKey = config('services.stripe.secret');

        if (empty($secretKey)) {
            Log::error('Stripe secret key missing.');
            return back()->with('error', 'Payment gateway configuration error.');
        }

        Stripe::setApiKey($secretKey);

        $roomNumber = $invoice->lease?->room?->room_number ?? 'N/A';
        $renterEmail = $invoice->lease?->renter?->email ?? 'renter@example.com';

        // Stripe expects amount in centavos for PHP (e.g., ₱1,500.00 -> 150000)
        $amountInCentavos = (int)round($invoice->amount * 100);

        try {
            $checkoutSession = StripeSession::create([
                'customer_email' => $renterEmail,
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'php',
                        'product_data' => [
                            'name' => "Invoice #{$invoice->id} — Room {$roomNumber}",
                            'description' => 'Monthly Rent Payment',
                        ],
                        'unit_amount' => $amountInCentavos,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'client_reference_id' => (string)$invoice->id,
                'metadata' => [
                    'invoice_id' => $invoice->id,
                ],
                'success_url' => url("/invoices/{$invoice->id}?payment=success"),
                'cancel_url' => url("/invoices/{$invoice->id}?payment=cancelled"),
            ]);

            return redirect()->away($checkoutSession->url);
        } catch (\Exception $e) {
            Log::error('Stripe Checkout Session creation failed', [
                'invoice_id' => $invoice->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Unable to initiate payment session. Please try again.');
        }
    }
}
