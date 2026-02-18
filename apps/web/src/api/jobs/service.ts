import { db } from '@/lib/db';
import { getActiveMembership } from '@/api/core/organization-context';

export const getJobLogsForActiveOrganization = async (userId: string) => {
  const { activeMembership } = await getActiveMembership(userId);

  return db.jobRun.findMany({
    where: {
      scheduledPost: {
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

