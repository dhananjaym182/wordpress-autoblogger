import { JobLogsList } from "@/modules/jobs/components/JobLogsList"
import { OrgSwitcher } from "@/modules/org/components/OrgSwitcher"

export default function JobsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Job Logs</h1>
        <OrgSwitcher />
      </div>
      <JobLogsList />
    </div>
  )
}
