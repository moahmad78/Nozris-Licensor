'use client';

import { MessageSquare, Video, Monitor, Zap, Headphones } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function SupportWidget() {
    const handleAction = (action: string) => {
        toast.info(`Initializing ${action}...`);
        // Logic for connecting to support would go here
    };

    useEffect(() => {
        // Tawk.to Script Injection
        const script = document.createElement("script");
        script.async = true;
        script.src = 'https://embed.tawk.to/67aa545e825083258e1329be/1ijonl0m6';
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');
        document.body.appendChild(script);

        return () => {
            // cleanup if needed
        };
    }, []);

    return (
        <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Headphones className="text-blue-400" /> Support Hub
                </h3>
                <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </div>

            <p className="text-xs text-gray-400 mb-6 relative z-10">
                Direct encrypted line to Nozris Command. Average response: <span className="text-green-400 font-mono">24s</span>.
            </p>

            <div className="space-y-3 relative z-10">
                {/* Live Chat Action */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10 hover:bg-slate-700/50 transition-colors cursor-pointer group"
                    onClick={() => {
                        // Tawk.to API
                        if ((window as any).Tawk_API) {
                            (window as any).Tawk_API.toggle();
                        } else {
                            toast.error("Support is currently offline.");
                        }
                    }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:text-emerald-300 transition-colors">
                            <MessageSquare size={20} />
                        </div>
                        <span className="font-bold text-white">Live Chat</span>
                    </div>
                    <p className="text-xs text-slate-400">Talk to a security engineer instantly.</p>
                </div>

                <button
                    onClick={() => handleAction('Video Uplink')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 rounded-xl transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:text-purple-300">
                            <Video size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-white">Video Uplink</p>
                            <p className="text-[10px] text-gray-500">Face-to-Face</p>
                        </div>
                    </div>
                    <Zap size={14} className="text-gray-600 group-hover:text-purple-400" />
                </button>

                <button
                    onClick={() => handleAction('Remote Session')}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-green-600/20 border border-white/10 hover:border-green-500/50 rounded-xl transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400 group-hover:text-green-300">
                            <Monitor size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-white">Screen Share</p>
                            <p className="text-[10px] text-gray-500">Remote Fix</p>
                        </div>
                    </div>
                    <Zap size={14} className="text-gray-600 group-hover:text-green-400" />
                </button>
            </div>
        </div>
    );
}
