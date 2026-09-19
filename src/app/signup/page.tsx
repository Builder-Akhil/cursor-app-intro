"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { notifySignupWebhookAction } from "@/app/auth/actions"
import { authErrorMessage } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"
import { hasEnvVars } from "@/lib/supabase/env"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checkEmail, setCheckEmail] = useState(searchParams.get("checkEmail") === "1")
  const [emailForResend, setEmailForResend] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(formData: FormData) {
    setError("")
    setPending(true)

    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim().toLowerCase()
    const password = String(formData.get("password") ?? "")
    const confirm = String(formData.get("confirm") ?? "")

    if (!name) {
      setError("Add your name so the logbook knows who is flying.")
      setPending(false)
      return
    }
    if (!email.includes("@")) {
      setError("Use a real email so we can find your hangar later.")
      setPending(false)
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      setPending(false)
      return
    }
    if (password !== confirm) {
      setError("Those two passwords do not match.")
      setPending(false)
      return
    }

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (signUpError) {
      const already =
        signUpError.message.toLowerCase().includes("already registered") ||
        signUpError.message.toLowerCase().includes("already been registered")
      if (already) {
        setEmailForResend(email)
        setCheckEmail(true)
        setError("That hangar already exists. Resend the confirmation if you have not cleared in yet.")
        setPending(false)
        return
      }
      setError(authErrorMessage(signUpError.message))
      setPending(false)
      return
    }

    const likelyExisting =
      Boolean(data.user) && (data.user?.identities?.length ?? 0) === 0
    if (!likelyExisting) {
      try {
        await notifySignupWebhookAction({ name, email })
      } catch {
        // Radio to n8n can fail; hangar doors still open.
      }
    }

    if (!data.session) {
      setEmailForResend(email)
      setCheckEmail(true)
      setPending(false)
      return
    }

    router.push("/onboarding")
    router.refresh()
  }

  async function resendConfirmation() {
    if (!emailForResend.includes("@")) {
      setError("Add the same email you used to create the hangar.")
      return
    }
    setPending(true)
    setError("")
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: emailForResend,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
    setPending(false)
    if (resendError) setError(authErrorMessage(resendError.message))
  }

  if (checkEmail) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
        <Card className="glass fade-up border-white/70 shadow-none">
          <CardHeader>
            <CardTitle className="font-display text-4xl uppercase tracking-wide">Check your inbox</CardTitle>
            <CardDescription className="text-base">
              Holding pattern — confirm the email we sent, then you can taxi to onboarding.
              Open that link in this same browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resend-email">Email</Label>
              <Input
                id="resend-email"
                type="email"
                value={emailForResend}
                onChange={(e) => setEmailForResend(e.target.value)}
                placeholder="peter@dailybugle.demo"
                className="h-11 rounded-xl bg-white/80"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <ShinyButton
              type="button"
              disabled={pending}
              onClick={() => void resendConfirmation()}
              className="w-full !px-6"
            >
              {pending ? "Sending…" : "Resend confirmation"}
            </ShinyButton>
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
          <CardTitle className="font-display text-4xl uppercase tracking-wide">Create your Fable hangar</CardTitle>
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
