'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShieldAlert,
    Key,
    FileText,
    MessageSquare,
    LogOut,
    Activity,
    Lock,
    Settings
} from 'lucide-react';
import { logoutClient } from '@/app/actions/client-auth';

const menuItems = [
    { label: 'Command Center', icon: LayoutDashboard, href: '/client/dashboard' },
    { label: 'Notices', icon: ShieldAlert, href: '/client/dashboard#notices' },
    { label: 'Billing & Deals', icon: Key, href: '/client/dashboard#billing' },
    { label: 'Support Hub', icon: MessageSquare, href: '/client/dashboard#support' },
    { label: 'KYC Center', icon: FileText, href: '/client/kyc-upload' },
    { label: 'Settings', icon: Settings, href: '/client/dashboard/settings' },
];

export function ClientSidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await logoutClient();
        window.location.href = '/';
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col">
            {/* Header */}
            <div className="p-8 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white tracking-widest uppercase text-sm">Nozris</h1>
                        <p className="text-[10px] text-blue-400 font-mono">CLIENT PORTAL</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/client/dashboard');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group ${isActive
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                                : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-gray-600 group-hover:text-white'}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-white/10 bg-black/50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest border border-red-500/20 hover:border-red-500 group"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Terminate Session
                </button>
            </div>

            {/* Status Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-50"></div>
        </aside>
    );
}
