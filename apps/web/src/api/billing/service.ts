import { PLAN_LIMITS } from '@autoblogger/shared';
import { db } from '@/lib/db';
import { getActiveMembership } from '@/api/core/organization-context';

export const getBillingOverview = async (userId: string) => {
  const { activeMembership } = await getActiveMembership(userId);
  const organization = activeMembership.organization;

  const [projectCount, billingEvents] = await Promise.all([
    db.project.count({
      where: { organizationId: organization.id },
    }),
    db.auditLog.findMany({
      where: {
        organizationId: organization.id,
        action: {
          startsWith: 'billing.',
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const limits = PLAN_LIMITS[organization.planId as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free;

  return {
    organizationId: organization.id,
    planId: organization.planId,
    planStatus: organization.planStatus,
    stripeCustomerId: organization.stripeCustomerId,
    usage: {
      publishesUsed: organization.publishesThisMonth,
      publishesLimit: limits.maxPublishesPerMonth,
      projectsUsed: projectCount,
      projectsLimit: limits.maxProjects,
    },
    billingEvents,
  };
};

