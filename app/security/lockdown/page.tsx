'use client';

import { useEffect, useRef } from 'react';
import { ShieldAlert, AlertCircle, Siren } from 'lucide-react';

export default function LockdownPage() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // 1. Mandatory No-Exit Logic
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F12' || e.key === 'Escape' || (e.ctrlKey && (e.key === 'Shift' || e.key === 'u' || e.key === 'i'))) {
                e.preventDefault();
                return false;
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "SYSTEM LOCKDOWN ACTIVE. ILLEGAL EXIT ATTEMPT LOGGED.";
            return e.returnValue;
        };

        // Block Back Button
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href);
            alert("ILLEGAL NAVIGATION: YOUR BROWSER IS LOCKED BY NOZRIS.");
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        // 2. Play Siren (Infinite Loop)
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.play().catch(e => console.log("Audio block:", e));
        }

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center text-white p-6 z-[9999] overflow-hidden select-none">
            <audio ref={audioRef} src="/sounds/siren.mp3" loop hidden />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-red-700 to-black opacity-50 animate-pulse" />

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                <div className="flex justify-center mb-4">
                    <div className="bg-white/10 p-8 rounded-full animate-bounce border-4 border-white">
                        <Siren className="w-24 h-24 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter uppercase italic">
                        Digital Jail
                    </h1>
                    <div className="bg-black text-white py-2 px-6 inline-block rounded-lg font-black tracking-[0.5em] animate-pulse">
                        ACCESS DENIED
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 space-y-6 shadow-2xl">
                    <div className="space-y-2">
                        <p className="text-2xl font-bold text-red-100 italic">"CRITICAL SECURITY BREACH DETECTED"</p>
                        <p className="text-sm text-red-200 leading-relaxed font-medium">
                            Your IP Address, Physical Geo-Location, and Device ID have been captured and transmitted to the Nozris Security Command.
                            Illegal tampering attempt has been logged. You may face JAIL TIME under Cyber Crime Prevention Laws.
                        </p>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    <div className="space-y-4 pt-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-red-300 font-black">Release Request Protocol</p>
                        <p className="text-sm font-medium">To request a system release, apologize and explain your actions to the Administrator:</p>
                        <div className="flex flex-col gap-3">
                            <a href="mailto:support@nozris.com" className="bg-white text-red-600 py-3 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                EMAIL NOZRIS ADMIN
                            </a>
                            <p className="text-[10px] text-red-300 italic font-medium">Unique Jail ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em] mt-10">
                    Proprietary Guard System by Nozris | Security Division
                </p>
            </div>

            {/* Warning Overlay */}
            <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none">
                <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <ShieldAlert key={i} className="w-6 h-6 text-white/20 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
