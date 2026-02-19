
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeMeAdmin() {
    const email = "moahmadmail92@gmail.com";
    console.log("Attempting to update user:", email);

    try {
        // First, check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.error("❌ User not found!");
            return;
        }
        console.log("User found:", user.id);

        // Try updating
        const updated = await prisma.user.update({
            where: { email },
            data: {
                isApproved: true,
                role: 'ADMIN',
                // emailVerified: new Date() // Commenting out temporarily to debug
            },
        });
        console.log("✅ Success! User updated:", updated.email, updated.role, updated.isApproved);
    } catch (e) {
        console.error("❌ Error updating user:");
        console.dir(e, { depth: null });
    } finally {
        await prisma.$disconnect();
    }
}

makeMeAdmin();
