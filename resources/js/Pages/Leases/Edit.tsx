import { FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";

interface Room {
    id: number;
    room_number: string;
    price: number;
    property: {
        name: string;
    };
}

interface Renter {
    id: number;
    full_name?: string;
    name?: string;
    email: string;
}

interface Lease {
    id: number;
    room_id: number;
    renter_id: number;
    start_date: string;
    end_date?: string;
    rent_amount: number;
    deposit_amount: number;
    status: "active" | "ended" | "terminated";
    notes?: string;
}

/**
 * Safely format incoming date strings into standard YYYY-MM-DD required by HTML date inputs.
 */
const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString.substring(0, 10);
        return date.toISOString().split("T")[0];
    } catch {
        return "";
    }
};

export default function Edit({
    lease,
    rooms,
    renters,
}: {
    lease: Lease;
    rooms: Room[];
    renters: Renter[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        room_id: lease.room_id?.toString() || "",
        renter_id: lease.renter_id?.toString() || "",
        start_date: formatDateForInput(lease.start_date),
        end_date: formatDateForInput(lease.end_date),
        rent_amount: lease.rent_amount?.toString() || "0",
        deposit_amount: lease.deposit_amount?.toString() || "0",
        status: lease.status || "active",
        notes: lease.notes || "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("leases.update", lease.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Edit Lease Agreement #{lease.id}
                    </h1>
                    <p className="text-xs text-slate-500">
                        Update agreement status, rent pricing, or end dates.
                    </p>
                </div>
            }
        >
            <Head title={`Edit Lease #${lease.id}`} />

            <div
                className="max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8"
                data-aos="fade-up"
            >
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Property / Room
                            </label>
                            <select
                                value={data.room_id}
                                onChange={(e) =>
                                    setData("room_id", e.target.value)
                                }
                                className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                            >
                                {rooms.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.property?.name} - Room{" "}
                                        {r.room_number}
                                    </option>
                                ))}
                            </select>
                            {errors.room_id && (
                                <p className="mt-1 text-xs text-red-600 font-medium">
                                    {errors.room_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Renter
                            </label>
                            <select
                                value={data.renter_id}
                                onChange={(e) =>
                                    setData("renter_id", e.target.value)
                                }
                                className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                            >
                                {renters.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.full_name || r.name} ({r.email})
                                    </option>
                                ))}
                            </select>
                            {errors.renter_id && (
                                <p className="mt-1 text-xs text-red-600 font-medium">
                                    {errors.renter_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <TextInput
                            label="Start Date"
                            id="start_date"
                            type="date"
                            value={data.start_date}
                            onChange={(e) =>
                                setData("start_date", e.target.value)
                            }
                            error={errors.start_date}
                            required
                        />
                        <TextInput
                            label="End Date"
                            id="end_date"
                            type="date"
                            value={data.end_date}
                            onChange={(e) =>
                                setData("end_date", e.target.value)
                            }
                            error={errors.end_date}
                        />
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Agreement Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value as any)
                                }
                                className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                            >
                                <option value="active">Active</option>
                                <option value="ended">Ended</option>
                                <option value="terminated">Terminated</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-xs text-red-600 font-medium">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="Monthly Rent Amount (₱)"
                            id="rent_amount"
                            type="number"
                            step="0.01"
                            value={data.rent_amount}
                            onChange={(e) =>
                                setData("rent_amount", e.target.value)
                            }
                            error={errors.rent_amount}
                            required
                        />
                        <TextInput
                            label="Security Deposit (₱)"
                            id="deposit_amount"
                            type="number"
                            step="0.01"
                            value={data.deposit_amount}
                            onChange={(e) =>
                                setData("deposit_amount", e.target.value)
                            }
                            error={errors.deposit_amount}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Additional Terms / Notes
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
                            href={route("leases.show", lease.id)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton isLoading={processing}>
                            Update Agreement
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}