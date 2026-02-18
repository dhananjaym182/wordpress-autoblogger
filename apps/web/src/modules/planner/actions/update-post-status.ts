'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';
import { updateScheduledPostStatus } from '@/api/planner/service';

export async function updatePostStatus(
  postId: string,
  status: 'draft' | 'scheduled' | 'published' | 'failed'
) {
  try {
    const session = await requireSession();
    await updateScheduledPostStatus(session.user.id, postId, status);
    revalidatePath(APP_ROUTES.dashboardPlanner);
    revalidatePath(APP_ROUTES.dashboardJobs);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error, 'Failed to update post status.') };
  }
}

