'use client';

import { useAdminNotifications } from '@/hooks/use-admin-notifications';

export function AdminNotificationListener() {
    useAdminNotifications();
    return null;
}
