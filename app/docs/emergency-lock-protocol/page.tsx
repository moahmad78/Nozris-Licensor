'use client';
import React, { useState } from 'react';
import { Shield, Lock, Activity, AlertTriangle, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EmergencyLockProtocol() {
    const [isSimulating, setIsSimulating] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-900">
            <main className="max-w-4xl mx-auto space-y-16 py-20 px-6">

                {/* Header Section */}
                <header className="border-b border-gray-800 pb-12">
                    <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-mono mb-8">
                        <Shield size={14} /> SECURITY PROTOCOL: LOCKDOWN
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Emergency <span className="text-red-500">Lock Switch</span>.
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                        The nuclear option of software protection. Instant, worldwide, and irreversible code locking across all client instances.
                    </p>
                </header>

                {/* How It Works */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><Cpu className="w-8 h-8 text-blue-500" /></div>
                        The Mesh Sync Advantage
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                        Unlike traditional license checks that wait for an API call, Licensr's Emergency Switch uses a <strong>Gossip Protocol</strong>. Within 140ms of triggering the lock from your dashboard, every active user session globally is terminated and the file system enters "Worm Mode" (Write Once, Read Many).
                    </p>
                </section>

                {/* Simulation Demo */}
                <section className="bg-gray-900/40 p-10 rounded-3xl border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
                    <h3 className="text-2xl font-bold text-white mb-4">Protocol Demonstration</h3>
                    <p className="text-gray-500 text-sm mb-8">
                        Experience the client-side reaction when an Emergency Lock is triggered. This simulation does not affect your actual hardware.
                    </p>

                    {!isSimulating ? (
                        <button
                            onClick={() => setIsSimulating(true)}
                            className="w-full md:w-auto px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.2)] flex items-center justify-center gap-3"
                        >
                            <ShieldAlert size={20} /> START SIMULATION MODE
                        </button>
                    ) : (
                        <div className="bg-red-950/30 border border-red-500 p-8 rounded-2xl animate-shake">
                            <div className="flex items-center gap-4 mb-4">
                                <AlertTriangle className="text-red-500 animate-pulse" size={32} />
                                <h4 className="text-xl font-black text-red-500">SYSTEM LOCKDOWN INITIATED</h4>
                            </div>
                            <p className="font-mono text-xs text-red-400/80 mb-6 leading-relaxed">
                                > SIGNAL_RECIEVED: EMERGENCY_ALPHA_7<br />
                                > VALIDATING SOURCE: [LICENSR_CORE_MESH]<br />
                                > STATUS: 100% NODES SYNCED<br />
                                > ACTION: ATOMIC_FS_LOCK_EXECUTED
                            </p>
                            <button
                                onClick={() => setIsSimulating(false)}
                                className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
                            >
                                [ TERMINATE SIMULATION ]
                            </button>
                        </div>
                    )}
                </section>

                {/* Note about admin access */}
                <section className="pt-10 border-t border-gray-900 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <Lock size={16} />
                        <span>Authorized access required for live execution.</span>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold transition-all uppercase tracking-widest text-xs">
                        Back to Landing Page
                    </Link>
                </section>

            </main>
        </div>
    );
}
