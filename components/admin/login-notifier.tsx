'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { getLicenseStats } from '@/app/actions/license-actions';
import { pusherClient } from '@/lib/pusher-client';

export function LoginNotifier() {
    useEffect(() => {
        // 1. Initial Load Alert (Standardized)
        async function checkAlerts() {
            const stats = await getLicenseStats();
            if (stats.expiredTodayCount > 0) {
                toast.error(`Alert: ${stats.expiredTodayCount} Licenses expired today!`, {
                    description: "Review them in the License Command Hub.",
                    duration: 10000,
                    action: {
                        label: 'View',
                        onClick: () => window.location.href = '/admin/licenses?filter=expired'
                    }
                });
            }

            if (stats.expiringSoon > 0) {
                toast.warning(`${stats.expiringSoon} Licenses expiring within 7 days.`, {
                    description: "Consider sending manual reminders to clients.",
                    duration: 5000
                });
            }
        }

        // 2. Real-Time Security Alert (Zero-Refresh)
        const channel = pusherClient.subscribe('admin-notifications');
        channel.bind('ip-banned', (data: { ip: string, reason: string }) => {
            toast.error("🚨 SECURITY ALERT: IP BANNED", {
                description: `IP ${data.ip} was automatically blocked for: ${data.reason}`,
                duration: 10000,
                action: {
                    label: 'Go to Security',
                    onClick: () => window.location.href = '/dashboard/security'
                }
            });
        });

        if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/dashboard')) {
            checkAlerts();
        }

        return () => {
            pusherClient.unsubscribe('admin-notifications');
        };
    }, []);

    return null;
}
