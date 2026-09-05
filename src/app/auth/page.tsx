"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { findProfileByEmail, loadState, setProfile } from "@/lib/storage"

export default function AuthPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  function continueFlow(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.includes("@")) {
      setMessage("Add your name and a valid email to create a local profile.")
      return
    }

    const existing = findProfileByEmail(email)
    const profile = {
      name: name.trim() || existing?.name || "Friend",
      email: email.trim().toLowerCase(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }
    setProfile(profile)

    const state = loadState()
    if (state.onboardingComplete) {
      setMessage("Welcome back — heading to your cockpit.")
      router.push("/app")
    } else {
      router.push("/onboarding")
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <Card className="glass fade-up border-white/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Create your Fable profile</CardTitle>
          <CardDescription className="text-base">
            Local demo login — like signing the hangar guest book. Same email later = returning
            pilot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={continueFlow} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Peter"
                className="h-11 rounded-xl bg-white/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="peter@dailybugle.demo"
                className="h-11 rounded-xl bg-white/80"
              />
            </div>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            <ShinyButton type="submit" className="w-full !px-6">
              Continue
            </ShinyButton>
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
