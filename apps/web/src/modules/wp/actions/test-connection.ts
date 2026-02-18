'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { testWordPressConnectionForProject } from '@/api/wp/service';

export async function testConnection(projectId: string) {
  const session = await requireSession();
  const result = await testWordPressConnectionForProject(session.user.id, projectId);

  revalidatePath(APP_ROUTES.dashboardProjects);
  revalidatePath(APP_ROUTES.dashboardContent);
  revalidatePath(APP_ROUTES.dashboardSettings);

  if (!result.ok) {
    return { error: result.message };
  }

  return { success: true, connection: result.connection };
}
