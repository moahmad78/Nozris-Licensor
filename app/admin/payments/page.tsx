'use client';

import { useState, useEffect } from 'react';
import { getPendingPayments } from '@/app/actions/admin-payment-data';
import { approvePayment, rejectPayment } from '@/app/actions/payment-actions';
import { Check, X, CreditCard, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);

    const refresh = () => getPendingPayments().then(setPayments);
    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    // Siren Effect
    useEffect(() => {
        if (payments.length > 0) {
            // Play sound - utilizing a notification sound placeholder
            // In a real app, use a hosted mp3
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Example siren/alert
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio play failed (interaction required)", e));
        }
    }, [payments.length]);

    const handleApprove = async (id: string) => {
        const res = await approvePayment(id);
        if (res.success) {
            toast.success("Payment Approved");
            refresh();
        } else {
            toast.error("Approval Failed");
        }
    };

    const [rejectId, setRejectId] = useState<string | null>(null);
    const [reason, setReason] = useState('Invalid UTR Number');

    const handleRejectSubmit = async () => {
        if (!rejectId) return;
        const res = await rejectPayment(rejectId, reason);
        if (res.success) {
            toast.success("Payment Rejected");
            setRejectId(null);
            refresh();
        } else {
            toast.error("Rejection Failed");
        }
    };

    const handleReject = async (id: string) => {
        setRejectId(id);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans relative">
            {rejectId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-black text-gray-900">Reject Payment</h3>
                        <p className="text-sm text-gray-500">Select a reason for rejection. The client will be notified immediately via WhatsApp.</p>

                        <div className="space-y-2">
                            {['Invalid UTR Number', 'Amount Received is Incorrect', 'Transaction Not Found in Bank', 'Spam / Duplicate'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setReason(r)}
                                    className={`w-full p-4 rounded-xl text-left font-bold text-sm border-2 transition-all ${reason === r ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <button
                                onClick={() => setRejectId(null)}
                                className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                className="flex-1 py-3 font-black text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-200"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment Approvals</h1>
                        <p className="text-gray-500 font-medium mt-1">Verify manual UTR submissions.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-600">{payments.length} Pending</span>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Client / Domain</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">UTR Number</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Amount</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Date</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">WhatsApp Alert</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="font-bold text-gray-900">{p.license.clientEmail}</div>
                                        <div className="text-xs text-gray-400 font-mono">{p.license.domain}</div>
                                    </td>
                                    <td className="p-6 font-mono text-sm font-bold text-indigo-600 bg-indigo-50/50 rounded-lg w-fit px-3 py-1">
                                        {p.utrNumber}
                                    </td>
                                    <td className="p-6 font-bold text-gray-900">
                                        ${p.amount}
                                    </td>
                                    <td className="p-6 text-xs font-medium text-gray-500">
                                        {format(new Date(p.createdAt), 'MMM dd, HH:mm')}
                                    </td>
                                    <td className="p-6 text-center">
                                        {p.notificationSent ? (
                                            <div className="inline-flex flex-col items-center gap-1 text-emerald-600">
                                                <Check className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Sent</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex flex-col items-center gap-1 text-gray-400 opacity-50">
                                                <span className="text-[10px] font-bold uppercase tracking-wider">-</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setRejectId(p.id)}
                                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                title="Reject"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(p.id)}
                                                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium italic">
                                        No pending payments found. All clear!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
