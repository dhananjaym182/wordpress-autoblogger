'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createId } from '@/lib/id';
import { APP_ROUTES } from '@/api/core/routes';
import { getActiveMembership } from '@/api/core/organization-context';
import { analyzeSeo } from '../lib/seo-analyzer';
import { markdownToGutenberg } from '../lib/markdown-to-gutenberg';

interface SaveDraftInput {
  projectId: string;
  postId?: string;
  title: string;
  markdown: string;
  excerpt?: string;
  focusKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  categories?: string[];
  tags?: string[];
  featuredImageMode?: string;
  featuredImageSource?: string;
  featuredImagePrompt?: string;
  featuredImageStoredKey?: string;
}

const normalizeList = (items?: string[]) =>
  (items ?? []).map((item) => item.trim()).filter(Boolean);

export async function saveDraft(input: SaveDraftInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized' };
  }

  const { activeMembership } = await getActiveMembership(session.user.id);

  const project = await db.project.findFirst({
    where: {
      id: input.projectId,
      organizationId: activeMembership.organizationId,
    },
  });

  if (!project) {
    return { error: 'Project not found' };
  }

  const analysis = analyzeSeo({
    title: input.title,
    metaDescription: input.metaDescription,
    focusKeyword: input.focusKeyword,
    markdown: input.markdown,
  });

  const data = {
    title: input.title,
    markdown: input.markdown,
    gutenbergHtml: markdownToGutenberg(input.markdown),
    excerpt: input.excerpt,
    focusKeyword: input.focusKeyword,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    seoScore: analysis.seoScore,
    readabilityScore: analysis.readabilityScore,
    categories: normalizeList(input.categories),
    tags: normalizeList(input.tags),
    featuredImageMode: input.featuredImageMode,
    featuredImageSource: input.featuredImageSource,
    featuredImagePrompt: input.featuredImagePrompt,
    storedImageKey: input.featuredImageStoredKey,
    status: 'draft',
    desiredStatus: 'draft',
  };

  try {
    const post = input.postId
      ? await db.scheduledPost.update({
          where: { id: input.postId },
          data,
        })
      : await db.scheduledPost.create({
          data: {
            id: createId('post'),
            externalId: createId('ext'),
            projectId: project.id,
            ...data,
          },
        });

    await db.auditLog.create({
      data: {
        id: createId('audit'),
        organizationId: activeMembership.organizationId,
        userId: session.user.id,
        action: 'post.save',
        resourceType: 'scheduled_post',
        resourceId: post.id,
        metadata: { title: input.title, projectId: project.id },
      },
    });

    revalidatePath(APP_ROUTES.dashboardContent);
    revalidatePath(APP_ROUTES.dashboardPlanner);
    revalidatePath(APP_ROUTES.dashboardProjects);

    return { success: true, post };
  } catch (error) {
    console.error('Failed to save draft:', error);
    return { error: 'Failed to save draft. Please try again.' };
  }
}
