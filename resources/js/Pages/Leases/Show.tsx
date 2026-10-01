import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, router } from "@inertiajs/react";

interface Renter {
    id: number;
    name: string;
    email: string;
}

interface Room {
    id: number;
    room_number: string;
    property: {
        id: number;
        name: string;
        address: string;
    };
}

interface Lease {
    id: number;
    start_date: string;
    end_date?: string;
    rent_amount: number;
    deposit_amount: number;
    status: "active" | "ended" | "terminated";
    notes?: string;
    renter: Renter;
    room: Room;
}

export default function Show({ lease }: { lease: Lease }) {
    const handleTerminate = () => {
        if (
            confirm(
                "Are you sure you want to terminate or delete this lease agreement?",
            )
        ) {
            router.delete(route("leases.destroy", lease.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Lease Agreement #{lease.id}
                        </h1>
                        <p className="text-xs text-slate-500">
                            {lease.room?.property?.name} — Room{" "}
                            {lease.room?.room_number}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route("leases.edit", lease.id)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Edit Lease
                        </Link>
                        <button
                            onClick={handleTerminate}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition"
                        >
                            Terminate Lease
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Lease #${lease.id}`} />

            <div className="max-w-4xl space-y-6">
                {/* Metric Cards */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Status
                        </span>
                        <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${lease.status === "active"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            {lease.status}
                        </span>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Monthly Rent
                        </span>
                        <p className="text-base font-extrabold text-slate-900">
                            ₱{Number(lease.rent_amount).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Security Deposit
                        </span>
                        <p className="text-base font-extrabold text-slate-900">
                            ₱{Number(lease.deposit_amount).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Start Date
                        </span>
                        <p className="text-base font-extrabold text-slate-900">
                            {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).format(new Date(lease.start_date))}
                        </p>
                    </div>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Renter Details */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Renter Information
                        </h3>
                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                {lease.renter?.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {lease.renter?.email}
                            </p>
                        </div>
                    </div>

                    {/* Room & Property Details */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Unit & Property
                        </h3>
                        <div>
                            <Link
                                href={route(
                                    "properties.show",
                                    lease.room?.property?.id,
                                )}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700"
                            >
                                {lease.room?.property?.name}
                            </Link>
                            <p className="text-xs text-slate-600 mt-0.5">
                                Room Number:{" "}
                                <span className="font-semibold text-slate-900">
                                    {lease.room?.room_number}
                                </span>
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {lease.room?.property?.address}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Notes */}
                {lease.notes && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Terms & Special Notes
                        </h3>
                        <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {lease.notes}
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}