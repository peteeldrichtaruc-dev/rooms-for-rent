import { FormEventHandler } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { PageProps } from "@/types";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-base font-bold text-slate-900">
                    Profile Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Update your account's profile name and primary communication
                    email address.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-5">
                {/* Full Name Field */}
                <TextInput
                    label="Full Name"
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    error={errors.name}
                    placeholder="John Doe"
                    required
                    autoComplete="name"
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

                {/* Email Address Field */}
                <TextInput
                    label="Email Address"
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    error={errors.email}
                    placeholder="name@property.com"
                    required
                    autoComplete="username"
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

                {/* Email Verification Callout */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 space-y-2">
                        <p>
                            Your email address is unverified.{" "}
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="font-semibold underline hover:text-amber-900 transition"
                            >
                                Click here to resend the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <p
                                className="font-semibold text-emerald-700"
                                data-aos="fade-in"
                            >
                                A new verification link has been sent to your
                                email address.
                            </p>
                        )}
                    </div>
                )}

                {/* Form Action & Feedback */}
                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton
                        type="submit"
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
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        }
                    >
                        Save Profile
                    </PrimaryButton>

                    {recentlySuccessful && (
                        <span
                            className="text-xs font-semibold text-emerald-600 flex items-center gap-1"
                            data-aos="fade-in"
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Saved successfully.
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
