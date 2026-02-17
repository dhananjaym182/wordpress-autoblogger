'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createId } from '@/lib/id';
import { rateLimits } from '@/lib/rate-limit';
import { PLAN_LIMITS } from '@autoblogger/shared/constants/plans';

interface CreateProjectInput {
  name: string;
  slug: string;
  description?: string;
}

export async function createProject(input: CreateProjectInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  // Rate limiting
  const rateLimitResult = await rateLimits.apiGeneral.limit(
    `create-project:${session.user.id}`
  );
  if (!rateLimitResult.success) {
    return { error: 'Rate limit exceeded. Please try again later.' };
  }

  // Get user's organization
  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (!membership) {
    return { error: 'No organization found' };
  }

  const { organization } = membership;

  // Check plan limits
  const projectCount = await db.project.count({
    where: { organizationId: organization.id },
  });

  const maxProjects = PLAN_LIMITS[organization.planId as keyof typeof PLAN_LIMITS]?.maxProjects ?? 1;

  if (projectCount >= maxProjects) {
    return {
      error: `You've reached the maximum number of projects (${maxProjects}) for your ${organization.planId} plan. Please upgrade to create more projects.`,
    };
  }

  // Validate slug format
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(input.slug)) {
    return { error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
  }

  // Check for duplicate slug in organization
  const existingProject = await db.project.findFirst({
    where: {
      organizationId: organization.id,
      slug: input.slug,
    },
  });

  if (existingProject) {
    return { error: 'A project with this slug already exists in your organization' };
  }

  try {
    const project = await db.project.create({
      data: {
        id: createId('proj'),
        name: input.name,
        slug: input.slug,
        description: input.description,
        organizationId: organization.id,
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        id: createId('audit'),
        organizationId: organization.id,
        userId: session.user.id,
        action: 'project.create',
        resourceType: 'project',
        resourceId: project.id,
        metadata: { name: input.name },
      },
    });

    revalidatePath('/projects');
    return { success: true, project };
  } catch (error) {
    console.error('Failed to create project:', error);
    return { error: 'Failed to create project. Please try again.' };
  }
}
