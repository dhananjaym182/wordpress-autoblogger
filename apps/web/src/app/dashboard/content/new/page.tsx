import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireSession } from '@/api/core/auth-context';
import { getActiveMembership } from '@/api/core/organization-context';
import { listProjectsForOrganization } from '@/api/projects/service';
import { ContentEditor } from '@/modules/content/components/ContentEditor';

interface NewContentPageProps {
  searchParams?: {
    projectId?: string;
  };
}

export default async function NewContentPage({ searchParams }: NewContentPageProps) {
  const session = await requireSession();
  const { activeMembership } = await getActiveMembership(session.user.id);
  const projects = await listProjectsForOrganization(activeMembership.organizationId);

  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Create a project first</CardTitle>
          <CardDescription>
            Content drafts are scoped to a project. Create one to start drafting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/projects">Go to Projects</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const requestedProjectId = searchParams?.projectId;
  const selectedProject =
    projects.find((project: (typeof projects)[number]) => project.id === requestedProjectId) ?? projects[0];

  return (
    <ContentEditor
      projectId={selectedProject.id}
      projectName={selectedProject.name}
      backHref="/dashboard/content"
    />
  );
}

