'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, AlertTriangle, DollarSign, Clock, ShieldAlert, Activity, Lock, ChevronRight } from 'lucide-react';

/* 
  autopsy/route.ts Response Interface 
*/
interface AutopsyResult {
    threat_level: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
    survival_days: number;
    hacker_entry_point: string;
    monetary_loss: number;
    dark_web_status: string;
}

export default function AutopsyScanner() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'COMPLETE'>('IDLE');
    const [logs, setLogs] = useState<string[]>([]);
    const [result, setResult] = useState<AutopsyResult | null>(null);

    // Simulated Scanning Logs
    const scanSteps = [
        "Initializing handshake...",
        "Bypassing firewall...",
        "Scanning for open ports (80, 443, 8080)...",
        "Analyzing SQL injection vectors...",
        "Checking Dark Web marketplaces...",
        "Calculating financial bleed rate...",
        "Survival clock estimation..."
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setStatus('SCANNING');
        setLogs([]);
        setResult(null);

        // 1. Log Simulation
        for (let i = 0; i < scanSteps.length; i++) {
            await new Promise(r => setTimeout(r, 600)); // Delay between logs
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${scanSteps[i]}`]);
        }

        // 2. Fetch API Data
        try {
            const res = await fetch('/api/autopsy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            setResult(data);
            setStatus('COMPLETE');
        } catch (error) {
            console.error("Autopsy Failed", error);
            setStatus('IDLE');
        }
    };

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-blue-900/20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05)_0%,transparent_50%)]" />

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        DIGITAL <span className="text-blue-500">AUTOPSY</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Enter your domain to run a forensic analysis. Our "Bomb Logic" engine calculates your exact survival time and financial bleed rate if attacked today.
                    </p>
                </div>

                {/* --- SCANNER INTERFACE --- */}
                <div className="bg-[#020617] border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">

                    {/* Terminal Header */}
                    <div className="bg-slate-900/50 px-4 py-3 border-b border-blue-900/20 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                        </div>
                        <div className="ml-4 text-xs font-mono text-slate-500 flex items-center gap-2">
                            <Terminal size={12} className="text-blue-500" />
                            autopsy_engine_v4.0.exe
                        </div>
                    </div>

                    {/* Scanner Input / Output */}
                    <div className="p-8 min-h-[400px] flex flex-col justify-center items-center">

                        {/* INPUT STAGE */}
                        {status === 'IDLE' && (
                            <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                                    <div className="relative flex items-center bg-slate-950 rounded-xl p-2 border border-blue-900/40">
                                        <Search className="ml-3 text-slate-500" size={20} />
                                        <input
                                            type="url"
                                            placeholder="https://your-company.com"
                                            className="w-full bg-transparent border-none focus:ring-0 text-white p-3 outline-none placeholder:text-slate-600 font-mono"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                        />
                                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20">
                                            SCAN
                                        </button>
                                    </div>
                                </div>
                                <p className="text-center text-xs text-slate-500 font-mono uppercase tracking-widest">
                                    *Analysis is non-intrusive & anonymous
                                </p>
                            </form>
                        )}

                        {/* SCANNING STAGE */}
                        {status === 'SCANNING' && (
                            <div className="w-full max-w-2xl font-mono text-sm self-start pl-4 md:pl-0">
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mb-2 text-slate-300"
                                    >
                                        <span className="text-blue-500 mr-2">&gt;</span>
                                        {log}
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-3 h-5 bg-blue-500 mt-2"
                                />
                            </div>
                        )}

                        {/* COMPLETE STAGE (High-Impact Result) */}
                        {status === 'COMPLETE' && result && (
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                                {/* 1. SURVIVAL CLOCK */}
                                <div className="bg-slate-900/40 rounded-xl p-6 border border-red-500/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                            <Clock size={16} /> Survival Estimate
                                        </h3>
                                        <span className="bg-red-950/50 text-red-500 text-[10px] font-bold px-2 py-1 rounded border border-red-900/50">CRITICAL</span>
                                    </div>
                                    <div className="text-5xl font-black text-white mb-2">
                                        {result.survival_days} <span className="text-xl text-slate-500">DAYS</span>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Estimated time before total system compromise based on current vulnerabilities.
                                    </p>
                                </div>

                                {/* 2. FINANCIAL BLEED */}
                                <div className="bg-slate-900/40 rounded-xl p-6 border border-blue-500/20 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                            <Activity size={16} /> Financial Exposure
                                        </h3>
                                        <span className="bg-blue-950/50 text-blue-500 text-[10px] font-bold px-2 py-1 rounded border border-blue-900/50">PROJECTED</span>
                                    </div>
                                    <div className="text-5xl font-black text-white mb-2 flex items-baseline gap-1">
                                        <span className="text-2xl text-slate-500">$</span>
                                        {result.monetary_loss.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Potential revenue loss per incident including downtime and data recovery.
                                    </p>
                                </div>

                                {/* 3. THREAT REPORT (Full Width) */}
                                <div className="col-span-1 md:col-span-2 bg-slate-950 rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Infiltration Vector</div>
                                        <div className="text-white font-mono text-lg border-b border-blue-500/30 pb-1 inline-block">
                                            {result.hacker_entry_point}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Dark Web Status</div>
                                        <div className="text-red-400 font-bold flex items-center gap-2">
                                            <AlertTriangle size={16} /> {result.dark_web_status}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStatus('IDLE')}
                                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all border border-slate-700 hover:border-slate-600"
                                    >
                                        RUN NEW SCAN
                                    </button>
                                </div>

                            </div>
                        )}

                    </div>
                </div>

            </div>
        </section>
    );
}
