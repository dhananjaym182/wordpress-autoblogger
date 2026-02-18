import { ProviderList } from "@/modules/ai/components/ProviderList"
import { OrgSwitcher } from "@/modules/org/components/OrgSwitcher"

export default function AIPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Providers</h1>
        <OrgSwitcher />
      </div>
      <ProviderList />
    </div>
  )
}
