'use client';

import { useState } from 'react';
import { createLicense } from '@/lib/actions';
import { toast } from 'sonner';

export function CreateLicenseForm() {
    const [selectedDuration, setSelectedDuration] = useState('30');
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const result = await createLicense(formData);
            if (result && result.error) {
                toast.error(result.error);
            } else {
                toast.success('License created successfully!');
                // Reset form or other success logic if needed
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-semibold mb-4">Create License</h2>
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
                    <input name="domain" type="text" placeholder="client.com" required className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                    <input name="clientEmail" type="email" placeholder="client@example.com" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                        <input name="planName" type="text" defaultValue="Standard Plan" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (₹)</label>
                        <input name="monthlyPrice" type="number" defaultValue="500" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select
                        name="days"
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    >
                        <option value="30">1 Month</option>
                        <option value="365">1 Year</option>
                        <option value="36500">Lifetime</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                {
                    selectedDuration === 'custom' && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valid From (Start)</label>
                                <input
                                    name="validFrom"
                                    type="datetime-local"
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (End)</label>
                                <input
                                    name="validUntil"
                                    type="datetime-local"
                                    required
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            </div>
                        </div>
                    )
                }
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                >
                    {isPending ? 'Generating...' : 'Generate Key'}
                </button>
            </form >
        </div >
    );
}
