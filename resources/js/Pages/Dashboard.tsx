import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

interface StatData {
    properties_count: number;
    new_properties_count: number;
    rooms_count: number;
    occupied_rooms_count: number;
    occupancy_rate: number;
    active_leases_count: number;
    expiring_soon_count: number;
    pending_renewals_count: number;
    monthly_revenue: number;
}

interface Activity {
    id: string;
    type: "payment" | "lease" | "warning";
    title: string;
    subtitle: string;
    timestamp: string;
}

export default function Dashboard({
    stats,
    recentActivities,
}: {
    stats: StatData;
    recentActivities: Activity[];
}) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateInvoices = () => {
        if (
            confirm(
                "Are you sure you want to generate monthly invoices for all active leases?",
            )
        ) {
            setIsGenerating(true);
            router.post(
                route("invoices.generate-monthly"),
                {},
                {
                    onFinish: () => setIsGenerating(false),
                },
            );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-xs text-slate-500">
                        Operational metrics and recent occupancy activity across
                        your properties.
                    </p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* 4 Primary Top Metrics Grid */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                    data-aos="fade-up"
                >
                    {/* Card 1: Properties */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Properties
                            </span>
                            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m-5 0V10"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                                {stats.properties_count}
                            </span>
                            {stats.new_properties_count > 0 && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    +{stats.new_properties_count} new
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                            Active locations tracked
                        </p>
                    </div>

                    {/* Card 2: Rooms & Units */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Rooms & Units
                            </span>
                            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                                {stats.rooms_count}
                            </span>
                            <span className="text-xs font-bold text-slate-500">
                                {stats.occupied_rooms_count} Occupied
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                            {stats.occupancy_rate}% Occupancy Rate
                        </p>
                    </div>

                    {/* Card 3: Active Leases */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Active Leases
                            </span>
                            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                                {stats.active_leases_count}
                            </span>
                            {stats.expiring_soon_count > 0 && (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                    {stats.expiring_soon_count} Expiring Soon
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                            {stats.pending_renewals_count} Pending renewals
                        </p>
                    </div>

                    {/* Card 4: Monthly Revenue */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Monthly Revenue
                            </span>
                            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-900">
                                ₱
                                {Number(stats.monthly_revenue).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                            Automated invoices issued
                        </p>
                    </div>
                </div>

                {/* Lower Layout: Activity Feed & Quick Management */}
                <div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    {/* Recent Occupancy Activity (2 columns on large screens) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-base font-extrabold text-slate-900">
                                    Recent Occupancy Activity
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Latest tenant checks, renewals, and
                                    payments.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                Live Sync
                            </span>
                        </div>

                        <div className="space-y-3">
                            {recentActivities.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-6">
                                    No recent activity recorded yet.
                                </p>
                            ) : (
                                recentActivities.map((act) => (
                                    <div
                                        key={act.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition border border-slate-100"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {act.type === "payment" ? (
                                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                    ✓
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                    +
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xs font-extrabold text-slate-900">
                                                    {act.title}
                                                </h3>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    {act.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                                            {act.timestamp}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Management Shortcuts (1 column on large screens) */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5 flex flex-col justify-between">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900">
                                Quick Management
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Direct shortcuts to expand your property
                                operations.
                            </p>
                        </div>

                        <div className="space-y-3 my-auto">
                            <Link
                                href={route("properties.create")}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                            >
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
                                Add New Property
                            </Link>

                            <Link
                                href={route("leases.create")}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-bold rounded-xl transition"
                            >
                                <svg
                                    className="w-4 h-4 text-slate-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                                Register New Tenant Lease
                            </Link>

                            <button
                                type="button"
                                onClick={handleGenerateInvoices}
                                disabled={isGenerating}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-xs font-bold rounded-xl transition disabled:opacity-50 cursor-pointer"
                            >
                                <svg
                                    className="w-4 h-4 text-slate-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {isGenerating
                                    ? "Generating Invoices..."
                                    : "Generate Monthly Invoices"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
