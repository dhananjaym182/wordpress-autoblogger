import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrgSwitcher } from "@/modules/org/components/OrgSwitcher"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <OrgSwitcher />
      </div>

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

          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Export data</Button>
            <Button variant="destructive">Delete account</Button>
          </div>
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
