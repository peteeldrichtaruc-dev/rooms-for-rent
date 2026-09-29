import { FormEventHandler } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in - RoomsForRent" />

            <div className="mb-6">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Sign in to access your property dashboard and active leases.
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

                {/* Password */}
                <div>
                    <TextInput
                        label="Password"
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
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
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        }
                    />

                    {/* Forgot Password Link */}
                    {canResetPassword && (
                        <div className="flex justify-end mt-2">
                            <Link
                                href={route("password.request")}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="pt-1">
                    <Checkbox
                        label="Remember me on this browser"
                        id="remember"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                    />
                </div>

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
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        }
                    >
                        Sign In to Account
                    </PrimaryButton>
                </div>
            </form>

            {/* Registration Callout */}
            <p className="mt-8 text-center text-xs text-slate-500">
                Don't have a property manager account yet?{" "}
                <Link
                    href={route("register")}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
                >
                    Create an account
                </Link>
            </p>
        </GuestLayout>
    );
}
