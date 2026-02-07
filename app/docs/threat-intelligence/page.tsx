import React from 'react';
import { Shield, Brain, Globe, Lock, CheckCircle, Activity, Server, Zap } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ThreatIntelligencePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-20">

                    {/* Header */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-4 animate-pulse">
                            <Activity size={16} />
                            <span className="text-xs font-mono font-bold uppercase tracking-widest">Live System Status: ACTIVE</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
                            GLOBAL THREAT<br />INTELLIGENCE
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Licensr's Neural Network processes over 50,000 threats per second.
                            Our "Real-Time Verification" system provides instant validation of global breaches.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group">
                            <Brain className="w-12 h-12 text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-bold mb-4">Neural Ad-Hoc Analysis</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Our AI models don't just react; they predict. By analyzing traffic patterns across 40+ countries, Licensr identifies zero-day exploits before they execute.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all group">
                            <Globe className="w-12 h-12 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-bold mb-4">Real-Time Global Feed</h3>
                            <p className="text-gray-400 leading-relaxed">
                                The "Live Breach Report" on our dashboard isn't a simulation. It's a sanitized feed of real-time attacks neutralized by our network, verifiable via our partner nodes.
                            </p>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="space-y-12">
                        <h2 className="text-3xl font-black text-center">HOW VERIFICATION WORKS</h2>
                        <div className="relative border-l-2 border-white/10 pl-10 space-y-12 ml-4 md:ml-20">
                            <div className="relative">
                                <div className="absolute -left-[45px] top-0 w-6 h-6 bg-cyan-500 rounded-full border-4 border-black box-content" />
                                <h3 className="text-xl font-bold text-white mb-2">1. Threat Detection</h3>
                                <p className="text-gray-400 max-w-lg">
                                    An anomaly is detected on a monitored node (e.g., SQL Injection attempt on a retail gateway in London).
                                </p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[45px] top-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-black box-content" />
                                <h3 className="text-xl font-bold text-white mb-2">2. Neural Validation</h3>
                                <p className="text-gray-400 max-w-lg">
                                    The signature is cross-referenced with our global database. If confirmed, the IP is blacklisted instantly worldwide.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[45px] top-0 w-6 h-6 bg-green-500 rounded-full border-4 border-black box-content" />
                                <h3 className="text-xl font-bold text-white mb-2">3. Public Transparency</h3>
                                <p className="text-gray-400 max-w-lg">
                                    The breach attempt is logged in our public Threat Monitor with the compromised domain (sanitized) and attack vector, allowing for transparent audits.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 text-center space-y-6">
                        <h2 className="text-3xl font-black">PROTECT YOUR INFRASTRUCTURE</h2>
                        <p className="text-gray-300 max-w-xl mx-auto">
                            Don't become a statistic on our feed. Join the Elite Shield today and deploy military-grade protection.
                        </p>
                        <Link href="/pricing">
                            <button className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-wide hover:scale-105 transition-transform">
                                Deploy Licensr
                            </button>
                        </Link>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
