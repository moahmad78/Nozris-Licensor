'use client';

import { useState } from 'react';
import { extendLicense } from '@/lib/actions';
import { RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

interface LicenseRenewalModalProps {
    licenseId: string;
    currentExpiresAt: Date;
}

export function LicenseRenewalModal({ licenseId, currentExpiresAt }: LicenseRenewalModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [extensionType, setExtensionType] = useState('1_MONTH');
    const [customDate, setCustomDate] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleExtend = async () => {
        setIsPending(true);
        try {
            const result = await extendLicense(licenseId, extensionType, customDate);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('License extended successfully!');
                setIsOpen(false);
            }
        } catch (error) {
            toast.error('Failed to extend license.');
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                title="Renew / Extend"
                className="p-2 hover:bg-blue-50 rounded-md text-gray-500 hover:text-blue-600 transition-colors"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-lg">Extend License</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="text-sm text-gray-500">
                        Current Expiry: <span className="font-medium text-gray-900">{new Date(currentExpiresAt).toLocaleDateString()}</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Extension Duration</label>
                        <select
                            value={extensionType}
                            onChange={(e) => setExtensionType(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                        >
                            <option value="1_MONTH">Extend by 1 Month</option>
                            <option value="1_YEAR">Extend by 1 Year</option>
                            <option value="CUSTOM">Set New Expiry Date</option>
                        </select>
                    </div>

                    {extensionType === 'CUSTOM' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Expiry Date</label>
                            <input
                                type="datetime-local"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExtend}
                            disabled={isPending}
                            className="flex-1 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Extending...' : 'Confirm Extension'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
