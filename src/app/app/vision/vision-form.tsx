"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Copy } from "lucide-react"
import { createVisionAction } from "@/app/actions"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Entry } from "@/lib/types"

export function VisionForm() {
  const router = useRouter()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function createHero() {
    setPending(true)
    setError("")
    const result = await createVisionAction()
    setPending(false)
    if (result.error || !result.entry) {
      setError(result.error ?? "Could not print that poster.")
      return
    }
    setEntry(result.entry)
    router.refresh()
  }

  async function copyPrompt() {
    if (!entry?.prompt) return
    await navigator.clipboard.writeText(entry.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 fade-up">
        <h1 className="text-3xl font-medium tracking-tight">Vision Board</h1>
        <p className="mt-2 text-muted-foreground">
          One hero visual (nature stand-in for now) and a ChatGPT prompt where you are the hero —
          your personal poster for the wall of hope. It files into History automatically.
        </p>
      </div>

      <div className="mb-6 fade-up delay-1">
        <ShinyButton
          onClick={() => void createHero()}
          disabled={pending}
          className="!px-6 !py-3 !text-base"
        >
          {pending ? "Printing poster…" : "Create my hero prompt"}
        </ShinyButton>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      {entry && (
        <div className="space-y-5 fade-in">
          <Card className="overflow-hidden border-white/70 shadow-none glass">
            <div className="relative aspect-[16/10]">
              {entry.imageUrl && (
                <Image
                  src={entry.imageUrl}
                  alt={entry.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              )}
            </div>
            <CardHeader>
              <CardTitle>{entry.title}</CardTitle>
              <CardDescription>{entry.body}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-white/70 shadow-none glass">
            <CardHeader>
              <CardTitle className="text-lg">ChatGPT / image prompt</CardTitle>
              <CardDescription>Copy this into ChatGPT or any image model.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap rounded-2xl bg-secondary/80 p-4 text-sm leading-relaxed">
                {entry.prompt}
              </pre>
              <Button type="button" variant="secondary" className="mt-4 gap-2" onClick={copyPrompt}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy prompt"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
