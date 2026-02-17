"use client"

import { useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type OnboardingStep = "plan" | "project" | "wordpress" | "content" | "complete"

const STEPS: { key: OnboardingStep; title: string; description: string }[] = [
  {
    key: "plan",
    title: "Choose a Plan",
    description: "Start with a free plan or upgrade for more features",
  },
  {
    key: "project",
    title: "Create a Project",
    description: "Set up your first WordPress blog project",
  },
  {
    key: "wordpress",
    title: "Connect WordPress",
    description: "Install our plugin or use application passwords",
  },
  {
    key: "content",
    title: "Create Your First Post",
    description: "Generate AI-powered content for your blog",
  },
  {
    key: "complete",
    title: "You're All Set!",
    description: "Start creating amazing content with AutoBlogger",
  },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("plan")
  const [data, setData] = useState({
    plan: "free",
    projectName: "",
    projectDescription: "",
    wpUrl: "",
    wpMode: "plugin",
  })

  const currentStepIndex = STEPS.findIndex((step) => step.key === currentStep)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const handleNext = () => {
    const stepOrder: OnboardingStep[] = ["plan", "project", "wordpress", "content", "complete"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handleSkip = () => {
    setCurrentStep("complete")
  }

  const renderStep = () => {
    switch (currentStep) {
      case "plan":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card
                className={`cursor-pointer transition-all ${
                  data.plan === "free" ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setData({ ...data, plan: "free" })}
              >
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">$0</div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>1 project</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>10 drafts/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Basic SEO tools</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all ${
                  data.plan === "starter" ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setData({ ...data, plan: "starter" })}
              >
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">$29<span className="text-sm text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>3 projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>30 publishes/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Auto-publish</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all ${
                  data.plan === "pro" ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setData({ ...data, plan: "pro" })}
              >
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">$99<span className="text-sm text-muted-foreground">/mo</span></div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>10 projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>120 publishes/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Content templates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "project":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2"
                placeholder="My Awesome Blog"
                value={data.projectName}
                onChange={(e) => setData({ ...data, projectName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description (optional)</label>
              <textarea
                className="w-full rounded-md border px-3 py-2"
                placeholder="Tell us about your blog..."
                rows={3}
                value={data.projectDescription}
                onChange={(e) => setData({ ...data, projectDescription: e.target.value })}
              />
            </div>
          </div>
        )

      case "wordpress":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">WordPress URL</label>
              <input
                type="url"
                className="w-full rounded-md border px-3 py-2"
                placeholder="https://yourblog.com"
                value={data.wpUrl}
                onChange={(e) => setData({ ...data, wpUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name="wp-mode"
                  value="plugin"
                  checked={data.wpMode === "plugin"}
                  onChange={() => setData({ ...data, wpMode: "plugin" })}
                />
                <span>Use Plugin (Recommended)</span>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name="wp-mode"
                  value="app-password"
                  checked={data.wpMode === "app-password"}
                  onChange={() => setData({ ...data, wpMode: "app-password" })}
                />
                <span>Use Application Password</span>
              </label>
            </div>
          </div>
        )

      case "content":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content Topic</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2"
                placeholder="e.g., Getting Started with AI Tools"
                value={data.projectName}
                onChange={(e) => setData({ ...data, projectName: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={() => {}}>
              Generate with AI
            </Button>
          </div>
        )

      case "complete":
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">You're All Set!</h3>
            <p className="text-muted-foreground">
              Start creating amazing content with AutoBlogger
            </p>
            <Button size="lg" onClick={() => {}}>
              Go to Dashboard
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Get Started with AutoBlogger</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          <Progress value={progress} className="h-2 mb-6" />

          <div className="flex items-start justify-between mb-8">
            {STEPS.map((step, index) => (
              <div key={step.key} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    index <= currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {renderStep()}

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(STEPS[Math.max(0, currentStepIndex - 1)].key)}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === "complete" ? "Get Started" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
