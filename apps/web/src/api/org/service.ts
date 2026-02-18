import { getActiveMembership } from '@/api/core/organization-context';

export interface OrganizationSwitcherOption {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export interface OrganizationSwitcherState {
  organizations: OrganizationSwitcherOption[];
  activeOrganizationId: string;
}

export const getOrganizationSwitcherState = async (userId: string): Promise<OrganizationSwitcherState> => {
  const { memberships, activeMembership } = await getActiveMembership(userId);

  return {
    organizations: memberships.map((membership: (typeof memberships)[number]) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      role: membership.role,
    })),
    activeOrganizationId: activeMembership.organizationId,
  };
};
