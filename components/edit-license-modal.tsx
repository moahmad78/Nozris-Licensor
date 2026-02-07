'use client';

import { useState } from 'react';
import { updateLicense } from '@/lib/actions';
import { Pencil, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface EditLicenseModalProps {
    license: {
        id: string;
        domain: string;
        clientEmail: string;
        planName: string;
        monthlyPrice: number;
    };
}

export function EditLicenseModal({ license }: EditLicenseModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Initial state from props
    const [domain, setDomain] = useState(license.domain);
    const [email, setEmail] = useState(license.clientEmail);
    const [plan, setPlan] = useState(license.planName);
    const [price, setPrice] = useState(license.monthlyPrice);

    async function handleUpdate(event: React.FormEvent) {
        event.preventDefault();
        setIsPending(true);

        const formData = new FormData();
        formData.append('domain', domain);
        formData.append('clientEmail', email);
        formData.append('planName', plan);
        formData.append('monthlyPrice', price.toString());

        const result = await updateLicense(license.id, formData);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success('License updated successfully');
            setIsOpen(false);
        }
        setIsPending(false);
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                title="Edit Details"
                className="p-2 hover:bg-blue-50 rounded-md text-gray-400 hover:text-blue-600 transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <form onSubmit={handleUpdate}>
                    <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900">Edit License</h3>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    value={plan}
                                    onChange={(e) => setPlan(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
