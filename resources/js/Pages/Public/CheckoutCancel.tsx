import { Head, Link } from "@inertiajs/react";

interface CheckoutCancelProps {
    invoiceId?: string;
    checkoutUrl: string;
}

export default function CheckoutCancel({
    invoiceId,
    checkoutUrl,
}: CheckoutCancelProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title="Payment Canceled" />

            <div
                className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6 relative overflow-hidden"
                data-aos="zoom-in"
                data-aos-duration="300"
            >
                {/* Decorative Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-orange-500" />

                {/* Cancel Icon Badge */}
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Content Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Payment Canceled
                    </h1>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Your checkout session was canceled or timed out. No
                        charges were made to your account.
                    </p>
                </div>

                {/* Information Callout */}
                <div className="bg-amber-50/60 rounded-2xl p-4 text-left border border-amber-100 text-xs text-amber-900 space-y-1">
                    <p className="font-bold">
                        Need assistance with your payment?
                    </p>
                    <p className="text-amber-700/80 text-[11px] leading-relaxed">
                        If you encountered an issue during checkout or need
                        alternative payment instructions, please contact
                        property support.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                    {invoiceId ? (
                        <Link
                            href={checkoutUrl}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm"
                        >
                            Retry Payment
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
