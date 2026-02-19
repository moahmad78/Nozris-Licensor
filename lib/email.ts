import nodemailer from 'nodemailer';

export async function sendAdminNotification(userEmail: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"Nozris Security" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // Sending to admin (self)
        subject: 'New User Registration Alert - Nozris',
        text: `A new user registered with email: ${userEmail}. Please check Nozris database to approve.`,
        html: `<p>A new user registered with email: <strong>${userEmail}</strong>. Please check Nozris database to approve.</p>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Admin notification sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export const sendEmail = async (to: string, subject: string, html: string, attachments?: any[]) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: `"Nozris Security" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        });
        return true;
    } catch (error) {
        console.error("Generic email send failed details:", {
            message: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            errorObject: error
        });
        return false;
    }
};
