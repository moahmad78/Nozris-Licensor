'use client';

import React from 'react';
import { ShieldAlert, Scale, Lock, FileWarning, Globe } from 'lucide-react';

export default function LegalDocPage() {
    const clientName = "Valued Partner"; // In a real scenario, fetch this dynamically
    const currentDate = new Date().toLocaleDateString();

    return (
        <div className="min-h-screen bg-white text-black font-serif p-8 md:p-16">
            <div className="max-w-4xl mx-auto border-2 border-black p-12 shadow-2xl relative">

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    <h1 className="text-9xl font-black -rotate-45">CONFIDENTIAL</h1>
                </div>

                <header className="text-center mb-12 border-b-2 border-black pb-8">
                    <h1 className="text-4xl font-black uppercase tracking-widest mb-2">Non-Disclosure & Protection Agreement</h1>
                    <p className="text-sm font-sans text-gray-600 uppercase tracking-widest">Legal Binding Contract under Indian IT Act, 2000</p>
                </header>

                <div className="space-y-8 text-lg leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                            <Scale className="w-6 h-6" /> 1. Parties Involved
                        </h2>
                        <p className="font-sans text-gray-800">
                            This agreement is made on <strong>{currentDate}</strong> between <strong>Licensr Security Systems</strong> (Provider) and <strong>{clientName}</strong> (Recipient).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6" /> 2. Scope of Protection
                        </h2>
                        <p className="font-sans text-gray-800">
                            The Recipient acknowledges that the software source code, assets, and intellectual property provided are protected by <strong>Licensr's Autonomous Security Protocols</strong>.
                        </p>
                    </section>

                    <section className="bg-red-50 border border-red-200 p-6 rounded-lg">
                        <h2 className="text-xl font-bold uppercase mb-4 text-red-700 flex items-center gap-2">
                            <ShieldAlert className="w-6 h-6" /> 3. Violation & Consequences
                        </h2>
                        <p className="font-sans text-red-900 font-medium">
                            <strong>WARNING:</strong> Any attempt to decompile, reverse engineer, share, or download the source code without explicit written authorization is strictly prohibited.
                        </p>
                        <ul className="list-disc list-inside mt-4 font-sans text-red-800 space-y-2">
                            <li>Immediate <strong>corruption of the entire codebase</strong> rendering it unusable.</li>
                            <li>Permanent blacklist of Recipient's IP address and Hardware ID.</li>
                            <li>Automatic generation of a forensic tampering report.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                            <FileWarning className="w-6 h-6" /> 4. Legal Prosecution
                        </h2>
                        <p className="font-sans text-gray-800">
                            Violations will be prosecuted to the fullest extent of the law under <strong>Section 66 (Computer Related Offences)</strong> of the <strong>Information Technology Act, 2000</strong>. Licensr reserves the right to claim damages for loss of intellectual property and revenue.
                        </p>
                    </section>

                </div>

                <footer className="mt-16 pt-8 border-t border-black flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="font-bold text-xl font-cursive">Mohd Ahmad</p>
                        <p className="text-sm text-gray-500 uppercase">Founder, Licensr</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-sans text-gray-500">
                        <Globe className="w-4 h-4" />
                        Digitally Verify at licensr.in/legal
                    </div>
                </footer>

            </div>
        </div>
    );
}
