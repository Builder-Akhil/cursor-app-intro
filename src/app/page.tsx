"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, LayoutDashboard, Mountain, Sparkles } from "lucide-react"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { addWaitlistEmail } from "@/lib/storage"
import { unsplashUrl } from "@/lib/types"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "joined" | "already" | "error">("idle")

  function joinWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) {
      setStatus("error")
      return
    }
    const result = addWaitlistEmail(email)
    setStatus(result.already ? "already" : "joined")
    if (result.ok) setEmail("")
  }

  return (
    <main className="flex-1">
      <section className="relative min-h-[88vh]">
        <Image
          src={unsplashUrl("photo-1506905925346-21bda4d32df4", 1800)}
          alt="Mountain horizon at soft light"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-background" />

        <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-20 pt-10 sm:pt-16">
          <div className="flex items-center justify-between fade-up">
            <div className="flex items-center gap-2 text-white">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15 text-sm font-medium backdrop-blur">
                F
              </span>
              <span className="text-lg font-medium tracking-tight">Fable</span>
            </div>
            <Link
              href="/auth"
              className="rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-white/25"
            >
              Try the demo
            </Link>
          </div>

          <div className="max-w-2xl space-y-6 text-white">
            <p className="fade-up delay-1 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs tracking-wide uppercase backdrop-blur">
              <Sparkles className="size-3.5" />
              For 18–30s seeking direction & hope
            </p>
            <h1 className="fade-up delay-2 text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Answer a few questions. Walk away with your life as a story.
            </h1>
            <p className="fade-up delay-3 max-w-xl text-base text-white/85 sm:text-lg">
              Fable listens, then reflects who you really are — a reflective story for your
              pocket, and a hero vision prompt for the person you&apos;re becoming. Fun, but
              purposeful — like Spider-Man finding his callsign in the skyline.
            </p>
          </div>

          <div className="fade-up delay-4 grid gap-4 md:grid-cols-[1.2fr_auto] md:items-end">
            <form
              onSubmit={joinWaitlist}
              className="glass rounded-3xl p-4 sm:p-5"
            >
              <label className="mb-2 block text-sm font-medium text-ink">
                Join the waitlist
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setStatus("idle")
                  }}
                  className="h-12 rounded-full border-border/70 bg-white/90 px-4"
                  aria-label="Email for waitlist"
                />
                <ShinyButton type="submit" className="shrink-0 !px-6 !py-3 !text-base">
                  Join the waitlist
                </ShinyButton>
              </div>
              {status === "joined" && (
                <p className="mt-3 text-sm text-primary">
                  You&apos;re on the list. (This demo saves emails on your device only.)
                </p>
              )}
              {status === "already" && (
                <p className="mt-3 text-sm text-primary">You&apos;re already on this device&apos;s waitlist.</p>
              )}
              {status === "error" && (
                <p className="mt-3 text-sm text-destructive">Enter a valid email to join.</p>
              )}
            </form>

            <div className="flex justify-start md:justify-end">
              <ShinyButton onClick={() => (window.location.href = "/auth")}>
                Try the demo
              </ShinyButton>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="mb-10 max-w-2xl fade-up">
          <h2 className="text-3xl font-medium tracking-tight text-ink">What you get in v0.1</h2>
          <p className="mt-3 text-muted-foreground">
            Think of this as a wind-tunnel model of the aircraft: every switch works, the real
            AI engines come next.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={<BookOpen className="size-5 text-primary" />}
            title="Story Mode"
            description="A reflective narrative you can take with you — hope, stuck points, and who you're becoming."
            delay="delay-1"
          />
          <FeatureCard
            icon={<Mountain className="size-5 text-primary" />}
            title="Vision Board"
            description="One hero visual plus a copyable ChatGPT prompt where you are the hero of the frame."
            delay="delay-2"
          />
          <FeatureCard
            icon={<LayoutDashboard className="size-5 text-primary" />}
            title="Dashboard & History"
            description="Day stamps, quotes, and a log of everything you've created across modes."
            delay="delay-3"
          />
        </div>
      </section>

      <section className="border-y border-border/60 bg-sky/60">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={unsplashUrl("photo-1441974231531-c6227db76b6e", 1000)}
              alt="Forest path through soft light"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-medium tracking-tight">Nature as your co-pilot</h2>
            <p className="text-muted-foreground leading-relaxed">
              Soft blues, mist, and open landscapes — not decoration for its own sake, but a
              reminder that seasons have jobs. Optional ambience music sits in the corner like
              a cabin PA: off by default, yours when you want calm.
            </p>
            <div className="pt-2">
              <ShinyButton onClick={() => (window.location.href = "/auth")}>
                Start your first chapter
              </ShinyButton>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted-foreground">
        <p>
          Fable demo · Waitlist emails stay on this device (localStorage) — not sent to a
          server yet. Not therapy or medical advice — just a reflective companion for direction
          and hope.
        </p>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: string
}) {
  return (
    <Card className={`glass fade-up ${delay} border-white/70 shadow-none`}>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-secondary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
