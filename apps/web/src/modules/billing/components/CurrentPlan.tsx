'use client';

import { useState, useTransition } from 'react';
import { BarChart3, Loader2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createBillingPortal } from '@/modules/billing/actions/create-portal';

interface CurrentPlanProps {
  currentPlan: string;
  planStatus: string;
  publishesUsed: number;
  publishesLimit: number;
  projectsUsed: number;
  projectsLimit: number;
  stripeCustomerId?: string | null;
}

const toPercent = (used: number, limit: number) => {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
};

export function CurrentPlan({
  currentPlan,
  planStatus,
  publishesUsed,
  publishesLimit,
  projectsUsed,
  projectsLimit,
  stripeCustomerId,
}: CurrentPlanProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const publishesPercentage = toPercent(publishesUsed, publishesLimit);
  const projectsPercentage = toPercent(projectsUsed, projectsLimit);

  const handleOpenPortal = () => {
    startTransition(async () => {
      setMessage(null);
      setError(null);
      const result = await createBillingPortal();
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
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Current Plan</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {currentPlan}
            </Badge>
            <Badge variant={planStatus === 'active' ? 'secondary' : 'destructive'}>{planStatus}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Publish Usage</span>
            <span className="text-sm text-muted-foreground">
              {publishesUsed} / {publishesLimit || 'Unlimited'}
            </span>
          </div>
          <Progress value={publishesPercentage} className="h-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            {publishesLimit === 0
              ? 'Auto-publish disabled on this plan.'
              : publishesUsed >= publishesLimit
              ? 'Limit reached. Upgrade to continue publishing.'
              : `${publishesLimit - publishesUsed} publishes remaining this cycle.`}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Projects</span>
            <span className="text-sm text-muted-foreground">
              {projectsUsed} / {projectsLimit}
            </span>
          </div>
          <Progress value={projectsPercentage} className="h-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            {projectsUsed >= projectsLimit
              ? 'Project limit reached. Upgrade to create more.'
              : `${projectsLimit - projectsUsed} projects remaining.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>Billing controls</span>
          </div>
          {stripeCustomerId ? (
            <Button variant="outline" size="sm" onClick={handleOpenPortal} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Manage Billing
            </Button>
          ) : (
            <Badge variant="secondary">No Stripe customer linked yet</Badge>
          )}
        </div>

        {currentPlan !== 'pro' && (
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Upgrade for higher throughput</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Increase project slots and monthly publishes</li>
                  <li>• Enable advanced AI fallback chains</li>
                  <li>• Unlock team-ready automation workflows</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
