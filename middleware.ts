import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 0. IMMEDIATE SECURITY CHECKS (Kill Switch & Geofence)

    // Check for Global Lockdown
    const siteStatus = request.cookies.get('site_status')?.value;
    if (siteStatus === 'LOCKED' && !pathname.startsWith('/client/dashboard/settings')) { // Allow admin/owner to unlock potentially (or hard block everything)
        // For now, hard block public access
        if (!pathname.startsWith('/api/unlock')) {
            return new NextResponse('<h1>🛑 SITE LOCKED BY ADMINISTRATOR via Nozris Neural Shield</h1>', {
                status: 403,
                headers: { 'Content-Type': 'text/html' }
            });
        }
    }

    // Check for Geofence (Blacklisted Countries)
    // Vercel/Next.js provides geo info in request.geo or headers
    const country = (request as any).geo?.country || request.headers.get('x-vercel-ip-country') || 'Unknown';
    const BLACKLISTED_COUNTRIES = ['RU', 'CN', 'KP']; // Example high-risk list
    if (BLACKLISTED_COUNTRIES.includes(country)) {
        return new NextResponse('<h1>🚫 Access Denied: Region Blocked by Nozris Shield</h1>', {
            status: 403,
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // 1. Secret Access Gate: If hitting the secret URL, set a "Stealth Cookie" and let it pass
    if (pathname === '/shield-access-vault') {
        const response = NextResponse.next();
        // Set a cookie that expires in 24 hours to allow access to the dashboard area
        response.cookies.set('nozris_stealth_access', 'enabled', {
            path: '/',
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24, // 24 hours
        });
        return response;
    }

    // 2. The Stealth Shield: Protect Dashboard/Admin/Login from public view
    const isProtectedPath = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        (pathname.startsWith('/client') && !pathname.includes('/client/kyc-upload')); // Allow KYC upload to be public-ish or handled separately

    if (isProtectedPath) {
        const isClientPath = pathname.startsWith('/client');
        const isAdminPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

        // Check for the Secret Stealth Cookie (Admins only)
        const hasStealthAccess = request.cookies.get('nozris_stealth_access');
        const isDev = process.env.NODE_ENV === 'development';

        if (isAdminPath && !hasStealthAccess && !isDev) {
            // Dev Mode Bypass: If specifically requested via dev-bypass query (insecure but requested) or just relying on isDev.
            // User requested: "access /dashboard locally without the stealth cookie"
            // The !isDev check above SHOULD allow it if NODE_ENV is development.
            // Let's make it explicit:
            const isLocal = request.headers.get('host')?.includes('localhost');
            if (!isLocal) {
                // Return 404 to mimic the page doesn't exist for unauthorized admin attempts (production)
                return new NextResponse(null, { status: 404 });
            }
        }

        // For CLIENT routes: must have client_session cookie
        if (isClientPath) {
            const clientSession = request.cookies.get('client_session');
            if (!clientSession && !pathname.includes('/login') && !pathname.includes('/shield-access-vault')) {
                const loginUrl = new URL('/', request.url);
                loginUrl.searchParams.set('login', 'true');
                loginUrl.searchParams.set('callbackUrl', pathname);
                return NextResponse.redirect(loginUrl);
            }
        }

        // For ADMIN routes that passed stealth: check for admin session
        if (isAdminPath && hasStealthAccess) {
            const sessionToken = request.cookies.get('authjs.session-token') ||
                request.cookies.get('__Secure-authjs.session-token') ||
                request.cookies.get('next-auth.session-token') ||
                request.cookies.get('__Secure-next-auth.session-token');

            if (!sessionToken && !pathname.includes('/login') && !pathname.includes('/shield-access-vault')) {
                const loginUrl = new URL('/', request.url);
                loginUrl.searchParams.set('login', 'true');
                loginUrl.searchParams.set('callbackUrl', pathname);
                return NextResponse.redirect(loginUrl);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
