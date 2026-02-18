// User & Authentication
export interface User {
  id: string;
  email: string;
  emailVerifiedAt?: Date | null;
  name?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  avatar?: string | null;
  stripeCustomerId?: string | null;
  planId: 'free' | 'starter' | 'pro';
  planStatus: 'active' | 'canceled' | 'past_due';
  planStartedAt?: Date | null;
  planEndsAt?: Date | null;
  publishesThisMonth: number;
  lastResetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  createdAt: Date;
  updatedAt: Date;
}

// Projects & WordPress
export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string | null;
  contentSettings?: ContentSettings | null;
  seoSettings?: SeoSettings | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentSettings {
  tone?: string;
  style?: string;
  targetAudience?: string;
  wordCount?: number;
}

export interface SeoSettings {
  focusKeywordStrategy?: string;
  metaLength?: number;
  internalLinking?: boolean;
}

export interface WpSiteConnection {
  id: string;
  projectId: string;
  siteUrl: string;
  siteName?: string | null;
  mode: 'plugin' | 'app_password';
  status: 'ok' | 'error' | 'pending';
  lastError?: string | null;
  lastCheckedAt?: Date | null;
  keyId?: string | null;
  secretEncrypted?: string | null;
  pairedAt?: Date | null;
  wpUsername?: string | null;
  appPasswordEncrypted?: string | null;
  capabilities?: Record<string, boolean> | null;
  wpVersion?: string | null;
  activeTheme?: string | null;
  detectedPlugins?: Record<string, boolean> | null;
  createdAt: Date;
  updatedAt: Date;
}

// Content
export interface ScheduledPost {
  id: string;
  projectId: string;
  externalId: string;
  title: string;
  markdown?: string | null;
  gutenbergHtml?: string | null;
  excerpt?: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  desiredStatus: 'draft' | 'publish';
  scheduledAt?: Date | null;
  publishedAt?: Date | null;
  wpPostId?: number | null;
  wpEditUrl?: string | null;
  wpPublicUrl?: string | null;
  slug?: string | null;
  categories: string[];
  tags: string[];
  featuredImageMode?: 'ai' | 'userupload' | 'userurl' | null;
  featuredImageSource?: string | null;
  featuredImagePrompt?: string | null;
  storedImageKey?: string | null;
  wpMediaId?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  seoScore?: number | null;
  readabilityScore?: number | null;
  aiModel?: string | null;
  aiTokensUsed?: number | null;
  aiCostUsd?: number | null;
  generatedAt?: Date | null;
  attemptCount: number;
  lastAttemptAt?: Date | null;
  lastError?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// AI
export interface AiEndpoint {
  id: string;
  organizationId: string;
  name: string;
  baseUrl: string;
  apiKeyEncrypted?: string | null;
  defaultModelText: string;
  defaultModelImage?: string | null;
  capabilities: {
    text: boolean;
    image: boolean;
  };
  mode: 'managed' | 'byok';
  enabled: boolean;
  lastTestedAt?: Date | null;
  lastError?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiFallbackPolicy {
  id: string;
  organizationId: string;
  textChain: string[];
  imageChain: string[];
  retryPolicy: {
    retries: number;
    timeoutMs: number;
    backoff: string;
  };
  circuitBreaker?: {
    enabled: boolean;
    failureThreshold: number;
    cooldownMs: number;
  } | null;
  updatedAt: Date;
}

// Plans - PlanId is exported from constants/plans.ts
import type { PlanId } from '../constants/plans';
export type { PlanId };

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  projects: number;
  publishesPerMonth: number;
  autoPublish: boolean;
  byok: boolean;
  templates: boolean;
  features: string[];
}
