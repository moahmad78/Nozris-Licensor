'use client';

import { useState } from 'react';
import {
    Ticket, Key, ShieldAlert, MessageSquare, Inbox, FileText, ArrowUpRight, BarChart3, Clock, Sparkles, Code2, Download, Scale, Share2
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { getLicenseDetails } from '@/app/actions/license-actions';
import { getPaymentStatus } from '@/app/actions/payment-actions';
import IntegrityManager from '@/components/IntegrityManager';
import SecureImage from '@/components/SecureImage';
import { TamperLogTable } from '@/components/security/tamper-log-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function ClientDashboard() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Mock data for analytics
    const attacksBlocked = 124;
    const uptime = "99.99%";

    // Mock data for empty state demonstration
    // ideally, these would come from the getLicenseDetails action
    const licenses: any[] = [];
    const tickets: any[] = [];
    // Mock user details for certificate generation
    const mockUser = {
        name: "Valued Partner",
        domain: "example.com",
        verificationCode: "xxxx-xxxx-xxxx"
    };


    const handleDownloadCertificate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate-certificate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: mockUser.name,
                    domain: mockUser.domain,
                    date: new Date().toLocaleDateString(),
                    verificationCode: mockUser.verificationCode // In real app, get from licence data
                })
            });

            if (!response.ok) throw new Error('Generation failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Certificate-${mockUser.domain}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success("Certificate Downloaded!");
        } catch (error) {
            toast.error("Failed to download certificate.");
        } finally {
            setLoading(false);
        }
    };

    const handleShareTrustLink = () => {
        const link = `https://licensr.in/verify/${mockUser.verificationCode}`;
        navigator.clipboard.writeText(link);
        toast.success("Trust Link Copied to Clipboard!");
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in duration-700">
            {/* Header / Primary Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-[1000] tracking-tighter uppercase italic leading-none">Your <span className="text-gray-300">Vault</span></h1>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active License Guardianship</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    {/* NEW ACTIONS */}
                    <button
                        onClick={handleDownloadCertificate}
                        disabled={loading}
                        className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                    >
                        <Download className="w-4 h-4" />
                        Download Cert
                    </button>
                    <Link href="/client/legal-doc" className="flex-1 md:flex-none bg-black text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                        <Scale className="w-4 h-4" />
                        Legal Agreement
                    </Link>
                    <button
                        onClick={handleShareTrustLink}
                        className="flex-1 md:flex-none bg-white border-2 border-green-500 text-green-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-green-50 transition-all"
                    >
                        <Share2 className="w-4 h-4" />
                        Share Trust Link
                    </button>

                    {/* Original Links (Simplified/Icon only if needed, or kept) */}
                    <Link href="/client/support" className="flex-1 md:flex-none bg-gray-100 text-black px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
                        <MessageSquare className="w-4 h-4" />
                        Support
                    </Link>
                </div>
            </div>

            {/* Image Protection Test */}
            <div className="mb-4 flex gap-4">
                <SecureImage
                    src="/details_1.png" // Assuming this exists or any placeholder
                    alt="Protected Asset"
                    width={300}
                    height={200}
                    className="rounded-xl shadow-lg"
                />
            </div>

            {/* Value Metrics Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black text-white p-8 rounded-[2.5rem] relative overflow-hidden group col-span-1 md:col-span-2">
                    {/* Simplified Threat Card Content */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-blue-400">
                                <ShieldAlert className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Threats Neutralized</span>
                            </div>
                            <p className="text-5xl font-[1000] tracking-tighter italic">{attacksBlocked}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">In the last 30 days &bull; Zero Breaches</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-white/10" />
                    </div>
                </div>

                <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6">
                    {/* Replaced Dev Env card with Integrity Management (which includes Dev concept) */}
                    <IntegrityManager
                        initialEditMode={false}
                        initialIsUnlimited={false}
                        initialExpiry={null}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Licenses Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Key className="w-5 h-5" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Active Licenses</h2>
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Support History</h2>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] p-16 flex flex-col items-center text-center space-y-4">
                            <div className="p-5 bg-white rounded-3xl shadow-sm">
                                <ShieldAlert className="w-8 h-8 text-gray-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-gray-900 uppercase">No Support Data</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Your ticket queue is completely clear.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Ticket List (Placeholder) */}
                        </div>
                    )}
                </div>
            </div>

            {/* Forensics Row */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                <TamperLogTable />
            </div>
        </div >
    );
}
