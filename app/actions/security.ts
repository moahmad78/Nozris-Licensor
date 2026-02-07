'use server';

import { pusherServer } from '@/lib/pusher';
import { prisma } from '@/lib/prisma';

export async function toggleEditMode(
    enabled: boolean,
    isUnlimited: boolean = false,
    customMinutes: number = 60,
    userEmail: string = "System Admin" // Defaulting to Admin for now
) {
    try {
        const expiryDate = enabled && !isUnlimited
            ? new Date(Date.now() + customMinutes * 60 * 1000)
            : null;

        const durationText = isUnlimited ? "Unlimited" : `${customMinutes}m`;
        const actionDescription = `Edit Mode ${enabled ? 'ENABLED' : 'DISABLED'} | Mode: ${isUnlimited ? 'Unlimited' : 'Timer'} (${customMinutes}m) | By: ${userEmail}`;

        // Update First License found (or specific logic if we had ID)
        // Using updateMany to be safe as we don't have ID, updating ALL for demo/single-tenant
        // In production this should be specific.
        await prisma.license.updateMany({
            data: {
                editMode: enabled,
                editModeExpiry: expiryDate,
                isUnlimited: isUnlimited,
                lastEditBy: userEmail,
                lastEditAt: new Date(),
                lastEditDuration: durationText,
            }
        });

        // Create Activity Log
        await prisma.activityLog.create({
            data: {
                type: 'SECURITY',
                action: enabled ? 'EDIT_MODE_ON' : 'EDIT_MODE_OFF',
                message: actionDescription,
                clientEmail: userEmail, // Assuming admin is tracking this
            }
        });

        // Broadcast event
        await pusherServer.trigger('security-channel', 'TIMER_UPDATED', {
            isEditMode: enabled,
            isUnlimited: isUnlimited,
            expiry: expiryDate?.toISOString(),
            timestamp: new Date().toISOString(),
            triggeredBy: userEmail
        });

        return {
            success: true,
            message: actionDescription,
            data: { enabled, isUnlimited, expiry: expiryDate }
        };
    } catch (error) {
        console.error("Failed to update protection:", error);
        return { success: false, message: "Failed to update protection status" };
    }
}

// Alias for compatibility if needed by frontend, or just update frontend to use toggleEditMode
// Since I have access to write, I should probably check if I can rename everywhere, 
// BUT integrity manager imports `updateProtectionStatus`.
// To adhere to "STRICT ATOMIC ACTION" I will export this alias or just the function itself.
export const updateProtectionStatus = toggleEditMode;

export async function getBlockedIPs() {
    try {
        return await prisma.blockedIP.findMany({
            where: { isBlocked: true },
            orderBy: { updatedAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching blocked IPs:", error);
        return [];
    }
}

export async function unblockIP(ipAddress: string) {
    try {
        await prisma.blockedIP.update({
            where: { ipAddress },
            data: { isBlocked: false, attempts: 0 }
        });

        await pusherServer.trigger('admin-stats', 'update', {
            type: 'SECURITY_ALERT',
            message: `IP Unblocked: ${ipAddress}`
        });

        return { success: true };
    } catch (error) {
        console.error("Error unblocking IP:", error);
        return { success: false, error: 'Failed to unblock IP' };
    }
}
