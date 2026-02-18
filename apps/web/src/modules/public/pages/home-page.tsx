import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "AI Content Generation",
    description: "Generate polished, SEO-aware drafts with the model provider of your choice.",
    points: ["Multi-provider AI routing", "SEO optimization and quality gates", "Content moderation guardrails"],
  },
  {
    title: "Smart Scheduling",
    description: "Plan your publishing calendar with retries, status tracking, and automation.",
    points: ["Calendar planning view", "Bulk scheduling workflows", "Auto-publish with retry logic"],
  },
  {
    title: "WordPress Integration",
    description: "Connect your WordPress sites securely and publish in native Gutenberg format.",
    points: ["Secure plugin integration", "Media library synchronization", "SEO metadata support"],
  },
  {
    title: "Featured Images",
    description: "Attach stronger visuals automatically or curate your own media assets.",
    points: ["AI image generation", "Local or URL-based upload", "Web-optimized output sizing"],
  },
  {
    title: "Bring Your Own Keys",
    description: "Use your existing OpenAI or Anthropic keys and control cost by provider.",
    points: ["OpenAI and Anthropic support", "Fallback model chains", "Provider-level cost visibility"],
  },
  {
    title: "Analytics & Quality",
    description: "Track output quality and monitor pipeline health before publishing.",
    points: ["SEO and readability scoring", "Usage metrics and trend visibility", "Detailed job logs"],
  },
]

const pricing = [
  {
    name: "Free",
    price: "$0",
    cadence: "/month",
    description: "Perfect for validating your workflow.",
    features: ["1 Project", "10 Drafts/month", "AI content generation"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$29",
    cadence: "/month",
    description: "For teams running active content operations.",
    features: ["3 Projects", "30 Publishes/month", "Auto-publish + BYOK"],
    cta: "Start Starter",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$99",
    cadence: "/month",
    description: "For high-volume brands and agencies.",
    features: ["10 Projects", "120 Publishes/month", "BYOK + reusable templates"],
    cta: "Go Pro",
    highlighted: false,
  },
]

const proofPoints = [
  { label: "Avg draft time", value: "4 min" },
  { label: "Publishing reliability", value: "99.9%" },
  { label: "Supported workflows", value: "BYOK + Auto" },
]

const workflow = [
  {
    title: "1. Generate",
    description: "Draft complete outlines and posts with provider fallback logic.",
  },
  {
    title: "2. Review",
    description: "Run quality gates, edit content, and attach featured media.",
  },
  {
    title: "3. Publish",
    description: "Schedule or auto-publish to WordPress with retry safeguards.",
  },
]

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <section className="container mx-auto px-4 text-center">
        <div className="mx-auto w-fit rounded-xl border border-sky-200/80 bg-sky-50/80 px-2.5 py-1.5 text-sm text-sky-800 backdrop-blur-md dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-100">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-300" />
            Publish smarter with AI-driven WordPress automation.
          </span>
        </div>

        <h1 className="mx-auto mt-8 max-w-4xl text-balance text-5xl font-bold tracking-tight sm:text-7xl">
          AI-Powered WordPress Autoblogging That Ships on Schedule
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Generate, review, schedule, and publish high-quality blog posts from one workflow.
          Reduce manual effort while improving content consistency and SEO readiness.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {proofPoints.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border/60 bg-background/80 p-3 text-left backdrop-blur-md"
            >
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need</h2>
          <p className="mt-3 text-muted-foreground">
            Built for fast editorial operations, from draft to publish.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/70 bg-background/80 backdrop-blur-md transition-colors duration-200 hover:bg-accent/30"
            >
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pt-20">
        <div className="mx-auto max-w-5xl rounded-2xl border border-border/70 bg-background/80 p-6 backdrop-blur-md sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How It Works</h2>
          <p className="mt-2 text-muted-foreground">
            A lightweight pipeline designed for speed, consistency, and safe automation.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {workflow.map((step) => (
              <div key={step.title} className="rounded-xl border border-border/60 bg-background/75 p-4">
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="container mx-auto px-4 pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple Pricing</h2>
          <p className="mt-3 text-muted-foreground">
            Start free and scale as your publishing cadence grows.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {pricing.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "border-border/70 bg-background/80 backdrop-blur-md",
                tier.highlighted && "border-primary shadow-lg shadow-primary/10"
              )}
            >
              <CardHeader>
                {tier.highlighted ? (
                  <div className="mb-2 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Most Popular
                  </div>
                ) : null}
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="pb-1 text-muted-foreground">{tier.cadence}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {tier.features.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={tier.highlighted ? "default" : "outline"} asChild>
                  <Link href="/signup">{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/70">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} AutoBlogger. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/legal/privacy" className="cursor-pointer transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/terms" className="cursor-pointer transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/legal/cookies" className="cursor-pointer transition-colors hover:text-foreground">
              Cookies
            </Link>
            <Link href="/docs/api" className="cursor-pointer transition-colors hover:text-foreground">
              API Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
