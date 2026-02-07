'use client';

import { useEffect, useCallback } from 'react';
import { logout } from '@/lib/actions/auth';

const TIMEOUT_MS = 600000; // 10 minutes

export function AutoLogout() {
    const handleLogout = useCallback(() => {
        console.log('User inactive, logging out...');
        logout();
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(handleLogout, TIMEOUT_MS);
        };

        // Initial timer
        resetTimer();

        // Event listeners
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [handleLogout]);

    return null; // This component handles side effects only
}
