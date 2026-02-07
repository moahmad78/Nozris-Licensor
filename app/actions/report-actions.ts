'use server';

import { prisma } from '@/lib/prisma';
import { getClientLicenseDetails } from './client-integration';

export async function getMonthlyReport() {
    // 1. Identify Client
    const meta = await getClientLicenseDetails();
    if (!meta || meta.key === 'NO_LICENSE_FOUND') return null;

    // 2. Mock/Aggregation Logic
    // In a real scenario, we would aggregate `ActivityLog` for the current month.
    // For this demo, we'll return dynamic but simulated "Live" stats or fetch from the new model if exists.

    // Check if we have a generated report for this month
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    // We'd use client email, but here we mostly have key/domain. 
    // Let's assume we find the license and get the email.

    const license = await prisma.license.findUnique({ where: { licenseKey: meta.key } });
    if (!license) return null;

    let report = await prisma.securityReport.findUnique({
        where: {
            clientEmail_month: {
                clientEmail: license.clientEmail,
                month: currentMonth
            }
        }
    });

    if (!report) {
        // Auto-generate/upsert a "Live" report entry
        report = await prisma.securityReport.create({
            data: {
                clientEmail: license.clientEmail,
                month: currentMonth,
                blockedIPs: Math.floor(Math.random() * 50) + 120, // Simulated "Live" data
                tamperAttempts: Math.floor(Math.random() * 5),
                uptime: 99.99
            }
        });
    }

    return report;
}
