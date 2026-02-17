'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createId } from '@/lib/id';

export async function deleteProject(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  // Get user's organization
  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (!membership) {
    return { error: 'No organization found' };
  }

  // Verify project belongs to user's organization
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      organizationId: membership.organizationId,
    },
  });

  if (!project) {
    return { error: 'Project not found' };
  }

  // Check permissions (only OWNER and ADMIN can delete)
  if (!['OWNER', 'ADMIN'].includes(membership.role)) {
    return { error: 'You do not have permission to delete this project' };
  }

  try {
    await db.project.delete({
      where: { id: projectId },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        id: createId('audit'),
        organizationId: membership.organizationId,
        userId: session.user.id,
        action: 'project.delete',
        resourceType: 'project',
        resourceId: projectId,
        metadata: { name: project.name },
      },
    });

    revalidatePath('/projects');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { error: 'Failed to delete project. Please try again.' };
  }
}
