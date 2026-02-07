'use client';

import React, { useState } from 'react';
import { Map, AlertTriangle, FileWarning, Send, ShieldAlert, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function ForensicTrackingPage() {
    const [hackers, setHackers] = useState([
        { id: 1, ip: "203.0.113.45", domain: "cracked-software.net", isp: "BadData Corp", location: "Moscow, RU", attempts: 12, lastSeen: "2026-02-05 14:30" },
        { id: 2, ip: "198.51.100.12", domain: "leaked-scripts.io", isp: "Unsecure Host", location: "Beijing, CN", attempts: 4, lastSeen: "2026-02-05 12:15" },
        // ... mock data
    ]);

    const handleSendWarning = async (hacker: any) => {
        try {
            const response = await fetch('/api/notify-hacker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip: hacker.ip, domain: hacker.domain })
            });
            if (response.ok) toast.success(`Legal Warning Sent to ${hacker.ip}`);
            else toast.error("Failed to send warning");
        } catch (e) {
            toast.error("Connection Error");
        }
    };

    const handleDownloadDMCA = async (hacker: any) => {
        try {
            const response = await fetch('/api/dmca-generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hackerDomain: hacker.domain,
                    hackerIp: hacker.ip,
                    licenseKey: "SYSTEM-DETECTED",
                    violationDate: hacker.lastSeen
                })
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `DMCA_${hacker.domain}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success("DMCA Notice Downloaded");
        } catch (e) {
            toast.error("Generation Error");
        }
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-red-600 uppercase tracking-tighter flex items-center gap-3">
                        <Map className="w-8 h-8" /> Forensic Radar
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Live Threat Tracking & Neutralization</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-gray-700">LIVE FEED ACTIVE</span>
                </div>
            </header>

            {/* Simulated Map View (Placeholder for actual Map library) */}
            <div className="bg-gray-900 rounded-[2rem] h-[400px] flex items-center justify-center relative overflow-hidden border-4 border-gray-800 shadow-2xl">
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center filter invert"></div>
                {/* Mock Pins */}
                <div className="absolute top-[30%] left-[60%] w-4 h-4 bg-red-600 rounded-full animate-ping"></div>
                <div className="absolute top-[30%] left-[60%] w-4 h-4 bg-red-600 rounded-full"></div>

                <div className="absolute top-[40%] left-[75%] w-4 h-4 bg-red-600 rounded-full animate-ping delay-75"></div>
                <div className="absolute top-[40%] left-[75%] w-4 h-4 bg-red-600 rounded-full"></div>

                <div className="z-10 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-red-900/50 text-center">
                    <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-2" />
                    <h3 className="text-red-500 font-bold">2 Active Threads Detected</h3>
                    <p className="text-gray-400 text-xs">Awaiting Counter-Measures</p>
                </div>
            </div>

            {/* Hacker List */}
            <div className="grid gap-4">
                {hackers.map(hacker => (
                    <div key={hacker.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-50 p-3 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{hacker.domain}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500 uppercase font-bold tracking-wider">
                                    <span>{hacker.ip}</span>
                                    <span>&bull;</span>
                                    <span>{hacker.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={() => handleSendWarning(hacker)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-bold text-xs uppercase tracking-wide"
                            >
                                <Send className="w-4 h-4" /> Send Legal Warning
                            </button>
                            <button
                                onClick={() => handleDownloadDMCA(hacker)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-bold text-xs uppercase tracking-wide"
                            >
                                <FileWarning className="w-4 h-4" /> Download DMCA
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
