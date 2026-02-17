import { CalendarView } from "@/modules/planner/components/CalendarView"
import { OrgSwitcher } from "@/modules/org/components/OrgSwitcher"

export default function PlannerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Planner</h1>
        <OrgSwitcher />
      </div>
      <CalendarView />
    </div>
  )
}
