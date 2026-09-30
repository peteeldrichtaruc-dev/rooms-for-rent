import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

interface Property {
    id: number;
    name: string;
    address: string;
    rooms_count?: number;
    created_at: string;
}

interface PaginatedProperties {
    data: Property[];
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
    properties,
    filters,
}: {
    properties: PaginatedProperties;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search || "");

    // Memoize the debounced request handler
    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route("properties.index"),
                    { search: query },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }, 300),
        [],
    );

    // Cancel pending debounce on component unmount
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Properties Portfolio
                        </h1>
                        <p className="text-xs text-slate-500">
                            Manage and track your property locations and room
                            counts.
                        </p>
                    </div>
                    <Link
                        href={route("properties.create")}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                        + Add New Property
                    </Link>
                </div>
            }
        >
            <Head title="Properties" />

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
                            placeholder="Search properties by name or address..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                    </div>
                    {properties.total > 0 && (
                        <span className="text-xs font-medium text-slate-400">
                            Showing {properties.from}–{properties.to} of{" "}
                            {properties.total} properties
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3.5 px-6">
                                        Property Name
                                    </th>
                                    <th className="py-3.5 px-6">Address</th>
                                    <th className="py-3.5 px-6 text-center">
                                        Total Rooms
                                    </th>
                                    <th className="py-3.5 px-6 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {properties.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-12 text-center text-slate-400"
                                        >
                                            No properties found matching "
                                            {filters.search}".
                                        </td>
                                    </tr>
                                ) : (
                                    properties.data.map((property) => (
                                        <tr
                                            key={property.id}
                                            className="hover:bg-slate-50/80 transition"
                                        >
                                            <td className="py-4 px-6 font-bold text-slate-900">
                                                {property.name}
                                            </td>
                                            <td className="py-4 px-6 text-slate-500">
                                                {property.address || "—"}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
                                                    {property.rooms_count ?? 0}{" "}
                                                    Rooms
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <Link
                                                    href={route(
                                                        "properties.show",
                                                        property.id,
                                                    )}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "properties.edit",
                                                        property.id,
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
                    {properties.total > properties.per_page && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="text-xs text-slate-500">
                                Page {properties.current_page} of{" "}
                                {properties.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {properties.links.map((link, index) => (
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
