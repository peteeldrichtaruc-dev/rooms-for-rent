import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-xs text-slate-500">
                        Manage your profile information, credentials, and
                        security preferences.
                    </p>
                </div>
            }
        >
            <Head title="Profile Settings" />

            <div className="space-y-8 max-w-4xl">
                {/* Profile Info Section */}
                <div
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8"
                    data-aos="fade-up"
                >
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                {/* Password Update Section */}
                <div
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                {/* Account Deletion Section */}
                <div
                    className="bg-white rounded-2xl border border-red-200/80 shadow-sm p-6 sm:p-8"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
