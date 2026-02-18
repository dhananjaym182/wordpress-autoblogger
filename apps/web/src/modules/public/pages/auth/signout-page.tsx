"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signOut } from "@/modules/auth/lib/auth-client"

type SignOutStatus = "pending" | "success" | "error"

export default function SignOutPage() {
  const [status, setStatus] = useState<SignOutStatus>("pending")

  useEffect(() => {
    let active = true

    async function runSignOut() {
      try {
        await signOut()
        if (active) {
          setStatus("success")
        }
      } catch {
        if (active) {
          setStatus("error")
        }
      }
    }

    runSignOut()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="container mx-auto flex justify-center px-4">
      <Card className="w-full max-w-md border-border/70 bg-background/80 backdrop-blur-md shadow-lg shadow-primary/5">
        <CardHeader className="space-y-4 text-center">
          {status === "pending" ? (
            <div className="mx-auto rounded-full bg-primary/10 p-3 text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : null}
          {status === "success" ? (
            <div className="mx-auto rounded-full bg-green-500/10 p-3 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          ) : null}
          {status === "error" ? (
            <div className="mx-auto rounded-full bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
          ) : null}

          <CardTitle>
            {status === "pending" && "Signing you out"}
            {status === "success" && "Signed out successfully"}
            {status === "error" && "Sign out failed"}
          </CardTitle>
          <CardDescription>
            {status === "pending" && "Please wait while your session is being closed securely."}
            {status === "success" && "Your session has ended. You can sign in again at any time."}
            {status === "error" && "We could not complete sign out automatically. Try again or return home."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/login">Go to Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
