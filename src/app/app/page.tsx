import Link from "next/link"
import { BookOpen, Mountain } from "lucide-react"
import { getCachedProfile } from "@/lib/data-server"
import { CATEGORY_META } from "@/lib/types"

export default async function AppHomePage() {
  const profile = await getCachedProfile()
  const name = profile?.name ?? "friend"
  const category = profile?.category ?? null

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-12 fade-up">
        <p className="stamp text-xs text-crimson">Welcome aboard</p>
        <h1 className="display-title mt-2 text-7xl sm:text-8xl">
          Hello,
          <br />
          <span className="text-navy">{name}.</span>
        </h1>
        {category && (
          <p className="mt-4 max-w-xl font-serif text-xl text-ink/75">
            Flying as <span className="text-ink">{CATEGORY_META[category].label}</span> —{" "}
            {CATEGORY_META[category].blurb}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ModeCard
          href="/app/story"
          index="01"
          title="Story Mode"
          description="Luna writes a reflective chapter from your answers — hope, stuckness, forward motion."
          icon={<BookOpen className="size-5" />}
          className="fade-up delay-1"
        />
        <ModeCard
          href="/app/vision"
          index="02"
          title="Vision Board"
          description="Flare prints a hero still of you. Campaign energy, nature as the set."
          icon={<Mountain className="size-5" />}
          className="fade-up delay-2"
        />
      </div>
    </main>
  )
}

function ModeCard({
  href,
  index,
  title,
  description,
  icon,
  className,
}: {
  href: string
  index: string
  title: string
  description: string
  icon: React.ReactNode
  className?: string
}) {
  return (
    <Link href={href} className={className}>
      <article className="group glass min-h-[280px] p-6 transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--ink)]">
        <div className="flex items-start justify-between">
          <span className="font-display text-6xl text-crimson">{index}</span>
          <span className="flex size-10 items-center justify-center bg-volt text-ink">
            {icon}
          </span>
        </div>
        <h2 className="mt-10 font-display text-5xl uppercase tracking-wide">{title}</h2>
        <p className="mt-3 font-serif text-lg leading-relaxed text-ink/75">{description}</p>
      </article>
    </Link>
  )
}
