import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { OrgSwitcher } from "@/modules/org/components/OrgSwitcher"
import { SettingsActions } from "@/modules/settings/components/SettingsActions"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage account lifecycle, compliance exports, and workspace preferences."
        actions={<OrgSwitcher />}
      />

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your profile, security, and account lifecycle settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <p className="font-medium">Email verification</p>
              <p className="text-sm text-muted-foreground">Verified users can access dashboard features.</p>
            </div>
            <Badge>Verified</Badge>
          </div>

          <SettingsActions />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Preferences</CardTitle>
          <CardDescription>Configure workspace behavior and publishing defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Use this section to set content defaults, SEO preferences, and notification behaviors.</p>
          <p>Advanced controls can be progressively added module-by-module as defined in the implementation plan.</p>
        </CardContent>
      </Card>
    </div>
  )
}
