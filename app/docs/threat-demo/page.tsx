'use client';
import React from 'react';
import { Shield, Activity, Terminal, AlertTriangle, Fingerprint, Eye, Globe, Lock, Search } from 'lucide-react';
import Link from 'next/link';

export default function ThreatDemo() {
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
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white">
                        Threat <span className="text-blue-500 uppercase">Intelligence Demo</span>.
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                        Real-time logging is irrelevant if it's not actionable. Licensr captures every byte of the intruder's environment for legal and technical retaliation.
                    </p>
                </header>

                {/* Dummy Log Showcase */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white uppercase tracking-tight">
                        <Terminal size={24} className="text-blue-500" /> Forensic Log Simulation
                    </h2>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden font-mono text-xs overflow-x-auto shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-800 border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-gray-400 font-bold">TIMESTAMP</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold">EVENT_ID</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold">IP_ADDR</th>
                                    <th className="px-6 py-4 text-gray-400 font-bold">LOCATION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {dummyLogs.map((log, i) => (
                                    <tr key={i} className="hover:bg-blue-500/5 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">{log.time}</td>
                                        <td className="px-6 py-4 text-red-500 font-bold uppercase">{log.event}</td>
                                        <td className="px-6 py-4 text-gray-300">{log.ip}</td>
                                        <td className="px-6 py-4 text-blue-400 uppercase">{log.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <AlertTriangle className="text-blue-400" size={20} />
                        </div>
                        <p className="text-blue-400/80 text-xs italic leading-relaxed">
                            <span className="font-bold border-b border-blue-400/30 mr-1">RESTRICTED ACCESS:</span>
                            Full forensic packet inspection and ISP-level device tracking is only accessible to authorized license holders via the private Security Command Center.
                        </p>
                    </div>
                </section>

                {/* Footer Link */}
                <section className="pt-20 border-t border-gray-900 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-all uppercase tracking-widest text-xs">
                        Return to Main Core
                    </Link>
                </section>

            </main>
        </div>
    );
}
