'use client';

import { useEffect, useState } from 'react';
import { blockAttackerIP } from '@/app/actions/security';
import { ShieldAlert, Lock, AlertTriangle } from 'lucide-react';

export default function DevToolsGuard() {
    const [triggered, setTriggered] = useState(false);

    useEffect(() => {
        const handleViolation = async (type: string) => {
            if (triggered) return;
            setTriggered(true);

            // Trigger server blocking
            await blockAttackerIP(`DevTools detected: ${type}`);

            // Freeze UI intentionally
            document.body.innerHTML = '';
            document.body.style.backgroundColor = '#000';
            document.body.style.overflow = 'hidden';

            // Create lock screen manually since React tree might be unstable if we nuke body
            const lockScreen = document.createElement('div');
            lockScreen.style.position = 'fixed';
            lockScreen.style.inset = '0';
            lockScreen.style.zIndex = '999999';
            lockScreen.style.display = 'flex';
            lockScreen.style.flexDirection = 'column';
            lockScreen.style.alignItems = 'center';
            lockScreen.style.justifyContent = 'center';
            lockScreen.style.backgroundColor = 'black';
            lockScreen.style.color = 'red';
            lockScreen.style.fontFamily = 'monospace';

            lockScreen.innerHTML = `
                <div style="text-align: center; animation: pulse 1s infinite;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 20px;">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <h1 style="font-size: 2rem; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 5px;">Security Violation</h1>
                    <p style="color: #666;">Neural Shield Triggered. Your IP has been logged.</p>
                </div>
            `;

            document.body.appendChild(lockScreen);
        };

        // 1. Key Combination Trap
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                handleViolation('F12 Key');
            }
            // Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                handleViolation('Ctrl+Shift+I');
            }
            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                handleViolation('Ctrl+Shift+J');
            }
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                handleViolation('View Source');
            }
        };

        // 2. Right Click Trap
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            handleViolation('Right Click');
        };

        // 3. Resize Trap (Detects DevTools docking efficiently)
        // Note: This can be sensitive to normal resizing, so usually we check inner vs outer width threshold
        // We'll skip aggressive resize check for now to avoid false positives on simple window snaps,
        // but keep the listener ready if needed.

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    if (triggered) return null; // Component effectively unmounts self visually, replaced by DOM manipulation

    return null; // Invisible guard
}
