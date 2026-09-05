"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadState } from "@/lib/storage"
import { QUOTES } from "@/lib/stories"
import type { Entry, Profile } from "@/lib/types"

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    const state = loadState()
    setProfile(state.profile)
    setEntries(state.entries)
    setQuoteIndex(new Date().getDate() % QUOTES.length)
  }, [])

  const stats = useMemo(() => {
    const stories = entries.filter((e) => e.type === "story").length
    const visions = entries.filter((e) => e.type === "vision").length
    const last = entries[0]
    const created = profile?.createdAt ? new Date(profile.createdAt) : null
    const dayCount = created
      ? Math.max(1, Math.ceil((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)))
      : 1
    return { stories, visions, last, dayCount }
  }, [entries, profile])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-8 fade-up">
        <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Your flight log — days flying, stories filed, vision prompts ready.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Days with Fable" value={String(stats.dayCount)} delay="delay-1" />
        <StatCard label="Stories" value={String(stats.stories)} delay="delay-2" />
        <StatCard label="Vision prompts" value={String(stats.visions)} delay="delay-3" />
        <StatCard
          label="Last created"
          value={
            stats.last
              ? new Date(stats.last.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
          delay="delay-4"
        />
      </div>

      <Card className="glass mt-6 fade-up border-white/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Today&apos;s quote</CardTitle>
          <CardDescription>A soft heading for the day.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xl leading-relaxed text-ink">&ldquo;{QUOTES[quoteIndex]}&rdquo;</p>
          <Link href="/app/history" className="mt-6 inline-block text-sm text-primary hover:underline">
            Open full history →
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}

function StatCard({
  label,
  value,
  delay,
}: {
  label: string
  value: string
  delay: string
}) {
  return (
    <Card className={`glass fade-up ${delay} border-white/70 shadow-none`}>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
