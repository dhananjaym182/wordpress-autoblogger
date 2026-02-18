import { PageHeader } from '@/components/ui/page-header';
import { OrgSwitcher } from '@/modules/org/components/OrgSwitcher';
import { JobLogsList } from '@/modules/jobs/components/JobLogsList';
import { requireSession } from '@/api/core/auth-context';
import { getJobLogsForActiveOrganization } from '@/api/jobs/service';

export default async function JobsPage() {
  const session = await requireSession();
  const logs = await getJobLogsForActiveOrganization(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Operations"
        description="Track worker execution, provider fallback behavior, and publish outcomes."
        actions={<OrgSwitcher />}
      />
      <JobLogsList
        logs={logs.map((log: (typeof logs)[number]) => ({
          id: log.id,
          scheduledPostId: log.scheduledPostId,
          scheduledPostTitle: log.scheduledPost.title,
          projectName: log.scheduledPost.project.name,
          status: log.status as 'running' | 'completed' | 'failed',
          startedAt: log.startedAt.toISOString(),
          finishedAt: log.finishedAt ? log.finishedAt.toISOString() : null,
          durationMs: log.durationMs ?? null,
          textProviderUsed: log.textProviderUsed,
          imageProviderUsed: log.imageProviderUsed,
          fallbackCount: log.fallbackCount,
          wpResponseCode: log.wpResponseCode ?? null,
          errorCode: log.errorCode ?? null,
          errorMessage: log.errorMessage ?? null,
          traceId: log.traceId,
        }))}
      />
    </div>
  );
}

