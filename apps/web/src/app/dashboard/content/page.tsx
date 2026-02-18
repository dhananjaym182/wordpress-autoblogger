import Link from 'next/link';
import { FilePlus2, FolderOpenDot, LibraryBig, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/ui/page-header';
import { StatsCard } from '@/components/ui/stats-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { OrgSwitcher } from '@/modules/org/components/OrgSwitcher';
import { requireSession } from '@/api/core/auth-context';
import { requireActiveProjectForUser } from '@/api/core/project-context';
import { getContentDashboardData } from '@/api/content/service';

export default async function ContentPage() {
  const session = await requireSession();
  const { activeProject } = await requireActiveProjectForUser(session.user.id);
  const data = await getContentDashboardData(session.user.id, {
    projectId: activeProject.id,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Studio"
        description="Monitor draft throughput, track publishing progress, and jump directly into post creation."
        actions={
          <>
            <OrgSwitcher />
            <Button asChild>
              <Link
                href={
                  activeProject
                    ? `/dashboard/content/new?projectId=${activeProject.id}`
                    : '/dashboard/projects'
                }
              >
                <FilePlus2 className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Posts"
          value={data.metrics.totalPosts}
          description="Across all projects in this organization"
          icon={<LibraryBig className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Drafts"
          value={data.metrics.draftPosts}
          description="Posts waiting for refinement"
          icon={<FolderOpenDot className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Scheduled"
          value={data.metrics.scheduledPosts}
          description="Queued for automated publish"
          icon={<Rocket className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Published"
          value={data.metrics.publishedPosts}
          description="Posts already published to WordPress"
          icon={<Rocket className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Pipelines</CardTitle>
          <CardDescription>Switch active project from the header to move across pipelines.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {data.projects.length > 0 ? (
            data.projects.map((project: (typeof data.projects)[number]) => (
              <Card key={project.id} className="border-border/70 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <CardDescription>/{project.slug}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.description ? (
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No project description yet.</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project._count.scheduledPosts} posts tracked</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/content/new?projectId=${project.id}`}>Create Draft</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed md:col-span-2">
              <CardHeader>
                <CardTitle>No projects found</CardTitle>
                <CardDescription>Create a project before drafting content.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/dashboard/projects">Create project</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Latest activity from all projects.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentPosts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentPosts.map((post: (typeof data.recentPosts)[number]) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.project.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell>{new Date(post.updatedAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/content/new?projectId=${post.project.id}&postId=${post.id}`}>
                          Edit Draft
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No posts yet. Create your first draft.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
