import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, router } from "@inertiajs/react";

interface Lease {
    id: number;
    start_date: string;
    end_date?: string;
    rent_amount: number;
    status: "active" | "ended" | "terminated";
    tenant: {
        name: string;
        email: string;
    };
    room: {
        room_number: string;
        property: {
            name: string;
        };
    };
}

export default function Index({ leases }: { leases: Lease[] }) {
    const handleDelete = (id: number) => {
        if (
            confirm(
                "Are you sure you want to terminate/delete this lease agreement?",
            )
        ) {
            router.delete(route("leases.destroy", id));
        }
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
                            Track active tenant agreements, terms, and monthly
                            rent rates.
                        </p>
                    </div>
                    <PrimaryButton
                        href={route("leases.create")}
                        size="md"
                        leftIcon={
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        }
                    >
                        Create Lease
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Leases - RoomsForRent" />

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {leases.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-xs text-slate-500">
                            No active or historic lease agreements found.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5">Tenant</th>
                                    <th className="px-6 py-3.5">
                                        Property / Unit
                                    </th>
                                    <th className="px-6 py-3.5">Rent Rate</th>
                                    <th className="px-6 py-3.5">Start Date</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leases.map((lease) => (
                                    <tr
                                        key={lease.id}
                                        className="hover:bg-slate-50/50 transition"
                                    >
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {lease.tenant?.name}
                                            <span className="block font-normal text-slate-400 text-[10px]">
                                                {lease.tenant?.email}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-slate-800">
                                                {lease.room?.property?.name}
                                            </span>
                                            <span className="block text-slate-500 text-[11px]">
                                                Room {lease.room?.room_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-extrabold text-slate-900">
                                            ₱
                                            {Number(
                                                lease.rent_amount,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Intl.DateTimeFormat("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }).format(
                                                new Date(lease.start_date),
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    lease.status === "active"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {lease.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <Link
                                                href={route(
                                                    "leases.show",
                                                    lease.id,
                                                )}
                                                className="font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={route(
                                                    "leases.edit",
                                                    lease.id,
                                                )}
                                                className="font-semibold text-slate-600 hover:text-slate-900"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(lease.id)
                                                }
                                                className="font-semibold text-red-600 hover:text-red-700"
                                            >
                                                Terminate
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
