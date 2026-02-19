'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Activity, Power, Terminal, AlertTriangle, CheckCircle, XCircle, Eye, Lock } from 'lucide-react';

// ─── Security Score Meter ──────────────────────────────────────

function SecurityScoreMeter({ domain, score, status }: { domain: string; score: number; status: string }) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const circumference = 2 * Math.PI * 54; // radius=54
    const offset = circumference - (animatedScore / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 90) return { stroke: '#22c55e', text: 'text-green-400', bg: 'bg-green-500/10', label: 'SECURE' };
        if (s >= 70) return { stroke: '#eab308', text: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'MODERATE' };
        return { stroke: '#ef4444', text: 'text-red-400', bg: 'bg-red-500/10', label: 'AT RISK' };
    };

    const colorInfo = getColor(score);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 100);
        return () => clearTimeout(timer);
    }, [score]);

    return (
        <div className="flex flex-col items-center gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#1f2937" strokeWidth="8" />
                    <circle
                        cx="60" cy="60" r="54" fill="none"
                        stroke={colorInfo.stroke}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 6px ${colorInfo.stroke}40)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-black ${colorInfo.text}`}>{animatedScore}%</span>
                </div>
            </div>
            <div className="text-center">
                <div className="text-xs font-bold text-white truncate max-w-[120px]" title={domain}>{domain}</div>
                <div className={`text-[10px] font-mono font-bold ${colorInfo.text} mt-1 px-2 py-0.5 rounded-full ${colorInfo.bg} inline-block`}>
                    {colorInfo.label}
                </div>
            </div>
        </div>
    );
}

// ─── Live Security Feed ────────────────────────────────────────

interface FeedEvent {
    id: string;
    time: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
}

function LiveSecurityFeed({ initialEvents }: { initialEvents: FeedEvent[] }) {
    const [events, setEvents] = useState<FeedEvent[]>(initialEvents);
    const feedRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [events]);

    // Simulate live events
    useEffect(() => {
        const sampleEvents: Omit<FeedEvent, 'id' | 'time'>[] = [
            { message: 'Heartbeat OK from voomet.com', type: 'success' },
            { message: 'Shield payload delivered to client-site.in', type: 'info' },
            { message: 'License validation: portfolio.dev... Pass', type: 'success' },
            { message: 'Suspicious CSS override detected on demo-site.com', type: 'warning' },
            { message: 'Rate limit triggered from 192.168.1.105', type: 'warning' },
            { message: 'HMAC signature verified for heartbeat #4821', type: 'info' },
            { message: 'Cache fallback activated for offline client', type: 'info' },
        ];

        const interval = setInterval(() => {
            const sample = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            setEvents(prev => [...prev.slice(-30), {
                id: crypto.randomUUID(),
                time: timeStr,
                message: sample.message,
                type: sample.type,
            }]);
        }, 4000 + Math.random() * 3000);

        return () => clearInterval(interval);
    }, []);

    const typeStyles = {
        success: 'text-green-400',
        warning: 'text-yellow-400',
        error: 'text-red-400',
        info: 'text-blue-400',
    };

    const typeIcons = {
        success: '✓',
        warning: '⚠',
        error: '✗',
        info: '›',
    };

    return (
        <div className="bg-[#0a0f1a] rounded-xl border border-gray-800 overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900/80 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs font-mono text-gray-500 ml-2">shield-v2@security-feed:~</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-green-400">LIVE</span>
                </div>
            </div>

            {/* Feed Content */}
            <div ref={feedRef} className="p-4 h-64 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-hide">
                {events.map(event => (
                    <div key={event.id} className="flex gap-2 leading-relaxed">
                        <span className="text-gray-600 shrink-0">{event.time}</span>
                        <span className={`shrink-0 ${typeStyles[event.type]}`}>{typeIcons[event.type]}</span>
                        <span className={typeStyles[event.type]}>{event.message}</span>
                    </div>
                ))}
                <div className="text-gray-700 animate-pulse">█</div>
            </div>
        </div>
    );
}

// ─── Emergency Kill Switch ─────────────────────────────────────

function EmergencyKillSwitch({ licenseId, domain, currentStatus, onToggle }: {
    licenseId: string;
    domain: string;
    currentStatus: string;
    onToggle: (id: string, status: string) => void;
}) {
    const [isArmed, setIsArmed] = useState(false);
    const isActive = currentStatus === 'ACTIVE';

    const handleKill = () => {
        if (!isArmed) {
            setIsArmed(true);
            return;
        }
        onToggle(licenseId, currentStatus);
        setIsArmed(false);
    };

    return (
        <div className={`p-4 rounded-xl border transition-all duration-300 ${isArmed
                ? 'bg-red-950/50 border-red-500/50 shadow-lg shadow-red-500/10'
                : isActive
                    ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                    : 'bg-red-950/30 border-red-900/50'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                    <div>
                        <div className="text-sm font-bold text-white truncate max-w-[150px]">{domain}</div>
                        <div className={`text-[10px] font-mono ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                            {isActive ? 'OPERATIONAL' : 'SUSPENDED'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleKill}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-300 ${isArmed
                            ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-lg shadow-red-600/30'
                            : isActive
                                ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50'
                                : 'bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-900/50'
                        }`}
                >
                    <Power className="w-3.5 h-3.5" />
                    {isArmed ? 'CONFIRM KILL' : isActive ? 'SUSPEND' : 'ACTIVATE'}
                </button>
            </div>

            {isArmed && (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-red-400 font-mono animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    ARMED — Click again to confirm immediate suspension
                </div>
            )}
        </div>
    );
}

