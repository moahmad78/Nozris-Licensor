'use client';

import { useState, useEffect } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

interface ExpiryTimerProps {
    expiryDate: string | Date;
    label?: string;
}

export function ExpiryTimer({ expiryDate, label = "Time Remaining" }: ExpiryTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isExpired: boolean;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

    useEffect(() => {
        const target = new Date(expiryDate).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                setTimeLeft(prev => ({ ...prev, isExpired: true }));
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
                isExpired: false
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    if (timeLeft.isExpired) {
        return (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100 font-bold text-xs uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4" />
                EXPIRED / SYSTEM LOCKED
            </div>
        );
    }

    const isCritical = timeLeft.days < 3;

    return (
        <div className={`p-4 rounded-2xl border transition-all ${isCritical ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-white border-gray-100 text-gray-900 shadow-sm'
            }`}>
            <div className="flex items-center gap-2 mb-3">
                <Clock className={`w-4 h-4 ${isCritical ? 'text-red-500' : 'text-blue-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black">{timeLeft.days}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Days</span>
                </div>
                <div className="text-gray-200 font-thin text-xl">:</div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Hrs</span>
                </div>
                <div className="text-gray-200 font-thin text-xl">:</div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Min</span>
                </div>
                <div className="text-gray-200 font-thin text-xl">:</div>
                <div className="flex flex-col items-center">
                    <span className="text-xl font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Sec</span>
                </div>
            </div>

            {isCritical && (
                <div className="mt-3 text-[9px] font-black uppercase tracking-widest text-red-500 text-center">
                    CRITICAL: RENEWAL REQUIRED
                </div>
            )}
        </div>
    );
}
