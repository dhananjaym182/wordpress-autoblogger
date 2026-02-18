import { OrgSwitcher } from '@/modules/org/components/OrgSwitcher';
import { ProjectsPage } from '@/modules/projects/components/ProjectsPage';
import { requireSession } from '@/api/core/auth-context';
import { getActiveMembership } from '@/api/core/organization-context';
import { listProjectsForOrganization } from '@/api/projects/service';

export default async function DashboardProjectsRoute() {
  const session = await requireSession();
  const { activeMembership } = await getActiveMembership(session.user.id);
  const projects = await listProjectsForOrganization(activeMembership.organizationId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Create and manage organization projects connected to WordPress.
          </p>
        </div>
        <OrgSwitcher />
      </div>

      <ProjectsPage
        projects={projects.map((project: (typeof projects)[number]) => ({
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          createdAt: project.createdAt.toISOString(),
          wpStatus: project.wpConnection?.status ?? null,
          wpSiteUrl: project.wpConnection?.siteUrl ?? null,
        }))}
      />
    </div>
  );
}
