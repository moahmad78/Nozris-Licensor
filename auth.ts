import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 Hours
    },
    // Default sender for emails
    // Note: Actual email sending logic might be in lib/mail.ts or actions, 
    // but configuring it here if providers use it is good practice, 
    // though this specific file uses Credentials provider which is manual.
    // We will verify lib/mail.ts next.
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    throw new Error("No user found with this email.");
                }

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) {
                    throw new Error("Invalid password. Please try again.");
                }

                const u = user as any;
                const isSuperAdmin = u.email === 'moahmadmail92@gmail.com';

                if (!u.emailVerified && !isSuperAdmin) {
                    throw new Error("Email not verified. Please verify your email.");
                }

                if (!u.isApproved && !isSuperAdmin) {
                    throw new Error("Account not approved yet. Contact Admin.");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
});
