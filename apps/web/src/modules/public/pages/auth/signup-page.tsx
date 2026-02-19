import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { BrandLogo } from "@/components/brand/BrandLogo"
import SignUp from "@/modules/auth/components/SignupForm"

export const metadata = {
  title: "Sign Up | AutoBlogger",
  description: "Create your AutoBlogger account",
}

const onboardingPoints = [
  "Connect your WordPress site securely",
  "Generate SEO-ready drafts from prompts",
  "Automate publishing with calendar scheduling",
]

export default function SignupPage() {
  return (
    <section className="container mx-auto px-4">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="hidden rounded-2xl border border-border/70 bg-background/75 p-8 backdrop-blur-sm lg:block">
          <div className="mb-6">
            <BrandLogo variant="icon" size={36} mode="auto" label="AutoBlogger" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Create your workspace</h1>
          <p className="mt-3 text-muted-foreground">
            Start with a free account and scale your publishing pipeline as content volume grows.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {onboardingPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <SignUp />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
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
