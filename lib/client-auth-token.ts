import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-me';

// Helper to sign token (HS256-ish)
export function signToken(payload: any) {
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(data)
        .digest('base64url');
    return `${data}.${signature}`;
}

// Helper to verify token
export function verifyToken(token: string) {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expectedSignature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(data)
        .digest('base64url');

    if (expectedSignature !== signature) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString());
}
