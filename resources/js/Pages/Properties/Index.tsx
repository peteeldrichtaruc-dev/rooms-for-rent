import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, router } from "@inertiajs/react";

interface Property {
    id: number;
    name: string;
    address: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
    description?: string;
    rooms_count?: number;
    created_at: string;
}

export default function Index({ properties }: { properties: Property[] }) {
    const handleDelete = (id: number, name: string) => {
        if (
            confirm(
                `Are you sure you want to delete "${name}"? All associated rooms and active lease records will be removed.`,
            )
        ) {
            router.delete(route("properties.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            Properties
                        </h1>
                        <p className="text-xs text-slate-500">
                            Manage real estate holdings, view total units, and
                            oversee locations.
                        </p>
                    </div>
                    <PrimaryButton
                        href={route("properties.create")}
                        size="md"
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        }
                    >
                        Add Property
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Properties - RoomsForRent" />

            {properties.length === 0 ? (
                <div
                    className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center"
                    data-aos="fade-up"
                >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                        No properties found
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Get started by adding your first property to organize
                        rooms and track occupant agreements.
                    </p>
                    <div className="mt-6">
                        <PrimaryButton href={route("properties.create")}>
                            Create Property
                        </PrimaryButton>
                    </div>
                </div>
            ) : (
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    data-aos="fade-up"
                >
                    {properties.map((property) => (
                        <div
                            key={property.id}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between hover:border-slate-300 transition duration-150"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <Link
                                        href={route(
                                            "properties.show",
                                            property.id,
                                        )}
                                        className="group"
                                    >
                                        <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                                            {property.name}
                                        </h2>
                                    </Link>
                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 shrink-0">
                                        {property.rooms_count ?? 0} Rooms
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4 shrink-0 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {property.address}, {property.city}
                                </p>
                                {property.description && (
                                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                                        {property.description}
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={route("properties.show", property.id)}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                                >
                                    View Details &rarr;
                                </Link>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={route(
                                            "properties.edit",
                                            property.id,
                                        )}
                                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                property.id,
                                                property.name,
                                            )
                                        }
                                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
