'use client';
import React from 'react';
import { Shield, Lock, Activity, Terminal, AlertTriangle, FileText, Cpu, Zap, Fingerprint, Globe, Scale } from 'lucide-react';
import Link from 'next/link';

export default function WatchdogDocs() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-900/30">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-red-600 rounded-lg group-hover:bg-red-500 transition-colors">
                            <Shield size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Nozris<span className="text-red-500">.watchdog</span></span>
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
                        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-20 max-w-5xl">
                {/* Hero section */}
                <section className="mb-24 text-center">
                    <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-mono mb-8 animate-pulse">
                        <Activity size={14} /> LIVE SYSTEM INTEGRITY MONITORING
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase">
                        Decentralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Watchdog</span>
                    </h1>
                    <p className="text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                        The world's first <span className="text-white font-medium">Self-Defending Code</span> protocol.
                        Nozris doesn't just watch for threats; it neutralizes them at the source.
                    </p>
                </section>

                {/* Core Feature: Self-Destruct */}
                <section className="mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                <Lock className="text-red-500" /> The Self-Destruct Protocol
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                When a tampering attempt is detected—whether it's a debugger attach, a memory dump, or a file-system clone—the Watchdog executes an
                                <span className="text-red-400"> irreversible self-corrupting sequence</span>.
                            </p>
                            <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
                                <p className="text-red-400 font-bold mb-2 flex items-center gap-2">
                                    <AlertTriangle size={18} /> NON-NEGOTIABLE INTEGRITY
                                </p>
                                <p className="text-sm text-gray-300">
                                    If the integrity check fails, the local files enter a "Ghost State". The code becomes logically defunct,
                                    ensuring your IP is never stolen in a working state.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 font-mono text-sm group">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500">// integrity_daemon.js</span>
                                <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs animate-pulse">WATCHING...</span>
                            </div>
                            <div className="space-y-2">
                                <div className="text-blue-400 italic">async function watchdog() {'{'}</div>
                                <div className="pl-4 text-gray-400">const integrity = await checkDNA();</div>
                                <div className="pl-4 text-purple-400">if (!integrity.valid) {'{'}</div>
                                <div className="pl-8 text-red-400">await triggerSelfDestruct();</div>
                                <div className="pl-8 text-red-500 font-bold">reportToGlobalBlacklist();</div>
                                <div className="pl-4 text-purple-400">{'}'}</div>
                                <div className="text-blue-400 italic">{'}'}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technical Guide: Emergency Lock */}
                <section className="mb-24">
                    <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
                        <Zap className="text-yellow-500" /> API Integration: Emergency Lock
                    </h2>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-10">
                        <p className="text-gray-400 mb-8 text-lg">
                            Owners can remotely trigger an <span className="text-white font-bold">Emergency Lock</span> via the Command Center or our Secure API.
                            This instantly freezes all active sessions globally.
                        </p>
                        <div className="bg-black border border-gray-800 rounded-xl p-6 mb-8 overflow-x-auto">
                            <div className="flex items-center gap-3 mb-4 text-xs font-mono">
                                <span className="bg-red-600 px-2 py-1 rounded text-white">POST</span>
                                <span className="text-gray-500 text-sm">https://api.nozris.com/v1/emergency/lock</span>
                            </div>
                            <pre className="text-green-400 text-sm">
                                {`{
  "api_key": "YOUR_SECRET_KEY",
  "scope": "global",
  "reason": "Security Breach Detected",
  "security_mode": "hard_lock"
}`}
                            </pre>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-800 pt-8">
                            <Cpu size={18} />
                            <span>Response Time: <span className="text-green-500 font-bold">&lt; 150ms</span> worldwide propagation.</span>
                        </div>
                    </div>
                </section>

                {/* Log Breakdown: IT Act 2000 */}
                <section className="mb-24">
                    <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
                        <Scale className="text-blue-500" /> Legal Shield: IT Act 2000 Filing
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Every incident logged by the Decentralized Watchdog satisfies the forensic requirements for legal prosecution.
                                We capture immutable evidence used to file FIRs under the <span className="text-white font-bold">Information Technology Act, 2000</span>.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                    <h4 className="font-bold text-white mb-1">Fingerprint</h4>
                                    <p className="text-xs text-gray-500">Browser & Hardware telemetry.</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                    <h4 className="font-bold text-white mb-1">Geo-IP</h4>
                                    <p className="text-xs text-gray-500">Localized ISP tracing.</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                    <h4 className="font-bold text-white mb-1">Attack Vector</h4>
                                    <p className="text-xs text-gray-500">Full stack-trace of the breach.</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                    <h4 className="font-bold text-white mb-1">Time-Stamps</h4>
                                    <p className="text-xs text-gray-500">Nanosecond precision log.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-3xl flex flex-col justify-between">
                            <div>
                                <FileText className="text-blue-500 mb-4" size={32} />
                                <h3 className="text-xl font-bold text-white mb-2">Legal PDF Generator</h3>
                                <p className="text-sm text-gray-400 mb-6">
                                    Our dashboard generates ready-to-file legal documents with embedded cryptographic proofs.
                                </p>
                            </div>
                            <Link href="/dashboard/logs" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-center transition-all block">
                                Access Logs
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="pt-20 border-t border-gray-900 text-center">
                    <h2 className="text-3xl font-black mb-8">Ready to secure your empire?</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/dashboard" className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-600/20">
                            Get Nozris Now
                        </Link>
                        <Link href="/docs" className="px-10 py-4 bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold rounded-xl transition-all border border-gray-800">
                            Return to Docs
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
