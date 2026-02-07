import React from 'react';
import { Shield, Lock, FileText, AlertTriangle, Eye, Globe, Database, Cpu, Code, Server, FileCode, CameraOff, MonitorX, MessageCircle, Mail, Smartphone, Gamepad2, Monitor, ShoppingBag, Terminal as TerminalIcon, Fingerprint, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-900">
            <main className="max-w-4xl mx-auto space-y-16 py-20 px-6">

                {/* Header */}
                <header className="border-b border-gray-800 pb-10">
                    <div className="text-blue-600 font-mono text-sm mb-4">CONFIDENTIAL // PUBLIC RELEASE 2.0</div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6">
                        LICENSR <span className="text-blue-600">PROTOCOL</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl">
                        The definitive standard for autonomous software protection.
                        Licensr is a <strong>Managed Security Service</strong> that combines AI-led detection with human-led enforcement.
                    </p>
                </header>

                {/* NEW: Program-Wise Security Guide */}
                <section className="space-y-8" id="program-security">
                    <h3 className="text-3xl font-black text-white flex items-center gap-4 border-b border-gray-800 pb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg"><Cpu className="w-8 h-8 text-blue-500" /></div>
                        Program-Wise Security Guide
                    </h3>

                    <p className="text-gray-400 text-lg">
                        Licensr treats different languages with specialized enforcement logic. We don't believe in a "one size fits all" approach to security.
                    </p>

                    <div className="space-y-6">
                        {/* React / JS Layer */}
                        <div className="bg-gray-900/40 p-8 rounded-2xl border border-gray-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 bg-cyan-500/10 rounded-bl-3xl border-l border-b border-cyan-500/20 text-cyan-400 font-mono text-[10px]">LAYER: FRONTEND</div>
                            <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <Code className="text-cyan-400" /> Frontend Scrambling (React/Next.js)
                            </h4>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                For JavaScript-heavy frontends, we use <strong>Polymorphic Obfuscation</strong>. Every build generates a different control flow graph, making it impossible for attackers to script a bypass.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><Zap size={14} className="text-cyan-500" /> DOM Integrity Verification</li>
                                <li className="flex items-center gap-2"><Zap size={14} className="text-cyan-500" /> Build-Time DNA Injection</li>
                            </ul>
                        </div>

                        {/* PHP / Server Layer */}
                        <div className="bg-gray-900/40 p-8 rounded-2xl border border-gray-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 bg-purple-500/10 rounded-bl-3xl border-l border-b border-purple-500/20 text-purple-400 font-mono text-[10px]">LAYER: BACKEND</div>
                            <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <Server className="text-purple-400" /> Backend DNA Checksum (PHP/Node.js)
                            </h4>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                For backend logic (CPanel/CMS), we implement <strong>Local File DNA Matching</strong>. Files are cryptographically bound to the server's HWID. If a file is accessed from a different environment, it self-destructs.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><Zap size={14} className="text-purple-500" /> Rolling Token Middleware</li>
                                <li className="flex items-center gap-2"><Zap size={14} className="text-purple-500" /> HWID Hardware Locking</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Introduction */}
                <section className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all" />

                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-blue-500" /> Scope of Protection
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Licensr provides military-grade security for <strong>Websites, Mobile Apps, CRM Systems, Desktop Software, Games, and CMS Platforms</strong>.
                            Our integrity protocols are non-negotiable and autonomous. Attempted tampering triggers immediate, irreversible countermeasures.
                        </p>
                    </div>
                </section>

                {/* Detailed Protection Logic (The 3 Steps) */}
                <section className="space-y-8" id="catching-process">
                    <h3 className="text-3xl font-black text-white flex items-center gap-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg"><Fingerprint className="w-8 h-8 text-yellow-500" /></div>
                        The 3-Step "Catching" Process
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                            <div className="text-blue-500 font-mono text-xs mb-2">STEP 01</div>
                            <h4 className="font-bold text-white mb-2">Detection</h4>
                            <p className="text-sm text-gray-400">Real-time DNA scanning of every file interaction at the source level.</p>
                        </div>
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                            <div className="text-yellow-500 font-mono text-xs mb-2">STEP 02</div>
                            <h4 className="font-bold text-white mb-2">Neural Logging</h4>
                            <p className="text-sm text-gray-400">Auto-capture of IP, Geo-location, and Browser Fingerprint of the intruder.</p>
                        </div>
                        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                            <div className="text-red-500 font-mono text-xs mb-2">STEP 03</div>
                            <h4 className="font-bold text-white mb-2">Enforcement</h4>
                            <p className="text-sm text-gray-400">WhatsApp/Mail alerts dispatched instantly + Remote Execution Kill-Switch.</p>
                        </div>
                    </div>
                </section>

                <section className="pt-12 border-t border-gray-800 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-wider">
                        <Globe className="w-4 h-4" /> Return to Homepage
                    </Link>
                </section>

            </main>
        </div>
    );
}
