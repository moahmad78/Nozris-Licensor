'use client';
import React, { useState } from 'react';
import { ShieldCheck, Server, Search, Gavel, ArrowRight, AlertTriangle, FileWarning, EyeOff, Eye, Fingerprint, Siren, LayoutDashboard, ToggleRight, XCircle, Scale, ScrollText, Globe, MonitorX } from 'lucide-react';
import Link from 'next/link';

export default function SecurityTabs() {
    const [activeTab, setActiveTab] = useState('command-dashboard');

    const tabs = [
        { id: 'command-dashboard', label: 'Command Dashboard', icon: <LayoutDashboard size={18} /> },
        { id: 'universal-protection', label: 'Universal Protection', icon: <Globe size={18} /> },
        { id: 'ssl-secure', label: 'SSL Secure', icon: <ShieldCheck size={18} /> },
        { id: 'proxy-shield', label: 'Proxy Shield', icon: <Server size={18} /> },
        { id: 'watchdog', label: 'Decentralized Watchdog', icon: <Search size={18} /> },
        { id: 'identity-verified', label: 'Identity Verified', icon: <Gavel size={18} /> },
        { id: 'real-world-threats', label: 'Real-world Threats', icon: <AlertTriangle size={18} /> },
        { id: 'legal-shield', label: 'Legal Shield', icon: <Scale size={18} /> },
        { id: 'client-defense', label: 'Client Defense', icon: <MonitorX size={18} /> },
    ];

    const content: Record<string, { title: string; description: string; color: string; border: string; bg: string; cursor: string; extra?: React.ReactNode }> = {
        'command-dashboard': {
            title: 'Total Command & Control',
            description: 'Your central hub for security operations. Monitor live license usage, view real-time threat maps, and execute remote commands instantly. From extending a trial to killing a compromised instance, you have absolute power.',
            color: 'text-cyan-400',
            border: 'border-cyan-500/50',
            bg: 'bg-cyan-500/10',
            cursor: 'security',
            extra: (
                <div className="flex gap-4 mt-8 justify-center">
                    <div className="flex flex-col items-center p-4 bg-gray-900 border border-gray-800 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full m-2 animate-pulse"></div>
                        <h4 className="text-gray-400 text-xs uppercase mb-2">License Status</h4>
                        <div className="text-2xl font-bold text-white mb-1">Active</div>
                        <ToggleRight className="text-green-500" />
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-900 border border-gray-800 rounded-xl relative overflow-hidden group border-red-500/20" data-cursor="threat">
                        <h4 className="text-gray-400 text-xs uppercase mb-2">Remote Kill</h4>
                        <button className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1 rounded text-xs font-bold transition-colors">
                            EXECUTE
                        </button>
                        <XCircle className="text-red-500 mt-2" size={20} />
                    </div>
                </div>
            )
        },
        'universal-protection': {
            title: 'One Shield. Every Platform.',
            description: 'Licensr is platform-agnostic. ChecksumDNA ensures consistency across Web, Mobile, Desktop (.exe/.dmg), and CMS environments like WordPress and Shopify.',
            color: 'text-indigo-400',
            border: 'border-indigo-500/50',
            bg: 'bg-indigo-500/10',
            cursor: 'default',
            extra: (
                <div className="flex gap-6 mt-8 justify-center flex-wrap">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 text-xs font-mono">React / Next.js</span>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 text-xs font-mono">iOS / Android</span>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 text-xs font-mono">Unity / Unreal</span>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 text-xs font-mono">Electron / C#</span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded border border-orange-500/30 text-xs font-mono">WordPress / Shopify</span>
                </div>
            )
        },
        'ssl-secure': {
            title: 'End-to-End Encryption',
            description: 'We employ military-grade AES-256 encryption for every license handshake. From the moment your application initializes, our secure tunnel ensures that no data packet can be intercepted, modified, or replayed by unauthorized actors.',
            color: 'text-green-400',
            border: 'border-green-500/50',
            bg: 'bg-green-500/10',
            cursor: 'security',
        },
        'proxy-shield': {
            title: 'Anti-Spoofing Protocol',
            description: 'Our system instantly identifies and blocks traffic originating from VPNs, Tor exit nodes, and commercial proxies. By analyzing packet headers and cross-referencing global threat intelligence databases, we ensure geography-based restrictions cannot be bypassed.',
            color: 'text-blue-400',
            border: 'border-blue-500/50',
            bg: 'bg-blue-500/10',
            cursor: 'security',
        },
        'watchdog': {
            title: 'Code Integrity Monitor',
            description: 'The DNA Watchdog binds to the core hash of your application\'s build. It continuously scans for unauthorized file modifications. If a single byte of your source code is altered, the system triggers an immediate lockdown.',
            color: 'text-red-400',
            border: 'border-red-500/50',
            bg: 'bg-red-500/10',
            cursor: 'security',
            extra: (
                <div className="flex gap-4 mt-8 justify-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400 text-xs px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl relative group">
                        <div className="absolute -top-3 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">LIVE</div>
                        <Eye size={24} className="text-red-500 mb-1" />
                        <span>1. Monitoring</span>
                    </div>
                    <div className="text-gray-700 mt-5">→</div>
                    <div className="flex flex-col items-center gap-2 text-gray-400 text-xs px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <Fingerprint size={24} className="text-yellow-500 mb-1" />
                        <span>2. Logging</span>
                    </div>
                    <div className="text-gray-700 mt-5">→</div>
                    <div className="flex flex-col items-center gap-2 text-gray-400 text-xs px-4 py-3 bg-white/10 border border-white/20 rounded-xl">
                        <Siren size={24} className="text-white mb-1" />
                        <span>3. Locking</span>
                    </div>
                </div>
            )
        },
        'identity-verified': {
            title: 'Legal Compliance',
            description: 'Our platform is fully compliant with the IT Act 2000. We log every access attempt with forensic precision, including IP, device fingerprint, and timestamp, providing irrefutable proof of ownership.',
            color: 'text-purple-400',
            border: 'border-purple-500/50',
            bg: 'bg-purple-500/10',
            cursor: 'security',
        },
        'real-world-threats': {
            title: 'Neutralizing Real-World Vectors',
            description: 'Targeting tools used by modern software thieves. Our engine detects signatures from CPanel File Managers attempting unauthorized copies, blocks automated malware injection scripts, and prevents media scraping tools.',
            color: 'text-orange-400',
            border: 'border-orange-500/50',
            bg: 'bg-orange-500/10',
            cursor: 'threat',
            extra: (
                <div className="flex flex-col items-center gap-6 mt-6">
                    <div className="flex gap-4 justify-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                            <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg"><FileWarning size={20} className="text-red-500" /></div>
                            <span>CPanel Theft</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                            <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg"><EyeOff size={20} className="text-blue-500" /></div>
                            <span>Media Scraping</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                            <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg"><Server size={20} className="text-purple-500" /></div>
                            <span>Malware Injection</span>
                        </div>
                    </div>
                    {/* Link to Map */}
                    <button
                        onClick={() => document.getElementById('global-threat-map')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider"
                    >
                        <Globe size={14} /> View Live Threat Map
                    </button>
                </div>
            )
        },
        'legal-shield': {
            title: 'Automated Legal Shield',
            description: 'Licensr automatically generates Cease & Desist notices populated with the intruder\'s forensic data, formatted for the Indian IT Act 2000 and DMCA compliance.',
            color: 'text-yellow-400',
            border: 'border-yellow-500/50',
            bg: 'bg-yellow-500/10',
            cursor: 'default',
            extra: (
                <div className="flex gap-4 mt-6 justify-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                        <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg"><ScrollText size={20} className="text-yellow-500" /></div>
                        <span>Auto-Drafted Notice</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                        <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg"><Gavel size={20} className="text-white" /></div>
                        <span>IT Act 2000 Compliant</span>
                    </div>
                </div>
            )
        },
        'client-defense': {
            title: 'Client-Side Integrity',
            description: 'We now protect the user device itself. Our lightweight JS agent detects DOM tampering, blocks malicious browser extensions, and prevents session hijacking in real-time, ensuring the end-user experience is never compromised.',
            color: 'text-indigo-400',
            border: 'border-indigo-500/50',
            bg: 'bg-indigo-500/10',
            cursor: 'security',
            extra: (
                <div className="flex gap-4 mt-6 justify-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                        <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg"><MonitorX size={20} className="text-indigo-500" /></div>
                        <span>DOM Guard</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                        <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg"><AlertTriangle size={20} className="text-indigo-500" /></div>
                        <span>Anti-Debug</span>
                    </div>
                </div>
            )
        }
    };

    const activeContent = content[activeTab as keyof typeof content] || content['command-dashboard'];

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            {/* Compressed Tab Bar */}
            <div className="flex flex-row overflow-x-auto scrollbar-hide gap-3 pb-4 justify-start md:justify-center mb-8 px-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border flex-shrink-0 backdrop-blur-sm ${activeTab === tab.id
                            ? `${activeContent.border} ${activeContent.bg} ${activeContent.color} shadow-[0_0_15px_rgba(0,0,0,0.4)] ring-1 ring-offset-2 ring-offset-black ${activeContent.border.replace('border', 'ring')}`
                            : 'border-gray-800 bg-gray-900/40 text-gray-500 hover:text-gray-300 hover:bg-gray-800/60'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Compressed Card with Max Height */}
            <div
                className={`relative overflow-hidden rounded-3xl border ${activeContent.border} bg-gray-950/80 backdrop-blur-xl p-6 transition-all duration-500 shadow-2xl max-h-[600px] overflow-y-auto`}
                data-cursor={activeContent.cursor || 'default'}
            >
                <div className={`absolute top-0 right-0 w-64 h-64 ${activeContent.bg} rounded-full blur-[100px] opacity-20 pointer-events-none`} />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <h3 className={`text-2xl md:text-3xl font-black mb-4 ${activeContent.color} tracking-tight`}>
                        {activeContent.title}
                    </h3>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-light mb-6">
                        {activeContent.description}
                    </p>

                    {/* Extra content */}
                    {activeContent.extra && activeContent.extra}

                    <div className="mt-8">
                        {/* Dynamically link to the correct documentation page */}
                        <Link
                            href={activeTab.startsWith('universal') ? '/docs/universal-protection' : `/docs/${activeTab}`}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-bold transition-all hover:scale-105 active:scale-95 text-white ${activeContent.border} bg-gray-900/50 hover:bg-white/10`}>
                            Learn More <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
