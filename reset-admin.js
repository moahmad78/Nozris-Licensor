
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetAdmin() {
    const email = "Moahmadmail92@gmail.com"; // Exact casing
    const password = "admin123";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                isApproved: true,
                role: 'ADMIN',
                emailVerified: new Date()
            },
        });
        console.log("✅ Admin access confirmed for:", user.email);
        console.log("   Password reset to: admin123");
    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
