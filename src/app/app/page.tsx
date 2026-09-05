"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { BookOpen, Mountain } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadState } from "@/lib/storage"
import { CATEGORY_META, unsplashUrl, type Category } from "@/lib/types"

export default function AppHomePage() {
  const [name, setName] = useState("friend")
  const [category, setCategoryLabel] = useState<Category | null>(null)

  useEffect(() => {
    const state = loadState()
    setName(state.profile?.name ?? "friend")
    setCategoryLabel(state.category)
  }, [])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-10 fade-up">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Welcome aboard</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight sm:text-4xl">
          Hello, {name}. Pick a mode.
        </h1>
        {category && (
          <p className="mt-2 text-muted-foreground">
            Flying as <span className="text-foreground">{CATEGORY_META[category].label}</span> —{" "}
            {CATEGORY_META[category].blurb}
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ModeCard
          href="/app/story"
          title="Story Mode"
          description="A reflective story you can take away — hope, stuckness, and aspirational forward motion."
          imageId="photo-1470071459604-3b5ec3a7fe05"
          icon={<BookOpen className="size-5" />}
          className="fade-up delay-1"
        />
        <ModeCard
          href="/app/vision"
          title="Vision Board"
          description="One hero visual plus a ChatGPT prompt where you are the hero of the frame."
          imageId="photo-1506905925346-21bda4d32df4"
          icon={<Mountain className="size-5" />}
          className="fade-up delay-2"
        />
      </div>
    </main>
  )
}

function ModeCard({
  href,
  title,
  description,
  imageId,
  icon,
  className,
}: {
  href: string
  title: string
  description: string
  imageId: string
  icon: React.ReactNode
  className?: string
}) {
  return (
    <Link href={href} className={className}>
      <Card className="group overflow-hidden border-white/70 shadow-none glass transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative h-44">
          <Image
            src={unsplashUrl(imageId, 900)}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm text-ink">
            {icon}
            {title}
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
