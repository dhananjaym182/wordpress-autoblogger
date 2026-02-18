'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function deleteAccount() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  // Get user with all related data
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              projects: {
                include: {
                  scheduledPosts: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Delete everything in a transaction
  await db.$transaction(async (tx) => {
    // For each organization the user owns
    for (const membership of user.memberships) {
      if (membership.role === 'OWNER') {
        const org = membership.organization;

        // Get all projects in the organization
        const projectIds = org.projects.map((p) => p.id);

        // Get all scheduled posts in those projects
        const postIds = org.projects.flatMap((p) =>
          p.scheduledPosts.map((sp) => sp.id)
        );

        // Delete job runs for those posts
        if (postIds.length > 0) {
          await tx.jobRun.deleteMany({
            where: {
              scheduledPostId: { in: postIds },
            },
          });
        }

        // Delete scheduled posts
        if (projectIds.length > 0) {
          await tx.scheduledPost.deleteMany({
            where: {
              projectId: { in: projectIds },
            },
          });
        }

        // Delete content templates
        await tx.contentTemplate.deleteMany({
          where: {
            projectId: { in: projectIds },
          },
        });

        // Delete WP connections
        await tx.wpSiteConnection.deleteMany({
          where: {
            projectId: { in: projectIds },
          },
        });

        // Delete projects
        await tx.project.deleteMany({
          where: {
            organizationId: org.id,
          },
        });

        // Delete AI endpoints
        await tx.aiEndpoint.deleteMany({
          where: {
            organizationId: org.id,
          },
        });

        // Delete fallback policy
        await tx.aiFallbackPolicy.deleteMany({
          where: {
            organizationId: org.id,
          },
        });

        // Delete audit logs
        await tx.auditLog.deleteMany({
          where: {
            organizationId: org.id,
          },
        });

        // Cancel Stripe subscription if exists
        if (org.stripeCustomerId) {
          // Note: Actual Stripe cancellation would happen here
          // stripe.subscriptions.list({ customer: org.stripeCustomerId })
          // Then cancel each subscription
        }

        // Delete organization
        await tx.organization.delete({
          where: { id: org.id },
        });
      }
    }

    // Delete user's sessions
    await tx.session.deleteMany({
      where: { userId },
    });

    // Delete user's accounts
    await tx.account.deleteMany({
      where: { userId },
    });

    // Delete organization memberships (for non-owned orgs)
    await tx.organizationMember.deleteMany({
      where: { userId },
    });

    // Finally, delete the user
    await tx.user.delete({
      where: { id: userId },
    });
  });

  // Sign out the user
  await auth.api.signOut({
    headers: headers(),
  });

  redirect('/');
}
