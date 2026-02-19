'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SERVICES = [
    { text: "WEB ATTACKS", color: "from-blue-400 to-cyan-300" },
    { text: "MOBILE PIRACY", color: "from-green-400 to-emerald-300" },
    { text: "GAME HACKS", color: "from-purple-400 to-pink-300" },
    { text: "PAYMENT FRAUD", color: "from-orange-400 to-red-300" }
];

const HACK_LOGS_POOL = [
    "ATTEMPT: SQL Injection on user_db.php | Status: BLOCKED [Nozris-9]",
    "STATUS: Firewall bypass initiated [Module: Web]... Access Denied",
    "DATASTREAM: Encrypted key extraction protocol active | Target: API_Gateway",
    "ALERT: Suspicious activity detected from IP 192.168.1.100 [Node-7]",
    "NOZRIS SHIELD: Threat neutralized (Type: XSS) | Origin: Unknown",
    "CONNECTION: Remote server access attempt [FAILED] | Retrying...",
    "SYSTEM SCAN: Vulnerability assessment complete. Status: Critical | Patching...",
    "DEFENSE PROTOCOL: Quantum encryption layer deployed | Key: 4096-bit",
    "ATTACK VECTOR: Mobile APK reverse engineering detected | Integrity Check: PASS",
    "NOZRIS SHIELD: Polymorphic code morphing engaged | Hash: #8f92a1",
    "GAME HACK: Memory injection detected (Game: Global Ops) | Ban Protocol: Active",
    "ACTION: Unauthorized API call blocked | User: Anonymous | Latency: 2ms",
    "LOG: User session hijacked attempt [FAILED] | Encryption: AES-256",
    "NOZRIS CORE: Integrity check passed. All systems nominal. | Uptime: 99.99%",
    "PAYMENT GATEWAY: Fraudulent transaction flagged. User: B.J. | ID: #99281",
    "REAL-TIME MONITORING: Intrusion Prevention System active | Threads: 128",
    "ALERT: Code obfuscation breach attempt | Source: External Proxy",
    "NOZRIS SHIELD: Dynamic signature update applied | Version: v4.2.0",
    "STATUS: All systems under advanced protection. | Awaiting instructions..."
];

const generateLongLogString = () => {
    let logString = '';
    for (let i = 0; i < 400; i++) {
        logString += HACK_LOGS_POOL[Math.floor(Math.random() * HACK_LOGS_POOL.length)] + '\n';
    }
    return logString;
};

export default function Hero({ onOpenAuth }: { onOpenAuth?: (view: 'register' | 'login') => void }) {
    const [index, setIndex] = useState(0);
    const [logContent, setLogContent] = useState('');

    useEffect(() => {
        const interval = setInterval(() => setIndex(prev => (prev + 1) % SERVICES.length), 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setLogContent(generateLongLogString());
    }, []);

    const handleOpenRegister = () => {
        if (onOpenAuth) {
            onOpenAuth('register');
        } else {
            // Fallback if prop not passed (should not happen in main app)
            window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { view: 'register' } }));
        }
    };

    return (
        <section className="relative min-h-screen bg-[#050714] text-white overflow-hidden flex items-center pt-20">
            {/* BACKGROUND NEBULA */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-900/20 rounded-full blur-[150px] opacity-40 mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px] opacity-40 mix-blend-screen"></div>
            </div>

            <div className="w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center h-full">

                {/* LEFT SIDE: DYNAMIC TEXT */}
                <div className="space-y-8 pl-2 z-20">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/30 text-xs font-medium text-purple-300 tracking-wide backdrop-blur-sm">System Status: Active Defense</div>
                    <div className="space-y-4 min-h-[180px]">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">Intelligence to solve <br /><AnimatePresence mode="wait"><motion.span key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${SERVICES[index].color}`}>{SERVICES[index].text}.</motion.span></AnimatePresence></h1>
                        <p className="text-lg text-slate-400 max-w-lg leading-relaxed">Nozris provides autonomous security layers, ensuring integrity from the first line of code to deployment.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <button onClick={handleOpenRegister} className="px-8 py-4 rounded-full font-bold text-black bg-white hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10 group">Get started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
                        <button onClick={() => alert("Nozris Strategy Video Coming Soon!")} className="px-8 py-4 rounded-full font-bold text-white bg-[#1a1b26] border border-gray-800 hover:border-gray-600 transition-all flex items-center gap-2 group"><PlayCircle size={18} className="group-hover:text-blue-400" /> Watch video</button>
                    </div>
                    <div className="pt-8 text-sm text-slate-500 font-medium border-t border-white/5 mt-8 w-fit">Trusted by the best engineering teams globally.</div>
                </div>

                {/* RIGHT SIDE: ABSOLUTE FULL-EDGE TERMINAL */}
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden bg-gradient-to-l from-[#050714]/50 to-transparent">
                    {/* Continuous Scrolling Code reaching the corners */}
                    <div className="absolute inset-0 w-full h-full font-mono text-xs whitespace-nowrap leading-relaxed opacity-60">
                        <motion.div
                            animate={{ y: ['0%', '-50%'] }}
                            transition={{ ease: "linear", duration: 80, repeat: Infinity }}
                            className="absolute top-0 left-0 w-full pl-10"
                            style={{
                                maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 100%)',
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 100%)'
                            }}
                        >
                            {logContent.split('\n').map((line, i) => (
                                <div
                                    key={i}
                                    className={`w-full py-0.5 ${line.includes('FAILED') || line.includes('ALERT') ? 'text-red-500/90 font-bold' : line.includes('NOZRIS') || line.includes('SECURE') ? 'text-green-500/90 font-bold' : 'text-blue-500/70'}`}
                                >
                                    {line}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* MOBILE ONLY TERMINAL (Relative) */}
                <div className="lg:hidden relative h-[400px] w-full overflow-hidden mask-gradient-b">
                    <div className="absolute inset-0 w-full h-full font-mono text-[10px] whitespace-pre-wrap leading-tight opacity-60">
                        <motion.div animate={{ y: ['0%', '-50%'] }} transition={{ ease: "linear", duration: 60, repeat: Infinity }}>
                            {logContent.split('\n').slice(0, 50).map((line, i) => (
                                <div key={i} className={`w-full ${line.includes('FAILED') ? 'text-red-500' : 'text-blue-500'}`}>{line}</div>
                            ))}
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}
