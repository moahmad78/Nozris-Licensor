'use client';
import React from 'react';
import { Shield, Activity, Terminal, AlertTriangle, Fingerprint, Eye, Globe, Lock, Search } from 'lucide-react';
import Link from 'next/link';

export default function ThreatIntelligenceDemo() {
    const dummyLogs = [
        { time: '14:02:11', event: 'Unauthorized Access Attempt', ip: '185.220.101.44', location: 'Frankfurt, DE', target: 'Auth-Node-Alpha' },
        { time: '14:02:34', event: 'Checksum Mismatch', ip: '45.132.12.98', location: 'Moscow, RU', target: 'Static-Assets-Server' },
        { time: '14:03:01', event: 'Local Storage Tamper', ip: '2.56.121.10', location: 'Beijing, CN', target: 'License-Cache' },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-900">
            <main className="max-w-4xl mx-auto space-y-16 py-20 px-6">

                {/* Header Section */}
                <header className="border-b border-gray-800 pb-12">
                    <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-sm font-mono mb-8">
                        <Activity size={14} /> LIVE THREAT INTELLIGENCE
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Attack <span className="text-blue-500">Forensics</span>.
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                        Real-time logging is irrelevant if it's not actionable. Nozris captures every byte of the intruder's environment for legal and technical retaliation.
                    </p>
                </header>

                {/* Dummy Log Showcase */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Terminal size={24} className="text-gray-500" /> Forensic Log Simulation
                    </h2>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden font-mono text-xs overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800 border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-gray-400">TIMESTAMP</th>
                                    <th className="px-6 py-4 text-gray-400">EVENT_ID</th>
                                    <th className="px-6 py-4 text-gray-400">IP_ADDR</th>
                                    <th className="px-6 py-4 text-gray-400">LOCATION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {dummyLogs.map((log, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">{log.time}</td>
                                        <td className="px-6 py-4 text-red-500 font-bold">{log.event}</td>
                                        <td className="px-6 py-4 text-gray-300">{log.ip}</td>
                                        <td className="px-6 py-4 text-blue-400">{log.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="text-blue-400 flex-shrink-0" size={18} />
                        <p className="text-blue-400 text-xs italic">
                            NOTE: Full forensic packet inspection and ISP-level device tracking is only accessible to authorized license holders via the private Security Command Center.
                        </p>
                    </div>
                </section>

                {/* Technical Overview */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-gray-900/40 rounded-2xl border border-gray-800">
                        <Fingerprint className="text-purple-500 mb-4" size={24} />
                        <h4 className="font-bold text-white mb-2">Device IDing</h4>
                        <p className="text-gray-500 text-[11px] leading-relaxed">We capture 80+ hardware fingerprints to identify repeat offenders even through VPNs.</p>
                    </div>
                    <div className="p-6 bg-gray-900/40 rounded-2xl border border-gray-800">
                        <Globe className="text-green-500 mb-4" size={24} />
                        <h4 className="font-bold text-white mb-2">Legal Geolocation</h4>
                        <p className="text-gray-500 text-[11px] leading-relaxed">ISO-3166 compliant location data formatted for immediate IT Act 2000 filing.</p>
                    </div>
                    <div className="p-6 bg-gray-900/40 rounded-2xl border border-gray-800">
                        <Search className="text-yellow-500 mb-4" size={24} />
                        <h4 className="font-bold text-white mb-2">Tamper Proof</h4>
                        <p className="text-gray-500 text-[11px] leading-relaxed">Logs are cryptographically hashed and mirrored across 3 global nodes instantly.</p>
                    </div>
                </section>

                {/* Footer Link */}
                <section className="pt-10 border-t border-gray-900 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-all uppercase tracking-widest text-xs">
                        Return to Landing Page
                    </Link>
                </section>

            </main>
        </div>
    );
}
