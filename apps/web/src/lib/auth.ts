import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { headers } from 'next/headers';
import { db } from './db';
import { createId } from './id';

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Implement email sending
      console.log('Reset password URL:', url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending
      console.log('Verification URL:', url);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    generateId: false,
  },
  callbacks: {
    async createUser(user) {
      // Auto-create organization for new user
      await db.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            id: createId('org'),
            name: `${user.name || user.email}'s Workspace`,
            slug: `workspace-${createId('').slice(0, 8)}`,
            planId: 'free',
          },
        });

        await tx.organizationMember.create({
          data: {
            id: createId('mem'),
            organizationId: org.id,
            userId: user.id,
            role: 'OWNER',
          },
        });

        // Create audit log
        await tx.auditLog.create({
          data: {
            id: createId('audit'),
            organizationId: org.id,
            userId: user.id,
            action: 'org.create',
            resourceType: 'organization',
            resourceId: org.id,
            metadata: { name: org.name },
          },
        });
      });

      return user;
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;

export async function getSession() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  return session;
}
