export const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
} as const;

export type PlanId = typeof PLANS[keyof typeof PLANS];

export interface PlanLimit {
  maxProjects: number;
  maxPublishesPerMonth: number;
  allowsAutoPublish: boolean;
  allowsBYOK: boolean;
  allowsAITemplates: boolean;
  priceMonthly: number;
  priceYearly: number;
}

export const PLAN_LIMITS: Record<PlanId, PlanLimit> = {
  [PLANS.FREE]: {
    maxProjects: 1,
    maxPublishesPerMonth: 0, // Drafts only
    allowsAutoPublish: false,
    allowsBYOK: false,
    allowsAITemplates: false,
    priceMonthly: 0,
    priceYearly: 0,
  },
  [PLANS.STARTER]: {
    maxProjects: 3,
    maxPublishesPerMonth: 30,
    allowsAutoPublish: true,
    allowsBYOK: true,
    allowsAITemplates: false,
    priceMonthly: 29,
    priceYearly: 290,
  },
  [PLANS.PRO]: {
    maxProjects: 10,
    maxPublishesPerMonth: 120,
    allowsAutoPublish: true,
    allowsBYOK: true,
    allowsAITemplates: true,
    priceMonthly: 99,
    priceYearly: 990,
  },
};

export function canUseFeature(planId: PlanId, feature: keyof PlanLimit): boolean {
  const plan = PLAN_LIMITS[planId];
  if (!plan) return false;
  
  const value = plan[feature];
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value > 0;
  }
  return false;
}

export function getPlanName(planId: string): string {
  const names: Record<string, string> = {
    [PLANS.FREE]: 'Free',
    [PLANS.STARTER]: 'Starter',
    [PLANS.PRO]: 'Pro',
  };
  return names[planId] || 'Unknown';
}
