'use client';

import { ShieldCheck, Scale, Gavel, FileLock, UserCheck, AlertOctagon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-red-500/30 font-sans">
            {/* Minimal Header */}
            <nav className="border-b border-white/5 sticky top-0 z-50 bg-black/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/documentation" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Docs
                    </Link>
                    <div className="font-black text-xl tracking-tighter flex items-center gap-2">
                        Nozris. <span className="text-red-600 text-[10px] uppercase tracking-widest bg-red-600/10 px-2 py-0.5 rounded border border-red-600/20">Legal Dept.</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-24">
                {/* Hero */}
                <div className="text-center mb-24 space-y-6">
                    <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto border border-red-600/20">
                        <Gavel className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                        Terms of <span className="text-red-600 underline decoration-red-600/30 underline-offset-8">Enforcement</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                        This is a legally binding document. By utilizing the Nozris System, you submit to the absolute authority and jurisdiction outlined below.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* 1. Ownership & Authority */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-red-600">
                            <Scale className="w-6 h-6" />
                            <h2 className="text-2xl font-black uppercase tracking-tight">1. Proprietary Authority</h2>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4 text-gray-400 leading-relaxed font-medium">
                            <p>
                                The "Nozris" platform, including all obfuscation algorithms, heartbeat monitors, and security sentinels, is the exclusive intellectual property of <strong className="text-white">Mohd Ahmad</strong>.
                            </p>
                            <p>
                                Any attempt to reverse-engineer, de-obfuscate, or bypass the security layers constitutes a criminal breach of digital property rights.
                            </p>
                        </div>
                    </section>

                    {/* 2. The Identity Vault */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-red-600">
                            <UserCheck className="w-6 h-6" />
                            <h2 className="text-2xl font-black uppercase tracking-tight">2. The Identity Vault (KYC)</h2>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4 text-gray-400 leading-relaxed font-medium">
                            <p>
                                Every license issued is tied to a verified identity. We maintain a <strong className="text-white">Digital KYC Vault</strong> containing Aadhar/Government ID data of every license holder.
                            </p>
                            <p>
                                Licenses are <strong className="text-red-500">NON-TRANSFERABLE</strong>. Selling, sharing, or spoofing a license will result in an immediate global IP blacklist and legal recovery of damages.
                            </p>
                        </div>
                    </section>

                    {/* 3. Anti-Theft Enforcement */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-red-600">
                            <FileLock className="w-6 h-6" />
                            <h2 className="text-2xl font-black uppercase tracking-tight">3. Asset Protection & Theft</h2>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4 text-gray-400 leading-relaxed font-medium">
                            <p>
                                Protection mechanisms including Right-click disabling, Inspector blocking, and Domain-Binding are mandatory components.
                            </p>
                            <p>
                                Bypassing these filters to "clone" or "steal" website assets (Images, CSS, or Logic) is a direct violation of international copyright law. Our <strong className="text-red-600 italic">"Sentinels"</strong> track and log clones in real-time, providing admissible evidence for court action.
                            </p>
                        </div>
                    </section>

                    {/* 4. Jurisdiction */}
                    <section className="p-12 bg-red-950/10 border-2 border-red-900/30 rounded-[3rem] text-center space-y-8">
                        <AlertOctagon className="w-16 h-16 text-red-600 mx-auto animate-pulse" />
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white uppercase italic">Legal Jurisdiction</h3>
                            <p className="text-xl text-red-200/80 font-black leading-tight max-w-2xl mx-auto">
                                ALL DISPUTES, BREACHES, OR LEGAL CHALLENGES ARE SUBJECT TO THE EXCLUSIVE JURISDICTION OF THE COURTS IN <span className="text-red-600 underline decoration-red-600/50">GORAKHPUR, UTTAR PRADESH, INDIA</span>.
                            </p>
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-[0.2em] pt-4">
                                NO EXTERNAL ARBITRATION WILL BE ENTERTAINED.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Closing */}
                <div className="mt-32 pt-16 border-t border-white/5 text-center">
                    <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em]">
                        Formalized by Mohd Ahmad | © {new Date().getFullYear()} Nozris. Enforcement
                    </p>
                </div>
            </main>
        </div>
    );
}
