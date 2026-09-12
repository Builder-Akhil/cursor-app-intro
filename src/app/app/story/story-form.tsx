"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createStoryAction } from "@/app/actions"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Answers, Category, Entry } from "@/lib/types"

export function StoryForm({
  name,
  category,
  initialAnswers,
}: {
  name: string
  category: Category
  initialAnswers: Answers
}) {
  const router = useRouter()
  const [answers, setLocal] = useState<Answers>(initialAnswers)
  const [story, setStory] = useState<Entry | null>(null)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  async function writeStory() {
    setPending(true)
    setError("")
    const result = await createStoryAction(answers)
    setPending(false)
    if (result.error || !result.entry) {
      setError(result.error ?? "Could not file that story.")
      return
    }
    setStory(result.entry)
    setSavedFlash(true)
    router.refresh()
    setTimeout(() => setSavedFlash(false), 2200)
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-10 fade-up">
        <p className="stamp text-xs text-crimson">Mode 01 · Luna</p>
        <h1 className="display-title mt-2 text-7xl sm:text-8xl">Story</h1>
        <p className="mt-4 max-w-2xl font-serif text-xl text-ink/75">
          Confirm your answers, then let Luna write the chapter — like reading your
          own origin issue. Files into {name}&apos;s logbook
          {category ? ` as a ${category}` : ""}.
        </p>
      </div>

      <section className="glass fade-up delay-1 mb-8 p-6">
        <h2 className="font-display text-3xl uppercase tracking-wide">Your answers</h2>
        <p className="mt-1 font-serif text-ink/70">Edit anything before generating.</p>
        <div className="mt-6 space-y-4">
          {(
            [
              ["hope", "Hope"],
              ["stuck", "Stuck"],
              ["becoming", "Becoming"],
              ["naturePlace", "Nature place"],
              ["seasonWord", "Season word"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <label className="stamp text-[11px]">{label}</label>
              <Textarea
                value={answers[key]}
                onChange={(e) => setLocal((a) => ({ ...a, [key]: e.target.value }))}
                rows={key === "seasonWord" ? 1 : 2}
                className="resize-none rounded-none border-2 border-ink bg-paper"
              />
            </div>
          ))}
          <ShinyButton
            onClick={() => void writeStory()}
            disabled={pending}
            className="!px-6 !py-3 !text-base"
          >
            {pending ? "Writing…" : "Write my story"}
          </ShinyButton>
          {savedFlash && (
            <p className="text-sm">Saved to your history — stamped like a flight entry.</p>
          )}
          {error && <p className="text-sm text-crimson">{error}</p>}
        </div>
      </section>

      {story && (
        <article className="fade-in border-2 border-ink bg-navy p-6 text-paper sm:p-10">
          <p className="stamp text-[11px] text-volt">
            {new Date(story.createdAt).toLocaleString()} · auto-saved
          </p>
          <h2 className="display-title mt-3 text-5xl sm:text-7xl">{story.title}</h2>
          <div className="mt-8 whitespace-pre-wrap font-serif text-lg leading-relaxed text-paper/90">
            {story.body}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-8 rounded-none border-2 border-volt bg-volt text-ink hover:bg-paper"
            onClick={() => navigator.clipboard.writeText(story.body)}
          >
            Copy story
          </Button>
        </article>
      )}
    </main>
  )
}
