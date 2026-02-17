import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ExternalLink, Settings } from 'lucide-react';

export const metadata = {
  title: 'Projects | AutoBlogger',
  description: 'Manage your AutoBlogger projects',
};

async function getProjects(userId: string) {
  // Get user's organization
  const membership = await db.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
  });

  if (!membership) {
    return [];
  }

  // Get projects for the organization
  return db.project.findMany({
    where: { organizationId: membership.organizationId },
    include: {
      wpConnection: true,
      _count: {
        select: { scheduledPosts: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const projects = await getProjects(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your WordPress sites and content projects
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>
              Create your first project to start publishing content to WordPress
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {project.wpConnection?.siteUrl || 'No site connected'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/projects/${project.id}/settings`}>
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        project.wpConnection?.status === 'ok'
                          ? 'bg-green-100 text-green-800'
                          : project.wpConnection?.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {project.wpConnection?.status === 'ok'
                        ? 'Connected'
                        : project.wpConnection?.status === 'error'
                        ? 'Error'
                        : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Scheduled Posts</span>
                    <span className="font-medium">{project._count.scheduledPosts}</span>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/projects/${project.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Project
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
