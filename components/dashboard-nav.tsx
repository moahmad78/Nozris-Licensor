'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Inbox, Settings, LogOut, PlusCircle, Trash2, Code2, User, ShieldAlert, UserCheck, LifeBuoy, ShieldCheck } from 'lucide-react';

export function DashboardNav({ pendingCount = 0 }: { pendingCount?: number }) {
    const pathname = usePathname();

    const links = [
        { href: '/admin/dashboard', label: 'Everything Dashboard', icon: Home },
        { href: '/admin/support-center', label: 'Support Command', icon: LifeBuoy },
        { href: '/dashboard', label: 'Licenses', icon: ShieldCheck },
        { href: '/dashboard/create', label: 'Create License', icon: PlusCircle },
        { href: '/dashboard/requests', label: 'Requests', icon: Inbox, badge: pendingCount },
        { href: '/dashboard/leads', label: 'Leads / Verification', icon: UserCheck },
        { href: '/dashboard/announcements', label: 'Announcements', icon: ShieldAlert },
        { href: '/dashboard/integration', label: 'Integration', icon: Code2 },
        { href: '/dashboard/security', label: 'Security / Alerts', icon: ShieldAlert },
        { href: '/dashboard/profile', label: 'Profile Settings', icon: User },
        { href: '/dashboard/bin', label: 'Recycle Bin', icon: Trash2 },
    ];

    return (
        <nav className="space-y-1">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            {link.label}
                        </div>
                        {link.badge ? (
                            link.badge > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                    {link.badge}
                                </span>
                            )
                        ) : null}
                    </Link>
                );
            })}
        </nav>
    );
}
