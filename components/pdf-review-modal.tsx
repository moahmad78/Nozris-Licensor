import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface PdfData {
    // Sender (Profile)
    senderName: string;
    senderAddress: string;
    senderEmail: string;
    senderWhatsapp: string;

    // Receiver (License)
    clientName: string;
    clientAddress: string;
    licenseKey: string;
    domain: string;
    planName: string;
    price: number;
    expiryDate: string; // ISO String
}

interface PdfReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: PdfData) => void;
    initialData: PdfData;
}

export function PdfReviewModal({ isOpen, onClose, onConfirm, initialData }: PdfReviewModalProps) {
    const [formData, setFormData] = useState<PdfData>(initialData);

    // Sync when initialData changes
    useEffect(() => {
        setFormData(initialData);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Review Billing Details</h2>
                        <p className="text-sm text-gray-500">Edit any details before generating the invoice PDF.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: Sender (From) */}
                    <div className="space-y-4">
                        <h3 className="tex-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">From (Your Details)</h3>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Full Name</label>
                            <input
                                name="senderName"
                                value={formData.senderName}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Email Address</label>
                            <input
                                name="senderEmail"
                                value={formData.senderEmail}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">WhatsApp / Phone</label>
                            <input
                                name="senderWhatsapp"
                                value={formData.senderWhatsapp}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Address</label>
                            <textarea
                                name="senderAddress"
                                value={formData.senderAddress}
                                onChange={handleChange}
                                rows={3}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Column 2: Receiver (To) */}
                    <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="tex-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">To (Client Details)</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Client Name</label>
                                <input
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    placeholder="Enter client name..."
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">License Key</label>
                                <input
                                    name="licenseKey"
                                    value={formData.licenseKey}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-gray-100 border border-transparent rounded-lg text-sm font-mono text-gray-500 cursor-not-allowed" // Keep key semi-readonly looking but editable if really needed, but mostly reference
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Client Address</label>
                            <textarea
                                name="clientAddress"
                                value={formData.clientAddress}
                                onChange={handleChange}
                                placeholder="Enter full address..."
                                rows={2}
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Authorized Domain</label>
                            <input
                                name="domain"
                                value={formData.domain}
                                onChange={handleChange}
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1 col-span-2">
                                <label className="text-xs font-medium text-gray-500">Plan Name</label>
                                <input
                                    name="planName"
                                    value={formData.planName}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-500">Price</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Expiry Date</label>
                            <input
                                name="expiryDate"
                                type="date"
                                value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(formData)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 hover:scale-105 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Confirm & Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
