import { useCookieConsent } from '@/components/custom/cookie-consent';

// PostHog analytics wrapper with consent check
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
}

class Analytics {
  private posthog: typeof import('posthog-js').default | null = null;
  private initialized = false;

  async init() {
    if (typeof window === 'undefined') return;

    // Check consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return;

    try {
      const parsed = JSON.parse(consent);
      if (!parsed.analytics) return;
    } catch {
      return;
    }

    // Dynamically import PostHog to avoid SSR issues
    const { default: posthog } = await import('posthog-js');
    
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: false,
      persistence: 'localStorage',
      // Respect Do Not Track
      respect_dnt: true,
      // Disable session recording by default
      disable_session_recording: true,
      // IP anonymization
      property_blacklist: ['$ip'],
    });

    this.posthog = posthog;
    this.initialized = true;
  }

  capture(event: string, properties?: Record<string, unknown>) {
    if (!this.initialized || !this.posthog) return;

    // Check consent again before capturing
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return;

    try {
      const parsed = JSON.parse(consent);
      if (!parsed.analytics) return;
    } catch {
      return;
    }

    this.posthog.capture(event, properties);
  }

  identify(userId: string, properties?: Record<string, unknown>) {
    if (!this.initialized || !this.posthog) return;

    this.posthog.identify(userId, properties);
  }

  reset() {
    if (!this.initialized || !this.posthog) return;

    this.posthog.reset();
  }

  pageView(url: string) {
    if (!this.initialized || !this.posthog) return;

    this.posthog.capture('$pageview', { $current_url: url });
  }
}

export const analytics = new Analytics();

// Hook for using analytics in components
export function useAnalytics() {
  const { hasConsent } = useCookieConsent();

  const track = (event: string, properties?: Record<string, unknown>) => {
    if (hasConsent('analytics')) {
      analytics.capture(event, properties);
    }
  };

  return { track };
}

// Predefined events
export const AnalyticsEvents = {
  // Auth events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  EMAIL_VERIFIED: 'email_verified',

  // Project events
  PROJECT_CREATED: 'project_created',
  PROJECT_DELETED: 'project_deleted',

  // WordPress events
  WP_CONNECTED: 'wp_connected',
  WP_CONNECTION_FAILED: 'wp_connection_failed',

  // Content events
  CONTENT_GENERATED: 'content_generated',
  CONTENT_SAVED: 'content_saved',
  POST_SCHEDULED: 'post_scheduled',
  POST_PUBLISHED: 'post_published',

  // AI events
  AI_PROVIDER_ADDED: 'ai_provider_added',
  AI_GENERATION_FAILED: 'ai_generation_failed',

  // Billing events
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  PAYMENT_FAILED: 'payment_failed',

  // Feature usage
  FEATURE_USED: 'feature_used',
} as const;
