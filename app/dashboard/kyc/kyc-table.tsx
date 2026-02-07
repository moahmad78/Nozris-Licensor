'use client';

import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, MessageCircle, FileText } from 'lucide-react';

export function KYCTable({ clients }: { clients: any[] }) {

    const getMissingFields = (client: any) => {
        const missing = [];
        if (!client.name) missing.push('Name');
        if (!client.address) missing.push('Address');
        if (!client.aadharNumber) missing.push('Aadhar #');
        if (!client.documentUrl) missing.push('Document');
        if (!client.profilePhoto) missing.push('Photo');
        return missing;
    };

    const handleWhatsApp = (client: any, missing: string[]) => {
        const msg = `Hello ${client.name}, your KYC is incomplete. Missing: ${missing.join(', ')}. Please complete it at ${window.location.origin}/client/kyc`;
        window.open(`https://wa.me/${client.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="py-4 px-6 font-semibold">Client</th>
                        <th className="py-4 px-6 font-semibold">Status</th>
                        <th className="py-4 px-6 font-semibold">Missing Info</th>
                        <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {clients.length === 0 ? (
                        <tr><td colSpan={4} className="py-8 text-center text-gray-500">No pending KYC clients.</td></tr>
                    ) : clients.map(client => {
                        const missing = getMissingFields(client);
                        return (
                            <tr key={client.id} className="hover:bg-gray-50">
                                <td className="py-4 px-6">
                                    <div className="font-medium text-gray-900">{client.name}</div>
                                    <div className="text-xs text-gray-500">{client.email}</div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${client.kycStatus === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {client.kycStatus}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    {missing.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {missing.map(m => (
                                                <span key={m} className="px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-medium">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    ) : <span className="text-green-600 text-xs font-bold">All Fields Present</span>}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleWhatsApp(client, missing)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100"
                                        >
                                            <MessageCircle className="w-3 h-3" /> Remind
                                        </button>

                                        {client.kycStatus === 'SUBMITTED' && (
                                            <button
                                                onClick={async () => {
                                                    const { approveClientKYC } = await import('@/app/actions/client-kyc');
                                                    const res = await approveClientKYC(client.id);
                                                    if (res.success) toast.success("KYC Approved & Notifications Sent!");
                                                    else toast.error(res.error || "Failed to approve");
                                                }}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                                            >
                                                <CheckCircle className="w-3 h-3" /> Approve & Activate
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
