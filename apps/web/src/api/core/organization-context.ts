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

const sanitizeSlugPart = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const buildDefaultOrganizationName = (name: string | null | undefined, email: string | null | undefined) => {
  const trimmedName = name?.trim();
  if (trimmedName) {
    const firstName = trimmedName.split(/\s+/)[0];
    return `${firstName}'s Workspace`;
  }

  const emailPrefix = email?.split('@')[0]?.trim();
  if (emailPrefix) {
    return `${emailPrefix}'s Workspace`;
  }

  return 'My Workspace';
};

const getDefaultOrganizationSlug = (userId: string) => {
  const sanitized = sanitizeSlugPart(userId);
  return `workspace-${sanitized || 'user'}`;
};

const ensureDefaultMembership = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const defaultSlug = getDefaultOrganizationSlug(userId);
  const defaultName = buildDefaultOrganizationName(user.name, user.email);

  await db.$transaction(async (tx) => {
    const existingMembership = await tx.organizationMember.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (existingMembership) {
      return;
    }

    const organization = await tx.organization.upsert({
      where: { slug: defaultSlug },
      update: {},
      create: {
        name: defaultName,
        slug: defaultSlug,
      },
    });

    await tx.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId,
        },
      },
      update: {},
      create: {
        organizationId: organization.id,
        userId,
        role: 'OWNER',
      },
    });
  });
};

export const getActiveMembership = async (userId: string) => {
  let memberships = await getMembershipsForUser(userId);

  if (memberships.length === 0) {
    await ensureDefaultMembership(userId);
    memberships = await getMembershipsForUser(userId);
  }

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
