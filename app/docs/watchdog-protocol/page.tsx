import React from 'react';
import { Shield, Lock, Activity, Terminal, AlertTriangle, Fingerprint, Zap, ShieldAlert, Cpu, FileText, Smartphone, Gavel, FileWarning, LayoutDashboard, Database, Eye } from 'lucide-react';
import Link from 'next/link';

export default function WatchdogProtocol() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-900">
            <main className="max-w-4xl mx-auto space-y-24 py-20 px-6">

                {/* Hero Section */}
                <header className="border-b border-gray-800 pb-12">
                    <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-mono mb-8 animate-pulse">
                        <Activity size={14} /> LIVE SYSTEM INTEGRITY MONITORING
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                        Decentralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Watchdog</span>
                    </h1>
                    <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-3xl">
                        Beyond simple blocking. Nozris's Watchdog is an autonomous enforcement layer that executes hardware-level locking and self-destruct protocols on detected tampering.
                    </p>
                </header>

                {/* Self-Destruct Guide */}
                <section className="space-y-8" id="self-destruct">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                        <div className="p-2 bg-red-500/10 rounded-lg"><Zap className="w-8 h-8 text-red-500" /></div>
                        Self-Destruct Protocols
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        When the Watchdog detects a bypass attempt (e.g., removal of license check, source code injection), it triggers a multi-stage self-destruct sequence to protect your intellectual property.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-900/40 p-8 rounded-3xl border border-gray-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 bg-red-500/10 text-red-400 font-mono text-xs">STAGE 01</div>
                            <h3 className="text-xl font-bold text-white mb-4">Code Corruption</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                The system injects garbage bytecode into core logic files, rendering the application inoperable. This is irreversible without the original secure build.
                            </p>
                        </div>
                        <div className="bg-gray-900/40 p-8 rounded-3xl border border-gray-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 bg-red-500/10 text-red-400 font-mono text-xs">STAGE 02</div>
                            <h3 className="text-xl font-bold text-white mb-4">Data Vault Lockdown</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Local database connections are severed and encryption keys are rotated to a "null" state, preventing any unauthorized data extraction.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Emergency Switch Docs */}
                <section className="space-y-8" id="emergency-lock">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><ShieldAlert className="w-8 h-8 text-blue-500" /></div>
                        Global Kill Switch
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        The Emergency Lock synchronizes across our decentralized node network. When triggered, the command propagates to all active instances of your software worldwide in under 2 seconds.
                    </p>
                    <div className="bg-gray-900/60 border border-blue-500/30 p-8 rounded-3xl relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">Instant Synchronization</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Uses a high-frequency WebSocket mesh network. The Watchdog client on the intruder's server receives the kill signal and executes the lock protocol immediately, regardless of background firewall settings.
                                </p>
                                <div className="p-4 bg-black rounded-xl border border-gray-800 font-mono text-xs text-blue-400">
                                    &gt; EMERGENCY_SIGNAL_RECEIVED: "PROTOCOL_ALPHA"<br />
                                    &gt; AUTH_KEY: [VERIFIED]<br />
                                    &gt; PROPAGATING TO NODES: 4,192 TOTAL<br />
                                    &gt; STATUS: <span className="text-red-500 font-bold">LOCKDOWN_ACTIVE</span>
                                </div>
                            </div>
                            <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                                <Cpu size={48} className="text-blue-500 mb-4 animate-spin-slow" />
                                <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Node Sync Latency: <span className="text-white">142ms</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Logs Demo Simulation */}
                <section className="space-y-8" id="live-logs-demo">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                        <div className="p-2 bg-green-500/10 rounded-lg"><Terminal className="w-8 h-8 text-green-500" /></div>
                        Real-Time Log Forensic Preview
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Below is a preview of the forensic data captured by the Watchdog during a tampering event. This information is automatically processed for legal evidence.
                    </p>
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden font-mono text-xs overflow-x-auto shadow-2xl">
                        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                            <span className="text-gray-400">log_capture_preview.iso</span>
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            </div>
                        </div>
                        <div className="p-6 space-y-3 text-gray-300">
                            <div className="flex gap-4"><span className="text-gray-500">[14:22:01]</span> <span className="text-red-400">CRITICAL:</span> Checksum Mismatch at `/app/core/auth.php`</div>
                            <div className="flex gap-4"><span className="text-gray-500">[14:22:01]</span> <span className="text-yellow-400">INFO:</span> Capturing Intruder Fingerprint...</div>
                            <div className="border-l-2 border-gray-700 pl-4 my-2 text-gray-500">
                                IP_ADDRESS: 192.168.1.104 <span className="italic">(Proxy Detected)</span><br />
                                ISP: DigitalOcean, LLC<br />
                                GEO: Frankfurt, DE<br />
                                BROWSER_AGENT: curl/7.68.0
                            </div>
                            <div className="flex gap-4"><span className="text-gray-500">[14:22:02]</span> <span className="text-green-400">ACTION:</span> Self-Destruct Triggered. Locking File System.</div>
                        </div>
                    </div>
                </section>

                {/* The Admin Advantage */}
                <section className="space-y-8 bg-gradient-to-br from-gray-900 to-black p-10 rounded-3xl border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><LayoutDashboard className="w-8 h-8 text-blue-500" /></div>
                        The Admin Advantage
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                        While visitors can view the technology, as a Nozris client, you gain access to your private **Security Command Center**.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Activity size={20} /></div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Live Feed Management</h4>
                                <p className="text-sm text-gray-500">Enable/Disable Watchdog modules on different platforms via a unified toggle switch.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Database size={20} /></div>
                            <div>
                                <h4 className="font-bold text-white">Advanced Analytics</h4>
                                <p className="text-sm text-gray-500">Export forensic attack logs into DMCA-ready legal templates with one click.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Legal Integration */}
                <section className="space-y-8" id="legal-integration">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg"><Gavel className="w-8 h-8 text-yellow-500" /></div>
                        IT Act 2000 Forensic Logs
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Nozris doesn't just block—it builds a case. Every attack log is cryptographically signed and formatted to meet the evidentiary standards of the Indian IT Act 2000.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gray-900/40 rounded-2xl border border-gray-800">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <FileText size={18} className="text-yellow-500" /> Automatic Forensic Reports
                            </h4>
                            <p className="text-sm text-gray-500">
                                Generates a PDF report containing IP timestamps, ISP details, and specific tampering signatures suitable for filing an FIR.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-900/40 rounded-2xl border border-gray-800">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <FileWarning size={18} className="text-yellow-500" /> Tamper-Proof Evidence
                            </h4>
                            <p className="text-sm text-gray-500">
                                Logs are stored on our tamper-proof decentralized ledger, ensuring the evidence cannot be modified or deleted by an intruder who has compromised your server.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA / Footer */}
                <section className="pt-20 border-t border-gray-900 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-bold transition-all uppercase tracking-widest text-sm">
                        <Shield className="w-4 h-4" /> Return to Command Center
                    </Link>
                </section>

            </main>
        </div>
    );
}
