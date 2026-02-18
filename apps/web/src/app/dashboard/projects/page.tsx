import { OrgSwitcher } from '@/modules/org/components/OrgSwitcher';
import { ProjectsPage } from '@/modules/projects/components/ProjectsPage';
import { requireSession } from '@/api/core/auth-context';
import { getActiveMembership } from '@/api/core/organization-context';
import { getProjectSwitcherState, listProjectsForOrganization } from '@/api/projects/service';

export default async function DashboardProjectsRoute() {
  const session = await requireSession();
  const { activeMembership } = await getActiveMembership(session.user.id);
  const [projects, projectSwitcher] = await Promise.all([
    listProjectsForOrganization(activeMembership.organizationId),
    getProjectSwitcherState(session.user.id),
  ]);

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
        activeProjectId={projectSwitcher.activeProjectId}
        projects={projects.map((project: (typeof projects)[number]) => ({
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          createdAt: project.createdAt.toISOString(),
          wpConnection: project.wpConnection
            ? {
                id: project.wpConnection.id,
                status: project.wpConnection.status ?? null,
                mode: project.wpConnection.mode ?? null,
                siteUrl: project.wpConnection.siteUrl ?? null,
                lastError: project.wpConnection.lastError ?? null,
                lastCheckedAt: project.wpConnection.lastCheckedAt
                  ? project.wpConnection.lastCheckedAt.toISOString()
                  : null,
                keyId: project.wpConnection.keyId ?? null,
                wpUsername: project.wpConnection.wpUsername ?? null,
              }
            : null,
        }))}
      />
    </div>
  );
}
