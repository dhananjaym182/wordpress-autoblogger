'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { DASHBOARD_REVALIDATE_PATHS } from '@/api/core/routes';
import {
  ACTIVE_PROJECT_COOKIE,
  listProjectsForOrganization,
} from '@/api/projects/service';
import { getActiveMembership } from '@/api/core/organization-context';

export async function setActiveProject(projectId: string) {
  const session = await requireSession();
  const { activeMembership } = await getActiveMembership(session.user.id);
  const projects = await listProjectsForOrganization(activeMembership.organizationId);
  const isOwnedProject = projects.some((project: (typeof projects)[number]) => project.id === projectId);

  if (!isOwnedProject) {
    return { error: 'Project not found for this workspace.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PROJECT_COOKIE, projectId, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  for (const path of DASHBOARD_REVALIDATE_PATHS) {
    revalidatePath(path);
  }

  revalidatePath(APP_ROUTES.dashboardProjects);
  return { success: true };
}
