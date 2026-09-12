"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { loginAction } from "@/app/auth/actions"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hasEnvVars } from "@/lib/supabase/env"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/app"
  const confirmed = searchParams.get("confirmed") === "1"
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(formData: FormData) {
    setError("")
    setPending(true)
    const result = await loginAction(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <Card className="glass fade-up border-white/70 shadow-none">
        <CardHeader>
          <CardTitle className="font-display text-4xl uppercase tracking-wide">Sign in to Fable</CardTitle>
          <CardDescription className="font-serif text-base">
            {confirmed
              ? "Email confirmed — sign in with the same password to enter the cockpit."
              : "Returning pilot — same hangar, same logbook, wherever you land."}
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
            <input type="hidden" name="next" value={next} />
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
                autoComplete="current-password"
                required
                className="h-11 rounded-xl bg-white/80"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <ShinyButton type="submit" disabled={pending} className="w-full !px-6">
              {pending ? "Taxiing in…" : "Sign in"}
            </ShinyButton>
            <p className="text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Create a hangar
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
