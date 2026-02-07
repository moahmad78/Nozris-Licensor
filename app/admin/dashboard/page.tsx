'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Users, Key, ShieldCheck, Clock, Download, Plus, ShieldAlert,
    Activity, ArrowRight, CheckCircle2, AlertCircle, AlertTriangle,
    Gavel, Globe, ShieldX, ScanEye, ToggleRight, ToggleLeft, HardDrive, Zap, Menu, X, User,
    Wifi, Database, MessageSquare, Briefcase, Siren
} from 'lucide-react';
import Link from 'next/link';
import { getAdminDashboardSummary, getRecentActivities } from '@/app/actions/admin-actions';
import { getPrisoners, releasePrisoner, addToGlobalBlacklist, removeFromGlobalBlacklist, getGlobalBlacklist } from '@/app/actions/security-actions';
import { refreshHealthAction } from '@/app/actions/maintenance-actions';
import { Loader2, Unlock } from 'lucide-react';
import { pusherClient } from '@/lib/pusher-client';
import { toast } from 'sonner';
import { SoundToggle } from '@/components/SoundToggle';

export default function AdminDashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [securityAlerts, setSecurityAlerts] = useState<any[]>([]); // New Feed
    const [prisoners, setPrisoners] = useState<any[]>([]);
    const [globalBlacklist, setGlobalBlacklist] = useState<any[]>([]);
    const [health, setHealth] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'LOCAL' | 'GLOBAL'>('LOCAL');
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // System Status State
    const [pusherConnected, setPusherConnected] = useState(false);

    // Audio Ref
    const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

    const loadData = async () => {
        const [s, a, p, g, h] = await Promise.all([
            getAdminDashboardSummary(),
            getRecentActivities(15),
            getPrisoners(),
            getGlobalBlacklist(),
            refreshHealthAction()
        ]);
        setSummary(s);
        setActivities(a);
        setPrisoners(p);
        setGlobalBlacklist(g);
        setHealth(h);
        setLoading(false);
    };

    useEffect(() => {
        // Initialize Audio
        alarmAudioRef.current = new Audio('/sounds/alarm.mp3'); // User must provide this file

        loadData();
        const channel = pusherClient.subscribe('admin-stats');

        channel.bind('pusher:subscription_succeeded', () => {
            setPusherConnected(true);
        });

        // OPTIMIZED: Atomic Updates instead of global re-fetch
        channel.bind('new-ticket', (data: any) => {
            setSummary((prev: any) => ({ ...prev, openTickets: (prev?.openTickets || 0) + 1 }));
            toast("New Ticket Received");
        });

        channel.bind('license-created', () => {
            setSummary((prev: any) => ({ ...prev, activeLicenses: (prev?.activeLicenses || 0) + 1 }));
        });

        channel.bind('ip-banned', (data: any) => {
            setPrisoners((prev) => [{ id: Date.now(), ipAddress: data.ip, reason: data.reason }, ...prev]);
            toast.error(`Auto-Ban Enforced: ${data.ip}`);
        });

        // NEW: Security Intrusion Alert
        channel.bind('security-alert', (data: any) => {
            setSecurityAlerts((prev) => [
                { id: Date.now(), ip: data.ip, reason: data.reason, url: data.url, timestamp: data.timestamp },
                ...prev.slice(0, 4) // Keep last 5
            ]);

            // Trigger Alarm
            if (alarmAudioRef.current) {
                alarmAudioRef.current.play().catch(e => console.log("Audio play failed (interaction required):", e));
            }

            toast.error(`🚨 INTRUSION BLOCKED: ${data.ip}`, {
                description: `${data.reason} on ${data.url}`,
                duration: 10000,
                style: { background: '#ff0000', color: 'white', border: 'none' }
            });
        });

        channel.bind('update', (data: any) => {
            if (data.type === 'SECURITY_ALERT') {
                setActivities((prev) => [{ id: Date.now(), message: data.message, createdAt: new Date() }, ...prev.slice(0, 14)]);
            }
        });

        return () => {
            pusherClient.unsubscribe('admin-stats');
        };
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-black animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Mobile Menu Toggle would go here if not handled by layout */}
                    <h1 className="text-4xl md:text-6xl font-[1000] tracking-tight uppercase italic leading-none">Intelligence</h1>
                </div>
                {/* Live Indicator Top Right */}
                <div className="hidden md:flex items-center gap-3">
                    <SoundToggle />
                    <div className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-2 rounded-full shadow-sm">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Live</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Guard', value: summary?.activeLicenses || 0, icon: Key, color: 'text-emerald-500' },
                    { label: 'Audit Count', value: summary?.totalUsers || 0, icon: Users, color: 'text-blue-500' },
                    { label: 'Uptime', value: '100%', icon: ShieldCheck, color: 'text-emerald-500' },
                    { label: 'Open Case', value: summary?.openTickets || 0, icon: Clock, color: 'text-amber-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <stat.icon className={`w-12 h-12 ${stat.color} opacity-5 absolute -right-3 -bottom-3 scale-150 rotate-12 transition-transform group-hover:rotate-0`} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black tracking-tighter italic">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* PRIORITY LEADS SECTION */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-violet-200">
                            <Briefcase className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-widest">Business Opportunities</span>
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter">Pre-Sale Inquiries</h2>
                        <p className="text-violet-100/80 font-medium max-w-xl">
                            Review incoming leads from the public contact form. These are potential high-value clients waiting for deployment.
                        </p>
                    </div>
                    <Link href="/admin/support-center" className="bg-white text-violet-600 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-violet-50 transition-all shadow-xl shadow-black/20">
                        Manage Leads
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white border border-gray-100 rounded-[4rem] p-10 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                            <ShieldAlert className="w-8 h-8" />
                            Defense Perimeter
                        </h2>
                        <button onClick={() => setActiveTab(activeTab === 'LOCAL' ? 'GLOBAL' : 'LOCAL')} className="bg-black text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            {activeTab}
                        </button>
                    </div>

                    {activeTab === 'LOCAL' ? (
                        <div className="grid grid-cols-1 gap-4">
                            {prisoners.length === 0 ? (
                                <div className="py-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Surveillance Zone Clear</p>
                                </div>
                            ) : prisoners.map((p) => (
                                <div key={p.id} className="bg-gray-50 p-6 rounded-[2.5rem] flex items-center justify-between">
                                    <p className="text-sm font-black">{p.ipAddress}</p>
                                    <button onClick={() => releasePrisoner(p.ipAddress)} className="text-xs font-bold text-red-600 uppercase">Unblock</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {globalBlacklist.length === 0 ? (
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center py-8">Global Filter Empty</p>
                            ) : globalBlacklist.map((b) => (
                                <div key={b.id} className="bg-black p-6 rounded-[2.5rem] flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-white">{b.ipAddress}</p>
                                    </div>
                                    <button onClick={() => removeFromGlobalBlacklist(b.ipAddress)} className="text-xs font-bold text-red-500 uppercase">Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white border border-gray-100 rounded-[4rem] p-10 shadow-sm space-y-8">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Live Intelligence</h2>
                    <div className="space-y-6">
                        {activities.map((act) => (
                            <div key={act.id} className="flex gap-4 group">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                                <div>
                                    <p className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{act.message}</p>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{new Date(act.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
