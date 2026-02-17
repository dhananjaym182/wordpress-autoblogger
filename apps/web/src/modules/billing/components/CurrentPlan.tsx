"use client"

import { ArrowRight, BarChart3, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface CurrentPlanProps {
  currentPlan: string
  publishesUsed: number
  publishesLimit: number
  projectsUsed: number
  projectsLimit: number
}

export function CurrentPlan({
  currentPlan,
  publishesUsed,
  publishesLimit,
  projectsUsed,
  projectsLimit,
}: CurrentPlanProps) {
  const publishesPercentage = Math.round((publishesUsed / publishesLimit) * 100)
  const projectsPercentage = Math.round((projectsUsed / projectsLimit) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Plan</CardTitle>
          <Badge variant="outline" className="capitalize">
            {currentPlan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Publish Usage</span>
            <span className="text-sm text-muted-foreground">
              {publishesUsed} / {publishesLimit}
            </span>
          </div>
          <Progress value={publishesPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {publishesUsed >= publishesLimit ? "Limit reached. Upgrade to continue publishing." : `${publishesLimit - publishesUsed} publishes remaining`}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Projects</span>
            <span className="text-sm text-muted-foreground">
              {projectsUsed} / {projectsLimit}
            </span>
          </div>
          <Progress value={projectsPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {projectsUsed >= projectsLimit ? "Project limit reached. Upgrade to create more." : `${projectsLimit - projectsUsed} projects remaining`}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>View detailed analytics</span>
          </div>
          <Button variant="outline" size="sm">
            Upgrade Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {currentPlan !== "pro" && (
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Upgrade to Pro for more features</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• 10 projects</li>
                  <li>• 120 publishes/month</li>
                  <li>• Content templates</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
