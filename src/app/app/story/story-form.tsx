"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createStoryAction } from "@/app/actions"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 fade-up">
        <h1 className="text-3xl font-medium tracking-tight">Story Mode</h1>
        <p className="mt-2 text-muted-foreground">
          Confirm your answers, then let Fable write a reflective takeaway — like reading your
          own origin issue. This files into {name}&apos;s cloud logbook
          {category ? ` as a ${category}` : ""}.
        </p>
      </div>

      <Card className="glass fade-up delay-1 mb-6 border-white/70 shadow-none">
        <CardHeader>
          <CardTitle>Your answers</CardTitle>
          <CardDescription>Edit anything before generating.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <label className="text-sm font-medium">{label}</label>
              <Textarea
                value={answers[key]}
                onChange={(e) => setLocal((a) => ({ ...a, [key]: e.target.value }))}
                rows={key === "seasonWord" ? 1 : 2}
                className="resize-none rounded-xl bg-white/80"
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
            <p className="text-sm text-primary">Saved to your history — logged like a flight entry.</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {story && (
        <Card className="fade-in border-white/70 shadow-none glass">
          <CardHeader>
            <CardTitle>{story.title}</CardTitle>
            <CardDescription>
              {new Date(story.createdAt).toLocaleString()} · auto-saved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
              {story.body}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-6"
              onClick={() => navigator.clipboard.writeText(story.body)}
            >
              Copy story
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
