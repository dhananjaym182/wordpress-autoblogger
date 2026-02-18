'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';
import { updatePrimaryFallback } from '@/api/ai/service';

export async function updateFallback(input: { textPrimaryId?: string; imagePrimaryId?: string }) {
  try {
    const session = await requireSession();
    await updatePrimaryFallback(session.user.id, input);
    revalidatePath(APP_ROUTES.dashboardAi);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error, 'Failed to update fallback policy.') };
  }
}

