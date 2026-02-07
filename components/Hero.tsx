'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, ChevronRight, AlertCircle, Cloud, Gavel, Terminal, CheckCircle, Activity } from 'lucide-react';
import LeadModal from './LeadModal';

export default function Hero() {
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    // --- LEFT SIDE STATE: TEXT ---
    const words = ["WORLD-CLASS PROTECTION", "AI-DRIVEN SECURITY", "INSTANT THREAT BLOCKING"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // --- RIGHT SIDE STATE: ATTACK FEED ---
    const [attacks, setAttacks] = useState<string[]>([]);
    const attackTypes = ["SQLi Injection", "XSS Payload", "DDoS Attack", "Brute Force", "Malware Upload", "Ransomware"];
    const targets = ["Unprotected-Shop.com", "Legacy-Bank.net", "Crypto-Exchange.io", "Medical-Portal.org", "Logistics-Hub.biz"];

    // Typewriter Effect
    useEffect(() => {
        const typeSpeed = isDeleting ? 50 : 100;
        const currentWord = words[currentWordIndex];

        const timer = setTimeout(() => {
            if (!isDeleting && displayText === currentWord) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
            } else {
                setDisplayText(currentWord.substring(0, displayText.length + (isDeleting ? -1 : 1)));
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentWordIndex, words]);

    // Hacking Feed Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            const target = targets[Math.floor(Math.random() * targets.length)];
            const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x`;
            const newAttack = `[${new Date().toLocaleTimeString()}] ${type} DETECTED from ${ip} -> ${target}`;

            setAttacks(prev => [newAttack, ...prev].slice(0, 15));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden font-sans relative bg-[#020617] text-white">

            {/* --- LEFT SIDE: SECURE / CLEAN (Slate/Blue) --- */}
            <div className="relative flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 z-10 border-r border-slate-800/50 bg-[#020617]">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

                {/* LOGO BAR (Google / IT Law) - MOVED ABOVE HEADLINE */}
                <div className="flex items-center gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-default">
                        <Cloud size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-widest">Google Cloud Partner</span>
                    </div>
                    <div className="h-4 w-px bg-slate-800" />
                    <div className="flex items-center gap-2 grayscale group hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-default">
                        <Shield size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-widest">IT Law 2000 Compliant</span>
                    </div>
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-[1.1] text-white">
                    LICENSR<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                        {displayText}
                    </span>
                    <span className="animate-blink text-blue-500 ml-1">|</span>
                </h1>

                <p className="text-slate-400 text-lg mb-10 max-w-lg leading-relaxed font-medium">
                    Deploying military-grade digital defense protocols. Ensure complete compliance and immunity with Licensr's autonomous protection layer.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-20">
                    <button
                        onClick={() => setIsLeadModalOpen(true)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
                    >
                        <Lock size={18} /> Activate Protocol
                    </button>
                    <Link href="/customer/dashboard">
                        <button className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group">
                            Client Access <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>

                {/* Trust Marquee */}
                <div className="absolute bottom-0 left-0 w-full bg-[#020617] border-t border-slate-800 py-4 overflow-hidden z-20">
                    <div className="flex gap-12 animate-marquee whitespace-nowrap text-slate-600 font-bold uppercase text-[10px] tracking-[0.2em] opacity-60">
                        <span className="flex items-center gap-2"><CheckCircle size={12} /> Google Cloud Approved</span>
                        <span className="flex items-center gap-2"><CheckCircle size={12} /> Microsoft Azure Certified</span>
                        <span className="flex items-center gap-2"><CheckCircle size={12} /> AWS Select Partner</span>
                        <span className="flex items-center gap-2"><CheckCircle size={12} /> Trusted by 10k+ Devs</span>
                        <span className="flex items-center gap-2"><CheckCircle size={12} /> 99.99% Uptime Guarantee</span>
                        {/* Duplicate for seamless loop */}
                        <span className="flex items-center gap-2"><CheckCircle size={12} /> Google Cloud Approved</span>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: TERMINAL BLUE (Slate/Cyan) --- */}
            <div className="relative flex flex-col p-8 overflow-hidden font-mono z-0">
                {/* BLENDED BACKGROUND */}
                <div className="absolute inset-0 bg-gradient-to-l from-[#0f172a] to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(59,130,246,0.1),transparent_70%)] animate-pulse-slow" />

                {/* Header (Floating) */}
                <div className="flex items-center justify-between border-b border-blue-900/30 pb-4 mb-6 z-10 relative mt-20 lg:mt-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-950/20 rounded border border-blue-900/30 animate-pulse">
                            <Activity size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-400 tracking-widest uppercase text-sm drop-shadow-sm">Global Threat Intelligence</h3>
                            <p className="text-[10px] text-blue-300/60 font-bold">REAL-TIME MONITORING // ACTIVE</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-bold text-blue-500">LIVE</span>
                    </div>
                </div>

                {/* Attack Log (Masked Entry) */}
                <div className="flex-1 overflow-hidden relative z-10 font-mono text-xs md:text-sm mask-image-gradient-horizontal">
                    {attacks.map((attack, i) => (
                        <div key={i} className="mb-3 animate-in slide-in-from-right-8 fade-in duration-500 border-l border-blue-900/20 pl-4 py-1">
                            <p className="text-blue-300/80 hover:text-blue-200 transition-colors cursor-default drop-shadow-[0_0_5px_rgba(59,130,246,0.2)]">
                                <span className="text-blue-600 mr-2 opacity-50">&gt;</span>
                                {attack.split('DETECTED')[0]}
                                <span className="bg-blue-950/30 text-blue-400 px-1 font-bold text-[10px]">BLOCKED</span>
                                <span className="text-blue-500/60">{attack.split('DETECTED')[1]}</span>
                            </p>
                        </div>
                    ))}
                    <div className="h-20" /> {/* Spacer */}
                </div>

                {/* Footer Status */}
                <div className="mt-auto border-t border-blue-900/30 pt-4 flex justify-between items-center text-[10px] uppercase font-bold text-blue-900/60 z-10 relative">
                    <span>Packets: {Math.floor(Math.random() * 999999)}/s</span>
                    <span className="animate-blink text-blue-600">SYSTEM_OPTIMAL</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .mask-image-gradient-horizontal {
                     mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                     -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
            `}</style>

            <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
        </section>
    );
}
