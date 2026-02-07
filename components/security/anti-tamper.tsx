'use client';

import { useEffect, useRef } from 'react';
import { pusherClient } from '@/lib/pusher-client';

export function AntiTamper() {
    const isScriptModified = useRef(false);

    useEffect(() => {
        // 1. Disable Right-Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // 2. Disable Inspection Keys (F12, Ctrl+Shift+I, Ctrl+U, etc.)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'U') ||
                (e.metaKey && e.altKey && e.key === 'I')
            ) {
                e.preventDefault();
                return false;
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        // 3. Heartbeat & DOM Integrity Check
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(async (mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    console.warn("MANDATORY SECURITY ALERT: DOM TAMPER DETECTED");

                    // Trigger Pusher Security Event
                    const { triggerAdminAlert } = await import('@/app/actions/admin-actions');
                    await triggerAdminAlert('security-alert', {
                        type: 'TAMPER_DETECTED',
                        timestamp: new Date().toISOString()
                    });
                }
            });
        });

        observer.observe(document.body, { attributes: true, childList: true, subtree: true });

        // 4. Script Integrity Check (Heartbeat)
        const heartbeatInterval = setInterval(() => {
            if (isScriptModified.current) {
                // Logic to detect if the obfuscated script was replaced
            }
        }, 5000);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            observer.disconnect();
            clearInterval(heartbeatInterval);
        };
    }, []);

    return null;
}
