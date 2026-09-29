import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

interface Tenant {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

interface Room {
    id: number;
    room_number: string;
    property?: {
        name: string;
        address?: string;
    };
}

interface Lease {
    id: number;
    tenant: Tenant;
    room: Room;
}

interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    due_date: string;
    paid_at?: string;
    status: "pending" | "paid" | "overdue" | "cancelled";
    payment_method?: string;
    description?: string;
    created_at: string;
    lease: Lease;
}

export default function Show({ invoice }: { invoice: Invoice }) {
    const handleMarkAsPaid = () => {
        if (confirm("Mark this invoice as paid?")) {
            router.patch(route("invoices.mark-as-paid", invoice.id));
        }
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this invoice record?")) {
            router.delete(route("invoices.destroy", invoice.id));
        }
    };

    const statusBadges = {
        paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        overdue: "bg-red-50 text-red-700 border-red-200",
        cancelled: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                                {invoice.invoice_number}
                            </h1>
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadges[invoice.status]}`}
                            >
                                {invoice.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Billing Statement details and tenant info.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {invoice.status === "pending" && (
                            <button
                                onClick={handleMarkAsPaid}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                            >
                                Mark Paid
                            </button>
                        )}
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Print Statement
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice ${invoice.invoice_number} - RoomsForRent`} />

            <div className="max-w-3xl space-y-6" data-aos="fade-up">
                {/* Main Printable Invoice Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-8">
                    {/* Header Details */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                        <div>
                            <h2 className="text-lg font-black text-slate-900">
                                INVOICE STATEMENT
                            </h2>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                                #{invoice.invoice_number}
                            </p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-xs text-slate-500">
                                Due Date:{" "}
                                <span className="font-bold text-slate-900">
                                    {invoice.due_date}
                                </span>
                            </p>
                            {invoice.paid_at && (
                                <p className="text-xs text-emerald-600 font-medium">
                                    Paid Date:{" "}
                                    <span className="font-bold">
                                        {invoice.paid_at}
                                    </span>{" "}
                                    ({invoice.payment_method || "Cash"})
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Billed To / Property Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Billed To
                            </h3>
                            <p className="text-sm font-bold text-slate-900">
                                {invoice.lease?.tenant?.first_name}{" "}
                                {invoice.lease?.tenant?.last_name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {invoice.lease?.tenant?.email}
                            </p>
                            <p className="text-xs text-slate-500">
                                {invoice.lease?.tenant?.phone}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Rental Unit
                            </h3>
                            <p className="text-sm font-bold text-slate-900">
                                {invoice.lease?.room?.property?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                Room {invoice.lease?.room?.room_number}
                            </p>
                            {invoice.lease?.room?.property?.address && (
                                <p className="text-xs text-slate-400">
                                    {invoice.lease?.room?.property?.address}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3">Description</th>
                                    <th className="px-5 py-3 text-right">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                <tr>
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-slate-900">
                                            Rental & Utility Payment
                                        </div>
                                        <div className="text-slate-400 text-[11px] mt-0.5">
                                            {invoice.description ||
                                                "Standard monthly lease billing charge."}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-right font-extrabold text-slate-900">
                                        ₱
                                        {Number(
                                            invoice.amount,
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-slate-50/80 border-t border-slate-200">
                                <tr>
                                    <td className="px-5 py-3.5 font-bold text-slate-900 text-right">
                                        Total Due:
                                    </td>
                                    <td className="px-5 py-3.5 font-black text-slate-900 text-right text-sm">
                                        ₱
                                        {Number(
                                            invoice.amount,
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
