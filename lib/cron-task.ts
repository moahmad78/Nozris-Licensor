import cron from 'node-cron';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getRenewalEmailTemplate } from '@/lib/email-templates';

let isJobScheduled = false;

export function scheduleReminders() {
    if (isJobScheduled) {
        console.log("Cron job already scheduled, skipping.");
        return;
    }

    console.log("Initializing Reminder Cron Job (Daily at 10 AM)...");

    // Run every day at 10:00 AM
    cron.schedule('0 10 * * *', async () => {
        console.log("Running Daily License Expiry Check...");
        await checkAndSendReminders();
    });

    // Dev only: Run immediately for testing
    if (process.env.NODE_ENV === 'development') {
        console.log("Dev Mode: Running immediate check...");
        checkAndSendReminders(); // Fire and forget
    }

    isJobScheduled = true;
}

async function checkAndSendReminders() {
    try {
        const today = new Date();

        // Fetch ACTIVE licenses
        const licenses = await prisma.license.findMany({
            where: { status: 'ACTIVE' }
        });

        // Get Profile
        const profile = await prisma.profile.findFirst();
        if (!profile) {
            console.error("No profile found.");
            return;
        }

        const profileData = {
            fullName: profile.fullName,
            contactNumber: profile.contactNumber,
            supportEmail: profile.supportEmail,
            logo: profile.logo,
            whatsappNumber: profile.whatsappNumber
        };

        // Use configured URL or fallback
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        for (const license of licenses) {
            const expiryDate = new Date(license.expiresAt);
            const timeDiff = expiryDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // Check Logic: 5 days or 1 day
            let shouldSend = false;
            // Using slightly fuzzy matching to catch it if cron runs slightly off (e.g. 4.9 days)
            if (daysLeft === 5) shouldSend = true;
            if (daysLeft === 1) shouldSend = true;

            if (shouldSend) {
                console.log(`Sending reminder for ${license.domain} (${daysLeft} days left)`);

                // Construct renewal link
                const renewalLink = `${appUrl}/renew?key=${license.licenseKey}`;

                const html = getRenewalEmailTemplate(
                    license.domain,
                    daysLeft,
                    renewalLink,
                    {
                        planName: license.planName,
                        price: license.monthlyPrice,
                        startDate: license.validFrom,
                        expiryDate: license.expiresAt
                    },
                    profileData
                );

                const success = await sendEmail(
                    license.clientEmail,
                    `Action Required: License Expiring in ${daysLeft} Days`,
                    html
                );

                if (success) {
                    await prisma.license.update({
                        where: { id: license.id },
                        data: { reminderSent: true } // Mark as sent (though ideally we track last sent date to differentiate 5-day from 1-day)
                    });
                    console.log(`Email sent to ${license.clientEmail}`);
                }
            }
        }
    } catch (error) {
        console.error("Error in cron job:", error);
    }
}
