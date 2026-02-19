'use client';
import React from 'react';
import { Wifi, Database, ShieldCheck, Activity, CheckCircle, Server } from 'lucide-react';

export default function StatusPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans py-20 px-6">
            <div className="max-w-4xl mx-auto">

                <div className="flex items-center justify-between mb-12 border-b border-gray-800 pb-8">
                    <div>
                        <h1 className="text-4xl font-black mb-2">System Status</h1>
                        <p className="text-gray-400">Real-time performance monitoring of the Nozris Network.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-green-500 font-bold text-sm">All Systems Operational</span>
                    </div>
                </div>

                {/* Uptime Badge */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-12 text-center">
                    <h2 className="text-5xl font-black text-white mb-2">99.99%</h2>
                    <p className="text-gray-500 text-sm uppercase tracking-widest">Uptime (Last 30 Days)</p>
                </div>

                {/* Component Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

                    {/* Global API */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center text-center hover:border-blue-500/50 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                            <Wifi className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Global API Edge</h3>
                        <span className="text-green-500 text-sm flex items-center gap-1">
                            <CheckCircle size={14} /> Operational
                        </span>
                        <div className="mt-4 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Prisma Database */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                            <Database className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Prisma Database</h3>
                        <span className="text-green-500 text-sm flex items-center gap-1">
                            <CheckCircle size={14} /> Connected
                        </span>
                        <div className="mt-4 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full"></div>
                        </div>
                    </div>

                    {/* License Engine */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center text-center hover:border-red-500/50 transition-colors">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Anti-Tamper Engine</h3>
                        <span className="text-green-500 text-sm flex items-center gap-1">
                            <CheckCircle size={14} /> Live
                        </span>
                        <div className="mt-4 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full"></div>
                        </div>
                    </div>

                </div>

                {/* Incident History (Placeholder) */}
                <div className="border-t border-gray-800 pt-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity size={20} /> Incident History
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                            <span className="text-green-500 font-mono text-sm">No incidents reported today.</span>
                            <span className="text-gray-600 text-xs">Feb 07, 2026</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
