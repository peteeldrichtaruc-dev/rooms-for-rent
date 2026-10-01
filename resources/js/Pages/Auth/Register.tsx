import { FormEventHandler } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <div className="mb-6">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Get started with RoomsForRent
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Set up your manager account to begin listing properties and
                    tracking leases.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Full Name */}
                <TextInput
                    label="Full Name"
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    error={errors.name}
                    placeholder="John Doe"
                    autoComplete="name"
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    }
                />

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
                <TextInput
                    label="Password"
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={errors.password}
                    placeholder="••••••••"
                    autoComplete="new-password"
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

                {/* Confirm Password */}
                <TextInput
                    label="Confirm Password"
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    error={errors.password_confirmation}
                    placeholder="••••••••"
                    autoComplete="new-password"
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
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    }
                />

                {/* Submit Action */}
                <div className="pt-3">
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
                        Create Account
                    </PrimaryButton>
                </div>
            </form>

            {/* Login Link */}
            <p className="mt-8 text-center text-xs text-slate-500">
                Already have a property manager account?{" "}
                <Link
                    href={route("login")}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
                >
                    Log in
                </Link>
            </p>
        </GuestLayout>
    );
}
