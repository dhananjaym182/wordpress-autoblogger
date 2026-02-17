import { Plan } from '../types';

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    projects: 1,
    publishesPerMonth: 10,
    autoPublish: false,
    byok: false,
    templates: false,
    features: [
      '1 Project',
      '10 drafts per month',
      'AI content generation',
      'Basic SEO tools',
      'Draft only publishing',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 29,
    projects: 3,
    publishesPerMonth: 30,
    autoPublish: true,
    byok: true,
    templates: false,
    features: [
      '3 Projects',
      '30 publishes per month',
      'AI content generation',
      'Auto-publishing',
      'Bring Your Own Keys',
      'Advanced SEO tools',
      'Priority support',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    projects: 10,
    publishesPerMonth: 120,
    autoPublish: true,
    byok: true,
    templates: true,
    features: [
      '10 Projects',
      '120 publishes per month',
      'AI content generation',
      'Auto-publishing',
      'Bring Your Own Keys',
      'Content templates',
      'Advanced SEO tools',
      'Bulk scheduling',
      'Priority support',
      'Team collaboration',
    ],
  },
};

export const getPlanById = (id: string): Plan => {
  return PLANS[id] || PLANS.free;
};

export const canAutoPublish = (planId: string): boolean => {
  return getPlanById(planId).autoPublish;
};

export const canUseBYOK = (planId: string): boolean => {
  return getPlanById(planId).byok;
};

export const getMaxProjects = (planId: string): number => {
  return getPlanById(planId).projects;
};

export const getMaxPublishesPerMonth = (planId: string): number => {
  return getPlanById(planId).publishesPerMonth;
};
