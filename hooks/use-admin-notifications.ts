'use client';

import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher-client';
import { toast } from 'sonner';

export function useAdminNotifications() {
    useEffect(() => {
        const channel = pusherClient.subscribe('admin-notifications');

        const playSound = () => {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(e => console.error("Audio playback failed:", e));
        };

        const handleNewTicket = (data: any) => {
            toast.success(`🎫 New Support Ticket: ${data.subject}`, {
                description: `From ${data.clientEmail}. Respond now in Support Center.`,
                duration: 5000,
                action: {
                    label: 'Resolve',
                    onClick: () => window.location.href = `/admin/support-center`
                }
            });
            playSound();
        };

        const handleKYCSubmitted = (data: any) => {
            toast.info(`📝 New KYC Submission`, {
                description: `${data.name} (${data.email}) submitted documents for verification.`,
                duration: 5000,
                action: {
                    label: 'Verify',
                    onClick: () => window.location.href = `/dashboard/kyc`
                }
            });
            playSound();
        };

        const handleSecurityThreat = (data: any) => {
            toast.error(`🚨 Security Alert!`, {
                description: `Suspicious activity detected from IP: ${data.ip}. Domain: ${data.domain}`,
                duration: 8000,
                action: {
                    label: 'Block IP',
                    onClick: () => window.location.href = `/dashboard/security`
                }
            });
            playSound();
        };

        channel.bind('new-ticket', handleNewTicket);
        channel.bind('kyc-submitted', handleKYCSubmitted);
        channel.bind('security-alert', handleSecurityThreat);

        return () => {
            pusherClient.unsubscribe('admin-notifications');
        };
    }, []);
}
