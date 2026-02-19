
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);
    users.forEach(u => console.log(`- ${u.email} [${u.role}] Approved:${u.isApproved}`));
}

listUsers();
