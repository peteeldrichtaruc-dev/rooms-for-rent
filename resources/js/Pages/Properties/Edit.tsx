import { FormEventHandler } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

interface Property {
    id: number;
    name: string;
    address: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
    description?: string;
}

export default function Edit({ property }: { property: Property }) {
    const { data, setData, put, processing, errors } = useForm({
        name: property.name || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        postal_code: property.postal_code || '',
        country: property.country || 'Philippines',
        description: property.description || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('properties.update', property.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Edit Property</h1>
                    <p className="text-xs text-slate-500">Update metadata and location details for {property.name}.</p>
                </div>
            }
        >
            <Head title={`Edit ${property.name} - RoomsForRent`} />

            <div className="max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8" data-aos="fade-up">
                <form onSubmit={submit} className="space-y-5">
                    <TextInput
                        label="Property Name"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                    />

                    <TextInput
                        label="Street Address"
                        id="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        error={errors.address}
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="City"
                            id="city"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            error={errors.city}
                            required
                        />

                        <TextInput
                            label="State / Province"
                            id="state"
                            value={data.state}
                            onChange={(e) => setData('state', e.target.value)}
                            error={errors.state}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="Postal Code"
                            id="postal_code"
                            value={data.postal_code}
                            onChange={(e) => setData('postal_code', e.target.value)}
                            error={errors.postal_code}
                        />

                        <TextInput
                            label="Country"
                            id="country"
                            value={data.country}
                            onChange={(e) => setData('country', e.target.value)}
                            error={errors.country}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Description / Building Notes
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-xs text-slate-800 transition"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{errors.description}</p>
                        )}
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <Link
                            href={route('properties.index')}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton isLoading={processing}>
                            Update Property
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}