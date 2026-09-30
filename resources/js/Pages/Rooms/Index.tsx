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
    price: number;
    status: "available" | "occupied" | "maintenance";
    property: Property;
    created_at: string;
}

interface PaginatedRooms {
    data: Room[];
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
    rooms,
    filters,
}: {
    rooms: PaginatedRooms;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search || "");

    // Memoize the debounced search request
    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                router.get(
                    route("rooms.index"),
                    { search: query },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }, 300),
        [],
    );

    // Clean up pending debounce callbacks when unmounting
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

    const getStatusBadge = (status: Room["status"]) => {
        switch (status) {
            case "occupied":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
                        Occupied
                    </span>
                );
            case "available":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                        Available
                    </span>
                );
            case "maintenance":
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100">
                        Maintenance
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
                            Rooms
                        </h1>
                        <p className="text-xs text-slate-500">
                            Manage individual rooms and occupancy statuses
                            across your properties.
                        </p>
                    </div>
                    <Link
                        href={route("rooms.create")}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                        + Add New Room
                    </Link>
                </div>
            }
        >
            <Head title="Rooms" />

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
                            placeholder="Search rooms by number or property name..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                    </div>
                    {rooms.total > 0 && (
                        <span className="text-xs font-medium text-slate-400">
                            Showing {rooms.from}–{rooms.to} of {rooms.total}{" "}
                            rooms
                        </span>
                    )}
                </div>

                {/* Rooms Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3.5 px-6">Room / Unit</th>
                                    <th className="py-3.5 px-6">Property</th>
                                    <th className="py-3.5 px-6">
                                        Monthly Rent
                                    </th>
                                    <th className="py-3.5 px-6 text-center">
                                        Status
                                    </th>
                                    <th className="py-3.5 px-6 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {rooms.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-12 text-center text-slate-400"
                                        >
                                            No rooms found matching "
                                            {filters.search}".
                                        </td>
                                    </tr>
                                ) : (
                                    rooms.data.map((room) => (
                                        <tr
                                            key={room.id}
                                            className="hover:bg-slate-50/80 transition"
                                        >
                                            <td className="py-4 px-6 font-bold text-slate-900">
                                                {room.room_number}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600">
                                                {room.property?.name || "—"}
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                ₱
                                                {Number(
                                                    room.price,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {getStatusBadge(room.status)}
                                            </td>
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <Link
                                                    href={route(
                                                        "rooms.show",
                                                        room.id,
                                                    )}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "rooms.edit",
                                                        room.id,
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

                    {/* Pagination Bar */}
                    {rooms.total > rooms.per_page && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="text-xs text-slate-500">
                                Page {rooms.current_page} of {rooms.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {rooms.links.map((link, index) => (
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
