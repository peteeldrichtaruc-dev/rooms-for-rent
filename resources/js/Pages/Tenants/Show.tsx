import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

interface Room {
    id: number;
    room_number: string;
    property: {
        id: number;
        name: string;
    };
}

interface Lease {
    id: number;
    start_date: string;
    end_date?: string;
    rent_amount: number;
    status: string;
    room: Room;
}

interface Tenant {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    notes?: string;
    leases: Lease[];
}

export default function Show({ tenant }: { tenant: Tenant }) {
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this tenant record?")) {
            router.delete(route("tenants.destroy", tenant.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            {tenant.full_name}
                        </h1>
                        <p className="text-xs text-slate-500">{tenant.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("tenants.edit", tenant.id)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Edit Profile
                        </Link>
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
            <Head title={`${tenant.full_name}`} />

            <div className="max-w-4xl space-y-6" data-aos="fade-up">
                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Contact Details */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Contact Details
                        </h3>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500">
                                Email:{" "}
                                <span className="font-semibold text-slate-900">
                                    {tenant.email}
                                </span>
                            </p>
                            <p className="text-xs text-slate-500">
                                Phone:{" "}
                                <span className="font-semibold text-slate-900">
                                    {tenant.phone}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Emergency Contact Info */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Emergency Contact
                        </h3>
                        {tenant.emergency_contact_name ? (
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500">
                                    Name:{" "}
                                    <span className="font-semibold text-slate-900">
                                        {tenant.emergency_contact_name}
                                    </span>
                                </p>
                                <p className="text-xs text-slate-500">
                                    Phone:{" "}
                                    <span className="font-semibold text-slate-900">
                                        {tenant.emergency_contact_phone ||
                                            "N/A"}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic">
                                No emergency contact provided.
                            </p>
                        )}
                    </div>
                </div>

                {/* Lease History */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Lease Agreements
                        </h3>
                    </div>
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Property / Room</th>
                                <th className="px-6 py-3">Start Date</th>
                                <th className="px-6 py-3">Rent</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {!tenant.leases || tenant.leases.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-6 text-center text-slate-400"
                                    >
                                        No leases linked to this tenant yet.
                                    </td>
                                </tr>
                            ) : (
                                tenant.leases.map((lease) => (
                                    <tr
                                        key={lease.id}
                                        className="hover:bg-slate-50/50 transition"
                                    >
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {lease.room?.property?.name} — Room{" "}
                                            {lease.room?.room_number}
                                        </td>
                                        <td className="px-6 py-4">
                                            {lease.start_date}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            ₱
                                            {Number(
                                                lease.rent_amount,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                                                    lease.status === "active"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {lease.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={route(
                                                    "leases.show",
                                                    lease.id,
                                                )}
                                                className="font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                View Lease
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
