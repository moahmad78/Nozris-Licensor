import { NextResponse } from 'next/server';
import { processKYCReminders } from '@/app/actions/kyc-reminders';

// This route can be called by an external cron service
export async function GET(request: Request) {
    // Basic Security: Check for a Cron Secret if needed
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    try {
        const result = await processKYCReminders();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
