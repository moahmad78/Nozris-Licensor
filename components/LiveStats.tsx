'use client';

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export function LiveStats() {
    const [count, setCount] = useState(8432190);
    const spring = useSpring(count, { mass: 1, stiffness: 100, damping: 20 });
    const display = useTransform(spring, (current: number) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(count);
        const interval = setInterval(() => {
            setCount(c => c + Math.floor(Math.random() * 5));
            spring.set(count + Math.floor(Math.random() * 10));
        }, 2000);
        return () => clearInterval(interval);
    }, [count, spring]);

    return (
        <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]">
            <div className="relative">
                <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50 animate-pulse" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Global Attacks Blocked</span>
                <motion.span className="text-xl font-black text-white tabular-nums tracking-tight font-mono">
                    {display}
                </motion.span>
            </div>
        </div>
    );
}
