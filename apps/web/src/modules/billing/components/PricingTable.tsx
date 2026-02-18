'use client';

import { useState, useTransition } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createCheckout } from '@/modules/billing/actions/create-checkout';

interface PricingTableProps {
  currentPlan: 'free' | 'starter' | 'pro';
}

interface PlanCard {
  id: 'free' | 'starter' | 'pro';
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: PlanCard[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['1 project', '10 drafts/month', 'Draft-only publishing', 'Basic SEO tools'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: 'month',
    description: 'For growing blogs',
    features: ['3 projects', '30 publishes/month', 'Auto-publish', 'BYOK support', 'Advanced SEO'],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99',
    period: 'month',
    description: 'For high-output teams',
    features: ['10 projects', '120 publishes/month', 'Fallback policy controls', 'Priority support'],
  },
];

export function PricingTable({ currentPlan }: PricingTableProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = (planId: 'starter' | 'pro') => {
    startTransition(async () => {
      setError(null);
      const result = await createCheckout(planId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.url) {
        window.location.href = result.url;
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const upgradeDisabled = isCurrent || plan.id === 'free';

          return (
            <Card key={plan.id} className={plan.popular ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.popular ? <Badge>Popular</Badge> : null}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period ? <span className="text-muted-foreground">/{plan.period}</span> : null}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.id === 'free' ? (
                  <Button className="w-full" variant="outline" disabled>
                    Included
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={isPending || upgradeDisabled}
                    onClick={() => handleUpgrade(plan.id as 'starter' | 'pro')}
                  >
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isCurrent ? 'Current Plan' : 'Upgrade'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
