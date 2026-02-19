import React from 'react';
import { LayoutDashboard, Globe, Activity, ShieldCheck, Zap, Lock, Terminal, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CommandDashboardDoc() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
            <main className="max-w-5xl mx-auto py-20 px-6">

                {/* Header */}
                <div className="mb-16 border-b border-gray-800 pb-10">
                    <Link href="/docs" className="text-cyan-500 hover:text-cyan-400 flex items-center gap-2 mb-6 font-mono text-sm uppercase tracking-wider">
                        <ArrowRight className="rotate-180" size={16} /> Back to Documentation
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        Master Your <span className="text-cyan-500">Kingdom</span>.
                    </h1>
                    <p className="text-2xl text-gray-400 font-light max-w-3xl">
                        The Nozris Command Dashboard is your central mission control. Detailed telemetry, live threat maps, and the absolute power to kill or revive any software instance instantly.
                    </p>
                </div>

                {/* Main Feature: Remote Kill Switch */}
                <section className="mb-20">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-10 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] group-hover:bg-cyan-500/20 transition-all"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 font-bold mb-6 animate-pulse">
                                    <Zap size={16} /> REMOTE EXECUTION PROTOCOL
                                </div>
                                <h2 className="text-3xl font-bold mb-4">The Kill-Switch.</h2>
                                <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                                    Sometimes, legal notices aren't fast enough. If you detect a leak or a non-paying client, simply toggle the
                                    <span className="text-white font-bold"> Status Switch</span> in your dashboard.
                                </p>
                                <ul className="space-y-3 text-gray-400 mb-8">
                                    <li className="flex items-center gap-3"><Terminal size={18} className="text-cyan-500" /> Instant API propagation (Latency &lt; 50ms)</li>
                                    <li className="flex items-center gap-3"><Lock size={18} className="text-cyan-500" /> Local cache invalidation on client device</li>
                                    <li className="flex items-center gap-3"><Database size={18} className="text-cyan-500" /> Forensic audit log created for the action</li>
                                </ul>
                            </div>

                            {/* Visual Placeholder */}
                            <div className="flex-1 w-full bg-black border border-gray-800 rounded-xl p-4 shadow-2xl">
                                <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-500">CL</div>
                                        <div>
                                            <div className="text-white font-bold">Client: Vertex_Corp</div>
                                            <div className="text-xs text-gray-500">ID: LX-9281-AA</div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-green-500/20 text-green-500 text-xs rounded border border-green-500/30 font-bold">ACTIVE</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-gray-900 p-3 rounded">
                                        <span className="text-sm text-gray-400">License Validity</span>
                                        <span className="text-sm text-white">365 Days</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-900 p-3 rounded border border-red-500/30">
                                        <span className="text-sm text-red-400 font-bold">Emergency Stop</span>
                                        <button className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors">
                                            REVOKE ACCESS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Analytics */}
                <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-900/20 border border-gray-800 p-8 rounded-3xl hover:border-cyan-500/50 transition-colors">
                        <Activity className="text-cyan-500 mb-6" size={40} />
                        <h3 className="text-2xl font-bold mb-4">Live Global Analytics</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Visualize where verify requests are coming from. Our interactive heatmap shows you valid users in Green and blocked attacks in Red. Filter by country, city, or ISP.
                        </p>
                    </div>
                    <div className="bg-gray-900/20 border border-gray-800 p-8 rounded-3xl hover:border-purple-500/50 transition-colors">
                        <ShieldCheck className="text-purple-500 mb-6" size={40} />
                        <h3 className="text-2xl font-bold mb-4">Asset Management</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Organize your licenses by Project, Client, or Tier. Bulk-generate keys for enterprise deals or create single-use trial keys that expire automatically after 24 hours.
                        </p>
                    </div>
                </section>

                {/* Technical Integration */}
                <section className="border-t border-gray-800 pt-16">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <Database className="text-cyan-500" /> Connecting to Your Database
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-3xl">
                        The Nozris Dashboard connects directly to your secure <strong>Prisma</strong> database instance. This ensures that every status change is committed atomically and synced across all your distributed applications instantly.
                    </p>

                    <div className="bg-black border border-gray-800 rounded-2xl p-6 font-mono text-sm text-gray-300 overflow-x-auto">
                        <span className="text-gray-500">// Example: Fetching License Status via API</span><br className="mb-4" />
                        <span className="text-purple-400">const</span> status = <span className="text-purple-400">await</span> prisma.license.<span className="text-yellow-300">findUnique</span>(&#123;<br />
                        &nbsp;&nbsp;where: &#123; key: <span className="text-green-400">"LICENSE_KEY"</span> &#125;,<br />
                        &nbsp;&nbsp;select: &#123; isActive: <span className="text-blue-400">true</span>, expiration: <span className="text-blue-400">true</span> &#125;<br />
                        &#125;);
                    </div>
                </section>

            </main>
        </div>
    );
}
