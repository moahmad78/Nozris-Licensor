import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Secret Access Gate: If hitting the secret URL, set a "Stealth Cookie" and let it pass
    if (pathname === '/shield-access-vault') {
        const response = NextResponse.next();
        // Set a cookie that expires in 24 hours to allow access to the dashboard area
        response.cookies.set('licensr_stealth_access', 'enabled', {
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
        pathname.startsWith('/login') ||
        pathname.startsWith('/client');

    if (isProtectedPath) {
        // Check for the Secret Stealth Cookie
        const hasStealthAccess = request.cookies.get('licensr_stealth_access');

        if (!hasStealthAccess) {
            // Return 404 to mimic the page doesn't exist
            return new NextResponse(null, { status: 404 });
        }

        // Secondary layer: Standard authentication for those who passed the stealth gate
        const sessionToken = request.cookies.get('authjs.session-token') ||
            request.cookies.get('__Secure-authjs.session-token') ||
            request.cookies.get('next-auth.session-token') ||
            request.cookies.get('__Secure-next-auth.session-token') ||
            request.cookies.get('client_session');

        // Only redirect to login IF we are not already on a login page and have no session
        if (!sessionToken && !pathname.includes('/login') && !pathname.includes('/shield-access-vault')) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
