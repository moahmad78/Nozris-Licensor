'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SmartFilter } from '@/components/admin/SmartFilter';
import { exportToCSV } from '@/lib/utils/exportToCSV';
import { Loader2, TrendingUp, Users, MessageSquare, Download, DollarSign, Key, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function DailyReportPage() {
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/app/api/reports/unified/route?date=${dateParam}`);
                // Note: Next.js App Router API routes are usually at /api/..., adjusting path if needed based on file struct
                // Strict path was app/api/reports/unified/route.ts -> /api/reports/unified
                const response = await fetch(`/api/reports/unified?date=${dateParam}`);
                if (!response.ok) throw new Error('Failed');
                const json = await response.json();
                setData(json.data);
            } catch (error) {
                toast.error("Failed to load report data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateParam]);

    const handleExport = () => {
        if (!data) return;
        // Flatten for export
        const flatList = [
            ...data.licenses.map((l: any) => ({ type: 'LICENSE', ...l })),
            ...data.payments.map((p: any) => ({ type: 'PAYMENT', ...p })),
            ...data.tickets.map((t: any) => ({ type: 'TICKET', ...t }))
        ];
        exportToCSV(flatList, `daily-report-${dateParam}`);
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    const totalRevenue = data?.payments.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
    const newUsers = data?.licenses.length || 0;
    const activeChats = data?.messages.length || 0;

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-[900] uppercase tracking-tighter">Daily Intelligence</h1>
                    <p className="text-gray-500 font-medium">Unified Operations View</p>
                </div>
                <div className="flex gap-4">
                    <SmartFilter />
                    <button onClick={handleExport} className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[80vh]">

                {/* Col 1: Metrics (1/4 width) */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <DollarSign className="w-8 h-8 text-emerald-500 mb-2" />
                        <p className="text-xs font-black uppercase text-gray-400">Total Revenue</p>
                        <h3 className="text-3xl font-black">${totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <Key className="w-8 h-8 text-blue-500 mb-2" />
                        <p className="text-xs font-black uppercase text-gray-400">New Licenses</p>
                        <h3 className="text-3xl font-black">{newUsers}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <MessageSquare className="w-8 h-8 text-indigo-500 mb-2" />
                        <p className="text-xs font-black uppercase text-gray-400">Chat Volume</p>
                        <h3 className="text-3xl font-black">{activeChats} msgs</h3>
                    </div>
                </div>

                {/* Col 2: Activity Table (2/4 width) */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                        <h3 className="font-bold text-lg">Detailed Activity Log</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {data?.lines?.length === 0 && <p className="text-center text-gray-400 py-10">No activity recorded for this date.</p>}

                        {data?.licenses.map((l: any) => (
                            <div key={l.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Key className="w-4 h-4" /></div>
                                    <div>
                                        <p className="font-bold text-sm">New License Issued</p>
                                        <p className="text-xs text-gray-500">{l.domain}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-gray-400">{new Date(l.createdAt).toLocaleTimeString()}</span>
                            </div>
                        ))}

                        {data?.payments.map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign className="w-4 h-4" /></div>
                                    <div>
                                        <p className="font-bold text-sm">Payment Received</p>
                                        <p className="text-xs text-gray-500">${p.amount} - {p.status}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-gray-400">{new Date(p.createdAt).toLocaleTimeString()}</span>
                            </div>
                        ))}
                        {/* Fallback mixed list if date is empty */}
                    </div>
                </div>

                {/* Col 3: Chat Feed (1/4 width) */}
                <div className="bg-black text-white rounded-[2.5rem] p-6 flex flex-col h-full shadow-2xl shadow-blue-900/10">
                    <h3 className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-gray-400 mb-6">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Live Comms
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {data?.messages.map((m: any) => (
                            <div key={m.id} className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] uppercase font-bold text-blue-300">{m.sender}</span>
                                    <span className="text-[9px] text-gray-500">{new Date(m.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed font-medium">"{m.text}"</p>
                            </div>
                        ))}
                        {data?.messages.length === 0 && (
                            <div className="text-center text-gray-600 text-xs py-10">
                                No messages exchanged.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
