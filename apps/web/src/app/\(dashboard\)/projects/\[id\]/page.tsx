import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Settings, Link2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

async function getProject(projectId: string, userId: string) {
  const membership = await db.organizationMember.findFirst({
    where: { userId },
    select: { organizationId: true },
  });

  if (!membership) return null;

  return db.project.findFirst({
    where: {
      id: projectId,
      organizationId: membership.organizationId,
    },
    include: {
      wpConnection: true,
      scheduledPosts: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const project = await getProject(params.id, session.user.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">
              {project.description || 'No description'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/projects/${project.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/projects/${project.id}/posts/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* WordPress Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              WordPress Connection
            </CardTitle>
            <CardDescription>Connect your WordPress site to publish content</CardDescription>
          </CardHeader>
          <CardContent>
            {project.wpConnection ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Site URL</span>
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {project.wpConnection.siteUrl}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      project.wpConnection.status === 'ok'
                        ? 'default'
                        : project.wpConnection.status === 'error'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {project.wpConnection.status}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/projects/${project.id}/connection`}>Manage Connection</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  No WordPress site connected yet
                </p>
                <Button asChild>
                  <Link href={`/projects/${project.id}/connection`}>Connect WordPress</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your most recently created posts</CardDescription>
          </CardHeader>
          <CardContent>
            {project.scheduledPosts.length > 0 ? (
              <div className="space-y-3">
                {project.scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.status} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">No posts created yet</p>
                <Button variant="outline" asChild>
                  <Link href={`/projects/${project.id}/posts/new`}>Create First Post</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
