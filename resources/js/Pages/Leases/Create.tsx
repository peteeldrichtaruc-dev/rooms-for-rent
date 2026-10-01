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
    name: string;
    email: string;
}

export default function Create({
    rooms,
    renters,
    selectedRoomId,
}: {
    rooms: Room[];
    renters: Renter[];
    selectedRoomId?: string;
}) {
    const initialRoom =
        rooms.find((r) => r.id.toString() === selectedRoomId) || rooms[0];

    const { data, setData, post, processing, errors } = useForm({
        room_id: selectedRoomId || (rooms[0]?.id.toString() ?? ""),
        renter_id: renters[0]?.id.toString() ?? "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        rent_amount: initialRoom ? initialRoom.price.toString() : "",
        deposit_amount: "0",
        status: "active",
        notes: "",
    });

    const handleRoomChange = (roomId: string) => {
        const room = rooms.find((r) => r.id.toString() === roomId);
        setData((prev) => ({
            ...prev,
            room_id: roomId,
            rent_amount: room ? room.price.toString() : prev.rent_amount,
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("leases.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        New Lease Agreement
                    </h1>
                    <p className="text-xs text-slate-500">
                        Assign a renter to an available unit and define rental terms.
                    </p>
                </div>
            }
        >
            <Head title="Create Lease" />

            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Select Unit / Room
                            </label>
                            <select
                                value={data.room_id}
                                onChange={(e) =>
                                    handleRoomChange(e.target.value)
                                }
                                className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                            >
                                {rooms.length === 0 && (
                                    <option value="">No available rooms</option>
                                )}
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
                                        {r.name} ({r.email})
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            label="End Date (Optional)"
                            id="end_date"
                            type="date"
                            value={data.end_date}
                            onChange={(e) =>
                                setData("end_date", e.target.value)
                            }
                            error={errors.end_date}
                        />
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
                            placeholder="Add lease policies, payment rules, or special clauses."
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <Link
                            href={route("leases.index")}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton isLoading={processing}>
                            Create Agreement
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}