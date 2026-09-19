import Link from "next/link"
import { connection } from "next/server"
import { getCachedEntries, getCachedProfile } from "@/lib/data-server"
import { QUOTES } from "@/lib/stories"

async function requestClock() {
  await connection()
  return Date.now()
}

function daysFlying(createdAt: string | undefined, nowMs: number) {
  if (!createdAt) return 1
  const created = new Date(createdAt).getTime()
  return Math.max(1, Math.ceil((nowMs - created) / (1000 * 60 * 60 * 24)))
}

export default async function DashboardPage() {
  const now = await requestClock()
  const [profile, entries] = await Promise.all([getCachedProfile(), getCachedEntries()])
  const stories = entries.filter((e) => e.type === "story").length
  const visions = entries.filter((e) => e.type === "vision").length
  const last = entries[0]
  const dayCount = daysFlying(profile?.createdAt, now)
  const quoteIndex = new Date(now).getDate() % QUOTES.length

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-10 fade-up">
        <p className="stamp text-xs text-crimson">Scoreboard</p>
        <h1 className="display-title mt-2 text-7xl sm:text-8xl">Board</h1>
        <p className="mt-3 font-serif text-xl text-ink/75">
          Days flying, stories filed, posters ready.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Days with Fable" value={String(dayCount)} delay="delay-1" />
        <StatCard label="Stories" value={String(stories)} delay="delay-2" />
        <StatCard label="Vision stills" value={String(visions)} delay="delay-3" />
        <StatCard
          label="Last created"
          value={
            last
              ? new Date(last.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
          delay="delay-4"
        />
      </div>

      <article className="glass mt-8 fade-up p-6">
        <p className="stamp text-[11px] text-crimson">Today&apos;s quote</p>
        <p className="mt-4 font-serif text-3xl leading-snug text-ink">
          &ldquo;{QUOTES[quoteIndex]}&rdquo;
        </p>
        <Link
          href="/app/history"
          className="mt-6 inline-block font-display text-lg uppercase tracking-wide text-ink underline decoration-volt decoration-4 underline-offset-4"
        >
          Open full log →
        </Link>
      </article>
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
    <article className={`glass fade-up ${delay} p-5`}>
      <p className="stamp text-[11px] text-ink/60">{label}</p>
      <p className="display-title mt-3 text-6xl">{value}</p>
    </article>
  )
}
