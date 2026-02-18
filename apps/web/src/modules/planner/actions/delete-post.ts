'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';
import { deleteScheduledPost } from '@/api/planner/service';

export async function removeScheduledPost(postId: string) {
  try {
    const session = await requireSession();
    await deleteScheduledPost(session.user.id, postId);
    revalidatePath(APP_ROUTES.dashboardPlanner);
    revalidatePath(APP_ROUTES.dashboardJobs);
    revalidatePath(APP_ROUTES.dashboardContent);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error, 'Failed to remove scheduled post.') };
  }
}

