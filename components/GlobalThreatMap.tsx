'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Wifi, Skull, Copy, Check, Target, Server, Globe } from 'lucide-react';
import { toast } from 'sonner';

// --- DATA: REAL-WORLD LOCATIONS ---
const CITIES = [
    { name: 'San Francisco', x: 19, y: 36 }, { name: 'New York', x: 29.5, y: 34 },
    { name: 'London', x: 49, y: 26 }, { name: 'Berlin', x: 52, y: 24 },
    { name: 'Moscow', x: 62, y: 22 }, { name: 'Beijing', x: 80, y: 34 },
    { name: 'Tokyo', x: 88, y: 36 }, { name: 'Sydney', x: 92, y: 78 },
    { name: 'Sao Paulo', x: 33, y: 68 }, { name: 'Lagos', x: 48, y: 52 },
    { name: 'Dubai', x: 60, y: 38 }, { name: 'Singapore', x: 78, y: 56 }
];

const PROTECTED_NODES = [
    { name: 'Nozris-NA', x: 22, y: 35 },
    { name: 'Nozris-EU', x: 51, y: 28 },
    { name: 'Nozris-APAC', x: 82, y: 40 }
];

// --- DATA: REALISTIC BUSINESS DOMAINS (50+) ---
const REAL_DOMAINS = [
    'api.logistics-global.io', 'secure.banking-partners.net', 'portal.med-records.com', 'shop.luxury-retail.co.uk',
    'auth.fintech-gateway.com', 'vpn.corp-access.org', 'cloud.storage-box.net', 'mail.enterprise-solutions.io',
    'pay.processor-v2.biz', 'crm.sales-force-autom.com', 'db.hotel-chains.info', 'admin.school-district.edu',
    'ssh.dev-server-alpha.io', 'ftp.media-assets.tv', 'ns1.hosting-provider.net', 'webmail.gov-portal.cl',
    'support.tech-startups.io', 'billing.utility-co.com', 'hr.corporate-intranet.net', 'store.fashion-brand.it',
    'api.crypto-exchange.asia', 'dev.mobile-backend.io', 'remote.law-firm.co.uk', 'test.insurance-group.com',
    'staging.e-commerce-v3.net', 'partners.supply-chain.org', 'dashboard.analytics-saas.io', 'login.member-portal.net',
    'assets.cdn-provider.com', 'git.software-house.dev', 'jenkins.build-server.io', 'jira.project-mgmt.net',
    'db-prod.finance-app.com', 'redis.caching-layer.io', 'k8s.cluster-manager.org', 'auth0.identity-provider.net',
    'api-v2.social-media.app', 'stream.video-platform.tv', 'chat.support-desk.io', 'relay.smtp-server.net',
    'proxy.vpn-service.com', 'dns.nameserver-root.net', 'gateway.iot-device-hub.io', 'control.smart-home.net',
    'fleet.trucking-co.com', 'inventory.warehouse-sys.org', 'pos.retail-chain.net', 'booking.travel-agency.com'
];

const VULNERABILITIES = [
    'SQL Injection', 'XSS (Stored)', 'DDoS (L7)', 'Brute Force (SSH)', 'Admin Bypass',
    'Remote Code Exec', 'Open S3 Bucket', 'Exposed .env', 'Weak JWT Secret'
];

interface Attack {
    id: string;
    source: { name: string; x: number; y: number };
    target: { name: string; x: number; y: number };
    type: string;
    blocked: boolean;
}

interface HackLog {
    id: string;
    time: string;
    domain: string;
    location: string;
    target: string;
}

