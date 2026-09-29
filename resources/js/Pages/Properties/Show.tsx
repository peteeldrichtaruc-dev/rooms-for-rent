import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link } from "@inertiajs/react";

interface Room {
    id: number;
    room_number: string;
    capacity: number;
    price: number;
    status: "available" | "occupied" | "maintenance";
}

interface Property {
    id: number;
    name: string;
    address: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
    description?: string;
    rooms?: Room[];
}

export default function Show({ property }: { property: Property }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            {property.name}
                        </h1>
                        <p className="text-xs text-slate-500">
                            {property.address}, {property.city},{" "}
                            {property.country}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("properties.edit", property.id)}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Edit Property
                        </Link>
                        <PrimaryButton href={route("rooms.create")}>
                            + Add Room
                        </PrimaryButton>
                    </div>
                </div>
            }
        >
            <Head title={`${property.name} - RoomsForRent`} />

            <div className="space-y-8" data-aos="fade-up">
                {/* Description Card */}
                {property.description && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Overview
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed">
                            {property.description}
                        </p>
                    </div>
                )}

                {/* Rooms Table Listing */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Rooms & Units
                            </h2>
                            <p className="text-xs text-slate-500">
                                Managed spaces located at this property.
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                            {property.rooms?.length || 0} Total
                        </span>
                    </div>

                    {!property.rooms || property.rooms.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-500">
                            No rooms added yet. Click "+ Add Room" to create
                            unit listings.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">Room #</th>
                                        <th className="px-6 py-3.5">
                                            Capacity
                                        </th>
                                        <th className="px-6 py-3.5">
                                            Monthly Price
                                        </th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {property.rooms.map((room) => (
                                        <tr
                                            key={room.id}
                                            className="hover:bg-slate-50/50 transition"
                                        >
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                {room.room_number}
                                            </td>
                                            <td className="px-6 py-4">
                                                {room.capacity} Person(s)
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                ₱{room.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                        room.status ===
                                                        "available"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : room.status ===
                                                                "occupied"
                                                              ? "bg-blue-50 text-blue-700"
                                                              : "bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route(
                                                        "rooms.show",
                                                        room.id,
                                                    )}
                                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
