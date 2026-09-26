import { useRef, useState, FormEventHandler } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-base font-bold text-red-600">
                    Delete Account
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Once your account is deleted, all associated resources, property records, unit listings, and tenant leases will be permanently purged.
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold rounded-xl transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-4 focus:ring-red-600/20"
            >
                Delete Account
            </button>

            {/* Render Modal into document.body to break free of parent transform containers */}
            {confirmingUserDeletion &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        {/* Backdrop Overlay */}
                        <div className="fixed inset-0" onClick={closeModal} />

                        {/* Modal Content */}
                        <div
                            className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 z-10"
                            data-aos="zoom-in"
                        >
                            <div className="flex items-center gap-3 text-red-600 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Are you sure you want to delete your account?
                                    </h3>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                This action cannot be undone. Please enter your password to confirm you want to permanently remove your property management account and data.
                            </p>

                            <form onSubmit={deleteUser} className="mt-5 space-y-4">
                                <TextInput
                                    ref={passwordInput}
                                    label="Confirm Password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    placeholder="••••••••"
                                    isFocused
                                    required
                                    leftIcon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    }
                                />

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {processing && (
                                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        Confirm Permanent Deletion
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
}