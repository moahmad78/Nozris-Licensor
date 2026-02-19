'use client';

import { ShieldCheck, Lock, Globe, Server, CheckCircle, Zap, FileText, Code2, Copy, ArrowRight, Terminal, AlertTriangle, Shield, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

function CodeBlock({ code, lang }: { code: string, lang: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Code snippet copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden border border-gray-800 bg-gray-950/50 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900/50 border-b border-gray-800">
                <span className="text-xs font-mono text-gray-400 capitalize">{lang} Snippet</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30">
            <Toaster position="bottom-right" theme="dark" />

            {/* Navbar */}
            <nav className="border-b border-white/5 sticky top-0 z-50 bg-black/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="font-black text-2xl tracking-tighter flex items-center gap-3">
                        <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-1.5 rounded-lg shadow-lg shadow-amber-500/20">
                            <ShieldCheck className="w-6 h-6 text-black" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                            Nozris. <span className="text-amber-500 uppercase text-[10px] tracking-[0.3em] font-bold">Absolute Authority</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-8">
                        <Link href="/client/login" className="text-sm font-bold text-zinc-400 hover:text-amber-500 transition-colors uppercase tracking-widest">
                            Client Vault
                        </Link>
                        <Link href="/dashboard" className="px-5 py-2.5 bg-amber-500 text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10">
                            Control Center
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* 1. Hero Header */}
                <section className="relative py-32 sm:py-48 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.08),transparent_50%)]" />
                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                            🛡️ Level 9 Sentinel Security
                        </div>
                        <h1 className="text-5xl sm:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-600 max-w-5xl mx-auto leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700">
                            The Nozris. <br />
                            <span className="text-amber-500 italic">God-Shield.</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100 italic">
                            "Without Nozris., your code is bleeding revenue. With it, you are an impenetrable digital fortress. This is your only defense against digital extinction."
                        </p>
                    </div>
                </section>

                {/* 2. God-Mode Features */}
                <section className="py-32 border-t border-white/5 bg-[#080808]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">The God-Shield Enforcement</h2>
                                <p className="text-gray-500 text-lg">Military-grade protection mechanisms designed to make piracy physically impossible.</p>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent hidden md:block mb-6" />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Globe,
                                    title: "Anti-Cloning Shield",
                                    desc: "Think they can copy your cPanel files? Our code is self-aware. On an unauthorized domain, it doesn't just stop; it CORRUPTS ITSELF, turning their stolen asset into a fatal error screen.",
                                    tag: "CPanel Proof"
                                },
                                {
                                    icon: Lock,
                                    title: "IP Extermination",
                                    desc: "An army of bots attacks daily. Our AI monitors every IP. 3 failed attempts? Instant, permanent IP ban. Their IP is marked 'Hostile' across our network.",
                                    tag: "Tamper Protection"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Identity Vault",
                                    desc: "Every license is backed by mandatory Aadhar/KYC verification personally vetted by Mohd Ahmad. This makes your license a legal, traceable, and non-transferable asset.",
                                    tag: "Digital KYC"
                                },
                                {
                                    icon: Code2,
                                    title: "Asset Fortress",
                                    desc: "Stop the bloodbath of image theft. Our shield disables right-click, copy-paste, and even DevTools. Any attempt triggers a 'Copyright Violation' warning.",
                                    tag: "Content Lock"
                                },
                                {
                                    icon: Zap,
                                    title: "Heartbeat Monitor",
                                    desc: "Our servers ping their site 24/7. If the security code is removed, the site enters 'Security Breach Mode' and alerts Mohd Ahmad instantly via WhatsApp.",
                                    tag: "24/7 Monitoring"
                                },
                                {
                                    icon: Terminal,
                                    title: "Legal Authority",
                                    desc: "Every license carries the weight of Gorakhpur Jurisdiction. Unauthorized usage results in permanent termination and immediate legal copyright action.",
                                    tag: "Legal Enforcement"
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-black border border-white/5 hover:border-amber-500/30 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{feature.tag}</span>
                                    </div>
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500/10 transition-colors">
                                        <feature.icon className="w-7 h-7 text-gray-500 group-hover:text-amber-500 transition-colors" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-500 leading-relaxed font-medium">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. The Sacred Vault (Privacy) */}
                <section className="py-32 border-t border-white/5 bg-[#080808]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <ShieldCheck className="w-64 h-64 text-amber-500" />
                            </div>

                            <div className="max-w-3xl relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                    🤝 The Sacred Vault oath
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter">Your Data is <span className="text-amber-500">YOURS.</span></h2>
                                <div className="space-y-6 text-zinc-400 text-lg font-medium leading-relaxed">
                                    <p>
                                        We are the impenetrable vault around your existing data, not a backdoor into it. We do <strong className="text-white underline decoration-amber-500/30">NOT</strong> store passwords or private files.
                                    </p>
                                    <p>
                                        Login once for configuration, <strong className="text-amber-500">change your password</strong>, and live forever secure. We're here to build the garden wall, not walk through the garden.
                                    </p>
                                    <div className="pt-6 grid grid-cols-2 gap-8 border-t border-white/5">
                                        <div>
                                            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Zero Log Policy</h4>
                                            <p className="text-sm text-zinc-500">We never see your customer files or database entries. Ever.</p>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Setup Privacy</h4>
                                            <p className="text-sm text-zinc-500">Temporary setup access only. Your security is our only interest.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. The Warning */}
                <section className="py-24 bg-black relative">
                    <div className="absolute inset-0 bg-red-950/5" />
                    <div className="max-w-5xl mx-auto px-6 relative">
                        <div className="bg-gradient-to-br from-red-950/20 to-black border-2 border-red-900/50 rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl shadow-red-900/10">
                            <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto border-4 border-red-900/30">
                                <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-4xl font-black text-red-500 uppercase tracking-tighter italic lg:text-5xl">
                                    Mohd Ahmad's Authority Warning
                                </h3>
                                <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full" />
                                <p className="text-xl md:text-2xl text-red-200/90 leading-tight font-black uppercase max-w-4xl mx-auto">
                                    "This system is not a suggestion. It is an enforcement. Unauthorised usage, code tampering, or domain spoofing will result in permanent termination and legal action under the jurisdiction of Gorakhpur, UP."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Integration */}
                <section id="integration" className="py-32 bg-[#050505] border-t border-white/5">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl font-black mb-6 uppercase tracking-tight italic text-amber-500">ACTIVATE THE GUARD</h2>
                            <p className="text-zinc-500 text-lg">One snippet. Total Protection. Immutable Security.</p>
                        </div>

                        <div className="space-y-16">
                            <div className="p-8 bg-black rounded-[2rem] border border-white/5 space-y-6">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center font-black text-amber-500">1</div>
                                    <h3 className="text-xl font-bold uppercase tracking-widest text-white">Inject the Guard</h3>
                                </div>
                                <p className="text-zinc-500 text-sm italic whitespace-pre-wrap">Place this code at the top of your website's main logic file. {"\n"}DO NOT SHARE YOUR LICENSE KEY. IT IS YOUR BUSINESS LIFELINE.</p>
                                <CodeBlock lang="javascript" code={`// Configuration
const LICENSE_KEY = 'v_guard_xxxx'; // Your Unique Asset ID
const DOMAIN = window.location.hostname;

// The sentinel will verify and lock assets automatically.
`} />
                            </div>

                            <div className="flex items-start gap-8 p-8 bg-amber-500/5 rounded-[2rem] border border-amber-500/10">
                                <div className="mt-1">
                                    <ShieldCheck className="w-10 h-10 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-white uppercase mb-2">Identity Sovereignty</h4>
                                    <p className="text-zinc-500 leading-relaxed font-medium">Once integrated, the core asset structure of your website becomes dependent on the validation heartbeat. Removal of the script results in a complete layout blackout. Your business survival depends on the shield.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-24 bg-black border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
                        <div className="col-span-2 space-y-8">
                            <div className="font-black text-3xl tracking-tighter flex items-center justify-center md:justify-start gap-3 mb-6">
                                Nozris.
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-black uppercase italic tracking-widest text-amber-500">Mohd Ahmad's Personal Oath</h3>
                                <p className="text-zinc-500 font-medium italic leading-relaxed max-w-md mx-auto md:mx-0">
                                    "Built with an oath of unbreakable security. This isn't just technology; it's a promise of digital sovereignty. Built by Mohd Ahmad from Gorakhpur, UP."
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                                    <a
                                        href="https://wa.me/919264920211"
                                        target="_blank"
                                        className="bg-green-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Direct Access: +91 9264920211
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black uppercase text-xs tracking-widest text-amber-500 mb-6 font-bold">Legal Authority</h4>
                            <ul className="space-y-4 text-sm font-bold text-zinc-500">
                                <li><Link href="/legal" className="hover:text-white transition-colors">Terms of Enforcement</Link></li>
                                <li><Link href="/legal" className="hover:text-white transition-colors">Privacy Vault</Link></li>
                                <li><Link href="/legal" className="hover:text-white transition-colors">Jurisdiction: Gorakhpur</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black uppercase text-xs tracking-widest text-amber-500 mb-6 font-bold">Security Status</h4>
                            <ul className="space-y-4 text-sm font-bold text-zinc-500">
                                <li><Link href="#" className="hover:text-white transition-colors">IP Blacklist Search</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Identity Verification</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors text-green-500">System: 100% SECURE</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">
                            &copy; {new Date().getFullYear()} Nozris. System | All Rights Reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/legal" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/legal" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Terms of Use</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
