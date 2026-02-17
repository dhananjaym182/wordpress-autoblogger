import { CurrentPlan } from "@/modules/billing/components/CurrentPlan"
import { PricingTable } from "@/modules/billing/components/PricingTable"
import { OrgSwitcher } from "@/modules/org/components/OrgSwitcher"

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Billing & Plans</h1>
        <OrgSwitcher />
      </div>

      <CurrentPlan
        currentPlan="starter"
        publishesUsed={15}
        publishesLimit={30}
        projectsUsed={2}
        projectsLimit={3}
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
        <PricingTable />
      </div>

      <div className="rounded-lg border bg-muted/20 p-6">
        <h3 className="text-lg font-semibold mb-2">Billing History</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between py-2 border-b">
            <span>Pro Plan - January 2024</span>
            <span className="font-medium text-foreground">$99.00</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Pro Plan - December 2023</span>
            <span className="font-medium text-foreground">$99.00</span>
          </div>
        </div>
      </div>
    </div>
  )
}
