import { db } from '@/lib/db';

export const getProjectForUser = async (projectId: string, userId: string) => {
  const membership = await db.organizationMember.findFirst({
    where: { userId },
    select: { organizationId: true },
  });

  if (!membership) {
    return null;
  }

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      organizationId: membership.organizationId,
    },
    include: { wpConnection: true },
  });

  if (!project) {
    return null;
  }

  return { project, organizationId: membership.organizationId };
};
