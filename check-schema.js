
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        await prisma.$connect();
        // Try to count tokens (will throw if table doesn't exist)
        const count = await prisma.passwordResetToken.count();
        console.log("✅ PasswordResetToken table exists. Count:", count);
    } catch (e) {
        console.error("❌ Table check failed:", e.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

check();
