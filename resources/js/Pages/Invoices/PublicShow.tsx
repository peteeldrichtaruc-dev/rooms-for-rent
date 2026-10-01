import React from "react";
import { Head, router } from "@inertiajs/react";

interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    due_date: string;
    paid_at?: string;
    status: "pending" | "paid" | "overdue" | "cancelled";
    payment_method?: string;
    description?: string;
    lease?: {
        renter?: {
            first_name: string;
            last_name: string;
            email?: string;
            phone?: string;
        };
        room?: {
            room_number: string;
            property?: { name: string };
        };
    };
}

export default function PublicShow({
    invoice,
    checkoutUrl,
}: {
    invoice: Invoice;
    checkoutUrl: string;
}) {
    const renter = invoice.lease?.renter;
    const room = invoice.lease?.room;

    const handlePayNow = () => {
        router.post(checkoutUrl);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Head title={`Pay Invoice #${invoice.invoice_number}`} />

            <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 space-y-6">
                {/* Header */}
                <div className="text-center border-b border-slate-100 pb-5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        RoomsForRent
                    </span>
                    <h1 className="text-2xl font-black text-slate-900 mt-1">
                        Invoice #{invoice.invoice_number}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {room?.property?.name ? `${room.property.name} — ` : ""}
                        Room {room?.room_number ?? "N/A"}
                    </p>
                </div>

                {/* Renter Information Card */}
                {renter && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Billed To
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                            {renter.first_name} {renter.last_name}
                        </p>
                        {renter.email && (
                            <p className="text-xs text-slate-500">
                                {renter.email}
                            </p>
                        )}
                        {renter.phone && (
                            <p className="text-xs text-slate-500">
                                {renter.phone}
                            </p>
                        )}
                    </div>
                )}

                {/* Amount & Due Date */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Amount Due
                        </p>
                        <p className="text-2xl font-black text-slate-900 mt-0.5">
                            ₱{" "}
                            {Number(invoice.amount).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                            Due Date
                        </p>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                            {invoice.due_date}
                        </p>
                    </div>
                </div>

                {/* Action Button / Paid Badge */}
                {invoice.status !== "paid" ? (
                    <button
                        onClick={handlePayNow}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        Pay Online via Stripe
                    </button>
                ) : (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                        <p className="text-xs font-bold text-emerald-700">
                            ✓ Invoice Paid
                        </p>
                        {invoice.paid_at && (
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                Settled on {invoice.paid_at}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}