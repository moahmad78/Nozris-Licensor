'use client';

import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Download, Bell, CheckCircle, Smartphone, Globe, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ClientShieldPortal() {
    const [showKey, setShowKey] = useState(false);
    const [email, setEmail] = useState('client@example.com'); // Mock data for now
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    // Mock Data — in real app, fetch via server component or API
    const licenseData = {
        key: 'LIC-8821-X992-KKA1',
        domain: 'voomet.com',
        plan: 'Enterprise Protection',
        status: 'ACTIVE',
        healthScore: 98,
        lastCheck: 'Just now',
        tamperHistory: 0
    };

    const snippet = `<!-- Nozris Shield v2 Integration -->
<script src="https://nozris.com/nozris.js" data-key="${licenseData.key}" defer></script>`;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        Nozris Protection Hub
                    </h1>
                    <p className="text-gray-500">Manage your license security and integration settings.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 text-sm font-medium">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    System Operational
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. License Key Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-500" /> License Identity
                    </h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Authenticated Domain</div>
                                <div className="flex items-center gap-2 font-mono text-gray-900 font-medium">
                                    <Globe className="w-4 h-4 text-indigo-500" />
                                    {licenseData.domain}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Current Plan</div>
                                <div className="flex items-center gap-2 font-medium text-purple-600">
                                    <Shield className="w-4 h-4" />
                                    {licenseData.plan}
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-indigo-900">Your Secret License Key</label>
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1"
                                >
                                    {showKey ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Reveal</>}
                                </button>
                            </div>
                            <div className="relative">
                                <div className="font-mono text-lg bg-white border border-indigo-200 rounded-lg p-3 text-center tracking-wider text-gray-800 shadow-sm">
                                    {showKey ? licenseData.key : '••••-••••-••••-••••'}
                                </div>
                            </div>
                            <p className="text-xs text-indigo-600/80 mt-2 flex items-center gap-1.5">
                                <AlertTriangle className="w-3 h-3" />
                                Wait! Never share this key with anyone. It controls your site's access.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Security Health Score */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

                    <h2 className="text-lg font-semibold text-white mb-6 relative z-10">Security Health</h2>

                    <div className="flex flex-col items-center relative z-10">
                        <div className="relative w-40 h-40 mb-4">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
                                <circle
                                    cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="8"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * licenseData.healthScore) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold">{licenseData.healthScore}%</span>
                                <span className="text-xs text-gray-400">SECURE</span>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex justify-between text-sm border-b border-gray-700/50 pb-2">
                                <span className="text-gray-400">Heartbeat</span>
                                <span className="text-green-400 font-mono">ACTIVE</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-700/50 pb-2">
                                <span className="text-gray-400">Integrity</span>
                                <span className="text-green-400 font-mono">VERIFIED</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Last Scan</span>
                                <span className="text-gray-300 font-mono">{licenseData.lastCheck}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Integration & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Snippet Download */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-gray-500" /> Integration Kit
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Copy and paste this snippet into the <code>&lt;head&gt;</code> of your website via FTP or cPanel.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4 relative group">
                        <pre className="text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap break-all">
                            {snippet}
                        </pre>
                        <button
                            onClick={() => navigator.clipboard.writeText(snippet)}
                            className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            Download .js File
                        </button>
                        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            Integration Guide
                        </button>
                    </div>
                </div>

                {/* Priority Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gray-500" /> Priority Alerts
                    </h2>
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg mb-6">
                        <div className="flex items-start gap-3">
                            <Smartphone className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-bold text-yellow-800">WhatsApp Guard™ Active</h3>
                                <p className="text-xs text-yellow-700 mt-1">
                                    You will receive instant alerts on <strong>+91 XXXXX XXXXX</strong> if a tampering attempt is detected.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Backup Notification Email</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEditingEmail}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-50"
                            />
                            {isEditingEmail ? (
                                <button
                                    onClick={() => setIsEditingEmail(false)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditingEmail(true)}
                                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
