import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { BrandLogo } from "@/components/brand/BrandLogo"
import SignIn from "@/modules/auth/components/LoginForm"

export const metadata = {
  title: "Sign In | AutoBlogger",
  description: "Sign in to your AutoBlogger account",
}

const valuePoints = [
  "Access your content pipeline and scheduler",
  "Manage publishing automations across projects",
  "Monitor SEO quality, jobs, and publishing status",
]

export default function LoginPage() {
  return (
    <section className="container mx-auto px-4">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="hidden rounded-2xl border border-border/70 bg-background/75 p-8 backdrop-blur-sm lg:block">
          <div className="mb-6">
            <BrandLogo variant="icon" size={36} mode="auto" label="AutoBlogger" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-3 text-muted-foreground">
            Continue publishing high-quality WordPress content with AI-assisted workflows.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {valuePoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted-foreground">
            New to AutoBlogger?{" "}
            <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <SignIn />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/legal/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
