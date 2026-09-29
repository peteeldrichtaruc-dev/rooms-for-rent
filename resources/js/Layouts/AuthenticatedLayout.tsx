import { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user as User;
    const flash = usePage().props.flash as { success?: string; error?: string };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        // Navigation links ready for upcoming database models & features
        {
            name: 'Properties',
            href: route('properties.index'),
            active: route().current('properties.*'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
        {
            name: 'Rooms & Units',
            href: route('rooms.index'),
            active: route().current('rooms.*'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            ),
        },
        {
            name: 'Leases & Tenants',
            href: '#',
            active: route().current('leases.*'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            name: 'Billing & Invoices',
            href: '#',
            active: route().current('invoices.*'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={`
                    fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Brand Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                            R
                        </div>
                        <span className="font-extrabold text-white tracking-tight text-lg">
                            Rooms<span className="text-blue-500">ForRent</span>
                        </span>
                    </Link>
                </div>

                {/* Main Navigation Items */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Management
                    </div>
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition
                                ${item.active
                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }
                            `}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Bottom Profile Summary */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Layout Area */}
            <div className="md:pl-64 flex-1 flex flex-col min-w-0">

                {/* Top Header Navbar */}
                <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Left Page Title / Breadcrumb Slot */}
                    <div className="hidden sm:block">
                        {header}
                    </div>

                    {/* Right User Dropdown Menu */}
                    <div className="relative ml-auto">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                {user.name.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold hidden sm:inline-block">{user.name}</span>
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Card */}
                        {isUserMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsUserMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 z-50" data-aos="fade-in">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href={route('profile.edit')}
                                        className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                    >
                                        Account Settings
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left block px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                                    >
                                        Sign Out
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Mobile Header Title */}
                <div className="sm:hidden px-4 pt-4">
                    {header}
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4" data-aos="fade-down">
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-800 flex items-center justify-between">
                            <span>{flash.success}</span>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4" data-aos="fade-down">
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm font-medium text-red-800 flex items-center justify-between">
                            <span>{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Main Content Viewport */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
