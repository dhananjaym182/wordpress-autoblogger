'use server';

import { createCheckoutSessionUrl } from '@/api/billing/stripe';
import { requireSession } from '@/api/core/auth-context';
import { toActionError } from '@/api/core/errors';

export async function createCheckout(planId: 'starter' | 'pro') {
  try {
    const session = await requireSession();
    const url = await createCheckoutSessionUrl(session.user.id, planId);
    return { success: true, url };
  } catch (error) {
    return { error: toActionError(error, 'Unable to create checkout session.') };
  }
}

