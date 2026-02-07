'use client';

import { useState, useEffect } from 'react';
import {
    ShieldCheck, ShieldAlert, ToggleRight, ToggleLeft, Loader2, Key,
    Database, Download, Upload, History, Clock, HardDrive, Trash2, Zap
} from 'lucide-react';
import { toggle2FA, getSecuritySettings } from '@/app/actions/two-factor-actions';
import { manualBackupAction } from '@/app/actions/backup-actions';
import { purgeOldLogs, refreshHealthAction } from '@/app/actions/maintenance-actions';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'SECURITY' | 'MAINTENANCE'>('MAINTENANCE');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [purging, setPurging] = useState(false);
    const [health, setHealth] = useState<any>(null);

    // Context from session usually
    const userId = "admin-user-id";

    const loadData = async () => {
        const [sec, h] = await Promise.all([
            getSecuritySettings(userId),
            refreshHealthAction()
        ]);
        if (sec) setTwoFactorEnabled(sec.twoFactorEnabled);
        setHealth(h);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const handlePurge = async () => {
        if (!confirm("RESTRICTED ACTION: Purge all logs older than 30 days? This action is terminal and irreversible.")) return;
        setPurging(true);
        const res = await purgeOldLogs();
        if (res.success) {
            toast.success(`PURGE COMPLETE: ${res.count} logs eliminated from database.`);
            setHealth(res.health);
        } else {
            toast.error(res.error || "Log purge failed");
        }
        setPurging(false);
    };

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>;

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
            <header className="space-y-4">
                <div className="flex items-center gap-2 text-black">
                    <Zap className="w-4 h-4 fill-black" />
                    <span className="text-[10px] font-[1000] uppercase tracking-[0.4em]">Proprietary OS Configuration</span>
                </div>
                <h1 className="text-6xl font-[1000] tracking-tight uppercase italic leading-none">Settings <span className="text-gray-200">& Maintenance</span></h1>
            </header>

            <div className="flex gap-4 border-b border-gray-100 pb-6 overflow-x-auto no-scrollbar">
                {['GENERAL', 'SECURITY', 'MAINTENANCE'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-black text-white shadow-2xl shadow-black/20' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'MAINTENANCE' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Server Maintenance Card */}
                        <div className="bg-black text-white rounded-[4rem] p-12 relative overflow-hidden flex flex-col justify-between min-h-[450px]">
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4 text-emerald-400">
                                    <div className="p-4 bg-white/10 rounded-[2rem] backdrop-blur-md border border-white/10">
                                        <HardDrive className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">Drive Terminal</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Active Resource Allocation</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-black uppercase italic tracking-widest">
                                            <span>Partition Load</span>
                                            <span className={Number(health?.percentage) > 90 ? "text-red-500" : "text-white"}>{health?.percentage}%</span>
                                        </div>
                                        <div className="h-6 bg-white/5 rounded-full p-1.5 border border-white/10 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${Number(health?.percentage) > 90 ? 'bg-red-600' : 'bg-white'}`}
                                                style={{ width: `${health?.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-12 pt-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Available</p>
                                            <p className="text-3xl font-[1000] italic text-emerald-400 leading-none">{health?.free}GB</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Consumed</p>
                                            <p className="text-3xl font-[1000] italic text-white leading-none">{health?.used}GB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[150px] opacity-10 translate-x-1/2 -translate-y-1/2" />
                            <div className="relative z-10 pt-10 border-t border-white/10 mt-10">
                                <p className="text-[11px] text-gray-400 font-medium leading-relaxed uppercase">Real-time stats polling from root partition `/`. All data encrypted at rest.</p>
                            </div>
                        </div>

                        {/* Maintenance Controls */}
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-100 p-10 rounded-[4rem] shadow-sm space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-4 bg-red-50 rounded-[2rem] text-red-600">
                                        <Trash2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 leading-none mb-1">Database Truncation</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Optimize Disk & IOPS</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">Permanently purge all activity logs and intelligence entries older than 30 days. This operation cannot be reversed.</p>
                                <button
                                    onClick={handlePurge}
                                    disabled={purging}
                                    className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {purging ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                    Purge Audit Logs Now
                                </button>
                            </div>

                            {/* EMERGENCY LOCKDOWN TOGGLE */}
                            <div className="bg-amber-400 p-10 rounded-[3.5rem] relative overflow-hidden group">
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-black text-black uppercase tracking-[0.3em]">Emergency Override</h4>
                                            <p className="text-black text-xl font-[1000] italic uppercase leading-none">Maintenance Mode</p>
                                        </div>
                                        <ToggleRight className="w-10 h-10 text-black opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase leading-relaxed opacity-60">
                                        Immediately disconnects all active client sessions and displays a "System Under Maintenance" screen.
                                    </p>
                                    <button
                                        onClick={async () => {
                                            const { toggleMaintenanceMode } = await import('@/app/actions/maintenance-actions');
                                            const res = await toggleMaintenanceMode();
                                            if (res.success) toast.success(`SYSTEM STATUS: ${res.maintenanceMode ? 'LOCKED' : 'ONLINE'}`);
                                        }}
                                        className="w-full bg-white/20 hover:bg-black hover:text-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        Toggle Status
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-10 rounded-[3.5rem] relative overflow-hidden group">
                                <div className="relative z-10 flex items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em]">Cloud Recovery</h4>
                                        <p className="text-white text-xl font-[1000] italic uppercase leading-none">Instant Vault Export</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const res = await manualBackupAction();
                                            if (res.success && res.data) {
                                                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a'); a.href = url; a.download = res.filename!; a.click();
                                                toast.success("SECURE EXPORT COMPLETE");
                                            }
                                        }}
                                        className="p-5 bg-white text-black rounded-3xl hover:bg-emerald-400 transition-colors"
                                    >
                                        <Download className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[4rem] p-12 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-12">
                        {[
                            { label: 'Weekly Cleanup', status: 'AUTO', icon: Clock },
                            { label: 'Integrity Check', status: 'SYSTEM', icon: ShieldCheck },
                            { label: 'Daily Backup', status: '03:00', icon: Database },
                            { label: 'API Guard', status: 'AES-256', icon: Key }
                        ].map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                </div>
                                <p className="text-3xl font-[1000] italic leading-none text-black uppercase">{item.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
