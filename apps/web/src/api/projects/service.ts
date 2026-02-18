import { PLAN_LIMITS } from '@autoblogger/shared';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { createId } from '@/lib/id';
import { ForbiddenError, NotFoundError } from '@/api/core/errors';
import { getActiveMembership } from '@/api/core/organization-context';

const slugRegex = /^[a-z0-9-]+$/;

export const ACTIVE_PROJECT_COOKIE = 'ab_active_project';

export interface ProjectSwitcherOption {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectSwitcherState {
  projects: ProjectSwitcherOption[];
  activeProjectId: string | null;
}

export const listProjectsForOrganization = async (organizationId: string) => {
  return db.project.findMany({
    where: { organizationId },
    include: { wpConnection: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getProjectSwitcherState = async (userId: string): Promise<ProjectSwitcherState> => {
  const { activeMembership } = await getActiveMembership(userId);

  const projects = await db.project.findMany({
    where: {
      organizationId: activeMembership.organizationId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const cookieStore = await cookies();
  const preferredProjectId = cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value;

  const activeProjectId =
    projects.find((project: (typeof projects)[number]) => project.id === preferredProjectId)?.id ??
    projects[0]?.id ??
    null;

  return {
    projects,
    activeProjectId,
  };
};

export const createProjectForOrganization = async (input: {
  organizationId: string;
  organizationPlanId: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
}) => {
  if (!slugRegex.test(input.slug)) {
    throw new ForbiddenError('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  const projectCount = await db.project.count({
    where: { organizationId: input.organizationId },
  });

  const maxProjects = PLAN_LIMITS[input.organizationPlanId as keyof typeof PLAN_LIMITS]?.maxProjects ?? 1;
  if (projectCount >= maxProjects) {
    throw new ForbiddenError(
      `You've reached the maximum number of projects (${maxProjects}) for your ${input.organizationPlanId} plan.`
    );
  }

  const duplicateProject = await db.project.findFirst({
    where: {
      organizationId: input.organizationId,
      slug: input.slug,
    },
  });

  if (duplicateProject) {
    throw new ForbiddenError('A project with this slug already exists in your organization');
  }

  const project = await db.project.create({
    data: {
      id: createId('proj'),
      organizationId: input.organizationId,
      name: input.name,
      slug: input.slug,
      description: input.description,
    },
  });

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: input.organizationId,
      userId: input.userId,
      action: 'project.create',
      resourceType: 'project',
      resourceId: project.id,
      metadata: { name: input.name },
    },
  });

  return project;
};

export const deleteProjectForOrganization = async (input: {
  organizationId: string;
  userId: string;
  role: string;
  projectId: string;
}) => {
  const project = await db.project.findFirst({
    where: {
      id: input.projectId,
      organizationId: input.organizationId,
    },
  });

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  if (!['OWNER', 'ADMIN'].includes(input.role)) {
    throw new ForbiddenError('You do not have permission to delete this project');
  }

  await db.project.delete({
    where: { id: input.projectId },
  });

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: input.organizationId,
      userId: input.userId,
      action: 'project.delete',
      resourceType: 'project',
      resourceId: input.projectId,
      metadata: { name: project.name },
    },
  });

  return project;
};
