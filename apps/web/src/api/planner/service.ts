import { db } from '@/lib/db';
import { createId } from '@/lib/id';
import { NotFoundError } from '@/api/core/errors';
import { getActiveMembership } from '@/api/core/organization-context';

interface CreateScheduledPostInput {
  projectId: string;
  title: string;
  scheduledAt: Date;
  desiredStatus: 'draft' | 'publish';
}

interface PlannerDataOptions {
  projectId?: string | null;
}

export const getPlannerData = async (userId: string, options: PlannerDataOptions = {}) => {
  const { activeMembership } = await getActiveMembership(userId);
  const organizationId = activeMembership.organizationId;
  const scopedProjectId = options.projectId ?? null;

  const [projects, scheduledPosts] = await Promise.all([
    db.project.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
    db.scheduledPost.findMany({
      where: {
        project: { organizationId },
        ...(scopedProjectId ? { projectId: scopedProjectId } : {}),
      },
      select: {
        id: true,
        title: true,
        status: true,
        desiredStatus: true,
        scheduledAt: true,
        updatedAt: true,
        projectId: true,
        project: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'desc' }],
      take: 200,
    }),
  ]);

  return { projects, scheduledPosts, activeProjectId: scopedProjectId };
};

export const createScheduledPost = async (userId: string, input: CreateScheduledPostInput) => {
  const { activeMembership } = await getActiveMembership(userId);

  const project = await db.project.findFirst({
    where: {
      id: input.projectId,
      organizationId: activeMembership.organizationId,
    },
  });

  if (!project) {
    throw new NotFoundError('Project not found');
  }

  const post = await db.scheduledPost.create({
    data: {
      id: createId('post'),
      externalId: createId('ext'),
      projectId: project.id,
      title: input.title.trim(),
      status: input.desiredStatus === 'publish' ? 'scheduled' : 'draft',
      desiredStatus: input.desiredStatus,
      scheduledAt: input.scheduledAt,
      categories: [],
      tags: [],
      markdown: '',
      gutenbergHtml: '',
    },
  });

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: activeMembership.organizationId,
      userId,
      action: 'post.schedule',
      resourceType: 'scheduled_post',
      resourceId: post.id,
      metadata: { projectId: project.id, desiredStatus: input.desiredStatus },
    },
  });

  return post;
};

export const updateScheduledPostStatus = async (
  userId: string,
  postId: string,
  status: 'draft' | 'scheduled' | 'published' | 'failed'
) => {
  const { activeMembership } = await getActiveMembership(userId);

  const post = await db.scheduledPost.findFirst({
    where: {
      id: postId,
      project: { organizationId: activeMembership.organizationId },
    },
  });

  if (!post) {
    throw new NotFoundError('Scheduled post not found');
  }

  const updatedPost = await db.scheduledPost.update({
    where: { id: post.id },
    data: {
      status,
      desiredStatus: status === 'published' ? 'publish' : post.desiredStatus,
      publishedAt: status === 'published' ? new Date() : post.publishedAt,
    },
  });

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: activeMembership.organizationId,
      userId,
      action: 'post.status.update',
      resourceType: 'scheduled_post',
      resourceId: post.id,
      metadata: { status },
    },
  });

  return updatedPost;
};

export const deleteScheduledPost = async (userId: string, postId: string) => {
  const { activeMembership } = await getActiveMembership(userId);

  const post = await db.scheduledPost.findFirst({
    where: {
      id: postId,
      project: { organizationId: activeMembership.organizationId },
    },
  });

  if (!post) {
    throw new NotFoundError('Scheduled post not found');
  }

  await db.jobRun.deleteMany({
    where: { scheduledPostId: post.id },
  });

  await db.scheduledPost.delete({
    where: { id: post.id },
  });

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: activeMembership.organizationId,
      userId,
      action: 'post.delete',
      resourceType: 'scheduled_post',
      resourceId: post.id,
      metadata: { title: post.title },
    },
  });
};
