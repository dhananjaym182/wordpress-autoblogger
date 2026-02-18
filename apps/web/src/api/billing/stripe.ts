import { db } from '@/lib/db';
import { createId } from '@/lib/id';
import { NotConfiguredError, NotFoundError } from '@/api/core/errors';
import { getActiveMembership } from '@/api/core/organization-context';

const STRIPE_API_BASE = 'https://api.stripe.com/v1';

const getStripeSecret = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new NotConfiguredError('Stripe is not configured. Set STRIPE_SECRET_KEY.');
  }
  return key;
};

const getPriceIdForPlan = (planId: 'starter' | 'pro') => {
  const map = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
  };
  const priceId = map[planId];
  if (!priceId) {
    throw new NotConfiguredError(`Stripe price ID is missing for plan "${planId}".`);
  }
  return priceId;
};

const stripeRequest = async (path: string, body: URLSearchParams) => {
  const secret = getStripeSecret();
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe request failed (${response.status}): ${text.slice(0, 500)}`);
  }

  return response.json() as Promise<Record<string, unknown>>;
};

const ensureCustomer = async (organizationId: string) => {
  const organization = await db.organization.findUnique({
    where: { id: organizationId },
  });

  if (!organization) {
    throw new NotFoundError('Organization not found');
  }

  if (organization.stripeCustomerId) {
    return organization.stripeCustomerId;
  }

  const params = new URLSearchParams({
    name: organization.name,
    metadata: JSON.stringify({ organizationId: organization.id }),
  });

  const customer = await stripeRequest('/customers', params);
  const customerId = typeof customer.id === 'string' ? customer.id : null;
  if (!customerId) {
    throw new Error('Invalid Stripe customer response.');
  }

  await db.organization.update({
    where: { id: organization.id },
    data: { stripeCustomerId: customerId },
  });

  return customerId;
};

export const createCheckoutSessionUrl = async (
  userId: string,
  planId: 'starter' | 'pro'
) => {
  const { activeMembership } = await getActiveMembership(userId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new NotConfiguredError('NEXT_PUBLIC_APP_URL is missing.');
  }

  const priceId = getPriceIdForPlan(planId);
  const customerId = await ensureCustomer(activeMembership.organizationId);

  const params = new URLSearchParams({
    mode: 'subscription',
    customer: customerId,
    success_url: `${appUrl}/dashboard/billing?checkout=success`,
    cancel_url: `${appUrl}/dashboard/billing?checkout=cancelled`,
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'metadata[organizationId]': activeMembership.organizationId,
    'metadata[planId]': planId,
  });

  const session = await stripeRequest('/checkout/sessions', params);
  const url = typeof session.url === 'string' ? session.url : null;

  if (!url) {
    throw new Error('Stripe checkout session URL missing.');
  }

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: activeMembership.organizationId,
      userId,
      action: 'billing.checkout.create',
      resourceType: 'organization',
      resourceId: activeMembership.organizationId,
      metadata: { planId },
    },
  });

  return url;
};

export const createBillingPortalUrl = async (userId: string) => {
  const { activeMembership } = await getActiveMembership(userId);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new NotConfiguredError('NEXT_PUBLIC_APP_URL is missing.');
  }

  const customerId = await ensureCustomer(activeMembership.organizationId);

  const params = new URLSearchParams({
    customer: customerId,
    return_url: `${appUrl}/dashboard/billing`,
  });

  const session = await stripeRequest('/billing_portal/sessions', params);
  const url = typeof session.url === 'string' ? session.url : null;

  if (!url) {
    throw new Error('Stripe billing portal URL missing.');
  }

  await db.auditLog.create({
    data: {
      id: createId('audit'),
      organizationId: activeMembership.organizationId,
      userId,
      action: 'billing.portal.create',
      resourceType: 'organization',
      resourceId: activeMembership.organizationId,
    },
  });

  return url;
};
