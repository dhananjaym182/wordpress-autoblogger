'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { requireSession } from '@/api/core/auth-context';
import { getMembershipsForUser, ACTIVE_ORG_COOKIE } from '@/api/core/organization-context';
import { APP_ROUTES } from '@/api/core/routes';

export async function setActiveOrganization(organizationId: string) {
  const session = await requireSession();
  const memberships = await getMembershipsForUser(session.user.id);
  const isMember = memberships.some(
    (membership: (typeof memberships)[number]) => membership.organizationId === organizationId
  );

  if (!isMember) {
    return { error: 'Organization not found for this account.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORG_COOKIE, organizationId, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath(APP_ROUTES.dashboard);
  revalidatePath(APP_ROUTES.dashboardProjects);
  revalidatePath(APP_ROUTES.dashboardContent);
  revalidatePath(APP_ROUTES.dashboardPlanner);
  revalidatePath(APP_ROUTES.dashboardAi);
  revalidatePath(APP_ROUTES.dashboardJobs);
  revalidatePath(APP_ROUTES.dashboardBilling);
  revalidatePath(APP_ROUTES.dashboardSettings);

  return { success: true };
}
