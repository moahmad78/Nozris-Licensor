import React from 'react';
import { Server, Globe, MapPin, Shield, Ban, Activity, ArrowRight, Network } from 'lucide-react';
import Link from 'next/link';

export default function ProxyShieldDoc() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
            <main className="max-w-5xl mx-auto py-20 px-6">

                {/* Header */}
                <div className="mb-16 border-b border-gray-800 pb-10">
                    <Link href="/docs" className="text-indigo-500 hover:text-indigo-400 flex items-center gap-2 mb-6 font-mono text-sm uppercase tracking-wider">
                        <ArrowRight className="rotate-180" size={16} /> Back to Documentation
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        Proxy <span className="text-indigo-600">Shield</span>.
                    </h1>
                    <p className="text-2xl text-gray-400 font-light max-w-3xl">
                        Anonymity is the first weapon of a cyber-attacker. Proxy Shield strips that away. We detect, inspect, and reject traffic from VPNs, Tor nodes, and residential proxies instantly.
                    </p>
                </div>

                {/* Content Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

                    {/* Feature 1: VPN Detection */}
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500 mb-4">
                            <Server size={32} />
                        </div>
                        <h2 className="text-3xl font-bold">Deep Packet Inspection</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Simple IP lookups aren't enough. We analyze the <span className="text-white">TCP/IP packet headers</span> to detect MTU discrepancies common in VPN tunneling protocols like OpenVPN and WireGuard.
                        </p>
                    </div>

                    {/* Feature 2: Geo-Fencing */}
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                            <MapPin size={32} />
                        </div>
                        <h2 className="text-3xl font-bold">Precision Geo-Fencing</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Define your operational borders. If your license is for "India-Only", any traffic from outside—or any traffic trying to <em>fake</em> being inside via a Proxy—is instantly dropped.
                        </p>
                    </div>
                </section>

                {/* The Blacklist Network */}
                <section className="bg-gray-900/20 border border-gray-800 rounded-3xl p-10 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Network className="text-indigo-500" /> The Global Blacklist
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-4xl">
                            Nozris operates on a Hive-Mind architecture. We maintain a real-time database of over <span className="text-white font-bold">45 Million</span> known malicious IPs, compromised IoT devices, and Botnet command nodes.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-black p-6 rounded-xl border border-gray-800">
                                <h4 className="text-indigo-400 font-bold text-sm uppercase mb-2">Tor Exit Nodes</h4>
                                <div className="text-3xl font-black text-white">100%</div>
                                <div className="text-xs text-gray-500 mt-1">Blocked by default</div>
                            </div>
                            <div className="bg-black p-6 rounded-xl border border-gray-800">
                                <h4 className="text-indigo-400 font-bold text-sm uppercase mb-2">Data Center IPs</h4>
                                <div className="text-3xl font-black text-white">AWS/GCP</div>
                                <div className="text-xs text-gray-500 mt-1">Flagged as non-human</div>
                            </div>
                            <div className="bg-black p-6 rounded-xl border border-gray-800">
                                <h4 className="text-indigo-400 font-bold text-sm uppercase mb-2">Residential Proxies</h4>
                                <div className="text-3xl font-black text-white">Heuristic</div>
                                <div className="text-xs text-gray-500 mt-1">Behavioral Analysis</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Integration Code */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Configuration</h2>
                    <p className="text-gray-400 mb-6">Enable Strict Mode in your `nozris.config.ts` to reject all anonymized traffic.</p>
                    <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl font-mono text-sm text-gray-300">
                        <span className="text-purple-400">export const</span> config = &#123;<br />
                        &nbsp;&nbsp;firewall: &#123;<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;block_vpn: <span className="text-blue-400">true</span>,<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;block_tor: <span className="text-blue-400">true</span>,<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;allowed_countries: [<span className="text-green-400">"IN"</span>, <span className="text-green-400">"US"</span>, <span className="text-green-400">"AE"</span>]<br />
                        &nbsp;&nbsp;&#125;<br />
                        &#125;;
                    </div>
                </section>

            </main>
        </div>
    );
}
