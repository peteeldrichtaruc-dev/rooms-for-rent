import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import {Head, Link, router} from '@inertiajs/react';

interface Property {
    id: number;
    name: string;
}

interface Room {
    id: number;
    room_number: string;
    capacity: number;
    price: number;
    status: 'available' | 'occupied' | 'maintenance';
    property: Property;
}

export default function Index({rooms}: { rooms: Room[] }) {
    const handleDelete = (id: number, number: string) => {
        if (confirm(`Are you sure you want to delete Room ${number}?`)) {
            router.delete(route('rooms.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">All Rooms & Units</h1>
                        <p className="text-xs text-slate-500">Monitor availability and pricing across all managed
                            properties.</p>
                    </div>
                    <PrimaryButton
                        href={route('rooms.create')}
                        size="md"
                        leftIcon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                            </svg>
                        }
                    >
                        Add Room
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Rooms - RoomsForRent"/>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                 data-aos="fade-up">
                {rooms.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-xs text-slate-500">No rooms available yet. Register a unit to begin
                            leasing.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead
                                className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5">Room #</th>
                                <th className="px-6 py-3.5">Property</th>
                                <th className="px-6 py-3.5">Capacity</th>
                                <th className="px-6 py-3.5">Price</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {rooms.map((room) => (
                                <tr key={room.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4 font-bold text-slate-900">{room.room_number}</td>
                                    <td className="px-6 py-4">{room.property?.name}</td>
                                    <td className="px-6 py-4">{room.capacity} Person(s)</td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">₱{Number(room.price).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    room.status === 'available' ? 'bg-emerald-50 text-emerald-700' :
                                                        room.status === 'occupied' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                {room.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <Link href={route('rooms.show', room.id)}
                                              className="font-semibold text-blue-600 hover:text-blue-700">View</Link>
                                        <Link href={route('rooms.edit', room.id)}
                                              className="font-semibold text-slate-600 hover:text-slate-900">Edit</Link>
                                        <button onClick={() => handleDelete(room.id, room.room_number)}
                                                className="font-semibold text-red-600 hover:text-red-700">Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
