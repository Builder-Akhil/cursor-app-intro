"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { signupAction } from "@/app/auth/actions"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hasEnvVars } from "@/lib/supabase/env"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const checkEmail = searchParams.get("checkEmail") === "1"
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(formData: FormData) {
    setError("")
    setPending(true)
    const result = await signupAction(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  if (checkEmail) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
        <Card className="glass fade-up border-white/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">Check your inbox</CardTitle>
            <CardDescription className="text-base">
              Holding pattern — confirm the email we sent, then you can taxi to onboarding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login" className="text-sm text-primary hover:underline">
              Already confirmed? Sign in
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <Card className="glass fade-up border-white/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Create your Fable hangar</CardTitle>
          <CardDescription className="text-base">
            Email and a password — this is a real badge, not the guest book.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasEnvVars() && (
            <p className="mb-4 rounded-xl bg-secondary/80 p-3 text-sm text-muted-foreground">
              Hangar keys are missing. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to <code>.env.local</code>.
            </p>
          )}
          <form action={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                placeholder="Peter"
                className="h-11 rounded-xl bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="peter@dailybugle.demo"
                className="h-11 rounded-xl bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="At least 8 characters"
                className="h-11 rounded-xl bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="h-11 rounded-xl bg-white/80"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <ShinyButton type="submit" disabled={pending} className="w-full !px-6">
              {pending ? "Opening hangar…" : "Create hangar"}
            </ShinyButton>
            <p className="text-center text-sm text-muted-foreground">
              Already flying?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
            <Link
              href="/"
              className="inline-flex h-8 w-full items-center justify-center rounded-lg text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Back to landing
            </Link>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
