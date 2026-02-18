'use server';

import { revalidatePath } from 'next/cache';
import { APP_ROUTES } from '@/api/core/routes';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';
import { createAiProvider } from '@/api/ai/service';

interface CreateProviderInput {
  name: string;
  mode: 'managed' | 'byok';
  baseUrl: string;
  apiKey?: string;
  defaultModelText: string;
  defaultModelImage?: string;
  supportsText: boolean;
  supportsImage: boolean;
}

export async function createProvider(input: CreateProviderInput) {
  try {
    const session = await requireSession();
    const provider = await createAiProvider(session.user.id, input);
    revalidatePath(APP_ROUTES.dashboardAi);
    return { success: true, provider };
  } catch (error) {
    return { error: toActionError(error, 'Failed to create provider.') };
  }
}

