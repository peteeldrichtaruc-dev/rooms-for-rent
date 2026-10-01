<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Display checkout success page after successful Stripe payment.
     *
     * @param Request $request
     * @return Response
     */
    public function success(Request $request): Response
    {
        $sessionId = $request->query('session_id');

        $invoiceNumber = $request->query('invoice_number');

        return Inertia::render('Public/CheckoutSuccess', [
            'sessionId' => $sessionId,
            'invoiceNumber' => $invoiceNumber,
        ]);
    }

    /**
     * Display checkout cancellation page when tenant cancels or exits Stripe payment.
     *
     * @param Request $request
     * @return Response
     */
    public function cancel(Request $request): Response
    {
        $invoiceId = $request->query('invoice_id');
        $checkoutUrl = $request->query('checkout_url');

        return Inertia::render('Public/CheckoutCancel', [
            'invoiceId' => $invoiceId,
            'checkoutUrl' => $checkoutUrl,
        ]);
    }
}
