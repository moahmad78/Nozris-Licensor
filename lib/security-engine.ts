import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { z } from 'zod';

// Military-Grade Security Secret
const SECURITY_SECRET = process.env.SECURITY_SECRET || 'fallback-secret-for-signing';

// --- RECOVERY ENGINE (THE HEALER) ---

export async function restoreSystem(licenseKey: string) {
    // 1. Fetch Clean Snapshot
    const license = await prisma.license.findUnique({
        where: { licenseKey }
    });

    if (!license || !license.cleanSnapshot) {
        throw new Error("RECOVERY_FAILED_NO_SNAPSHOT");
    }

    // 2. Broadcast Restore Signal
    // This pushes the clean code payload back to the client
    await pusherServer.trigger(`license-${licenseKey}`, 'system-restore', {
        status: 'RESTORING',
        payload: license.cleanSnapshot,
        timestamp: new Date().toISOString(),
        message: 'System Repair Initiated. Overwriting corrupted sectors.'
    });

    return { status: 'RESTORED' };
}

// --- POISON / KILL-SWITCH LOGIC ---

export function IntegrityCheck(currentHash: string, expectedHash: string) {
    if (currentHash !== expectedHash) {
        return systemCrash();
    }
    return { status: 'SECURE' };
}

export function systemCrash() {
    const chaosStyles = `
        body { pointer-events: none !important; filter: invert(1) !important; overflow: hidden !important; }
        * { cursor: not-allowed !important; user-select: none !important; transform: rotate(1deg) !important; }
        img, video { opacity: 0.1 !important; filter: blur(10px) !important; }
        div::after { content: "THEFT DETECTED - SYSTEM CORRUPTED"; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: red; z-index: 99999; display: flex; align-items: center; justify-content: center; font-size: 5vw; font-weight: bold; color: white; opacity: 0.9; }
    `;

    return {
        status: 'CRITICAL_FAILURE',
        poison: chaosStyles,
        action: 'HALT_EXECUTION'
    };
}

// --- VPN / PROXY DETECTION ---
const VPN_IP_RANGES = [
    '1.1.1.1', '8.8.8.8',
    '203.0.113.0/24'
];

export async function detectVPN(req: Request): Promise<{ isVPN: boolean; reason?: string }> {
    const headers = req.headers;

    if (headers.get('via') || headers.get('x-forwarded-for')) {
        return { isVPN: true, reason: 'Proxy Header Detected via/x-forwarded-for' };
    }

    return { isVPN: false };
}

export async function checkGlobalBlacklist(ip: string): Promise<boolean> {
    const hiddenThreat = await prisma.globalBlacklist.findUnique({
        where: { ipAddress: ip }
    });
    return !!hiddenThreat;
}

// --- TRAP LOGIC ---

export async function captureHackerIdentity(req: Request, domain: string) {
    const ip = req.headers.get('x-forwarded-for') || 'Unknown IP';
    const userAgent = req.headers.get('user-agent') || 'Unknown UA';
    const referer = req.headers.get('referer') || 'Direct Access';

    if (await checkGlobalBlacklist(ip)) {
        throw new Error("GLOBAL_BAN_ACTIVE");
    }
    const vpnCheck = await detectVPN(req);
    if (vpnCheck.isVPN) {
        await prisma.blockedIP.create({
            data: {
                ipAddress: ip,
                reason: `VPN/Proxy Blocked: ${vpnCheck.reason}`,
                attempts: 1,
                isBlocked: true,
                userAgent: userAgent
            }
        });
        throw new Error("Access Denied: VPN/Proxy Detected.");
    }

    const geo = {
        isp: "Unknown ISP",
        country: "Unknown",
        city: "Unknown",
        lat: 0,
        lon: 0
    };

    const forensicRecord = await prisma.blockedIP.upsert({
        where: { ipAddress: ip as string },
        update: {
            attempts: { increment: 1 },
            reason: `Unauthorized Access to ${domain}`,
            userAgent: userAgent,
            location: `${geo.city}, ${geo.country}`,
            isp: geo.isp,
            updatedAt: new Date()
        },
        create: {
            ipAddress: ip as string,
            reason: `Unauthorized Access to ${domain}`,
            attempts: 1,
            isBlocked: true,
            userAgent: userAgent,
            location: `${geo.city}, ${geo.country}`,
            isp: geo.isp,
            evidenceUrl: referer
        }
    });

    await pusherServer.trigger('admin-notifications', 'hacker-detected', {
        ip,
        domain,
        location: `${geo.city}, ${geo.country}`,
        isp: geo.isp,
        timestamp: new Date().toISOString()
    });

    return forensicRecord;
}

export function validateDomain(
    requestDomain: string,
    authorizedDomain: string,
    stagingDomain?: string | null,
    devModeUntil?: Date | null
): boolean {
    const whitelist = ['localhost', '127.0.0.1', '.local', '.test'];

    if (whitelist.some(d => requestDomain.includes(d))) return true;
    if (devModeUntil && new Date() < devModeUntil) return true;
    if (stagingDomain && requestDomain === stagingDomain) return true;

    const isValid = requestDomain === authorizedDomain;

    if (!isValid) {
        return false;
    }

    return true;
}

export async function checkIPStatus(ip: string) {
    const record = await prisma.blockedIP.findUnique({
        where: { ipAddress: ip }
    });
    return {
        isBlocked: record?.isBlocked || false,
        attempts: record?.attempts || 0
    };
}
