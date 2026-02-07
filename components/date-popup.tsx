"use client";
import { useState } from "react";

export function DatePopup({ date }: { date: Date | string }) {
    const [isOpen, setIsOpen] = useState(false);

    const d = new Date(date || Date.now());
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = d.toLocaleString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div
            className="relative inline-block cursor-help"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Text - REMOVED "Updated:" prefix */}
            <span className="text-xs text-muted-foreground hover:text-blue-500 underline decoration-dotted transition-colors">
                {dateStr}
            </span>

            {/* The Popup Bubble */}
            {isOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-max animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl relative">
                        <div className="font-semibold mb-0.5 text-blue-200">Exact Timestamp</div>
                        <div>{timeStr}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
