import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

interface Tenant {
    id: number;
    full_name?: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Room {
    id: number;
    room_number: string;
    property?: {
        name: string;
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
    lease: Lease;
}

interface PaginatedInvoices {
    data: Invoice[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Stats {
    total_billed: number;
    total_paid: number;
    total_pending: number;
    overdue_count: number;
}

export default function Index({
    invoices,
    stats,
}: {
    invoices: PaginatedInvoices;
    stats: Stats;
}) {
    const handleMarkAsPaid = (invoiceId: number) => {
        if (confirm("Mark this invoice as paid?")) {
            router.patch(route("invoices.mark-as-paid", invoiceId));
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Billing & Invoices
                        </h1>
                        <p className="text-xs text-slate-500">
                            Track tenant billing statements, payments, and
                            outstanding balances.
                        </p>
                    </div>
                    <Link
                        href={route("invoices.create")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                    >
                        + Create Invoice
                    </Link>
                </div>
            }
        >
            <Head title="Billing & Invoices - RoomsForRent" />

            <div className="space-y-6">
                {/* Stats Summary Cards */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    data-aos="fade-up"
                >
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Total Billed
                        </p>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                            ₱{Number(stats.total_billed).toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                            Collected Payments
                        </p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">
                            ₱{Number(stats.total_paid).toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                            Outstanding Balance
                        </p>
                        <p className="text-2xl font-black text-amber-600 mt-1">
                            ₱{Number(stats.total_pending).toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                            Overdue Invoices
                        </p>
                        <p className="text-2xl font-black text-red-600 mt-1">
                            {stats.overdue_count}
                        </p>
                    </div>
                </div>

                {/* Invoices Table */}
                <div
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5">Invoice #</th>
                                <th className="px-6 py-3.5">Tenant / Unit</th>
                                <th className="px-6 py-3.5">Amount</th>
                                <th className="px-6 py-3.5">Due Date</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-slate-400"
                                    >
                                        No billing invoices found. Click "+
                                        Create Invoice" to generate one.
                                    </td>
                                </tr>
                            ) : (
                                invoices.data.map((inv) => (
                                    <tr
                                        key={inv.id}
                                        className="hover:bg-slate-50/50 transition"
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-slate-900">
                                            {inv.invoice_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">
                                                {inv.lease?.tenant?.first_name}{" "}
                                                {inv.lease?.tenant?.last_name}
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                {
                                                    inv.lease?.room?.property
                                                        ?.name
                                                }{" "}
                                                — Room{" "}
                                                {inv.lease?.room?.room_number}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-extrabold text-slate-900">
                                            ₱
                                            {Number(
                                                inv.amount,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {inv.due_date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block ${
                                                    statusBadges[inv.status]
                                                }`}
                                            >
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {inv.status === "pending" && (
                                                <button
                                                    onClick={() =>
                                                        handleMarkAsPaid(inv.id)
                                                    }
                                                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                            <Link
                                                href={route(
                                                    "invoices.show",
                                                    inv.id,
                                                )}
                                                className="font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
