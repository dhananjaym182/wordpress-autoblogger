import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPlanName } from '@autoblogger/shared/constants/plans';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Settings | AutoBlogger',
  description: 'Manage your account and organization settings',
};

async function getOrganization(userId: string) {
  const membership = await db.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
  });
  return membership?.organization;
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const organization = await getOrganization(session.user.id);

  if (!organization) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and organization settings</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No Organization Found</CardTitle>
            <CardDescription>
              Please contact support if you believe this is an error.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and organization settings</p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Organization Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Manage your organization details and plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground">{organization.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <p className="text-sm text-muted-foreground">{organization.slug}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Current Plan</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={organization.planId === 'free' ? 'secondary' : 'default'}>
                  {getPlanName(organization.planId)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {organization.planStatus === 'active' ? 'Active' : organization.planStatus}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your personal account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground">{session.user.name || 'Not set'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email Verification</label>
              <div className="flex items-center gap-2 mt-1">
                {session.user.emailVerifiedAt ? (
                  <Badge variant="default" className="bg-green-500">Verified</Badge>
                ) : (
                  <Badge variant="destructive">Not Verified</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
