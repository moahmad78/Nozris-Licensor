'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Activity, AlertTriangle, ExternalLink, ShieldCheck, Fingerprint, Bug, Globe, Smartphone, Gamepad2, ShoppingBag, Server } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// 🔠 SCRAMBLE TEXT COMPONENT
const ScrambleText = ({ text }: { text: string }) => {
    const [display, setDisplay] = useState(text);
    const chars = '!<>-_\\/[]{}—=+*^?#________';

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(text.split('').map((letter, index) => {
                if (index < iterations) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <motion.span animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }}>{display}</motion.span>;
};

// 🔢 COUNT UP COMPONENT
const CountUp = ({ to }: { to: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);
    useEffect(() => { const controls = animate(count, to, { duration: 2 }); return controls.stop; }, [to]);
    return <motion.span>{rounded}</motion.span>;
};

const GLOBAL_THREAT_DATA = [
    { url: 'ndtv.com', type: 'web', location: 'INDIA', attack: 'DDoS (Layer 7)', risk: 'HIGH' },
    { url: 'paytm.com', type: 'mobile', location: 'INDIA', attack: 'API Key Leak', risk: 'CRITICAL' },
    { url: 'bgmi.com', type: 'game', location: 'INDIA', attack: 'Server Flooding', risk: 'HIGH' },
    { url: 'meesho.com', type: 'cms', location: 'INDIA', attack: 'Checkout Fraud', risk: 'HIGH' }
];

const IDLE_LOGS = ["Analyzing packet flow...", "Detecting anomalous traffic...", "Verifying TLS 1.3 handshake...", "Blocking unauthorized API calls...", "Syncing with Global Threat DB..."];

export default function IntelligenceHub() {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [feed, setFeed] = useState(GLOBAL_THREAT_DATA);
    const [logIndex, setLogIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFeed([...GLOBAL_THREAT_DATA].sort(() => Math.random() - 0.5).slice(0, 4));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (results) return;
        const interval = setInterval(() => setLogIndex(prev => (prev + 1) % IDLE_LOGS.length), 1200);
        return () => clearInterval(interval);
    }, [results]);

    const handleScan = async () => {
        if (!url) return;
        setIsScanning(true); setResults(null);
        setTimeout(() => {
            setResults({ risk: 89, risk_label: 'CRITICAL', leaks: 23, vuln: 'SQL Injection via Search Input' });
            setIsScanning(false);
        }, 2500);
    };

    return (
        <section className="py-24 bg-[#020202] relative overflow-hidden font-sans">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

            <div className="w-full px-6 md:px-12 relative z-10">
                <div className="text-center mb-12">
                    <motion.h2 animate={{ backgroundPosition: ['0% center', '100% center'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-white bg-[length:200%_auto] tracking-tighter mb-3 uppercase">
                        Live Threat Intelligence & Defense Grid
                    </motion.h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">System Status: Active Monitoring</span>
                    </div>
                </div>

                <div className="w-full mx-auto rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                    {/* LEFT: SCANNER */}
                    <div className="p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/5 relative flex flex-col justify-center min-h-[500px]">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}><Terminal className="text-blue-500" /></motion.div> Digital Autopsy
                            </h3>
                        </div>
                        <div className="relative flex bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 shadow-lg mb-4 group">
                            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter Domain (e.g. voomet.com)" className="flex-1 bg-transparent p-5 text-white outline-none placeholder:text-slate-600 font-mono relative z-10" />
                            <div className="absolute inset-0 bg-blue-500/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                            <button onClick={handleScan} disabled={isScanning} className="bg-blue-600 hover:bg-blue-500 text-white px-8 font-bold transition-all disabled:opacity-50 relative overflow-hidden group/btn">
                                <span className="relative z-10">{isScanning ? '...' : 'SCAN'}</span>
                                <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {!results && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black/50 rounded-lg border border-white/5 p-4 font-mono text-xs h-32 overflow-hidden flex flex-col justify-end relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-500/5 animate-pulse"></div>
                                    <div className="text-slate-500 mb-1 border-b border-white/5 pb-1 flex justify-between relative z-10"><span>TERMINAL_OUTPUT</span><span className="text-green-500 animate-pulse">● LIVE</span></div>
                                    <div className="space-y-1 relative z-10"><p className="text-slate-600">root@licensr:~ ./monitor.sh</p><p className="text-green-500/80"> {IDLE_LOGS[logIndex]}<span className="animate-ping">_</span></p></div>
                                </motion.div>
                            )}
                            {results && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="bg-[#0a0a0a]/80 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl animate-pulse"></div>
                                        <div className="flex justify-between items-end mb-2 relative z-10">
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Threat Level</span>
                                            <span className={`text-2xl font-black ${results.risk > 70 ? 'text-red-500' : 'text-green-500'}`}>{results.risk_label} (<CountUp to={results.risk} />%)</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative z-10">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${results.risk}%` }} transition={{ duration: 1.5, ease: "circOut" }} className={`h-full rounded-full ${results.risk > 70 ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-green-500'}`}></motion.div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 group hover:bg-slate-800/50 transition-all"><div className="text-blue-400 text-xs mb-1 uppercase font-bold flex items-center gap-2"><motion.div animate={{ rotateY: 360 }} transition={{ duration: 4, repeat: Infinity }}><Fingerprint size={14} /></motion.div> Dark Web</div><div className="text-white text-xl font-bold"><CountUp to={results.leaks} /> Leaks</div></div>
                                        <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 group hover:bg-slate-800/50 transition-all"><div className="text-yellow-400 text-xs mb-1 uppercase font-bold flex items-center gap-2"><motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity }}><Bug size={14} /></motion.div> Vulnerability</div><div className="text-white text-sm font-bold truncate">{results.vuln}</div></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: GLOBAL FEED */}
                    <div className="bg-[#050505]/30 p-10 lg:p-14 flex flex-col relative overflow-hidden min-h-[500px]">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                            <div><h3 className="text-sm font-bold text-white flex items-center gap-2"><Activity size={16} className="text-red-500 animate-pulse" /> Live Interception Feed</h3><p className="text-[10px] text-slate-400 uppercase">Sector: <span className="text-blue-400 font-bold">GLOBAL</span></p></div>
                            <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span><span className="text-[9px] font-bold text-red-400 uppercase">LIVE</span></div>
                        </div>
                        <div className="flex-1 space-y-3 relative z-10 overflow-hidden">
                            <AnimatePresence mode="popLayout">
                                {feed.map((target, idx) => (
                                    <motion.div key={`${target.url}-${idx}`} initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }} transition={{ duration: 0.3 }} className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className="p-2 bg-slate-800 rounded-lg"><motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}><Globe size={14} className="text-blue-400" /></motion.div></div>
                                            <div><div className="text-xs font-bold text-slate-200"><ScrambleText text={target.url} /></div><div className="text-[9px] text-slate-500 uppercase flex gap-2"><span>{target.location}</span><span className="text-red-400">• {target.attack}</span></div></div>
                                        </div>
                                        <a href={`https://${target.url}`} target="_blank" className="opacity-40 group-hover:opacity-100 px-2 py-1 bg-slate-800 hover:bg-blue-600 text-white text-[9px] font-bold rounded transition-all flex items-center gap-1 relative z-10">Check <ExternalLink size={8} /></a>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
