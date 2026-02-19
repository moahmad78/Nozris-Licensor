'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Save, User, Bell, Shield, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const [email, setEmail] = useState('client@example.com');
    const [phone, setPhone] = useState('+1 (555) 000-0000');
    const [toggles, setToggles] = useState({
        whatsapp: true,
        devAlerts: true,
        weeklyReport: true
    });

    const handleSave = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Updating Profile...',
            success: 'Settings Saved Successfully',
            error: 'Failed to Save'
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                <Link href="/client/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900">
                    ← Back to Command Center
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <User className="text-blue-500" /> Profile Information
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <Link href="/client/dashboard/settings/profile">
                            <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl mt-4 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                <User size={18} /> EDIT FULL PROFILE
                            </button>
                        </Link>
                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl mt-4 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> SAVE CHANGES
                        </button>
                    </div>
                </div>

                {/* Notifications & Watchdog */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Shield className="text-emerald-500" /> Neural Watchdog
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Smartphone size={20} /></div>
                                <div>
                                    <p className="font-bold text-slate-900">WhatsApp Alerts</p>
                                    <p className="text-xs text-slate-500">Critical breach notifications</p>
                                </div>
                            </div>
                            <input type="checkbox" checked={toggles.whatsapp} onChange={() => setToggles({ ...toggles, whatsapp: !toggles.whatsapp })} className="toggle toggle-success" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Bell size={20} /></div>
                                <div>
                                    <p className="font-bold text-slate-900">Unauthorized Dev Mode</p>
                                    <p className="text-xs text-slate-500">Notify when DevTools opened</p>
                                </div>
                            </div>
                            <input type="checkbox" checked={toggles.devAlerts} onChange={() => setToggles({ ...toggles, devAlerts: !toggles.devAlerts })} className="toggle toggle-error" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Save size={20} /></div>
                                <div>
                                    <p className="font-bold text-slate-900">Weekly Security PDF</p>
                                    <p className="text-xs text-slate-500">Automated email reports</p>
                                </div>
                            </div>
                            <input type="checkbox" checked={toggles.weeklyReport} onChange={() => setToggles({ ...toggles, weeklyReport: !toggles.weeklyReport })} className="toggle toggle-info" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
