"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Copy } from "lucide-react"
import { createVisionAction } from "@/app/actions"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Button } from "@/components/ui/button"
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
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-10 fade-up">
        <p className="stamp text-xs text-crimson">Mode 02 · Flare</p>
        <h1 className="display-title mt-2 text-7xl sm:text-8xl">Vision</h1>
        <p className="mt-4 max-w-2xl font-serif text-xl text-ink/75">
          One hero still, printed for the wall. Flare takes about half a minute —
          like waiting for the hangar doors to open.
        </p>
      </div>

      <div className="mb-8 fade-up delay-1">
        <ShinyButton
          onClick={() => void createHero()}
          disabled={pending}
          className="!px-6 !py-3 !text-base"
        >
          {pending ? "Printing poster…" : "Create my hero still"}
        </ShinyButton>
        {error && <p className="mt-3 text-sm text-crimson">{error}</p>}
      </div>

      {entry && (
        <div className="space-y-5 fade-in">
          <article className="overflow-hidden border-2 border-ink bg-ink text-paper shadow-[10px_10px_0_0_var(--volt)]">
            <div className="relative aspect-[16/10]">
              {entry.imageUrl && (
                <Image
                  src={entry.imageUrl}
                  alt={entry.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              )}
            </div>
            <div className="p-6">
              <h2 className="font-display text-4xl uppercase tracking-wide">{entry.title}</h2>
              <p className="mt-2 font-serif text-lg text-paper/80">{entry.body}</p>
            </div>
          </article>

          <article className="glass p-6">
            <h3 className="font-display text-2xl uppercase tracking-wide">Image prompt</h3>
            <p className="mt-1 font-serif text-ink/70">The brief Flare flew from. Copy it anywhere.</p>
            <pre className="mt-4 whitespace-pre-wrap border-2 border-ink bg-paper p-4 font-serif text-sm leading-relaxed">
              {entry.prompt}
            </pre>
            <Button
              type="button"
              variant="secondary"
              className="mt-4 gap-2 rounded-none border-2 border-ink bg-volt text-ink hover:bg-paper"
              onClick={copyPrompt}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy prompt"}
            </Button>
          </article>
        </div>
      )}
    </main>
  )
}
