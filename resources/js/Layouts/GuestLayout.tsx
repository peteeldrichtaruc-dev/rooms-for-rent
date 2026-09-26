import { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">

            {/* Header Brand Logo */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center" data-aos="fade-down">
                <Link href="/" className="inline-flex items-center gap-2.5 group focus:outline-none">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 transition">
                        R
                    </div>
                    <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
                        Rooms<span className="text-blue-600">ForRent</span>
                    </span>
                </Link>

                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Property & Lease Management
                </p>
            </div>

            {/* Auth Card Container */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0" data-aos="fade-up" data-aos-delay="100">
                <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80 sm:px-10">
                    {children}
                </div>

                {/* Card Footer Note */}
                <p className="mt-6 text-center text-xs text-slate-400">
                    © 2026 RoomsForRent SaaS • Encrypted & Secure Multi-Tenant Access
                </p>
            </div>
        </div>
    );
}