'use client';

import React from 'react';
import Link from 'next/link';
import {
    Code, Terminal, FileJson, Layers, Box, Cpu, Globe, Lock, ShieldCheck,
    Smartphone, Monitor, ShoppingBag, Database, Server, Info
} from 'lucide-react';

export default function PlatformGrid() {
    const platforms = [
        {
            id: 'react-next',
            slug: 'web-security',
            name: 'React / Next.js',
            icon: <Code className="text-cyan-400" size={32} />,
            description: 'Frontend Scrambling',
            detail: 'Client-side assets are obfuscated via polymorphic encryption. We inject an anti-tamper DNA into the webpack chunks.',
            color: 'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400'
        },
        {
            id: 'node-php',
            slug: 'web-security',
            name: 'Node.js / PHP',
            icon: <Server className="text-purple-400" size={32} />,
            description: 'Backend DNA Checksum',
            detail: 'Every server-side request is validated against a rolling DNA-token. Unauthorized controller access triggers a crash.',
            color: 'border-purple-500/30 bg-purple-500/5 hover:border-purple-400'
        },
        {
            id: 'binaries',
            slug: 'universal-protection',
            name: '.EXE / .DMG',
            icon: <Monitor className="text-red-400" size={32} />,
            description: 'Binary Shielding',
            detail: 'Native packages are wrapped in a virtualized V8 layer. Heartbeat checks are mandatory for the entry point to execute.',
            color: 'border-red-500/30 bg-red-500/5 hover:border-red-400'
        },
        {
            id: 'mobile',
            slug: 'mobile-app-shield',
            name: 'iOS / Android',
            icon: <Smartphone className="text-green-400" size={32} />,
            description: 'Bundle ID & Signature Lock',
            detail: 'Verification of signing certificates at runtime. Jailbreak and root attempts result in instant session termination.',
            color: 'border-green-500/30 bg-green-500/5 hover:border-green-400'
        },
        {
            id: 'cms',
            slug: 'universal-protection',
            name: 'WordPress / Shopify',
            icon: <ShoppingBag className="text-orange-400" size={32} />,
            description: 'Theme & Plugin Locking',
            detail: 'Your proprietary logic is moved to our secure CDN. The local theme only contains non-functional skeleton code.',
            color: 'border-orange-500/30 bg-orange-500/5 hover:border-orange-400'
        },
        {
            id: 'python',
            slug: 'universal-protection',
            name: 'Python / AI Models',
            icon: <Terminal className="text-yellow-400" size={32} />,
            description: 'Model Weight Encryption',
            detail: 'Protects .pth and .h5 files. Weights are decrypted in-memory during inference, never touching the disk decrypted.',
            color: 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-400'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((plat) => (
                <Link
                    key={plat.id}
                    href={`/docs/${plat.slug || 'universal-protection'}`}
                    className={`p-6 rounded-2xl border ${plat.color} transition-all group relative overflow-hidden block hover:-translate-y-1 active:scale-95`}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 group-hover:scale-110 transition-transform group-hover:bg-gray-900">
                            {plat.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-white">{plat.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{plat.description}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-300">
                        {plat.detail}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800/50">
                        <span className="text-xs font-bold text-gray-600 group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                            <Info size={12} /> View Detailed Logic
                        </span>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShieldCheck size={16} className="text-white/20" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
