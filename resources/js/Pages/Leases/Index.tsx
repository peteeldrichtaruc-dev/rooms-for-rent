import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

interface Property {
    id: number;
    name: string;
}

interface Room {
    id: number;
    room_number: string;
    property: Property;
}

interface Tenant {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Lease {
    id: number;
    rent_amount: number;
    start_date: string;
    end_date: string;
    status: "active" | "expired" | "terminated" | "pending";
    room: Room;
    tenant: Tenant;
    created_at: string;
}

interface PaginatedLeases {
    data: Lease[];
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

export default function Index({
    leases,
    filters,
}: {
    leases: PaginatedLeases;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search || "");

    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route("leases.index"),
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

    const getStatusBadge = (status: Lease["status"]) => {
        switch (status) {
            case "active":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                        Active
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
                        Pending
                    </span>
                );
            case "expired":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200">
                        Expired
                    </span>
                );
            case "terminated":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100">
                        Terminated
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

    const formatDate = (dateString: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Lease Agreements
                        </h1>
                        <p className="text-xs text-slate-500">
                            Manage tenant occupancy, rental rates, and lease
                            terms.
                        </p>
                    </div>
                    <Link
                        href={route("leases.create")}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                        + Create New Lease
                    </Link>
                </div>
            }
        >
            <Head title="Leases" />

            <div className="space-y-6">
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
                            placeholder="Search leases by tenant, room, or property..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                    </div>
                    {leases.total > 0 && (
                        <span className="text-xs font-medium text-slate-400">
                            Showing {leases.from}–{leases.to} of {leases.total}{" "}
                            leases
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3.5 px-6">Tenant</th>
                                    <th className="py-3.5 px-6">
                                        Property / Room
                                    </th>
                                    <th className="py-3.5 px-6">Rent Amount</th>
                                    <th className="py-3.5 px-6">Lease Term</th>
                                    <th className="py-3.5 px-6 text-center">
                                        Status
                                    </th>
                                    <th className="py-3.5 px-6 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {leases.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-12 text-center text-slate-400"
                                        >
                                            No lease agreements found matching "
                                            {filters.search}".
                                        </td>
                                    </tr>
                                ) : (
                                    leases.data.map((lease) => (
                                        <tr
                                            key={lease.id}
                                            className="hover:bg-slate-50/80 transition"
                                        >
                                            <td className="py-4 px-6 font-bold text-slate-900">
                                                {lease.tenant
                                                    ? `${lease.tenant.first_name} ${lease.tenant.last_name}`
                                                    : "—"}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-slate-800">
                                                    {lease.room?.property
                                                        ?.name || "—"}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    Room{" "}
                                                    {lease.room?.room_number ||
                                                        "N/A"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                ₱
                                                {Number(
                                                    lease.rent_amount,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">
                                                {formatDate(lease.start_date)} –{" "}
                                                {formatDate(lease.end_date)}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {getStatusBadge(lease.status)}
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <Link
                                                    href={route(
                                                        "leases.show",
                                                        lease.id,
                                                    )}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "leases.edit",
                                                        lease.id,
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
                    {leases.total > leases.per_page && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="text-xs text-slate-500">
                                Page {leases.current_page} of {leases.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {leases.links.map((link, index) => (
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
