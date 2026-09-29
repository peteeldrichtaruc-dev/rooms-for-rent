import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

interface Tenant {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    leases_count: number;
}

interface PaginatedTenants {
    data: Tenant[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Index({ tenants }: { tenants: PaginatedTenants }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Tenants
                        </h1>
                        <p className="text-xs text-slate-500">
                            Manage tenant contact information and rental
                            histories.
                        </p>
                    </div>
                    <Link
                        href={route("tenants.create")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                    >
                        + Add Tenant
                    </Link>
                </div>
            }
        >
            <Head title="Tenants - RoomsForRent" />

            <div
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                data-aos="fade-up"
            >
                <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3.5">Name</th>
                            <th className="px-6 py-3.5">Contact</th>
                            <th className="px-6 py-3.5">Leases</th>
                            <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tenants.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-8 text-center text-slate-400"
                                >
                                    No tenants found. Click "+ Add Tenant" to
                                    create one.
                                </td>
                            </tr>
                        ) : (
                            tenants.data.map((tenant) => (
                                <tr
                                    key={tenant.id}
                                    className="hover:bg-slate-50/50 transition"
                                >
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        {tenant.full_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>{tenant.email}</div>
                                        <div className="text-[11px] text-slate-400">
                                            {tenant.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-full text-[10px]">
                                            {tenant.leases_count}{" "}
                                            {tenant.leases_count === 1
                                                ? "lease"
                                                : "leases"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link
                                            href={route(
                                                "tenants.show",
                                                tenant.id,
                                            )}
                                            className="font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={route(
                                                "tenants.edit",
                                                tenant.id,
                                            )}
                                            className="font-semibold text-slate-600 hover:text-slate-900"
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
        </AuthenticatedLayout>
    );
}
