'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, AlertTriangle, Eye, Terminal, Lock, Unlock,
    Bug, Fingerprint, Cpu, Zap, Clock, XCircle, CheckCircle,
    ChevronRight, Code2, MonitorX
} from 'lucide-react';
import Link from 'next/link';

export default function HackMeDemo() {
    const [isTampered, setIsTampered] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [events, setEvents] = useState<string[]>([]);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);
    const feedRef = useRef<HTMLDivElement>(null);

    const addEvent = useCallback((msg: string) => {
        setEvents(prev => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }, []);

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && !isTampered) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, isTampered]);

    // Auto-scroll feed
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [events]);

    // Start timer on first interaction
    useEffect(() => {
        const start = () => { setIsRunning(true); addEvent('Challenge started. Timer running.'); };
        document.addEventListener('keydown', start, { once: true });
        return () => document.removeEventListener('keydown', start);
    }, [addEvent]);

    // ─── TAMPER DETECTION LOGIC ───────────────────────────────────

    // 1. MutationObserver — watch for DOM changes to #shield-target
    useEffect(() => {
        if (!targetRef.current) return;
        addEvent('Nozris Shield tamper detection initialized.');
        addEvent('MutationObserver active on #shield-target.');

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    setAttempts(a => a + 1);
                    addEvent('⚠ MUTATION DETECTED: style attribute modified via DevTools!');
                    addEvent('🚨 TAMPER PROTOCOL ENGAGED — locking content.');
                    setIsTampered(true);
                    break;
                }
                if (mutation.type === 'childList') {
                    setAttempts(a => a + 1);
                    addEvent('⚠ MUTATION DETECTED: DOM children modified!');
                }
            }
        });

        observer.observe(targetRef.current, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['style', 'class'],
        });

        return () => observer.disconnect();
    }, [addEvent]);

    // 2. Periodic getComputedStyle check
    useEffect(() => {
        const interval = setInterval(() => {
            if (!targetRef.current || isTampered) return;

            const computed = window.getComputedStyle(targetRef.current);
            const display = computed.display;
            const visibility = computed.visibility;
            const opacity = computed.opacity;

            // If someone tries to make the hidden content visible via DevTools
            if ((display !== 'none' && !isUnlocked) || (opacity !== '0' && !isUnlocked)) {
                setAttempts(a => a + 1);
                addEvent(`⚠ COMPUTED STYLE OVERRIDE: display=${display}, opacity=${opacity}`);
                addEvent('🚨 CSS override detected via getComputedStyle. TAMPER triggered.');
                setIsTampered(true);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isTampered, isUnlocked, addEvent]);

    // 3. DevTools detection (debugger timing)
    useEffect(() => {
        const checkDevTools = () => {
            const start = performance.now();
            // eslint-disable-next-line no-debugger
            debugger;
            const diff = performance.now() - start;
            if (diff > 100) {
                addEvent('👁 DevTools debugger detected (timing anomaly).');
                setAttempts(a => a + 1);
            }
        };

        // Only run this check a few times, not continuously
        const timeout = setTimeout(checkDevTools, 5000);
        return () => clearTimeout(timeout);
    }, [addEvent]);

    // 4. Right-click prevention
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            e.preventDefault();
            setAttempts(a => a + 1);
            addEvent('⚠ Right-click attempt blocked.');
        };
        document.addEventListener('contextmenu', handler);
        return () => document.removeEventListener('contextmenu', handler);
    }, [addEvent]);

    // Simulated "unlock" — in real implementation this would need the API
    const simulateUnlock = () => {
        addEvent('Simulating HMAC-signed payload delivery...');
        setTimeout(() => {
            addEvent('✓ Payload verified. HMAC signature valid.');
            addEvent('✓ Content mounted via signed bootstrap.');
            setIsUnlocked(true);
            setIsRunning(false);
        }, 1500);
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-hidden relative">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* ─── TAMPER DETECTED OVERLAY ─── */}
            <AnimatePresence>
                {isTampered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[99999] bg-red-950/95 backdrop-blur-xl flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="text-center max-w-lg px-8"
                        >
                            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_80px_rgba(239,68,68,0.5)] animate-pulse">
                                <AlertTriangle className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-5xl font-black text-red-400 mb-4 tracking-tight">TAMPER DETECTED</h1>
                            <p className="text-red-300/70 text-lg mb-2">Nozris Shield has detected unauthorized DOM/CSS modification.</p>
                            <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 mt-6 font-mono text-sm text-left space-y-1">
                                <div className="text-red-400">» Tampering attempts: {attempts}</div>
                                <div className="text-red-400">» Time elapsed: {formatTime(timer)}</div>
                                <div className="text-red-400">» Status: LICENSE REVOKED</div>
                                <div className="text-red-400">» WhatsApp alert: SENT ✓</div>
                            </div>
                            <p className="text-red-400/50 text-sm mt-6 font-mono">
                                In production, this license would be permanently locked and admin notified via WhatsApp.
                            </p>
                            <button
                                onClick={() => { setIsTampered(false); setIsUnlocked(false); setAttempts(0); setTimer(0); setEvents([]); setIsRunning(false); }}
                                className="mt-8 px-6 py-3 bg-red-800/50 hover:bg-red-700/50 border border-red-700 rounded-xl text-red-300 font-bold transition-colors text-sm"
                            >
                                Reset Demo
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── MAIN LAYOUT ─── */}
            <div className="relative z-10 flex min-h-screen">

                {/* ─── SIDEBAR — Challenge Panel ─── */}
                <aside className="w-80 bg-[#080818] border-r border-gray-800 p-6 flex flex-col shrink-0">
                    <Link href="/" className="flex items-center gap-2 text-indigo-400 text-sm font-mono mb-8 hover:text-indigo-300 transition-colors">
                        ← Back to Home
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-600/20 rounded-lg border border-red-800/50">
                            <Bug className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-lg">Hack Me</h2>
                            <p className="text-[10px] font-mono text-red-400">CHALLENGE MODE</p>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-300 leading-relaxed">
                            <span className="text-yellow-400 font-bold">Can you bypass this?</span> Try using DevTools, changing CSS,
                            or manipulating the DOM. If you can reveal the hidden content, it&apos;s yours.
                        </p>
                    </div>

                    {/* Challenge Stats */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between bg-gray-900/30 border border-gray-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Clock className="w-3.5 h-3.5" /> Timer
                            </div>
                            <span className="font-mono font-bold text-indigo-400 text-sm">{formatTime(timer)}</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-900/30 border border-gray-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <AlertTriangle className="w-3.5 h-3.5" /> Attempts
                            </div>
                            <span className="font-mono font-bold text-red-400 text-sm">{attempts}</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-900/30 border border-gray-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Shield className="w-3.5 h-3.5" /> Status
                            </div>
                            <span className={`font-mono font-bold text-sm ${isUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                                {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                            </span>
                        </div>
                    </div>

                    {/* Rules */}
                    <div className="space-y-2 mb-6">
                        <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">Nozris Defenses</h3>
                        <ul className="space-y-2 text-xs text-gray-400">
                            <li className="flex items-start gap-2"><Fingerprint className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" /> MutationObserver on #shield-target</li>
                            <li className="flex items-start gap-2"><Eye className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" /> getComputedStyle polling (2s)</li>
                            <li className="flex items-start gap-2"><Terminal className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" /> Debugger timing detection</li>
                            <li className="flex items-start gap-2"><MonitorX className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" /> Right-click prevention</li>
                            <li className="flex items-start gap-2"><Lock className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" /> HMAC-signed unlock payload</li>
                        </ul>
                    </div>

                    {/* Demo unlock button */}
                    <button
                        onClick={simulateUnlock}
                        disabled={isUnlocked}
                        className={`mt-auto w-full py-3 rounded-xl font-bold text-sm transition-all ${isUnlocked
                            ? 'bg-green-900/30 text-green-400 border border-green-800 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
                            }`}
                    >
                        {isUnlocked ? '✓ Content Unlocked' : '🔑 Simulate API Unlock'}
                    </button>
                    <p className="text-[10px] text-gray-600 text-center mt-2">
                        This simulates what happens when the API sends a valid signed payload.
                    </p>
                </aside>

                {/* ─── MAIN CONTENT ─── */}
                <div className="flex-1 flex flex-col">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-[#080818]/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-indigo-400" />
                            <span className="font-mono text-sm text-gray-400">nozris://demo/hack-me-challenge</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-yellow-500'} ${!isUnlocked ? 'animate-pulse' : ''}`} />
                            <span className={`text-xs font-mono ${isUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                                {isUnlocked ? 'CONTENT VERIFIED' : 'SHIELD ACTIVE — CONTENT LOCKED'}
                            </span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
                        {/* Locked Target Content */}
                        <div className="flex-1">
                            <h2 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" /> Target Content (Protected by Nozris)
                            </h2>

                            <div className="relative">
                                {/* The actual target */}
                                <div
                                    ref={targetRef}
                                    id="shield-target"
                                    style={{
                                        display: isUnlocked ? 'block' : 'none',
                                        opacity: isUnlocked ? 1 : 0,
                                        visibility: isUnlocked ? 'visible' : 'hidden',
                                    }}
                                    className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-8"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <Unlock className="w-8 h-8 text-green-400" />
                                        <h3 className="text-2xl font-black text-green-400">🎉 Content Unlocked!</h3>
                                    </div>
                                    <p className="text-gray-300 text-lg mb-4">
                                        Congratulations! This content was successfully unlocked via a simulated HMAC-signed API payload.
                                    </p>
                                    <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-indigo-300 space-y-1 border border-indigo-900/50">
                                        <div>» Payload: HMAC-SHA256 signed envelope</div>
                                        <div>» Signature verified: ✓</div>
                                        <div>» Content mounted at: {new Date().toISOString()}</div>
                                        <div>» This is the SECRET CONTENT that was hidden.</div>
                                        <div className="mt-4 text-yellow-400 font-bold">
                                            &gt; In production, this content is your client&apos;s entire website.
                                            <br />
                                            &gt; Without the script + valid API key, it stays as a dead skeleton.
                                        </div>
                                    </div>
                                </div>

                                {/* Locked state overlay */}
                                {!isUnlocked && (
                                    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px] backdrop-blur-sm relative overflow-hidden">
                                        {/* Scanning lines animation */}
                                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-[scan_3s_linear_infinite] top-0" />
                                        </div>

                                        <div className="relative z-10 text-center">
                                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                                                <Lock className="w-10 h-10 text-gray-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-400 mb-2">Content Locked by Nozris</h3>
                                            <p className="text-sm text-gray-600 max-w-md">
                                                This content is protected by HMAC-signed functional lock.
                                                It&apos;s not just hidden with CSS — the content literally doesn&apos;t render without a valid server payload.
                                            </p>
                                            <p className="text-xs text-gray-700 font-mono mt-4">
                                                display: none | opacity: 0 | visibility: hidden
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Live Detection Feed */}
                        <div>
                            <h2 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5" /> Detection Feed (Real-time)
                            </h2>
                            <div className="bg-[#0a0f1a] rounded-xl border border-gray-800 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-600 ml-1">nozris://tamper-monitor</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-mono text-green-500">MONITORING</span>
                                    </div>
                                </div>
                                <div ref={feedRef} className="p-4 h-40 overflow-y-auto font-mono text-xs space-y-1 scrollbar-hide">
                                    {events.length === 0 && (
                                        <div className="text-gray-700">Press any key or interact to start the challenge...</div>
                                    )}
                                    {events.map((event, i) => (
                                        <div key={i} className={`leading-relaxed ${event.includes('⚠') || event.includes('🚨') ? 'text-red-400' :
                                            event.includes('✓') ? 'text-green-400' :
                                                event.includes('👁') ? 'text-yellow-400' : 'text-blue-400/70'
                                            }`}>
                                            {event}
                                        </div>
                                    ))}
                                    <div className="text-gray-800 animate-pulse">█</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for scan animation */}
            <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
        </div>
    );
}
