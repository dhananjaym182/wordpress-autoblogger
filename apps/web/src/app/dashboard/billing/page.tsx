import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgSwitcher } from '@/modules/org/components/OrgSwitcher';
import { CurrentPlan } from '@/modules/billing/components/CurrentPlan';
import { PricingTable } from '@/modules/billing/components/PricingTable';
import { requireSession } from '@/api/core/auth-context';
import { getBillingOverview } from '@/api/billing/service';

export default async function BillingPage() {
  const session = await requireSession();
  const billing = await getBillingOverview(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Plans"
        description="Track usage, manage subscriptions, and scale your publishing throughput."
        actions={<OrgSwitcher />}
      />

      <CurrentPlan
        currentPlan={billing.planId}
        planStatus={billing.planStatus}
        publishesUsed={billing.usage.publishesUsed}
        publishesLimit={billing.usage.publishesLimit}
        projectsUsed={billing.usage.projectsUsed}
        projectsLimit={billing.usage.projectsLimit}
        stripeCustomerId={billing.stripeCustomerId}
      />

      <Card>
        <CardHeader>
          <CardTitle>Upgrade Plan</CardTitle>
          <CardDescription>
            Select a plan to unlock more projects and automated publishing capacity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PricingTable currentPlan={billing.planId as 'free' | 'starter' | 'pro'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Activity</CardTitle>
          <CardDescription>Recent billing related events for this organization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {billing.billingEvents.length > 0 ? (
            billing.billingEvents.map((event: (typeof billing.billingEvents)[number]) => (
              <div key={event.id} className="flex items-center justify-between rounded-md border p-3">
                <span>{event.action}</span>
                <span>{new Date(event.createdAt).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p>No billing events recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

