'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Heartbeat() {
    const router = useRouter();

    useEffect(() => {
        const checkLicense = async () => {
            try {
                const res = await fetch('/api/license/verify');
                if (!res.ok) {
                    // If 403/Locked, force redirect
                    if (res.status === 403 || res.status === 423) {
                        window.location.href = '/security/lockdown';
                    }
                }
            } catch (e) {
                console.error("Heartbeat skipped", e);
            }
        };

        // Initial check
        checkLicense();

        // Interval: 10 minutes
        const interval = setInterval(checkLicense, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [router]);

    return null;
}
