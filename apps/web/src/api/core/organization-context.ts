import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { NotFoundError } from './errors';

export const ACTIVE_ORG_COOKIE = 'ab_active_org';

export const getMembershipsForUser = async (userId: string) => {
  return db.organizationMember.findMany({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: 'asc' },
  });
};

export const getActiveMembership = async (userId: string) => {
  const memberships = await getMembershipsForUser(userId);

  if (memberships.length === 0) {
    throw new NotFoundError('No organization found');
  }

  const cookieStore = await cookies();
  const preferredOrgId = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;

  const activeMembership =
    memberships.find(
      (membership: (typeof memberships)[number]) => membership.organizationId === preferredOrgId
    ) ?? memberships[0];

  return {
    memberships,
    activeMembership,
  };
};
