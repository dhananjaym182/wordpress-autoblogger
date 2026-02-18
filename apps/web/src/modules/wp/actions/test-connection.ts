'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getProjectForUser } from '../lib/project-access';
import { APP_ROUTES } from '@/api/core/routes';

export async function testConnection(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  const access = await getProjectForUser(projectId, session.user.id);
  if (!access || !access.project.wpConnection) {
    return { error: 'Connection not found' };
  }

  const connection = await db.wpSiteConnection.update({
    where: { id: access.project.wpConnection.id },
    data: {
      status: 'ok',
      lastError: null,
      lastCheckedAt: new Date(),
      capabilities: {
        posts: true,
        media: true,
        terms: true,
        seoMeta: true,
      },
    },
  });

  revalidatePath(APP_ROUTES.dashboardProjects);
  revalidatePath(APP_ROUTES.dashboardContent);
  revalidatePath(APP_ROUTES.dashboardSettings);

  return { success: true, connection };
}
