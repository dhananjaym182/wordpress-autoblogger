'use server';

import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { requireSession } from '@/api/core/auth-context';
import { APP_ROUTES } from '@/api/core/routes';

export async function deleteAccount() {
  const session = await requireSession();
  const userId = session.user.id;

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

  type Membership = (typeof user.memberships)[number];
  type Project = Membership['organization']['projects'][number];
  type ScheduledPost = Project['scheduledPosts'][number];

  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const membership of user.memberships) {
      if (membership.role !== 'OWNER') {
        continue;
      }

      const org = membership.organization;
      const projectIds = org.projects.map((project: Project) => project.id);
      const postIds = org.projects.flatMap((project: Project) =>
        project.scheduledPosts.map((scheduledPost: ScheduledPost) => scheduledPost.id)
      );

      if (postIds.length > 0) {
        await tx.jobRun.deleteMany({
          where: {
            scheduledPostId: { in: postIds },
          },
        });
      }

      if (projectIds.length > 0) {
        await tx.scheduledPost.deleteMany({
          where: {
            projectId: { in: projectIds },
          },
        });
      }

      await tx.contentTemplate.deleteMany({
        where: {
          projectId: { in: projectIds },
        },
      });

      await tx.wpSiteConnection.deleteMany({
        where: {
          projectId: { in: projectIds },
        },
      });

      await tx.project.deleteMany({
        where: {
          organizationId: org.id,
        },
      });

      await tx.aiEndpoint.deleteMany({
        where: {
          organizationId: org.id,
        },
      });

      await tx.aiFallbackPolicy.deleteMany({
        where: {
          organizationId: org.id,
        },
      });

      await tx.auditLog.deleteMany({
        where: {
          organizationId: org.id,
        },
      });

      await tx.organization.delete({
        where: { id: org.id },
      });
    }

    await tx.session.deleteMany({
      where: { userId },
    });

    await tx.account.deleteMany({
      where: { userId },
    });

    await tx.organizationMember.deleteMany({
      where: { userId },
    });

    await tx.user.delete({
      where: { id: userId },
    });
  });

  await auth.api.signOut({
    headers: await headers(),
  });

  redirect(APP_ROUTES.home);
}

