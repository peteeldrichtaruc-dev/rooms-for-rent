import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

interface Tenant {
    id: number;
    first_name: string;
    last_name: string;
}

interface Property {
    id: number;
    name: string;
}

interface Room {
    id: number;
    room_number: string;
    property: Property;
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
    status: "paid" | "pending" | "overdue" | "cancelled";
    lease: Lease;
    created_at: string;
}

interface PaginatedInvoices {
    data: Invoice[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
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
    filters,
}: {
    invoices: PaginatedInvoices;
    stats: Stats;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search || "");

    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route("invoices.index"),
                    { search: query },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }, 300),
        [],
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: Invoice["status"]) => {
        switch (status) {
            case "paid":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                        Paid
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
                        Pending
                    </span>
                );
            case "overdue":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100">
                        Overdue
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100">
                        {status}
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Invoices & Billing
                        </h1>
                        <p className="text-xs text-slate-500">
                            Track tenant statements, pending collections, and
                            payment statuses.
                        </p>
                    </div>
                    <Link
                        href={route("invoices.create")}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                        + Create Invoice
                    </Link>
                </div>
            }
        >
            <Head title="Invoices" />

            <div className="space-y-6">
                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Total Billed
                        </span>
                        <p className="text-xl font-extrabold text-slate-900 mt-1">
                            ₱{Number(stats.total_billed || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            Total Paid
                        </span>
                        <p className="text-xl font-extrabold text-emerald-700 mt-1">
                            ₱{Number(stats.total_paid || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                            Pending Balance
                        </span>
                        <p className="text-xl font-extrabold text-amber-700 mt-1">
                            ₱{Number(stats.total_pending || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                            Overdue Invoices
                        </span>
                        <p className="text-xl font-extrabold text-rose-700 mt-1">
                            {stats.overdue_count || 0}
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <svg
                            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="search"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search invoices by tenant, room, or invoice #..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                    </div>
                    {invoices.total > 0 && (
                        <span className="text-xs font-medium text-slate-400">
                            Showing {invoices.from}–{invoices.to} of{" "}
                            {invoices.total} invoices
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3.5 px-6">Invoice #</th>
                                    <th className="py-3.5 px-6">Tenant</th>
                                    <th className="py-3.5 px-6">
                                        Property / Room
                                    </th>
                                    <th className="py-3.5 px-6">Amount</th>
                                    <th className="py-3.5 px-6">Due Date</th>
                                    <th className="py-3.5 px-6 text-center">
                                        Status
                                    </th>
                                    <th className="py-3.5 px-6 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {invoices.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-12 text-center text-slate-400"
                                        >
                                            No invoices found matching "
                                            {filters.search}".
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.data.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className="hover:bg-slate-50/80 transition"
                                        >
                                            <td className="py-4 px-6 font-bold text-slate-900">
                                                {invoice.invoice_number ||
                                                    `#INV-${invoice.id}`}
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                {invoice.lease?.tenant
                                                    ? `${invoice.lease.tenant.first_name} ${invoice.lease.tenant.last_name}`
                                                    : "—"}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-slate-800">
                                                    {invoice.lease?.room
                                                        ?.property?.name || "—"}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    Room{" "}
                                                    {invoice.lease?.room
                                                        ?.room_number || "N/A"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                ₱
                                                {Number(
                                                    invoice.amount,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                                                {formatDate(invoice.due_date)}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {getStatusBadge(invoice.status)}
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <Link
                                                    href={route(
                                                        "invoices.show",
                                                        invoice.id,
                                                    )}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "invoices.edit",
                                                        invoice.id,
                                                    )}
                                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {invoices.total > invoices.per_page && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="text-xs text-slate-500">
                                Page {invoices.current_page} of{" "}
                                {invoices.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {invoices.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        preserveState
                                        preserveScroll
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : link.url
                                                  ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                                                  : "text-slate-300 pointer-events-none"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
