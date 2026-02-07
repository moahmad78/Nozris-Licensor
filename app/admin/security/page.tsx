'use client';

import React, { useState } from 'react';
import { Globe, Shield, Activity, Lock, AlertOctagon, Radio } from 'lucide-react';

export default function SecurityDashboardPage() {
    const [threats, setThreats] = useState([
        { id: 1, country: "Russia", ip: "185.200.11.2", type: "Proxy", time: "2s ago" },
        { id: 2, country: "China", ip: "103.21.244.0", type: "VPN", time: "5s ago" },
        { id: 3, country: "Brazil", ip: "45.161.0.0", type: "Botnet", time: "12s ago" },
    ]);

    return (
        <div className="min-h-screen bg-black text-white p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
                <div>
                    <h1 className="text-3xl font-black text-blue-500 uppercase tracking-widest flex items-center gap-3">
                        <Globe className="w-8 h-8 animate-pulse" /> Global Shield
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Active Perimeter Defense System</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-red-900/20 border border-red-900 px-4 py-2 rounded flex items-center gap-2">
                        <AlertOctagon className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-400">12 VPNs BLOCKED</span>
                    </div>
                    <div className="bg-green-900/20 border border-green-900 px-4 py-2 rounded flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold text-green-400">SYSTEM SECURE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* World Map Section */}
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden min-h-[500px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-10 pointer-events-none filter invert"></div>

                    {/* Simulated Threat Blips */}
                    <div className="absolute top-[30%] left-[60%] w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="absolute top-[45%] left-[70%] w-3 h-3 bg-red-500 rounded-full animate-ping delay-100"></div>
                    <div className="absolute top-[35%] left-[20%] w-3 h-3 bg-yellow-500 rounded-full animate-ping delay-200"></div>

                    <div className="z-10 text-center">
                        <Globe className="w-24 h-24 text-gray-800 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700 uppercase">Live Global Threat Map</h2>
                        <p className="text-gray-600">Monitoring 24/7 across 50+ Regions</p>
                    </div>
                </div>

                {/* Side Panel: Top Attacking Countries */}
                <div className="space-y-6">

                    {/* Real-time Blocked Proxies */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-400" /> Real-time Blocks
                        </h3>
                        <div className="space-y-3">
                            {threats.map(threat => (
                                <div key={threat.id} className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${threat.type === 'VPN' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-300">{threat.ip}</p>
                                            <p className="text-[10px] text-gray-500 uppercase">{threat.country}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-red-400">{threat.type}</span>
                                        <span className="block text-[10px] text-gray-600">{threat.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Attackers Stats */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Radio className="w-5 h-5 text-red-500" /> High Risk Regions
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Russia</span>
                                <div className="w-32 bg-gray-800 rounded-full h-2">
                                    <div className="bg-red-600 h-2 rounded-full w-[80%]"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">China</span>
                                <div className="w-32 bg-gray-800 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full w-[65%]"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Unknown</span>
                                <div className="w-32 bg-gray-800 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full w-[40%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
