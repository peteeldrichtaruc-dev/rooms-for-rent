import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="space-y-6" data-aos="fade-up">
                {/* Header Badge & Title */}
                <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 uppercase tracking-wider mb-3">
                        Account Security
                    </span>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Verify Your Email
                    </h1>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                        Thanks for signing up! Before getting started, please
                        verify your email address by clicking the link we just
                        sent you.
                    </p>
                </div>

                {/* Status Alert */}
                {status === "verification-link-sent" && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700 text-center">
                        A new verification link has been sent to your registered
                        email address.
                    </div>
                )}

                {/* Action Form */}
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <PrimaryButton
                        isLoading={processing}
                        className="w-full justify-center"
                    >
                        Resend Verification Email
                    </PrimaryButton>

                    <div className="text-center pt-2">
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition focus:outline-none"
                        >
                            Log Out
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
