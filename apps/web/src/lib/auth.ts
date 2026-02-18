import { betterAuth } from "better-auth";
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from './db';
import { sendTransactionalEmail } from './email';

const appUrl = process.env.BETTER_AUTH_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const auth = betterAuth({
    baseURL: appUrl,
    database: prismaAdapter(db, {
        provider: 'postgresql',
    }),
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }: { user: { email: string }; url: string; token: string }, request: Request | undefined) => {
            const safeUrl = url || `${appUrl}/verify-email`;
            await sendTransactionalEmail({
                to: user.email,
                subject: 'Verify your AutoBlogger email',
                text: `Verify your email by visiting ${safeUrl}`,
                html: `
                  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>Verify your email</h2>
                    <p>Click the link below to verify your AutoBlogger account.</p>
                    <p><a href="${safeUrl}">${safeUrl}</a></p>
                    <p>If you did not request this email, you can ignore it.</p>
                  </div>
                `,
            });
        },
        sendResetPassword: async ({ user, url, token }: { user: { email: string }; url: string; token: string }, request: Request | undefined) => {
            const safeUrl = url || `${appUrl}/login`;
            await sendTransactionalEmail({
                to: user.email,
                subject: 'Reset your AutoBlogger password',
                text: `Reset your password using this link: ${safeUrl}`,
                html: `
                  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>Password reset request</h2>
                    <p>Use the link below to reset your password.</p>
                    <p><a href="${safeUrl}">${safeUrl}</a></p>
                    <p>If you did not request this change, please ignore this email.</p>
                  </div>
                `,
            });
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
