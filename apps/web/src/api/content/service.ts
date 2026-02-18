import { db } from '@/lib/db';
import { getActiveMembership } from '@/api/core/organization-context';

interface ContentDashboardOptions {
  projectId?: string | null;
}

export const getContentDashboardData = async (userId: string, options: ContentDashboardOptions = {}) => {
  const { activeMembership } = await getActiveMembership(userId);
  const organizationId = activeMembership.organizationId;
  const scopedProjectId = options.projectId ?? null;

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
          ...(scopedProjectId ? { projectId: scopedProjectId } : {}),
        },
      }),
      db.scheduledPost.count({
        where: {
          project: { organizationId },
          ...(scopedProjectId ? { projectId: scopedProjectId } : {}),
          status: 'draft',
        },
      }),
      db.scheduledPost.count({
        where: {
          project: { organizationId },
          ...(scopedProjectId ? { projectId: scopedProjectId } : {}),
          status: 'scheduled',
        },
      }),
      db.scheduledPost.count({
        where: {
          project: { organizationId },
          ...(scopedProjectId ? { projectId: scopedProjectId } : {}),
          status: 'published',
        },
      }),
      db.scheduledPost.findMany({
        where: {
          project: { organizationId },
          ...(scopedProjectId ? { projectId: scopedProjectId } : {}),
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
    activeProjectId: scopedProjectId,
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
