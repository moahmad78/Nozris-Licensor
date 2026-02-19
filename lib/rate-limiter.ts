/**
 * Rate Limiter — In-memory sliding window per IP
 * Protects API routes from DDoS and brute-force attacks.
 * 
 * Usage:
 *   import { rateLimiter } from '@/lib/rate-limiter';
 *   const limiter = rateLimiter.check(ip);
 *   if (!limiter.allowed) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.resetAt) store.delete(key);
    }
}, 5 * 60 * 1000);

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;     // 20 requests per minute

export const rateLimiter = {
    /**
     * Check if an IP is within rate limits.
     * Returns { allowed, remaining, resetAt }
     */
    check(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
        const now = Date.now();
        const entry = store.get(ip);

        if (!entry || now > entry.resetAt) {
            // New window
            store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
            return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
        }

        entry.count++;
        store.set(ip, entry);

        if (entry.count > MAX_REQUESTS) {
            return { allowed: false, remaining: 0, resetAt: entry.resetAt };
        }

        return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt };
    },

    /**
     * Get rate limit headers for the response.
     */
    headers(result: { remaining: number; resetAt: number }): Record<string, string> {
        return {
            'X-RateLimit-Limit': String(MAX_REQUESTS),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        };
    }
};
