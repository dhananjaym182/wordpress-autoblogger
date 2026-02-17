'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createId } from '@/lib/id';
import { getProjectForUser } from '../lib/project-access';

export async function disconnectConnection(projectId: string) {
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

  await db.wpSiteConnection.delete({
    where: { id: access.project.wpConnection.id },
  });

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: access.organizationId,
      userId: session.user.id,
      action: 'wp.disconnect',
      resourceType: 'wp_connection',
      resourceId: access.project.wpConnection.id,
      metadata: { projectId: access.project.id },
    },
  });

  revalidatePath(`/projects/${access.project.id}`);
  revalidatePath(`/projects/${access.project.id}/connection`);

  return { success: true };
}
