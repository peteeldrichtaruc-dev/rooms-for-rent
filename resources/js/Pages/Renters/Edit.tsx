import { FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";

interface Renter {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    notes?: string;
}

export default function Edit({ renter }: { renter: Renter }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: renter.first_name || "",
        last_name: renter.last_name || "",
        email: renter.email || "",
        phone: renter.phone || "",
        emergency_contact_name: renter.emergency_contact_name || "",
        emergency_contact_phone: renter.emergency_contact_phone || "",
        notes: renter.notes || "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("renters.update", renter.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Edit Renter
                    </h1>
                    <p className="text-xs text-slate-500">
                        Update personal details or emergency contacts.
                    </p>
                </div>
            }
        >
            <Head title={`Edit ${renter.first_name}`} />

            <div
                className="max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8"
                data-aos="fade-up"
            >
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="First Name"
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            error={errors.first_name}
                            required
                        />

                        <TextInput
                            label="Last Name"
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            error={errors.last_name}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="Email Address"
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            error={errors.email}
                            required
                        />

                        <TextInput
                            label="Phone Number"
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            error={errors.phone}
                            required
                        />
                    </div>

                    <hr className="border-slate-100 my-2" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="Emergency Contact Name"
                            id="emergency_contact_name"
                            value={data.emergency_contact_name}
                            onChange={(e) =>
                                setData(
                                    "emergency_contact_name",
                                    e.target.value,
                                )
                            }
                            error={errors.emergency_contact_name}
                        />

                        <TextInput
                            label="Emergency Contact Phone"
                            id="emergency_contact_phone"
                            value={data.emergency_contact_phone}
                            onChange={(e) =>
                                setData(
                                    "emergency_contact_phone",
                                    e.target.value,
                                )
                            }
                            error={errors.emergency_contact_phone}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Notes / Special Remarks
                        </label>
                        <textarea
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <Link
                            href={route("renters.show", renter.id)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton isLoading={processing}>
                            Update Renter
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
