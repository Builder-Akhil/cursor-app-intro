"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { saveCategoryAction } from "@/app/actions"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_META, type Category, unsplashUrl } from "@/lib/types"
import { cn } from "@/lib/utils"

const CATEGORIES = Object.keys(CATEGORY_META) as Category[]

export function PreferencesForm({ initialCategory }: { initialCategory: Category }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Category>(initialCategory)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function confirm() {
    setPending(true)
    setError("")
    const result = await saveCategoryAction(selected)
    if (result.error) {
      setError(result.error)
      setPending(false)
      return
    }
    router.push("/app")
    router.refresh()
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

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-8 flex justify-end">
        <ShinyButton onClick={() => void confirm()} disabled={pending}>
          {pending ? "Clearing you in…" : "Enter Fable"}
        </ShinyButton>
      </div>
    </main>
  )
}
