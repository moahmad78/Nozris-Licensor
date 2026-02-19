
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function forceAdmin() {
    const email = "moahmadmail92@gmail.com";
    const password = "admin123";

    try {
        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            console.log(`User ${email} exists. Updating to ADMIN...`);
            await prisma.user.update({
                where: { email },
                data: {
                    role: 'ADMIN',
                    isApproved: true,
                    emailVerified: new Date()
                }
            });
            console.log("✅ User updated to ADMIN and APPROVED.");
        } else {
            console.log(`User ${email} does not exist. Creating new ADMIN...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    email,
                    name: "Admin User",
                    password: hashedPassword,
                    role: 'ADMIN',
                    isApproved: true,
                    emailVerified: new Date()
                }
            });
            console.log("✅ New Admin User created.");
            console.log("   Email: moahmadmail92@gmail.com");
            console.log("   Password: admin123");
        }

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

forceAdmin();
