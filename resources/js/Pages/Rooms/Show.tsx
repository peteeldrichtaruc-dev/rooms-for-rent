import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

interface Room {
    id: number;
    room_number: string;
    capacity: number;
    price: number;
    status: "available" | "occupied" | "maintenance";
    description?: string;
    property: {
        id: number;
        name: string;
    };
}

export default function Show({ room }: { room: Room }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Room {room.room_number}
                        </h1>
                        <p className="text-xs text-slate-500">
                            Located at {room.property?.name}
                        </p>
                    </div>
                    <Link
                        href={route("rooms.edit", room.id)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                    >
                        Edit Room
                    </Link>
                </div>
            }
        >
            <Head title={`Room ${room.room_number} - RoomsForRent`} />

            <div className="max-w-3xl space-y-6" data-aos="fade-up">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Status
                        </span>
                        <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                                room.status === "available"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : room.status === "occupied"
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-amber-50 text-amber-700"
                            }`}
                        >
                            {room.status}
                        </span>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Monthly Rent
                        </span>
                        <p className="text-base font-extrabold text-slate-900">
                            ₱{Number(room.price).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Capacity
                        </span>
                        <p className="text-base font-extrabold text-slate-900">
                            {room.capacity} Person(s)
                        </p>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Property
                        </span>
                        <Link
                            href={route("properties.show", room.property.id)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            {room.property.name}
                        </Link>
                    </div>
                </div>

                {room.description && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Unit Details
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed">
                            {room.description}
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
