import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 Hours (Hard session limit)
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch) {
                    if (!user.isApproved) {
                        throw new Error("Account not approved yet. Contact Admin.");
                    }
                    return user;
                }

                return null;
            },
        }),
    ],
});
