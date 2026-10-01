import { Head, Link } from "@inertiajs/react";

interface CheckoutSuccessProps {
    sessionId?: string;
    invoiceNumber?: string;
}

export default function CheckoutSuccess({
    sessionId,
    invoiceNumber,
}: CheckoutSuccessProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title="Payment Successful" />

            <div
                className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6 relative overflow-hidden"
                data-aos="zoom-in"
                data-aos-duration="300"
            >
                {/* Decorative Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                {/* Success Icon Badge */}
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
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
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Content Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Payment Successful!
                    </h1>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Thank you! Your payment has been successfully processed
                        and verified. A receipt has been issued to your email
                        address.
                    </p>
                </div>

                {/* Session Details Card */}
                {(invoiceNumber || sessionId) && (
                    <div className="bg-slate-50/80 rounded-2xl p-4 text-left border border-slate-100 space-y-2">
                        {invoiceNumber && (
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-400">
                                    Invoice Reference:
                                </span>
                                <span className="font-bold text-slate-800">
                                    #{invoiceNumber}
                                </span>
                            </div>
                        )}
                        {sessionId && (
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-400">
                                    Transaction ID:
                                </span>
                                <span className="font-mono text-[11px] text-slate-600 truncate max-w-[160px]">
                                    {sessionId}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-slate-400">
                                Status:
                            </span>
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Completed
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
