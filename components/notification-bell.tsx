'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { markAllNotificationsAsRead } from '@/app/actions/notification-actions';
import { toast } from 'sonner';
import { pusherClient } from '@/lib/pusher-client';

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: Date;
}

export function NotificationBell({
    initialNotifications,
    unreadCount,
    target
}: {
    initialNotifications: NotificationItem[],
    unreadCount: number,
    target: { email?: string; userId?: string }
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [count, setCount] = useState(unreadCount);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead(target);
            setCount(0);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success("Read all notifications");
        } catch (error) {
            toast.error("Failed to mark read");
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        // Zero-Refresh: Pusher Listener for Notifications
        const channelName = target.email ? `notifications-${target.email.replace(/[@.]/g, '-')}` : null;
        if (channelName) {
            const channel = pusherClient.subscribe(channelName);
            channel.bind('new-notification', (notif: NotificationItem) => {
                setNotifications(prev => [notif, ...prev]);
                setCount(prev => prev + 1);
                toast.info(`New Notification: ${notif.title}`);
            });

            return () => {
                pusherClient.unsubscribe(channelName);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [target.email]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors ${count > 0 ? 'text-gray-900' : 'text-gray-500'}`}
            >
                <Bell className="w-6 h-6" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {count > 0 && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">{count} New</span>}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm flex flex-col items-center">
                                <div className="p-3 bg-gray-50 rounded-full mb-2">
                                    <Bell className="w-5 h-5 text-gray-400" />
                                </div>
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`px-4 py-3 border-b border-gray-50 last:border-0 transition-colors ${!notif.isRead ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <div className={`w-2 h-2 rounded-full ${!notif.isRead ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/50">
                            <button
                                onClick={handleMarkAllRead}
                                className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-bold text-gray-600 hover:text-black hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark all as read
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
