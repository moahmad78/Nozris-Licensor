import nodemailer from 'nodemailer';

export async function sendOTPEmail(email: string, otp: string) {
    // NOTE: In a real production app, configure these with actual SMTP settings
    // For Mohd Ahmad, we will use a dedicated security mailer
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    });

    const mailOptions = {
        from: '"Licensr Security" <security@licensr.com>',
        to: email,
        subject: 'MANDATORY: 2FA Verification Code',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                <h1 style="color: #000; text-transform: uppercase; letter-spacing: -1px; text-align: center;">Security Verification</h1>
                <p style="text-align: center; color: #666;">A login attempt was made to your Licensr Admin account.</p>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #000;">${otp}</span>
                </div>
                <p style="text-align: center; font-size: 12px; color: #999;">This code expires in 5 minutes. If you did not request this, SECURE YOUR ACCOUNT IMMEDIATELY.</p>
                <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #ccc; text-transform: uppercase; letter-spacing: 2px;">
                    Proprietary Guard System by Voomit
                </div>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
}
