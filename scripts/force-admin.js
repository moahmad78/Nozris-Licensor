
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function forceAdmin() {
    const email = "moahmadmail92@gmail.com";
    console.log(`Checking user: ${email}...`);

    try {
        // Case-insensitive search 
        const existing = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        });

        if (existing) {
            console.log(`✅ User found: ${existing.email} (Role: ${existing.role})`);

            await prisma.user.update({
                where: { id: existing.id }, // Use ID to avoid unique constraint issues on casing
                data: {
                    role: 'ADMIN',
                    isApproved: true,
                    emailVerified: new Date()
                }
            });
            console.log("✅ User updated to ADMIN, APPROVED, and VERIFIED.");
        } else {
            console.log(`⚠️ User ${email} not found. Please register via the UI first.`);
        }

    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

forceAdmin();