// ─── Main Export — SecurityCommandCenter ───────────────────────

interface LicenseData {
    id: string;
    domain: string;
    status: string;
    lastChecked: string | null;
}

export function SecurityCommandCenter({ licenses }: { licenses: LicenseData[] }) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Compute security scores
    const scoredLicenses = licenses.map(l => ({
        ...l,
        score: l.status === 'ACTIVE'
            ? (l.lastChecked && (Date.now() - new Date(l.lastChecked).getTime()) < 5 * 60 * 1000 ? 98 : 85)
            : l.status === 'TAMPERED' ? 12 : l.status === 'SUSPENDED' ? 35 : 60,
    }));

    // Initial feed events
    const initialEvents: FeedEvent[] = [
        { id: '1', time: timeStr, message: 'Shield v2 Command Center initialized.', type: 'info' },
        { id: '2', time: timeStr, message: `Monitoring ${licenses.length} active license(s).`, type: 'info' },
        ...licenses.slice(0, 3).map((l, i) => ({
            id: `init-${i}`,
            time: timeStr,
            message: `Validating ${l.domain}... ${l.status === 'ACTIVE' ? 'Success.' : `Status: ${l.status}`}`,
            type: (l.status === 'ACTIVE' ? 'success' : 'warning') as FeedEvent['type'],
        })),
    ];

    const handleToggle = async (id: string, currentStatus: string) => {
        // This would call the server action — for now it refreshes
        const form = document.createElement('form');
        form.style.display = 'none';
        form.method = 'POST';
        form.action = `/api/license/toggle?id=${id}&status=${currentStatus}`;
        document.body.appendChild(form);
        // In real implementation, call toggleStatus server action
        window.location.reload();
    };

    return (
        <div className="space-y-6 mt-4">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Security Command Center</h2>
                    <p className="text-xs text-gray-500">Shield v2 — Real-time monitoring & threat response</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Security Score Meters */}
                <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" /> Security Scores
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {scoredLicenses.slice(0, 6).map(l => (
                            <SecurityScoreMeter key={l.id} domain={l.domain} score={l.score} status={l.status} />
                        ))}
                    </div>
                </div>

                {/* Center: Live Feed */}
                <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5" /> Live Security Feed
                    </h3>
                    <LiveSecurityFeed initialEvents={initialEvents} />
                </div>

                {/* Right: Kill Switches */}
                <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Power className="w-3.5 h-3.5 text-red-500" /> Emergency Kill Switch
                    </h3>
                    <div className="space-y-3">
                        {licenses.slice(0, 5).map(l => (
                            <EmergencyKillSwitch
                                key={l.id}
                                licenseId={l.id}
                                domain={l.domain}
                                currentStatus={l.status}
                                onToggle={handleToggle}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
