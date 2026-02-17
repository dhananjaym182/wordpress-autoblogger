import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, FileText } from 'lucide-react';

export const metadata = {
  title: 'Planner | AutoBlogger',
  description: 'Schedule and manage your content calendar',
};

async function getUpcomingPosts(userId: string) {
  const membership = await db.organizationMember.findFirst({
    where: { userId },
    select: { organizationId: true },
  });

  if (!membership) return [];

  return db.scheduledPost.findMany({
    where: {
      project: {
        organizationId: membership.organizationId,
      },
      status: {
        in: ['draft', 'scheduled'],
      },
    },
    include: {
      project: {
        select: { name: true },
      },
    },
    orderBy: { scheduledAt: 'asc' },
    take: 10,
  });
}

export default async function PlannerPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const upcomingPosts = await getUpcomingPosts(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Planner</h1>
        <p className="text-muted-foreground">Schedule and manage your content calendar</p>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingPosts.filter((p) => p.status === 'scheduled').length}
            </div>
            <p className="text-xs text-muted-foreground">Posts scheduled for publishing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingPosts.filter((p) => p.status === 'draft').length}
            </div>
            <p className="text-xs text-muted-foreground">Posts in draft status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publishing Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                upcomingPosts.filter(
                  (p) =>
                    p.scheduledAt &&
                    new Date(p.scheduledAt) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Posts publishing in next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Content</CardTitle>
          <CardDescription>Your scheduled and draft posts</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingPosts.length > 0 ? (
            <div className="space-y-4">
              {upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.project.name} • {post.status}
                    </p>
                  </div>
                  <div className="text-right">
                    {post.scheduledAt ? (
                      <p className="text-sm font-medium">
                        {new Date(post.scheduledAt).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not scheduled</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {post.scheduledAt
                        ? new Date(post.scheduledAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No upcoming posts</p>
              <p className="text-sm text-muted-foreground">
                Create posts in your projects to see them here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
