
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs is installed
const prisma = new PrismaClient();

async function makeMeAdmin() {
    const email = "moahmadmail92@gmail.com";
    const password = "admin123"; // Default password if creating

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                isApproved: true,
                role: 'ADMIN',
                emailVerified: new Date()
            },
            create: {
                email,
                name: "Admin User",
                password: hashedPassword,
                role: 'ADMIN',
                isApproved: true,
                emailVerified: new Date()
            }
        });

        console.log("✅ Success! User:", user.email);
        console.log("   Role:", user.role);
        console.log("   Approved:", user.isApproved);
        console.log("   Verified:", user.emailVerified);
        if (user.createdAt > new Date(Date.now() - 5000)) {
            console.log("   NOTE: Created new user with password: 'admin123'");
        }
    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

makeMeAdmin();
