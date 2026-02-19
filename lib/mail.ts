import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

const BASE_STYLES = `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 0;
    border-radius: 8px;
    overflow: hidden;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
`;

const HEADER_STYLES = `
    background-color: #0f172a;
    padding: 24px;
    text-align: center;
`;

const CONTENT_STYLES = `
    padding: 32px 24px;
    color: #334155;
    line-height: 1.6;
`;

const FOOTER_STYLES = `
    background-color: #f8fafc;
    padding: 16px;
    text-align: center;
    font-size: 12px;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
`;

export async function sendOTPEmail(email: string, otp: string) {
    const mailOptions = {
        from: '"Nozris Security" <security@nozris.com>',
        to: email,
        subject: '🔐 Login Verification Code',
        html: `
            <div style="${BASE_STYLES}">
                <div style="${HEADER_STYLES}">
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Nozris Security</h1>
                </div>
                <div style="${CONTENT_STYLES}">
                    <h2 style="margin-top: 0; color: #0f172a; font-size: 18px;">Verify Your Login</h2>
                    <p>A login attempt was detected for your Nozris Admin account. Use the code below to complete the verification:</p>
                    <div style="background: #f1f5f9; padding: 24px; border-radius: 8px; text-align: center; margin: 24px 0; letter-spacing: 8px; font-size: 32px; font-weight: 700; color: #0f172a; border: 1px dashed #cbd5e1;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #64748b;">This code is valid for 5 minutes. If you did not request this, please contact support immediately.</p>
                </div>
                <div style="${FOOTER_STYLES}">
                    &copy; ${new Date().getFullYear()} Nozris Security Systems. All rights reserved.
                </div>
            </div>
        `,
    };
    return await transporter.sendMail(mailOptions);
}

export async function sendExpirationWarning(email: string, domain: string, content: string, daysRemaining: number) {
    const mailOptions = {
        from: '"Nozris Notifications" <updates@nozris.com>',
        to: email,
        subject: `⚠️ License Expiring Soon: ${domain}`,
        html: `
            <div style="${BASE_STYLES}">
                <div style="${HEADER_STYLES}">
                     <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">License Alert</h1>
                </div>
                <div style="${CONTENT_STYLES}">
                    <h2 style="margin-top: 0; color: #b91c1c; font-size: 18px;">Action Required: License Renewal</h2>
                    <p>The license for <strong>${domain}</strong> is scheduled to expire in <strong>${daysRemaining} days</strong>.</p>
                    <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 16px; margin: 20px 0; font-size: 14px; color: #881337;">
                        "To ensure uninterrupted service and security protection, please renew your license before the expiration date."
                    </div>
                    ${daysRemaining <= 1 ? '<p style="font-weight: bold; color: #dc2626;">Warning: Nozris protection will effectively lock your site if the license expires.</p>' : ''}
                    
                    <a href="https://nozris.com/client/dashboard" style="display: block; width: 100%; padding: 16px 0; text-align: center; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 24px;">Renew License Now</a>
                </div>
                <div style="${FOOTER_STYLES}">
                    Reference ID: ${content} <br/>
                    &copy; ${new Date().getFullYear()} Nozris. Automated Alert System.
                </div>
            </div>
        `,
    };
    return await transporter.sendMail(mailOptions);
}

export async function sendSecurityBreachAlert(adminEmail: string, domain: string, details: any) {
    const mailOptions = {
        from: '"Nozris Security" <alert@nozris.com>',
        to: adminEmail,
        subject: `🚨 SECURITY BREACH DETECTED: ${domain}`,
        html: `
            <div style="${BASE_STYLES}">
                <div style="${HEADER_STYLES}; background-color: #7f1d1d;">
                     <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">CRITICAL SECURITY ALERT</h1>
                </div>
                <div style="${CONTENT_STYLES}">
                    <h2 style="margin-top: 0; color: #991b1b; font-size: 18px;">Tamper Event Detected</h2>
                    <p>Nozris Security has detected a critical security violation on <strong>${domain}</strong>.</p>
                    
                    <div style="background-color: #1e293b; color: #10b981; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 12px; margin: 20px 0; overflow-x: auto;">
                        <div style="margin-bottom: 8px;">> TARGET: ${domain}</div>
                        <div style="margin-bottom: 8px;">> TYPE: ${details.type || 'UNKNOWN_TAMPER_EVENT'}</div>
                        <div style="margin-bottom: 8px;">> IP ADDRESS: ${details.ip || 'Unknown'}</div>
                        <div style="margin-bottom: 8px;">> TIMESTAMP: ${new Date().toISOString()}</div>
                        <div style="color: #fca5a5;">> STATUS: TAMPERED (License Locked)</div>
                    </div>

                    <p style="font-size: 14px;">The system has automatically engaged lockdown protocols. Please review the incident report in the command center.</p>

                    <a href="https://nozris.com/dashboard" style="display: block; width: 100%; padding: 16px 0; text-align: center; background-color: #b91c1c; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 24px;">Open Security Command Center</a>
                </div>
                <div style="${FOOTER_STYLES}">
                    Reference: ${details.id || 'N/A'} <br/>
                    &copy; ${new Date().getFullYear()} Nozris Security.
                </div>
            </div>
        `,
    };
    return await transporter.sendMail(mailOptions);
}
