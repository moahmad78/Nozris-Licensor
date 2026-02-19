import React from 'react';
import { ShieldAlert, Activity } from 'lucide-react';

export default function EmergencyProtocol() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-md w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10">
                <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto border border-red-500/20 animate-pulse">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl font-black tracking-tight uppercase">Emergency Protocols</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        The Nozris automated incident response documentation is currently being updated to reflect the new neural defense grid (v4.0).
                    </p>
                </div>

                <div className="flex justify-center gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        <Activity size={12} className="text-blue-500" />
                        System Active
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                        Docs: Coming Soon
                    </span>
                </div>
            </div>
        </div>
    );
}