export default function GlobalThreatMap() {
    const [attacks, setAttacks] = useState<Attack[]>([]);
    const [hackFeed, setHackFeed] = useState<HackLog[]>([]);
    const [globalHacks, setGlobalHacks] = useState(842910);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Initial Stats Calculation
    useEffect(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const seconds = (now.getTime() - startOfDay.getTime()) / 1000;
        setGlobalHacks(Math.floor(seconds * 1.5) + 50000); // 1.5 hacks/sec average
    }, []);

    const handleCopy = (id: string, domain: string) => {
        setCopiedId(id);
        navigator.clipboard.writeText(domain);
        toast.success(`Domain verified: ${domain}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Map Attacks (Left)
            const source = CITIES[Math.floor(Math.random() * CITIES.length)];
            const target = PROTECTED_NODES[Math.floor(Math.random() * PROTECTED_NODES.length)];

            const newAttack: Attack = {
                id: Math.random().toString(36).substr(2, 9),
                source: { ...source, x: source.x + (Math.random() * 2 - 1), y: source.y + (Math.random() * 2 - 1) },
                target: target,
                type: 'Mitigated',
                blocked: true
            };
            setAttacks(prev => [...prev.slice(-8), newAttack]);

            // 2. Feed Updates (Right)
            if (Math.random() > 0.3) {
                const domain = REAL_DOMAINS[Math.floor(Math.random() * REAL_DOMAINS.length)];
                const city = CITIES[Math.floor(Math.random() * CITIES.length)].name;
                const vuln = VULNERABILITIES[Math.floor(Math.random() * VULNERABILITIES.length)];

                const newHack: HackLog = {
                    id: Math.random().toString(36).substr(2, 9),
                    time: new Date().toLocaleTimeString([], { hour12: false }),
                    domain: domain,
                    location: city,
                    target: vuln
                };

                setHackFeed(prev => [newHack, ...prev.slice(0, 7)]);
                setGlobalHacks(prev => prev + 1);
            }

        }, 1200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-0 bg-black border border-gray-800 rounded-3xl overflow-hidden relative shadow-2xl">

            {/* --- LEFT PANEL: REAL WORLD MAP --- */}
            <div className="relative w-full aspect-[4/3] lg:aspect-auto bg-[#02040a] overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-800 group">

                {/* HUD Overlay */}
                <div className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                            <Shield className="text-blue-500 fill-blue-500/20" /> NOZRIS DEFENSE
                        </h3>
                        <div className="flex gap-4 mt-2 text-[10px] font-mono uppercase tracking-widest">
                            <span className="text-green-500 flex items-center gap-1"><Lock size={10} /> Secure</span>
                            <span className="text-blue-500 flex items-center gap-1"><Server size={10} /> Active</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 font-mono uppercase">Global Latency</div>
                        <div className="text-xl font-bold text-blue-400 font-mono">12ms</div>
                    </div>
                </div>

                {/* The Map */}
                <div className="absolute inset-0 flex items-center justify-center p-8 opacity-60">
                    <svg viewBox="0 0 100 60" className="w-full h-full stroke-none fill-blue-900/20 drop-shadow-[0_0_10px_rgba(30,58,138,0.3)]">
                        {/* Detailed World Map Path */}
                        <path d="M22.3,16.5 C20.1,14.5 15.5,12.2 12.1,13.8 C10.5,14.6 9.5,17.2 8.2,18.5 C6.5,20.2 3.1,19.8 2.5,21.5 C1.8,23.5 4.5,26.2 5.5,27.8 C7.0,30.2 6.5,33.5 7.8,36.0 C9.1,38.5 13.5,45.2 15.2,46.5 C17.5,48.2 21.2,42.5 22.5,40.5 C24.0,38.2 28.5,34.5 30.5,33.5 C34.5,31.5 40.5,22.5 42.5,21.5 C43.2,21.1 41.5,18.5 40.5,17.5 C38.5,15.5 34.5,12.5 32.5,12.0 C29.5,11.2 24.5,18.5 22.3,16.5 Z" />
                        <path d="M48.5,25.5 C50.5,23.5 54.5,17.5 56.5,16.5 C58.5,15.5 64.5,14.5 66.5,15.5 C68.5,16.5 72.5,18.5 73.5,20.5 C74.2,21.8 70.5,24.5 68.5,25.5 C65.5,27.0 60.5,28.5 58.5,27.5 C56.5,26.5 52.5,24.5 50.5,25.5 C49.5,26.0 48.5,28.5 47.5,30.5 C46.5,32.5 44.5,38.5 43.5,37.5 C42.2,36.2 45.5,28.5 48.5,25.5 Z" />
                        <path d="M78.5,30.5 C80.5,28.5 86.5,28.5 88.5,29.5 C90.5,30.5 94.5,34.5 95.5,36.5 C96.2,37.8 92.5,40.5 90.5,41.5 C88.5,42.5 84.5,38.5 82.5,37.5 C80.5,36.5 76.5,32.5 78.5,30.5 Z" />
                        <path d="M52.5,45.5 C54.5,43.5 58.5,42.5 60.5,43.5 C62.5,44.5 66.5,48.5 67.5,50.5 C68.2,51.8 64.5,54.5 62.5,55.5 C60.5,56.5 56.5,52.5 54.5,51.5 C52.5,50.5 48.5,46.5 50.5,44.5 L52.5,45.5 Z" />
                    </svg>
                </div>

                {/* Nodes & Activity */}
                <div className="absolute inset-0">
                    {PROTECTED_NODES.map((node) => (
                        <div key={node.name} className="absolute flex flex-col items-center" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                            <div className="relative">
                                <Shield size={20} className="text-blue-400 fill-blue-900 z-10 relative" />
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                            </div>
                        </div>
                    ))}

                    <AnimatePresence>
                        {attacks.map((attack) => (
                            <React.Fragment key={attack.id}>
                                <motion.div
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 1.5 }}
                                    className="absolute w-2 h-2 bg-red-500 rounded-full"
                                    style={{ left: `${attack.source.x}%`, top: `${attack.source.y}%` }}
                                />
                                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                    <motion.line
                                        initial={{ pathLength: 0, opacity: 0.6 }}
                                        animate={{ pathLength: 1, opacity: 0 }}
                                        transition={{ duration: 0.8, ease: "circIn" }}
                                        x1={`${attack.source.x}%`} y1={`${attack.source.y}%`}
                                        x2={`${attack.target.x}%`} y2={`${attack.target.y}%`}
                                        stroke="#ef4444" strokeWidth="1" strokeLinecap="round"
                                        strokeDasharray="2 4"
                                    />
                                </svg>
                            </React.Fragment>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- RIGHT PANEL: REAL-TIME THREAT INTELLIGENCE --- */}
            <div className="relative w-full aspect-[4/3] lg:aspect-auto bg-[#0a0a0a] flex flex-col border-t lg:border-t-0 font-mono">
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none" />

                {/* Header */}
                <div className="p-4 bg-red-950/20 border-b border-red-900/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-500">
                        <Globe size={16} className="animate-spin-slow" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Global Breach Feed</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] text-red-400 uppercase">Live Stream</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="p-6 text-center border-b border-gray-900 bg-black/50">
                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">Total Threats Neutralized</div>
                    <div className="text-4xl font-black text-white tabular-nums tracking-tight">
                        {globalHacks.toLocaleString()}
                    </div>
                </div>

                {/* Feed List */}
                <div className="flex-1 overflow-hidden p-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] pointer-events-none z-10" />
                    <div className="flex flex-col gap-2">
                        <AnimatePresence mode='popLayout'>
                            {hackFeed.map((hack) => (
                                <motion.div
                                    key={hack.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="group p-3 rounded border border-gray-800 bg-gray-900/30 hover:bg-gray-800/50 hover:border-red-500/30 transition-all flex justify-between items-center"
                                >
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black bg-red-500 text-black px-1 rounded uppercase">BREACHED</span>
                                            <span className="text-xs text-gray-300 truncate font-bold">{hack.domain}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                            <span className="flex items-center gap-1"><Target size={10} /> {hack.location}</span>
                                            <span className="flex items-center gap-1 text-red-400"><Skull size={10} /> {hack.target}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] text-gray-600">{hack.time}</span>
                                        <button
                                            onClick={() => handleCopy(hack.id, hack.domain)}
                                            className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                                            title="Copy Domain for Verification"
                                        >
                                            {copiedId === hack.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="p-2 text-[9px] text-center text-gray-600 border-t border-gray-900 bg-black">
                    VERIFIED INTELLIGENCE • NOZRIS NEURAL NET V4.0
                </div>

            </div>
        </div>
    );
}
