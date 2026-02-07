'use client';

import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';

export default function SecurityPulse() {
    return (
        <div className="relative flex items-center justify-center w-64 h-64">
            {/* Outer Pulse Rings */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-4 bg-blue-500/10 rounded-full animate-pulse delay-75"></div>

            {/* Core Map Graphic (Simplified as a globe for now) */}
            <div className="relative z-10 bg-black border border-blue-900/50 rounded-full p-6 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                <Globe className="w-24 h-24 text-blue-500 animate-slow-spin-custom" />
            </div>

            {/* Orbiting Satellite/Shield */}
            <div className="absolute inset-0 animate-spin-slow pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-black border border-green-500 p-2 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.8)]">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
            </div>

            {/* Status Label */}
            <div className="absolute -bottom-12 w-full text-center">
                <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 px-4 py-1 rounded-full backdrop-blur-md">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Real-time Protection Active</span>
                </div>
            </div>
        </div>
    );
}
