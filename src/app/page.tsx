"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, LayoutDashboard, Mountain } from "lucide-react"
import { joinWaitlistAction } from "@/app/actions"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "joined" | "already" | "error">("idle")
  const [message, setMessage] = useState("")

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) {
      setStatus("error")
      setMessage("Enter a valid email to join.")
      return
    }
    const result = await joinWaitlistAction(email)
    if (!result.ok) {
      setStatus("error")
      setMessage(result.error ?? "Enter a valid email to join.")
      return
    }
    setStatus(result.already ? "already" : "joined")
    if (!result.already) setEmail("")
  }

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="pointer-events-none absolute -right-16 top-10 rotate-12 font-display text-[28vw] leading-none text-volt/15">
          GO
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-10 sm:pt-14">
          <div className="flex items-center justify-between fade-up">
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center bg-volt font-display text-lg text-ink">
                F
              </span>
              <span className="font-display text-3xl tracking-wide">FABLE</span>
            </div>
            <Link
              href="/login"
              className="stamp border-2 border-paper px-4 py-2 text-xs text-paper transition hover:bg-volt hover:text-ink"
            >
              Sign in
            </Link>
          </div>

          <div className="max-w-4xl">
            <p className="fade-up delay-1 stamp inline-block bg-crimson px-3 py-1 text-[11px] text-paper">
              18–30 · direction · hope
            </p>
            <h1 className="fade-up delay-2 display-title mt-5 text-[22vw] sm:text-[9.5rem]">
              Your life
              <br />
              <span className="text-volt">as a story.</span>
            </h1>
            <p className="fade-up delay-3 mt-6 max-w-xl font-serif text-xl leading-relaxed text-paper/85 sm:text-2xl">
              Answer a few questions. Walk away with a chapter written by Luna,
              and a hero still printed by Flare. Fun, but purposeful — like
              Spider-Man finding a callsign in the skyline.
            </p>
          </div>

          <div className="fade-up delay-4 grid gap-4 md:grid-cols-[1.2fr_auto] md:items-end">
            <form
              onSubmit={(e) => void joinWaitlist(e)}
              className="border-2 border-volt bg-paper p-4 text-ink sm:p-5"
            >
              <label className="stamp mb-2 block text-[11px] text-ink">
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
                  className="h-12 rounded-none border-2 border-ink bg-paper px-4"
                  aria-label="Email for waitlist"
                />
                <ShinyButton type="submit" className="shrink-0 !px-6 !py-3 !text-base">
                  Join the list
                </ShinyButton>
              </div>
              {status === "joined" && (
                <p className="mt-3 text-sm">You&apos;re on the list. Logged in the hangar.</p>
              )}
              {status === "already" && (
                <p className="mt-3 text-sm">You&apos;re already on the waitlist.</p>
              )}
              {status === "error" && (
                <p className="mt-3 text-sm text-crimson">{message || "Enter a valid email to join."}</p>
              )}
            </form>

            <div className="flex justify-start md:justify-end">
              <Link href="/signup">
                <ShinyButton>Start your first chapter</ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex flex-col gap-3 fade-up md:flex-row md:items-end md:justify-between">
          <h2 className="display-title text-6xl sm:text-8xl">
            What you
            <br />
            get now
          </h2>
          <p className="max-w-sm font-serif text-lg text-ink/80">
            Real engines in the wings: Luna writes the chapter, Flare prints the
            poster. Same hangar. Louder paint job.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            index="01"
            icon={<BookOpen className="size-5" />}
            title="Story Mode"
            description="A reflective narrative you can take with you — hope, stuck points, and who you're becoming."
            delay="delay-1"
          />
          <FeatureCard
            index="02"
            icon={<Mountain className="size-5" />}
            title="Vision Board"
            description="A real hero still, plus the prompt behind it. You in the frame, not a stock mountain."
            delay="delay-2"
          />
          <FeatureCard
            index="03"
            icon={<LayoutDashboard className="size-5" />}
            title="Board & Log"
            description="Day stamps, quotes, and every chapter you have filed. One logbook, two modes."
            delay="delay-3"
          />
        </div>
      </section>

      <section className="border-y-2 border-ink bg-navy text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden border-2 border-volt bg-ink">
            <p className="absolute inset-0 flex items-center justify-center font-display text-[22vw] leading-none text-volt/25 md:text-[9rem]">
              YOU
            </p>
            <p className="absolute bottom-4 left-4 right-4 font-serif text-2xl text-paper">
              Nature as co-pilot. You as the campaign.
            </p>
          </div>
          <div className="space-y-5">
            <p className="stamp text-volt">Field note</p>
            <h2 className="display-title text-6xl sm:text-7xl">
              Seasons
              <br />
              have jobs.
            </h2>
            <p className="font-serif text-lg leading-relaxed text-paper/80">
              Soft landings still count. Optional ambience sits in the corner like
              a cabin PA: off by default, yours when you want calm.
            </p>
            <div className="pt-2">
              <Link href="/signup">
                <ShinyButton>Try the demo</ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink/70">
        <p>
          Fable · Waitlist emails go to the hangar. Not therapy or medical advice —
          a reflective companion for direction and hope.
        </p>
      </footer>
    </main>
  )
}

function FeatureCard({
  index,
  icon,
  title,
  description,
  delay,
}: {
  index: string
  icon: React.ReactNode
  title: string
  description: string
  delay: string
}) {
  return (
    <article className={`glass fade-up ${delay} p-5`}>
      <p className="font-display text-5xl text-crimson">{index}</p>
      <div className="mt-6 flex size-10 items-center justify-center bg-volt text-ink">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-3xl uppercase tracking-wide">{title}</h3>
      <p className="mt-2 font-serif text-base leading-relaxed text-ink/75">{description}</p>
    </article>
  )
}
