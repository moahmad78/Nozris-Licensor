import { prisma } from '@/lib/db';
import { approveRenewal, rejectRenewal } from '@/lib/actions';
import { Check, X, Clock, FileText } from 'lucide-react';
import { Toaster } from 'sonner';

export default async function RequestsPage() {
    const requests = await prisma.renewalRequest.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8">
            <Toaster />

            <header>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Renewal Requests</h1>
                <p className="text-gray-500">Manage incoming subscription renewal requests.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Domain</th>
                                <th className="px-6 py-3 font-medium">Details</th>
                                <th className="px-6 py-3 font-medium">Payment Ref</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No renewal requests found.
                                    </td>
                                </tr>
                            )}
                            {requests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">
                                            {new Date(request.createdAt).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {request.domain}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 font-medium">{request.duration} Months</div>
                                        <div className="text-xs text-gray-500">₹{request.amount}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-600">
                                            {request.transactionId || 'N/A'}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5
                                            ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {request.status === 'PENDING' && <Clock className="w-3 h-3" />}
                                            {request.status === 'APPROVED' && <Check className="w-3 h-3" />}
                                            {request.status === 'REJECTED' && <X className="w-3 h-3" />}
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {request.status === 'PENDING' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <form action={async () => {
                                                    'use server';
                                                    await approveRenewal(request.id);
                                                }}>
                                                    <button
                                                        title="Approve & Extend"
                                                        className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </form>
                                                <form action={async () => {
                                                    'use server';
                                                    await rejectRenewal(request.id);
                                                }}>
                                                    <button
                                                        title="Reject"
                                                        className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

