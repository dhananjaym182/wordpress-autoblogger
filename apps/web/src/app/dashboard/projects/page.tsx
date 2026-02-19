import { OrgSwitcher } from '@/modules/org/components/OrgSwitcher';
import { ProjectsPage } from '@/modules/projects/components/ProjectsPage';
import { requireSession } from '@/api/core/auth-context';
import { getActiveMembership } from '@/api/core/organization-context';
import { getProjectSwitcherState, listProjectsForOrganization } from '@/api/projects/service';
import { PageHeader } from '@/components/ui/page-header';

export default async function DashboardProjectsRoute() {
  const session = await requireSession();
  const { activeMembership } = await getActiveMembership(session.user.id);
  const [projects, projectSwitcher] = await Promise.all([
    listProjectsForOrganization(activeMembership.organizationId),
    getProjectSwitcherState(session.user.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Create and manage organization projects connected to WordPress."
        actions={<OrgSwitcher />}
      />

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
