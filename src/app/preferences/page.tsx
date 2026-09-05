"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_META, type Category, unsplashUrl } from "@/lib/types"
import { loadState, setCategory } from "@/lib/storage"
import { suggestCategory } from "@/lib/stories"
import { cn } from "@/lib/utils"

const CATEGORIES = Object.keys(CATEGORY_META) as Category[]

export default function PreferencesPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Category>("seeker")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const state = loadState()
    if (!state.profile) {
      router.replace("/auth")
      return
    }
    if (!state.answers) {
      router.replace("/onboarding")
      return
    }
    setSelected(state.category ?? suggestCategory(state.answers))
    setReady(true)
  }, [router])

  function confirm() {
    setCategory(selected)
    router.push("/app")
  }

  if (!ready) {
    return <main className="flex flex-1 items-center justify-center p-8 text-muted-foreground">Loading…</main>
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="mb-8 fade-up">
        <h1 className="text-3xl font-medium tracking-tight">How should Fable see you?</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          We suggested a category from your answers — like choosing your callsign. Pick the one
          that feels true; it steers story tone and your hero visual.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((key, i) => {
          const meta = CATEGORY_META[key]
          const active = selected === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={cn(
                "fade-up text-left transition",
                i === 1 && "delay-1",
                i === 2 && "delay-2",
                i === 3 && "delay-3"
              )}
            >
              <Card
                className={cn(
                  "overflow-hidden border-white/70 shadow-none glass",
                  active && "ring-2 ring-primary"
                )}
              >
                <div className="relative h-28">
                  <Image
                    src={unsplashUrl(meta.imageId, 600)}
                    alt={meta.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{meta.label}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{meta.blurb}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <ShinyButton onClick={confirm}>Enter Fable</ShinyButton>
      </div>
    </main>
  )
}
