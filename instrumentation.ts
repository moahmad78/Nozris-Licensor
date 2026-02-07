export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { scheduleReminders } = await import('@/lib/cron-task');
        // Run once on server startup to initialize the schedule
        scheduleReminders();
    }
}
