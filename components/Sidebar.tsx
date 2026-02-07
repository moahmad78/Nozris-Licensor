'use client';

import React from 'react';
import Link from 'next/link';
import {
    Activity, ShieldAlert, Key, Zap, User, Lock, LogOut, Scale
} from 'lucide-react';

export function Sidebar() {
    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col p-8 bg-black text-white border-r border-white/5">

                <Link
                    prefetch={true}
                    href="/admin/profile"
                    className="flex items-center gap-4 group p-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white hover:text-black transition-all mb-12"
                >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-500">Master Admin</p>
                        <p className="text-sm font-black italic">Licensr Admin</p>
                    </div>
                </Link>

                <nav className="flex-1 space-y-2">
                    {[
                        { label: 'Intelligence', icon: Activity, href: '/admin/dashboard' },
                        { label: 'Guard Post', icon: ShieldAlert, href: '/admin/security' },
                        { label: 'License Hub', icon: Key, href: '/admin/licenses' },
                        { label: 'Legal Manager', icon: Scale, href: '/admin/legal' },
                        { label: 'Maintenance', icon: Zap, href: '/admin/settings' }
                    ].map((item) => (
                        <Link
                            key={item.label}
                            prefetch={true}
                            href={item.href}
                            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-white/10 hover:text-white transition-all group"
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-white/10">
                    <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all">
                        <LogOut className="w-4 h-4 inline-block mr-2" />
                        Logout
                    </button>
                </div>
            </div>
            );
}
