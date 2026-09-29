import { Link, Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="RoomsForRent - Multi-Tenant Property & Lease Management SaaS" />

            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
                {/* Top Navigation */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                R
                            </div>
                            <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                                Rooms
                                <span className="text-blue-600">ForRent</span>
                            </span>
                        </div>

                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition shadow-sm"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition shadow-sm"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-20 pb-16 px-6 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/60">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Multi-Tenant Property Management System
                        </span>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                            Manage Your Rooms, Leases, & Automated Billing{" "}
                            <span className="text-blue-600">In One Place</span>.
                        </h1>

                        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                            Engineered for landlords, property managers, and
                            co-living operations. Track room availability,
                            digitize tenant leases, and automate monthly
                            invoicing effortlesly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={route("register")}
                                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl transition shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                            >
                                Start Managing Free
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
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </Link>
                            <a
                                href="#features"
                                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-base rounded-xl transition"
                            >
                                Explore Features
                            </a>
                        </div>
                    </div>
                </section>

                {/* Core Features Grid */}
                <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
                            Built for Operations
                        </h2>
                        <p className="text-3xl font-extrabold text-slate-900">
                            Everything you need to scale property management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                <svg
                                    className="w-6 h-6"
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Multi-Property & Unit Tracking
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Organize multiple locations, individual rooms,
                                unit pricing, and status availability in a
                                centralized real-time dashboard.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                                <svg
                                    className="w-6 h-6"
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Digital Lease Agreements
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Track occupant records, active rental periods,
                                deposit balances, and lease renewals without
                                physical paperwork.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                                <svg
                                    className="w-6 h-6"
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Automated Monthly Billing
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Scheduled background jobs issue rent invoices,
                                calculate utility add-ons, and keep records of
                                overdue tenant balances.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-6 bg-white border-t border-slate-200 text-center text-sm text-slate-500">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <p>© 2026 RoomsForRent SaaS. All rights reserved.</p>
                        <p className="text-xs text-slate-400">
                            Built with Laravel, Inertia.js, React, TypeScript, &
                            Docker.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
