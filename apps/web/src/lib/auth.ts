import { betterAuth } from "better-auth";
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from './db';

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
    database: prismaAdapter(db, {
        provider: 'postgresql',
    }),
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }: { user: { email: string }; url: string; token: string }, request: Request | undefined) => {
            // In development, log the verification link
            // The URL already contains the callbackURL parameter from the signup
            console.log('===========================================');
            console.log('VERIFICATION EMAIL FOR:', user.email);
            console.log('VERIFICATION URL:', url);
            console.log('TOKEN:', token);
            console.log('===========================================');
            // TODO: Send actual email via Mailjet or other email provider
        },
        sendResetPassword: async ({ user, url, token }: { user: { email: string }; url: string; token: string }, request: Request | undefined) => {
            console.log('Reset password for:', user.email, 'URL:', url);
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
        }
    },
});

export type AuthSession = typeof auth.$Infer.Session;

export async function getSession() {
    const { headers } = await import('next/headers');
    return auth.api.getSession({
        headers: await headers(),
    });
}
