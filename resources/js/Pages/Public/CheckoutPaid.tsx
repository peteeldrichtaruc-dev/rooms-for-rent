import { Head, Link } from "@inertiajs/react";

interface CheckoutPaidProps {
    invoiceNumber: string;
    amount: number;
    paidAt?: string;
}

export default function CheckoutPaid({
    invoiceNumber,
    amount,
    paidAt,
}: CheckoutPaidProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title="Invoice Already Settled" />

            <div
                className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 text-center space-y-6 relative overflow-hidden"
                data-aos="zoom-in"
                data-aos-duration="300"
            >
                {/* Decorative Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

                {/* Badge Icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                {/* Content Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Invoice Already Paid
                    </h1>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        This invoice has already been fully settled. No further
                        payment action is required.
                    </p>
                </div>

                {/* Invoice Summary Box */}
                <div className="bg-slate-50/80 rounded-2xl p-4 text-left border border-slate-100 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-400">
                            Invoice Reference:
                        </span>
                        <span className="font-bold text-slate-800">
                            #{invoiceNumber}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-400">
                            Amount Settled:
                        </span>
                        <span className="font-extrabold text-slate-900">
                            ₱
                            {Number(amount).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}
                        </span>
                    </div>

                    {paidAt && (
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-slate-400">
                                Date Settled:
                            </span>
                            <span className="font-medium text-slate-600 text-[11px]">
                                {paidAt}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                        <span className="font-medium text-slate-400">
                            Status:
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Fully Paid
                        </span>
                    </div>
                </div>

                {/* Action */}
                <div className="pt-2">
                    <Link
                        href={route("dashboard")}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-md"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
