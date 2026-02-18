'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { getActiveMembership } from '@/api/core/organization-context';
import { deleteProjectForOrganization } from '@/api/projects/service';
import { toActionError } from '@/api/core/errors';

export async function deleteProject(projectId: string) {
  try {
    const session = await requireSession();
    const { activeMembership } = await getActiveMembership(session.user.id);

    await deleteProjectForOrganization({
      organizationId: activeMembership.organizationId,
      userId: session.user.id,
      role: activeMembership.role,
      projectId,
    });

    revalidatePath(APP_ROUTES.dashboardProjects);
    revalidatePath(APP_ROUTES.dashboard);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { error: toActionError(error, 'Failed to delete project. Please try again.') };
  }
}
