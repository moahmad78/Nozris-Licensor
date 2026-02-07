'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'active' | 'expired' | 'pending' | 'warning' | 'error';
}

export function Badge({ children, variant = 'pending', className, ...props }: BadgeProps) {
    const variants = {
        active: "bg-[#22c55e] text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        expired: "bg-[#ef4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        pending: "bg-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        warning: "bg-[#f59e0b] text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]",
        error: "bg-black text-white"
    };

    return (
        <div
            className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-[1000] uppercase tracking-[0.2em] italic inline-flex items-center justify-center border-2 border-white/10",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
