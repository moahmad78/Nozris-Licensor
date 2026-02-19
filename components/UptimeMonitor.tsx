'use client';

import { Activity, Server, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface UptimeProps {
    status: 'online' | 'degraded' | 'offline';
    uptime: number; // percentage, e.g. 99.9
    latency: number; // ms
    lastCheck: string;
}

export function UptimeMonitor({ status, uptime, latency, lastCheck }: UptimeProps) {
    const color =
        status === 'online' ? 'bg-green-50 border-green-200' :
            status === 'degraded' ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200';

    const textColor =
        status === 'online' ? 'text-green-700' :
            status === 'degraded' ? 'text-yellow-700' :
                'text-red-700';

    const icon =
        status === 'online' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
            status === 'degraded' ? <AlertTriangle className="w-5 h-5 text-yellow-600" /> :
                <XCircle className="w-5 h-5 text-red-600" />;

    return (
        <div className={`rounded-xl border p-4 flex items-center justify-between ${color}`}>
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/50">
                    <Server className={`w-5 h-5 ${textColor}`} />
                </div>
                <div>
                    <div className="text-xs font-bold uppercase opacity-70 mb-0.5 text-gray-600">Licensr Server Status</div>
                    <div className={`flex items-center gap-2 font-bold text-lg ${textColor}`}>
                        {status === 'online' ? 'Operational' : status === 'degraded' ? 'Degraded Performance' : 'Major Outage'}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-700">
                <div className="text-right">
                    <div className="text-xs opacity-70">Uptime (24h)</div>
                    <div className={`font-mono font-bold ${textColor}`}>{uptime}%</div>
                </div>
                <div className="text-right">
                    <div className="text-xs opacity-70">Latency</div>
                    <div className={`font-mono font-bold ${textColor}`}>{latency}ms</div>
                </div>
                <div className="h-8 w-[1px] bg-current opacity-10" />
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className="text-xs font-medium opacity-70">Live</span>
                </div>
            </div>
        </div>
    );
}
