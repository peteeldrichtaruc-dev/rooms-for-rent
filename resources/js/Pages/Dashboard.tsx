import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Property Overview
                    </h1>
                    <p className="text-xs text-slate-500">
                        Real-time metrics, active leases, and occupancy metrics
                        across your portfolio.
                    </p>
                </div>
            }
        >
            <Head title="Dashboard - RoomsForRent" />

            <div className="space-y-8">
                {/* Top Metrics Cards */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                    data-aos="fade-up"
                >
                    {/* KPI 1: Properties */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Properties
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
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
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                                12
                            </span>
                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 10l7-7 7 7"
                                    />
                                </svg>
                                +2 new
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Across 3 locations
                        </p>
                    </div>

                    {/* KPI 2: Total Units / Rooms */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Rooms & Units
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
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
                                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                                48
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                                42 Occupied
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            87.5% Occupancy Rate
                        </p>
                    </div>

                    {/* KPI 3: Active Leases */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Active Leases
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
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
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                                42
                            </span>
                            <span className="text-xs font-semibold text-amber-600">
                                3 Expiring Soon
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            2 Pending renewals
                        </p>
                    </div>

                    {/* KPI 4: Monthly Revenue */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Monthly Revenue
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
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
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900">
                                $24,800
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Automated invoices issued
                        </p>
                    </div>
                </div>

                {/* Quick Actions & Recent Leases Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Recent Activity & Multi-Tenant Status (2 cols) */}
                    <div
                        className="lg:col-span-2 space-y-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        Recent Occupancy Activity
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Latest tenant checks, renewals, and
                                        payments.
                                    </p>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                                    Live Sync
                                </span>
                            </div>

                            {/* Recent Activity List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">
                                                Room 204 — Payment Received
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Tenant: Alex Rivera • $650.00
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-400">
                                        10m ago
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                            +
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">
                                                New Lease Signed — Unit 102
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Tenant: Sarah Jenkins • 12-Month
                                                Lease
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-400">
                                        2h ago
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                            !
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">
                                                Lease Renewal Notice Due
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Unit 301 • Expiring in 14 days
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-400">
                                        1d ago
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Quick Manager Actions (1 col) */}
                    <div
                        className="space-y-6"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                            <h2 className="text-base font-bold text-slate-900 mb-1">
                                Quick Management
                            </h2>
                            <p className="text-xs text-slate-500 mb-6">
                                Direct shortcuts to expand your property
                                operations.
                            </p>

                            <div className="space-y-3">
                                <PrimaryButton
                                    className="w-full justify-start text-xs py-3"
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
                                    Add New Property
                                </PrimaryButton>

                                <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-start gap-2">
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
                                </button>

                                <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-start gap-2">
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
                                    Generate Monthly Invoices
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
