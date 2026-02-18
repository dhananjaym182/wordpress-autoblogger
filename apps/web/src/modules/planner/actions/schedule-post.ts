'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';
import { createScheduledPost } from '@/api/planner/service';

interface SchedulePostInput {
  projectId: string;
  title: string;
  scheduledAt: string;
  desiredStatus: 'draft' | 'publish';
}

export async function schedulePost(input: SchedulePostInput) {
  try {
    const session = await requireSession();
    const scheduledAt = new Date(input.scheduledAt);
    if (Number.isNaN(scheduledAt.valueOf())) {
      return { error: 'Please provide a valid schedule date and time.' };
    }

    const post = await createScheduledPost(session.user.id, {
      projectId: input.projectId,
      title: input.title,
      scheduledAt,
      desiredStatus: input.desiredStatus,
    });

    revalidatePath(APP_ROUTES.dashboardPlanner);
    revalidatePath(APP_ROUTES.dashboardContent);
    return { success: true, post };
  } catch (error) {
    return { error: toActionError(error, 'Failed to schedule post.') };
  }
}

