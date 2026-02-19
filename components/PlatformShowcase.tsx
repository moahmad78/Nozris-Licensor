'use client';

import React from 'react';
import { Globe, Smartphone, Gamepad2, ShoppingBag, ArrowRight, Code } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PLATFORMS = [
    {
        id: 'web',
        title: 'Web Apps',
        icon: Globe,
        desc: 'React, Next.js, Node.js',
        link: '/protection/web',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20'
    },
    {
        id: 'mobile',
        title: 'Mobile Apps',
        icon: Smartphone,
        desc: 'iOS, Android, React Native',
        link: '/protection/mobile',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20'
    },
    {
        id: 'game',
        title: 'Games',
        icon: Gamepad2,
        desc: 'Unity, Unreal, C++',
        link: '/protection/game',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20'
    },
    {
        id: 'cms',
        title: 'CMS / E-Com',
        icon: ShoppingBag,
        desc: 'Shopify, WordPress, Magento',
        link: '/protection/cms',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20'
    }
];

export default function PlatformShowcase() {
    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            <div className="w-full px-6 md:px-12 relative z-10">

                {/* HEADLINE */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Protecting Every Link in the Chain <br />
                        <span className="text-slate-500">From Server to User Device.</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Our autonomous agents deploy instantly across your entire stack.
                    </p>
                </div>

                {/* PLATFORM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto">
                    {PLATFORMS.map((platform, idx) => (
                        <Link key={idx} href={platform.link} className="group relative">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className={`h-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:bg-slate-800/60 hover:border-white/10 group-hover:shadow-2xl`}
                            >
                                <div className={`mb-6 p-4 rounded-2xl ${platform.bg} ${platform.color} border ${platform.border} group-hover:scale-110 transition-transform duration-300`}>
                                    <platform.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{platform.title}</h3>
                                <p className="text-slate-400 text-sm mb-6">{platform.desc}</p>

                                <div className={`mt-auto flex items-center gap-2 text-sm font-bold ${platform.color} opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0`}>
                                    View Protocol <ArrowRight size={14} />
                                </div>

                                {/* Hover Glow */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${platform.bg.replace('/10', '/0')} to-transparent opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity pointer-events-none`}></div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* FOOTER SNIPPET */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs">
                        <Code size={14} className="text-blue-500" />
                        <span>{'</> Protecting .exe, .apk, .js, .php, and CMS themes with decentralized DNA monitoring.'}</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
