'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';
import { toggleAiProvider } from '@/api/ai/service';

export async function toggleProvider(providerId: string) {
  try {
    const session = await requireSession();
    await toggleAiProvider(session.user.id, providerId);
    revalidatePath(APP_ROUTES.dashboardAi);
    return { success: true };
  } catch (error) {
    return { error: toActionError(error, 'Failed to update provider.') };
  }
}

