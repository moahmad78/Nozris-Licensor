
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeMeAdmin() {
    const email = "moahmadmail92@gmail.com";
    try {
        const user = await prisma.user.update({
            where: { email },
            data: {
                isApproved: true,
                role: 'ADMIN',
                emailVerified: new Date() // Also verify email if not already
            },
        });
        console.log("✅ Success! User updated:", user.email, user.role, user.isApproved);
    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

makeMeAdmin();
