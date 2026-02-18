'use server';

import { createBillingPortalUrl } from '@/api/billing/stripe';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';

export async function createBillingPortal() {
  try {
    const session = await requireSession();
    const url = await createBillingPortalUrl(session.user.id);
    return { success: true, url };
  } catch (error) {
    return { error: toActionError(error, 'Unable to open billing portal.') };
  }
}

