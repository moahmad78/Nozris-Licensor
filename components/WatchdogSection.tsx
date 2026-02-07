'use client';
import React from 'react';
import { Activity, Lock, Terminal, Shield } from 'lucide-react';
import Link from 'next/link';

export default function WatchdogSection() {
    return (
        <section className="py-24 border-y border-gray-900 bg-black relative overflow-hidden" data-cursor="security">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-red-500/5 border border-red-500/20 text-red-500 text-sm font-mono mb-8 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <Activity size={14} /> LIVE SYSTEM INTEGRITY MONITORING
                </div>
                <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase tracking-tighter">
                    <Link href="/docs/watchdog-protocol" className="hover:text-red-500 transition-colors cursor-pointer">
                        Decentralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Watchdog</span>
                    </Link>
                </h2>
                <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
                    Our system doesn't just block attacks. It actively monitors, adapts, and executes <span className="text-white font-medium">self-destruct protocols</span> on detected tampering attempts. Your code remains yours, or it ceases to exist.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href="/docs/emergency-protocol" className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] border border-red-500 flex items-center gap-3">
                        <Lock size={20} /> Trigger Emergency Lock
                    </Link>
                    <Link href="/docs/threat-demo" className="px-10 py-4 bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold rounded-xl transition-all border border-gray-800 hover:border-gray-700 flex items-center gap-3">
                        <Terminal size={20} /> View Attack Logs
                    </Link>
                </div>
            </div>
        </section>
    );
}
