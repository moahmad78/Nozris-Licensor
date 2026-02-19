'use client';

import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, XCircle, ArrowRight, Code, Server, Smartphone, Globe, Gamepad2, Database, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 🧠 THE BRAIN: DATA FOR ALL CATEGORIES
const PROTECTION_DATA: any = {
    web: {
        title: "Web Application Defense",
        subtitle: "For React, Next.js, Node.js & Vue",
        description: "Prevent source code theft and unauthorized cloning. We inject a polymorphic shield into your frontend bundles.",
        icon: Globe,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        tech: ["React.js", "Next.js", "Vue.js", "Angular", "Node.js", "PHP/Laravel"],
        risks: [
            "Source Code Scraping (Ctrl+U)",
            "API Endpoint Reverse Engineering",
            "Man-in-the-Middle Attacks",
            "Unauthorized Domain Deployment"
        ],
        solutions: [
            "Polymorphic Code Obfuscation",
            "Domain-Lock Enforcement",
            "Anti-Tamper Integrity Check",
            "Real-time API Throttling"
        ]
    },
    mobile: {
        title: "Mobile App Armor",
        subtitle: "For Flutter, React Native, iOS & Android",
        description: "Stop modded APKs and piracy. Ensure your app only runs on genuine, un-rooted devices.",
        icon: Smartphone,
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        tech: ["Flutter", "React Native", "Swift (iOS)", "Kotlin (Android)", "Ionic", "Capacitor"],
        risks: [
            "APK Decompilation & Cloning",
            "Premium Feature Bypassing",
            "Running on Rooted/Jailbroken Devices",
            "Fake In-App Purchases"
        ],
        solutions: [
            "Binary Packing & Encryption",
            "Root/Jailbreak Detection",
            "Anti-Debugging Hooks",
            "Signature Verification"
        ]
    },
    game: {
        title: "Game Economy Guard",
        subtitle: "For Unity, Unreal Engine & Godot",
        description: "Kill aimbots and memory injectors instantly. Protect your game's economy from coin hackers.",
        icon: Gamepad2,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        tech: ["Unity 3D", "Unreal Engine 5", "Godot", "C# / C++", "HTML5 Games"],
        risks: [
            "Memory Injection (Cheat Engine)",
            "Speedhacks & Aimbots",
            "Asset Extraction (Models/Audio)",
            "Cracked In-Game Stores"
        ],
        solutions: [
            "Runtime Memory Integrity",
            "Anti-Hooking Engine",
            "Asset Bundle Encryption",
            "Server-Side Validation"
        ]
    },
    cms: {
        title: "E-Commerce Fortress",
        subtitle: "For WordPress, Shopify & Custom CMS",
        description: "Secure your checkout flow. Prevent payment skimming and malicious plugin injections.",
        icon: ShoppingBag,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        tech: ["WordPress / WooCommerce", "Shopify Headless", "Magento", "Custom MERN Stack", "Wix"],
        risks: [
            "Payment Data Skimming",
            "SQL Injection on Checkout",
            "Admin Panel Brute Force",
            "Malicious Plugin Backdoors"
        ],
        solutions: [
            "Web Application Firewall (WAF)",
            "Checkout Integrity Monitor",
            "Admin Login Shield",
            "File Change Detection"
        ]
    }
};

export default function ProtectionPage({ params }: { params: { category: string } }) {
    // 1. Get Data based on URL
    const data = PROTECTION_DATA[params.category];

    // 2. Handle Invalid URLs
    if (!data) return notFound();

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20">
            <div className="container mx-auto px-4">

                {/* HERO SECTION */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <div className={`inline-flex p-4 rounded-2xl mb-6 ${data.bg} ${data.color} border ${data.border}`}>
                        <data.icon size={48} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                        {data.title}
                    </h1>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        {data.description}
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform">
                            Secure My Code Now
                        </button>
                        <Link href="/" className="px-8 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all">
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* SUPPORTED TECH GRID */}
                <div className="mb-24">
                    <h3 className="text-center text-slate-500 font-bold uppercase tracking-widest text-sm mb-8">Supported Technologies</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.tech.map((tech: string, i: number) => (
                            <div key={i} className="px-6 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-sm hover:border-blue-500/50 hover:text-white transition-all cursor-default">
                                {tech}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RISK VS SOLUTION (The Fear Factor) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

                    {/* THE RISK CARD (Red) */}
                    <div className="bg-red-950/10 border border-red-900/30 p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
                        <h3 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-3">
                            <AlertTriangle /> WITHOUT PROTECTION
                        </h3>
                        <ul className="space-y-4">
                            {data.risks.map((risk: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-slate-400 group-hover:text-red-200/80 transition-colors">
                                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                                    <span>{risk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* THE SOLUTION CARD (Blue/Green) */}
                    <div className={`bg-slate-900/50 border ${data.border} p-8 rounded-3xl relative overflow-hidden`}>
                        <div className={`absolute top-0 left-0 w-full h-1 ${data.color.replace('text', 'bg')}`}></div>
                        <h3 className={`text-2xl font-bold ${data.color} mb-6 flex items-center gap-3`}>
                            <Shield /> WITH NOZRIS
                        </h3>
                        <ul className="space-y-4">
                            {data.solutions.map((sol: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                    <CheckCircle className={`w-5 h-5 ${data.color} shrink-0`} />
                                    <span>{sol}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* FINAL CTA */}
                <div className="mt-24 text-center">
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-12 max-w-4xl mx-auto backdrop-blur-sm">
                        <h2 className="text-3xl font-bold mb-4">Ready to lock down your {params.category} asset?</h2>
                        <p className="text-slate-400 mb-8">Deploy the {data.title} protocol in less than 5 minutes.</p>
                        <button className={`px-10 py-5 rounded-xl font-bold text-black text-lg transition-transform hover:scale-105 ${data.color.replace('text', 'bg').replace('400', '500')}`}>
                            Start Free Trial
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
