import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'moahmadmail92@gmail.com';
    const password = 'admin'; // Temporary password for initial setup
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Setting up Admin user: ${email}...`);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: 'ADMIN',
                isApproved: true,
                emailVerified: new Date(),
                name: 'Mohd Ahmad (Admin)',
            },
            create: {
                email,
                password: hashedPassword,
                role: 'ADMIN',
                isApproved: true,
                emailVerified: new Date(),
                name: 'Mohd Ahmad (Admin)',
            },
        });

        console.log(`✅ Admin user upserted successfully: ${user.email}`);
        console.log(`🔑 Login with: ${email} / ${password}`);
    } catch (e) {
        console.error('❌ Error setting up admin user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
