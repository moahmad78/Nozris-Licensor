import React from 'react';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Secure Your Code. <span className="text-blue-500">Protect Revenue.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the level of protection your software demands. From individual developers to enterprise ecosystems.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Developer Free Plan */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <span className="text-xs font-mono border border-gray-700 px-2 py-1 rounded text-gray-500">TESTNET</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Developer Free</h2>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black">$0</span>
                            <span className="text-gray-500">/ forever</span>
                        </div>
                        <p className="text-gray-400 mb-8 border-b border-gray-800 pb-8 min-h-[80px]">
                            Essential protection for open-source projects, prototypes, and individual developers testing the waters.
                        </p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-gray-500" /> Basic Integrity Checks
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-gray-500" /> 1 Active Project
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-gray-500" /> Community Support
                            </li>
                            <li className="flex items-center gap-3 text-gray-500">
                                <X className="w-5 h-5 text-red-900/50" /> No Global Blacklist
                            </li>
                            <li className="flex items-center gap-3 text-gray-500">
                                <X className="w-5 h-5 text-red-900/50" /> No Legal Enforcement
                            </li>
                        </ul>

                        <Link href="/register" className="block w-full text-center py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all border border-gray-700">
                            Start Building
                        </Link>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-gradient-to-b from-blue-900/20 to-black border border-blue-500/30 rounded-3xl p-8 hover:border-blue-500/60 transition-all relative overflow-hidden group shadow-[0_0_40px_rgba(37,99,235,0.1)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute top-0 right-0 p-4">
                            <span className="text-xs font-mono bg-blue-500/20 border border-blue-500/40 px-2 py-1 rounded text-blue-400 font-bold tracking-widest">RECOMMENDED</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-white">Enterprise</h2>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-white">$499</span>
                            <span className="text-gray-400">/ month</span>
                        </div>
                        <p className="text-blue-100/80 mb-8 border-b border-blue-900/30 pb-8 min-h-[80px]">
                            Military-grade defense for high-value software. Full autonomous protection, legal backing, and priority support.
                        </p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div>
                                <span className="font-bold">DNA Neural Response</span>
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div>
                                Global IP Blacklist Sync
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div>
                                IT Act 2000 Legal Evidence
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div>
                                Unlimited Projects & Bandwidth
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-blue-400" /></div>
                                VPN & Proxy Anti-Spoofing
                            </li>
                        </ul>

                        <Link href="/register" className="block w-full text-center py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-600/20">
                            Get Full Protection
                        </Link>
                    </div>
                </div>

                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p>Enterprise plans include a dedicated account manager and 24/7 emergency response hotline.</p>
                </div>
            </div>
        </div>
    );
}
