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
}

interface Room {
    id: number;
    room_number: string;
    property?: {
        name: string;
    };
}

interface Lease {
    id: number;
    rent_amount: number;
    renter: Renter;
    room: Room;
}

export default function Create({ leases }: { leases: Lease[] }) {
    const { data, setData, post, processing, errors } = useForm({
        lease_id: leases.length > 0 ? leases[0].id.toString() : "",
        amount: leases.length > 0 ? leases[0].rent_amount.toString() : "",
        due_date: "",
        description: "",
    });

    // Auto-fill rent amount when a lease is selected
    const handleLeaseChange = (leaseIdStr: string) => {
        setData("lease_id", leaseIdStr);
        const selectedLease = leases.find(
            (l) => l.id.toString() === leaseIdStr,
        );
        if (selectedLease) {
            setData((prevData) => ({
                ...prevData,
                lease_id: leaseIdStr,
                amount: selectedLease.rent_amount.toString(),
            }));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("invoices.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Generate Invoice
                    </h1>
                    <p className="text-xs text-slate-500">
                        Create a billing statement for an active renter lease.
                    </p>
                </div>
            }
        >
            <Head title="Generate Invoice" />

            <div
                className="max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8"
                data-aos="fade-up"
            >
                {leases.length === 0 ? (
                    <div className="text-center py-6 space-y-3">
                        <p className="text-xs text-slate-500">
                            No active leases found. You need an active lease to
                            generate an invoice.
                        </p>
                        <Link
                            href={route("leases.create")}
                            className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                        >
                            Create Lease First
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Select Active Lease / Renter
                            </label>
                            <select
                                value={data.lease_id}
                                onChange={(e) =>
                                    handleLeaseChange(e.target.value)
                                }
                                className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                            >
                                {leases.map((lease) => (
                                    <option key={lease.id} value={lease.id}>
                                        {lease.renter?.first_name}{" "}
                                        {lease.renter?.last_name} —{" "}
                                        {lease.room?.property?.name} (Room{" "}
                                        {lease.room?.room_number})
                                    </option>
                                ))}
                            </select>
                            {errors.lease_id && (
                                <p className="mt-1 text-xs text-red-600 font-medium">
                                    {errors.lease_id}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TextInput
                                label="Billing Amount (₱)"
                                id="amount"
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) =>
                                    setData("amount", e.target.value)
                                }
                                error={errors.amount}
                                required
                            />

                            <TextInput
                                label="Payment Due Date"
                                id="due_date"
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData("due_date", e.target.value)
                                }
                                error={errors.due_date}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Invoice Notes / Breakdown
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                placeholder="e.g. Monthly Rent for October 2026 + Utility charges"
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600 font-medium">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <Link
                                href={route("invoices.index")}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton isLoading={processing}>
                                Create Invoice
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}