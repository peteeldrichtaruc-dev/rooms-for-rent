import { FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";

interface Property {
    id: number;
    name: string;
}

interface Room {
    id: number;
    property_id: number;
    room_number: string;
    capacity: number;
    price: number;
    status: "available" | "occupied" | "maintenance";
    description?: string;
}

export default function Edit({
    room,
    properties,
}: {
    room: Room;
    properties: Property[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        property_id: room.property_id,
        room_number: room.room_number,
        capacity: room.capacity,
        price: room.price,
        status: room.status,
        description: room.description || "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("rooms.update", room.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Edit Room {room.room_number}
                    </h1>
                    <p className="text-xs text-slate-500">
                        Update unit rate, capacity, or occupancy state.
                    </p>
                </div>
            }
        >
            <Head title={`Edit Room ${room.room_number}`} />

            <div
                className="max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8"
                data-aos="fade-up"
            >
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Property
                        </label>
                        <select
                            value={data.property_id}
                            onChange={(e) =>
                                setData("property_id", parseInt(e.target.value))
                            }
                            className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                        >
                            {properties.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        {errors.property_id && (
                            <p className="mt-1 text-xs text-red-600 font-medium">
                                {errors.property_id}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="Room Number / Identifier"
                            id="room_number"
                            value={data.room_number}
                            onChange={(e) =>
                                setData("room_number", e.target.value)
                            }
                            error={errors.room_number}
                            required
                        />

                        <TextInput
                            label="Max Capacity"
                            id="capacity"
                            type="number"
                            value={data.capacity}
                            onChange={(e) =>
                                setData(
                                    "capacity",
                                    parseInt(e.target.value) || 1,
                                )
                            }
                            error={errors.capacity}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="Monthly Rent Price (₱)"
                            id="price"
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) =>
                                setData("price", parseFloat(e.target.value))
                            }
                            error={errors.price}
                            required
                        />

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value as any)
                                }
                                className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                            >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Description / Features
                        </label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <Link
                            href={route("rooms.index")}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton isLoading={processing}>
                            Update Room
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
