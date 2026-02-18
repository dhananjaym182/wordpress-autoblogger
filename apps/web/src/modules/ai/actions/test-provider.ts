'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';
import { testAiProvider } from '@/api/ai/service';

export async function runProviderTest(providerId: string) {
  try {
    const session = await requireSession();
    const result = await testAiProvider(session.user.id, providerId);
    revalidatePath(APP_ROUTES.dashboardAi);
    if (!result.ok) {
      return { error: result.message };
    }
    return { success: true, message: result.message };
  } catch (error) {
    return { error: toActionError(error, 'Failed to test provider.') };
  }
}

