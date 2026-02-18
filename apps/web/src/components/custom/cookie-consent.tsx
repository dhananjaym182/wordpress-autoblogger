'use client';

import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Cookie, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const COOKIE_CATEGORIES = {
  essential: {
    title: 'Essential',
    description: 'Required for the website to function properly.',
    required: true,
  },
  analytics: {
    title: 'Analytics',
    description: 'Help us understand how visitors interact with our website.',
    required: false,
  },
  marketing: {
    title: 'Marketing',
    description: 'Used to deliver personalized advertisements.',
    required: false,
  },
};

export function CookieConsent() {
  const initialStoredConsent = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('cookie-consent');
  }, []);

  const [show, setShow] = useState(() => !initialStoredConsent);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (!initialStoredConsent) {
      return {
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      return JSON.parse(initialStoredConsent) as CookiePreferences;
    } catch {
      return {
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      };
    }
  });

  useEffect(() => {
    if (initialStoredConsent) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'cookie-consent' || !event.newValue) {
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue) as CookiePreferences;
        setPreferences(parsed);
        setShow(false);
      } catch {
        // Ignore malformed values from other tabs.
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [initialStoredConsent]);

  const handleAcceptAll = () => {
    const consent: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setPreferences(consent);
    setShow(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
  };

  const handleSavePreferences = () => {
    const consent: CookiePreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShow(false);
    setShowPreferences(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
  };

  const handleRejectAll = () => {
    const consent: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setPreferences(consent);
    setShow(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consent }));
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      {!showPreferences ? (
        <Card className="mx-auto max-w-4xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Cookie Preferences</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
                <a href="/legal/cookies" className="text-primary hover:underline">
                  Learn more
                </a>
              </p>
            </div>
            <button
              onClick={handleRejectAll}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowPreferences(true)}>
              Customize
            </Button>
            <Button variant="outline" onClick={handleRejectAll}>
              Reject All
            </Button>
            <Button onClick={handleAcceptAll}>Accept All</Button>
          </div>
        </Card>
      ) : (
        <Card className="mx-auto max-w-2xl p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customize Cookie Preferences</h3>
            <button
              onClick={() => setShowPreferences(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => (
              <div
                key={key}
                className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <h4 className="font-medium">{category.title}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  {category.required && (
                    <span className="mt-1 inline-block text-xs text-muted-foreground">
                      Required
                    </span>
                  )}
                </div>
                <Switch
                  checked={preferences[key as keyof CookiePreferences] as boolean}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({
                      ...prev,
                      [key]: checked,
                    }))
                  }
                  disabled={category.required}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// Hook to check if analytics/marketing is allowed
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const checkConsent = () => {
      const stored = localStorage.getItem('cookie-consent');
      if (stored) {
        try {
          setConsent(JSON.parse(stored));
        } catch {
          setConsent(null);
        }
      }
    };

    checkConsent();

    const handleUpdate = (e: CustomEvent<CookiePreferences>) => {
      setConsent(e.detail);
    };

    window.addEventListener('cookie-consent-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('cookie-consent-updated', handleUpdate as EventListener);
    };
  }, []);

  return {
    consent,
    hasConsent: (category: keyof CookiePreferences) => consent?.[category] ?? false,
    isLoaded: consent !== null,
  };
}
