'use server';

import { revalidatePath } from 'next/cache';
import { rateLimits } from '@/lib/rate-limit';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { getActiveMembership } from '@/api/core/organization-context';
import { createProjectForOrganization } from '@/api/projects/service';
import { toActionError } from '@/api/core/errors';

interface CreateProjectInput {
  name: string;
  slug: string;
  description?: string;
}

export async function createProject(input: CreateProjectInput) {
  try {
    const session = await requireSession();
    const rateLimitResult = await rateLimits.apiGeneral(`create-project:${session.user.id}`);
    if (!rateLimitResult.success) {
      return { error: 'Rate limit exceeded. Please try again later.' };
    }

    const { activeMembership } = await getActiveMembership(session.user.id);
    const project = await createProjectForOrganization({
      organizationId: activeMembership.organizationId,
      organizationPlanId: activeMembership.organization.planId,
      userId: session.user.id,
      name: input.name.trim(),
      slug: input.slug.trim(),
      description: input.description?.trim(),
    });

    revalidatePath(APP_ROUTES.dashboardProjects);
    revalidatePath(APP_ROUTES.dashboard);
    return { success: true, project };
  } catch (error) {
    console.error('Failed to create project:', error);
    return { error: toActionError(error, 'Failed to create project. Please try again.') };
  }
}
