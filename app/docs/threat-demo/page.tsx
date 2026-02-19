import React from 'react';
import { Radar, Crosshair } from 'lucide-react';

export default function ThreatDemo() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-green-900/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-md w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10">
                <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto border border-green-500/20 relative">
                    <Radar className="w-8 h-8 text-green-500 relative z-10" />
                    <div className="absolute inset-0 rounded-full border border-green-500/30 animate-ping"></div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-black tracking-tight uppercase">Threat Intel Demo</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        An interactive global threat map and attack simulation module is constructing...
                    </p>
                </div>

                <div className="flex justify-center gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        <Crosshair size={12} className="text-red-500" />
                        Live Feed: Offline
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-400 uppercase tracking-widest">
                        Coming Soon
                    </span>
                </div>
            </div>
        </div>
    );
}
