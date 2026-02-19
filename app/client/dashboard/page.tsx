'use client';

import { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Lock,
    Activity,
    Users,
    ChevronRight,
    Download,
    Cpu,
    Zap,
    AlertOctagon, // For Panic Button
    Settings
} from 'lucide-react';
import { toast } from 'sonner';
import DevToolsGuard from '@/components/security/DevToolsGuard';
import { NoticeWidget } from '@/components/client/NoticeWidget';
import { SupportWidget } from '@/components/client/SupportWidget';
import { SystemVault } from '@/components/client/SystemVault';
import { approveDeveloper } from '@/app/actions/dev-management';
import { globalSiteLock } from '@/app/actions/lockdown'; // Action
import LiveThreatMap from '@/components/client/LiveThreatMap'; // New
import TrafficChart from '@/components/client/TrafficChart'; // New
import GeofenceControl from '@/components/client/GeofenceControl'; // New
import SubscriptionCard from '@/components/client/SubscriptionCard'; // New
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
    const [loading, setLoading] = useState(true);
    const [licenseData, setLicenseData] = useState<any>(null);
    const [securityScore, setSecurityScore] = useState(100);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { getClientLicenseDetails } = await import('@/app/actions/client-integration');
                const data = await getClientLicenseDetails();
                if (data) {
                    setLicenseData(data);
                }
            } catch (e) {
                console.error("Failed to fetch license data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePanicButton = async () => {
        const confirm = window.confirm("⚠ EXTREME WARNING ⚠\n\nThis will instantly LOCK DOWN your entire website.\nVisitors will see a Security Entry Page.\nDatabase connections will be severed.\n\nAre you sure you want to deploy the KILL SWITCH?");
        if (confirm) {
            if (!licenseData?.key) return toast.error("License Key Missing");

            toast.loading("DEPLOYING GLOBAL LOCKDOWN...");
            const res = await globalSiteLock(licenseData.key);

            if (res.success) {
                toast.dismiss();
                toast.error("⛔ SITE LOCKED DOWN ⛔", { duration: 10000 });
                // Force reload or redirect to show lock state
                window.location.reload();
            } else {
                toast.dismiss();
                toast.error("Lockdown Failed");
            }
        }
    };

    const handleApproveDev = async (email: string) => {
        if (!licenseData?.key) return;
        toast.loading("Processing Approval & Auto-Backup...");
        const res = await approveDeveloper(email, licenseData.key);
        if (res.success) {
            toast.dismiss();
            toast.success(res.message);
        } else {
            toast.dismiss();
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-6 md:p-10 space-y-8 animate-in fade-in duration-500 relative">
            <DevToolsGuard />

            {/* Header / Status Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse box-content border-4 border-emerald-100"></span>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Neural Shield Active</p>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
                    <p className="text-sm font-mono text-slate-500">
                        LICENSE: <span className="font-bold text-slate-800">{licenseData?.key || '...'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePanicButton}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                        <AlertOctagon size={16} /> KILL SWITCH
                    </button>
                    <Link href="/client/dashboard/settings">
                        <button className="bg-white p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors">
                            <Settings size={20} />
                        </button>
                    </Link>
                    <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Integrity</span>
                        <span className="text-lg font-black text-emerald-600">{securityScore}%</span>
                    </div>
                </div>
            </div>

            {/* MAIN SYSTEM VAULT */}
            <section className="relative z-20">
                <SystemVault licenseKey={licenseData?.key} />
            </section>

            {/* NEW: ANALYTICS GRID (Map + Chart) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <LiveThreatMap />
                </div>
                <div>
                    <TrafficChart />
                </div>
            </section>

            {/* NEW: SECURITY CONTROLS & SUBSCRIPTION */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GeofenceControl />
                <SubscriptionCard licenseKey={licenseData?.key} />
            </section>

            {/* Existing: Dev Management & Notices */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Passive Defenses */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Lock className="text-blue-500" size={20} /> Active Defenses
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'DevTools Trap', desc: 'Anti-Tamper', active: true },
                                { name: 'IP Geo-Fencing', desc: 'Global Block', active: true },
                                { name: 'Heuristic Scan', desc: 'AI Analysis', active: true },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{feature.name}</p>
                                        <p className="text-[10px] text-slate-500">{feature.desc}</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${feature.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: Devs & Notices */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Users className="text-indigo-500" size={20} /> Developer Authorization
                            </h3>
                            <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100">
                                + Invite
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest">
                                        <th className="pb-3 pl-2">Developer Email</th>
                                        <th className="pb-3">Access Level</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3 text-right pr-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    <tr className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-3 pl-2 font-bold">frontend_dev@agency.com</td>
                                        <td className="py-3">Full Access</td>
                                        <td className="py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">Active</span></td>
                                        <td className="py-3 text-right pr-2">
                                            <button className="text-[10px] font-bold text-slate-400 hover:text-red-500">REVOKE</button>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-3 pl-2 font-bold">contractor_09@gmail.com</td>
                                        <td className="py-3">Limited</td>
                                        <td className="py-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase">Pending</span></td>
                                        <td className="py-3 text-right pr-2">
                                            <button
                                                onClick={() => handleApproveDev('contractor_09@gmail.com')}
                                                className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                                            >
                                                APPROVE
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-1 rounded-3xl shadow-xl">
                        <NoticeWidget />
                    </div>

                    <div className="h-[400px]">
                        <SupportWidget />
                    </div>
                </div>
            </div>
        </div>
    );
}
