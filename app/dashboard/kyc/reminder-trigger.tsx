'use client';

import { useState } from 'react';
import { processKYCReminders } from '@/app/actions/kyc-reminders';
import { Bell, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ReminderTrigger() {
    const [loading, setLoading] = useState(false);
    const [lastSentCount, setLastSentCount] = useState<number | null>(null);

    const handleTrigger = async () => {
        setLoading(true);
        try {
            const res = await processKYCReminders();
            if (res.success) {
                toast.success(`Job successful! Sent ${res.sentCount} reminders.`);
                setLastSentCount(res.sentCount || 0);
            } else {
                toast.error("Failed to run reminder job.");
            }
        } catch (err) {
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {lastSentCount !== null && (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Sent {lastSentCount}
                </span>
            )}
            <button
                onClick={handleTrigger}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Bell className="w-4 h-4" />
                )}
                Run Daily Reminders
            </button>
        </div>
    );
}
