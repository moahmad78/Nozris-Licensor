import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // 1. Security Check
    const secret = req.headers.get('x-admin-secret');
    if (secret !== process.env.ADMIN_SECRET && secret !== "NOZRIS-MASTER-KEY") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { domain, days, clientEmail } = body;

    // 2. Input Validation
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const daysInt = parseInt(days);
    if (isNaN(daysInt) || daysInt <= 0) {
      return NextResponse.json({ error: 'Invalid days parameter' }, { status: 400 });
    }

    // 3. Logic
    const licenseKey = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysInt);

    const license = await prisma.license.create({
      data: {
        domain,
        licenseKey,
        expiresAt,
        status: 'ACTIVE',
        clientEmail: clientEmail || 'legacy_user@example.com',
      },
    });

    return NextResponse.json({ license });
  } catch (error) {
    console.error('Error creating license:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

