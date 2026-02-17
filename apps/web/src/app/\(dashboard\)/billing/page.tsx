import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PLAN_LIMITS, getPlanName } from '@autoblogger/shared/constants/plans';
import { Check, X } from 'lucide-react';

export const metadata = {
  title: 'Billing | AutoBlogger',
  description: 'Manage your subscription and billing',
};

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out AutoBlogger',
    features: [
      '1 project',
      '10 drafts per month',
      'Basic SEO tools',
      'Manual publishing only',
    ],
    notIncluded: [
      'Auto-publish',
      'Bring Your Own Key (BYOK)',
      'AI content templates',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    description: 'For content creators getting started',
    features: [
      '3 projects',
      '30 publishes per month',
      'Advanced SEO tools',
      'Auto-publish',
      'Bring Your Own Key (BYOK)',
    ],
    notIncluded: ['AI content templates'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    description: 'For professional content teams',
    features: [
      '10 projects',
      '120 publishes per month',
      'Advanced SEO tools',
      'Auto-publish',
      'Bring Your Own Key (BYOK)',
      'AI content templates',
      'Priority support',
    ],
    notIncluded: [],
  },
];

async function getOrganization(userId: string) {
  const membership = await db.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
  });
  return membership?.organization;
}

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const organization = await getOrganization(session.user.id);

  if (!organization) {
    redirect('/projects');
  }

  const currentPlanId = organization.planId;
  const currentPlan = plans.find((p) => p.id === currentPlanId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      <Separator />

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the {currentPlan?.name} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">
                ${currentPlan?.price}
                <span className="text-lg text-muted-foreground">/month</span>
              </div>
              <Badge variant={currentPlanId === 'free' ? 'secondary' : 'default'}>
                {currentPlan?.name}
              </Badge>
            </div>
            {currentPlanId !== 'free' && (
              <Button variant="outline">Manage Subscription</Button>
            )}
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Projects</p>
              <p className="font-medium">
                {PLAN_LIMITS[currentPlanId as keyof typeof PLAN_LIMITS]?.maxProjects} max
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Publishes This Month</p>
              <p className="font-medium">{organization.publishesThisMonth}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plan Status</p>
              <p className="font-medium capitalize">{organization.planStatus}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${plan.id === currentPlanId ? 'border-primary' : ''}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.id === currentPlanId && <Badge>Current</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-muted-foreground">
                    <X className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              {plan.id === currentPlanId ? (
                <Button className="w-full" disabled>
                  Current Plan
                </Button>
              ) : plan.id === 'free' ? (
                <Button className="w-full" variant="outline" disabled={currentPlanId === 'free'}>
                  {currentPlanId === 'free' ? 'Current Plan' : 'Downgrade'}
                </Button>
              ) : (
                <Button className="w-full">Upgrade</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
