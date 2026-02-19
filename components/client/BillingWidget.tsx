'use client';

import { FileText, Download, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function BillingWidget() {
    const transactions = [
        { id: 'INV-001', deal: 'Enterprise Upgrade', date: '2026-02-01', amount: '$499.00', status: 'Paid' },
        { id: 'INV-002', deal: 'Security Audit', date: '2026-01-15', amount: '$150.00', status: 'Paid' },
        { id: 'INV-003', deal: 'Bot Protection', date: '2026-01-01', amount: '$99.00', status: 'Paid' },
    ];

    const handleDownload = (invoiceId: string) => {
        toast.success(`Downloading Invoice ${invoiceId}...`);
    };

    return (
        <div className="bg-black/50 border border-white/10 rounded-3xl p-6 h-full flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="text-green-500" /> Billing & Deals
                </h3>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-500 border-b border-white/10">
                            <th className="py-3 font-bold uppercase tracking-wider">Deal</th>
                            <th className="py-3 font-bold uppercase tracking-wider">Date</th>
                            <th className="py-3 font-bold uppercase tracking-wider">Amount</th>
                            <th className="py-3 font-bold uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions.map((tx, i) => (
                            <tr key={i} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                <td className="py-3 text-white font-medium">
                                    {tx.deal}
                                    <div className="flex items-center gap-1 text-[10px] text-green-500 mt-0.5">
                                        <CheckCircle size={10} /> {tx.status}
                                    </div>
                                </td>
                                <td className="py-3 text-gray-400 font-mono text-xs">{tx.date}</td>
                                <td className="py-3 text-white font-bold">{tx.amount}</td>
                                <td className="py-3">
                                    <button
                                        onClick={() => handleDownload(tx.id)}
                                        className="p-2 bg-white/5 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-all hover:scale-110"
                                        title="Download Invoice"
                                    >
                                        <FileText size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="w-full mt-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                <Download size={14} /> Download All History
            </button>
        </div>
    );
}
