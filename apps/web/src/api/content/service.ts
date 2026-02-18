import { db } from '@/lib/db';
import { getActiveMembership } from '@/api/core/organization-context';

export const getContentDashboardData = async (userId: string) => {
  const { activeMembership } = await getActiveMembership(userId);
  const organizationId = activeMembership.organizationId;

  const [projects, totalPosts, draftPosts, scheduledPosts, publishedPosts, recentPosts] =
    await Promise.all([
      db.project.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          _count: {
            select: { scheduledPosts: true },
          },
        },
      }),
      db.scheduledPost.count({
        where: {
          project: { organizationId },
        },
      }),
      db.scheduledPost.count({
        where: {
          project: { organizationId },
          status: 'draft',
        },
      }),
      db.scheduledPost.count({
        where: {
          project: { organizationId },
          status: 'scheduled',
        },
      }),
      db.scheduledPost.count({
        where: {
          project: { organizationId },
          status: 'published',
        },
      }),
      db.scheduledPost.findMany({
        where: {
          project: { organizationId },
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),
    ]);

  return {
    organization: activeMembership.organization,
    projects,
    metrics: {
      totalPosts,
      draftPosts,
      scheduledPosts,
      publishedPosts,
    },
    recentPosts,
  };
};

