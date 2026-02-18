import { PageHeader } from '@/components/ui/page-header';
import { OrgSwitcher } from '@/modules/org/components/OrgSwitcher';
import { CalendarView } from '@/modules/planner/components/CalendarView';
import { requireSession } from '@/api/core/auth-context';
import { getPlannerData } from '@/api/planner/service';

export default async function PlannerPage() {
  const session = await requireSession();
  const data = await getPlannerData(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planner"
        description="Coordinate publishing across projects with a calendar-first workflow."
        actions={<OrgSwitcher />}
      />
      <CalendarView
        projects={data.projects.map((project: (typeof data.projects)[number]) => ({
          id: project.id,
          name: project.name,
        }))}
        posts={data.scheduledPosts.map((post: (typeof data.scheduledPosts)[number]) => ({
          id: post.id,
          title: post.title,
          status: post.status as 'draft' | 'scheduled' | 'published' | 'failed',
          desiredStatus: post.desiredStatus as 'draft' | 'publish',
          scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
          projectId: post.projectId,
          projectName: post.project.name,
        }))}
      />
    </div>
  );
}

