'use client';

import { useState, useEffect } from 'react';
import { getClientLicenseDetails } from '@/app/actions/client-integration';
import { CreditCard, Download, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import Link from 'next/link';

export default function BillingPage() {
    const [license, setLicense] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        getClientLicenseDetails().then(data => {
            if (data && data.key !== 'NO_LICENSE_FOUND') {
                // In a real app, we'd fetch full details + billing history from a server action
                // For now, we mock/use what we have or fetch user details. 
                // Let's assume we fetch a "getBillingDetails" action.
                // Since we don't have that action yet, let's mock the display based on the 'license' object if we had it, 
                // or just fetch it here.
                // Let's create a quick server action for this page's data to be real.
                import('@/app/actions/billing-actions').then(mod => {
                    mod.getBillingDetails().then(details => {
                        setLicense(details.license);
                        setHistory(details.history);
                    });
                });
            }
        });
    }, []);

    if (!license) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    const daysUntilDue = Math.ceil((new Date(license.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isUrgent = daysUntilDue <= 5;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing & Invoices</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage your subscription and payment history.</p>
                    </div>
                    <Link href="/client/dashboard" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Status Card */}
                <div className={`p-8 rounded-[2.5rem] border ${isUrgent ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-100 text-gray-900'} shadow-xl transition-all`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 opacity-80">
                                <Clock className="w-5 h-5" />
                                <span className="text-xs font-black uppercase tracking-widest">Next Payment Due</span>
                            </div>
                            <h2 className="text-5xl font-black tracking-tighter">
                                {format(new Date(license.expiresAt), 'MMM dd, yyyy')}
                            </h2>
                            <p className={`font-medium ${isUrgent ? 'text-red-100' : 'text-gray-500'}`}>
                                {daysUntilDue > 0 ? `${daysUntilDue} days remaining` : 'Payment Overdue'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 ${isUrgent ? 'bg-white text-red-600' : 'bg-black text-white'}`}>
                                <CreditCard className="w-4 h-4" />
                                {isUrgent ? 'Pay Now & prevent Lock' : 'Manage Payment Method'}
                            </button>
                            {isUrgent && (
                                <div className="flex items-center justify-center gap-2 text-red-200 bg-red-700/30 py-2 rounded-lg">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase">Urgent Action Required</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Download className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Payment History</h3>
                    </div>

                    <div className="overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Invoice ID</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {history.length > 0 ? history.map((item: any, i: number) => (
                                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 text-xs font-bold text-gray-900">INV-{item.id || '000'}</td>
                                        <td className="py-4 text-xs font-medium text-gray-500">{format(new Date(item.date), 'MMM dd, yyyy')}</td>
                                        <td className="py-4 text-xs font-bold text-gray-900">${item.amount}</td>
                                        <td className="py-4">
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                Paid
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-xs text-gray-400 font-medium italic">
                                            No payment history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
