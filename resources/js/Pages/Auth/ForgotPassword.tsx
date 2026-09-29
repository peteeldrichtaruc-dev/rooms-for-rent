import { FormEventHandler } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password - RoomsForRent" />

            <div className="mb-6">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Reset your password
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Forgot your password? No problem. Just let us know your
                    email address and we will email you a password reset link.
                </p>
            </div>

            {/* Session Status Notice */}
            {status && (
                <div
                    className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-sm font-medium text-emerald-800"
                    data-aos="fade-in"
                >
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email Address */}
                <TextInput
                    label="Email Address"
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    error={errors.email}
                    placeholder="name@property.com"
                    autoComplete="username"
                    required
                    isFocused
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
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                        </svg>
                    }
                />

                {/* Submit Action */}
                <div className="pt-2">
                    <PrimaryButton
                        className="w-full"
                        size="lg"
                        isLoading={processing}
                        rightIcon={
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
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        }
                    >
                        Email Password Reset Link
                    </PrimaryButton>
                </div>
            </form>

            {/* Back to Login Link */}
            <p className="mt-8 text-center text-xs text-slate-500">
                Remembered your password?{" "}
                <Link
                    href={route("login")}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
                >
                    Back to log in
                </Link>
            </p>
        </GuestLayout>
    );
}
