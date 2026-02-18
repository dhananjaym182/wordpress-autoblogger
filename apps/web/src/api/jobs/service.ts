import { db } from '@/lib/db';
import { getActiveMembership } from '@/api/core/organization-context';

interface JobLogsOptions {
  projectId?: string | null;
}

export const getJobLogsForActiveOrganization = async (
  userId: string,
  options: JobLogsOptions = {}
) => {
  const { activeMembership } = await getActiveMembership(userId);
  const scopedProjectId = options.projectId ?? null;

  return db.jobRun.findMany({
    where: {
      scheduledPost: {
        ...(scopedProjectId ? { projectId: scopedProjectId } : {}),
        project: {
          organizationId: activeMembership.organizationId,
        },
      },
    },
    include: {
      scheduledPost: {
        select: {
          id: true,
          title: true,
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: { startedAt: 'desc' },
    take: 100,
  });
};
