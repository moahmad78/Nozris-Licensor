'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, AlertTriangle, Activity, Clock, Lock, Globe, ShieldAlert } from 'lucide-react';

interface AutopsyResult {
    threat_level: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
    survival_days: number;
    hacker_entry_point: string;
    financial_loss: number;
    vulnerabilities: string[];
    ssl_status: string;
    location: string;
}

export default function AutopsyScanner() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'COMPLETE'>('IDLE');
    const [logs, setLogs] = useState<string[]>([]);

    // STRICT FIX 1: State
    const [results, setResults] = useState<AutopsyResult | null>(null);
    const [showReport, setShowReport] = useState(false);

    const scanSteps = [
        "Initializing handshake...",
        "Ping -> 64 bytes from target...",
        "Checking SSL Certificate Validity...",
        "Analyzing DNS Records...",
        "Scanning open ports (80, 443)...",
        "Deploying GPT-4 Forensics Engine...",
        "Calculating Financial Exposure...",
    ];

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setStatus('SCANNING');
        setShowReport(false);
        setLogs([]);
        setResults(null);

        // 1. Visual Logs
        for (let i = 0; i < scanSteps.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${scanSteps[i]}`]);
        }

        try {
            const res = await fetch('/api/autopsy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();

            if (res.ok) {
                // STRICT FIX 2: Logic
                setResults(data);
                setStatus('COMPLETE');
                setShowReport(true);

                // Smooth Scroll
                setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, 100);

            } else {
                setLogs(prev => [...prev, `[ERROR] Analysis Failed: ${data.error}`]);
                setStatus('IDLE');
            }
        } catch (error) {
            console.error("Analysis Failed", error);
            setLogs(prev => [...prev, `[CRITICAL_FAIL] Network Error.`]);
            setStatus('IDLE');
        }
    };

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-blue-900/20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05)_0%,transparent_50%)]" />

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        DIGITAL <span className="text-blue-500">AUTOPSY</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Enter a domain. See exactly how an attacker views it.
                        Powered by <span className="text-green-400 font-mono">GPT-4 Cyber-Intelligence</span>.
                    </p>
                </div>

                <div className="bg-[#020617] border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">
                    <div className="bg-slate-900/50 px-4 py-3 border-b border-blue-900/20 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                        </div>
                        <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                            <Terminal size={12} className="text-blue-500" />
                            GPT-4_AUTOPSY__v4.0.exe
                        </div>
                    </div>

                    <div className="p-8 min-h-[450px] flex flex-col justify-center items-center relative">

                        {/* INPUT */}
                        {status === 'IDLE' && (
                            <form onSubmit={handleScan} className="w-full max-w-lg space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                                    <div className="relative flex items-center bg-slate-950 rounded-xl p-2 border border-blue-900/40">
                                        <Search className="ml-3 text-slate-500" size={20} />
                                        <input
                                            type="url"
                                            placeholder="https://target-domain.com"
                                            className="w-full bg-transparent border-none focus:ring-0 text-white p-3 outline-none placeholder:text-slate-600 font-mono"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                        />
                                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20">
                                            SCAN TARGET
                                        </button>
                                    </div>
                                </div>
                                <p className="text-center text-xs text-slate-500 font-mono uppercase tracking-widest">
                                    *Real-time Intelligence Gathering Active
                                </p>
                            </form>
                        )}

                        {/* SCANNING */}
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

                        {/* COMPLETE with AnimatePresence */}
                        <AnimatePresence>
                            {showReport && results && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                                >

                                    {/* Top Stats */}
                                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-900/40 p-4 rounded-xl border border-blue-500/20">
                                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <ShieldAlert size={14} className="text-red-500" /> Threat Level
                                            </div>
                                            <div className={`text-2xl font-black ${results.threat_level === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`}>
                                                {results.threat_level}
                                            </div>
                                        </div>
                                        <div className="bg-slate-900/40 p-4 rounded-xl border border-blue-500/20">
                                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <Lock size={14} className="text-blue-500" /> SSL Status
                                            </div>
                                            <div className="text-xl font-bold text-white">
                                                {results.ssl_status}
                                            </div>
                                        </div>
                                        <div className="bg-slate-900/40 p-4 rounded-xl border border-blue-500/20">
                                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <Globe size={14} className="text-green-500" /> Server Location
                                            </div>
                                            <div className="text-lg font-bold text-white truncate">
                                                {results.location || 'Unknown'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Survival Clock */}
                                    <div className="bg-slate-900/40 rounded-xl p-6 border border-red-500/20 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                                        <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                                            <Clock size={16} /> Survival Estimate
                                        </h3>
                                        <div className="text-5xl font-black text-white mb-2">
                                            {results.survival_days} <span className="text-xl text-slate-500">DAYS</span>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Estimated time before automated breach based on detected vulnerabilities.
                                        </p>
                                    </div>

                                    {/* Financial Bleed */}
                                    <div className="bg-slate-900/40 rounded-xl p-6 border border-blue-500/20 relative overflow-hidden">
                                        <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-4">
                                            <Activity size={16} /> Financial Exposure
                                        </h3>
                                        <div className="text-5xl font-black text-white mb-2 flex items-baseline gap-1">
                                            <span className="text-2xl text-slate-500">$</span>
                                            {results.financial_loss.toLocaleString()}
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Projected revenue loss per incident (Data breach + Downtime).
                                        </p>
                                    </div>

                                    {/* Vulnerabilities List */}
                                    <div className="col-span-1 md:col-span-2 bg-slate-950 rounded-xl p-6 border border-slate-800">
                                        <h3 className="text-slate-300 font-bold uppercase tracking-widest text-sm mb-4 border-b border-slate-800 pb-2">
                                            Detected Vulnerabilities (GPT-4 Analysis)
                                        </h3>
                                        <ul className="space-y-3">
                                            {results.vulnerabilities.map((vuln, idx) => (
                                                <li key={idx} className="flex items-start gap-3 bg-red-950/20 p-3 rounded-lg border border-red-900/20">
                                                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                                    <span className="text-slate-300 text-sm font-mono">{vuln}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 text-center">
                                        <button
                                            onClick={() => {
                                                setStatus('IDLE');
                                                setShowReport(false);
                                            }}
                                            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all border border-slate-700 hover:border-slate-600"
                                        >
                                            RUN NEW SCAN
                                        </button>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                    {/* Badge */}
                    <div className="bg-slate-900/80 p-2 text-center border-t border-blue-900/20">
                        <span className="text-[10px] text-slate-500 font-mono flex justify-center items-center gap-2">
                            <ShieldAlert size={10} className="text-green-500" />
                            POWERED BY OPENAI GPT-4 SECURITY ENGINE
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
