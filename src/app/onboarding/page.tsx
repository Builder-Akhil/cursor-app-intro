"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShinyButton } from "@/components/ui/shiny-button"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EMPTY_ANSWERS, type Answers } from "@/lib/types"
import { loadState, setAnswers } from "@/lib/storage"

const QUESTIONS: { key: keyof Answers; title: string; hint: string }[] = [
  {
    key: "hope",
    title: "What do you hope for right now?",
    hint: "A direction, a feeling, a chapter you want — not a perfect plan.",
  },
  {
    key: "stuck",
    title: "Where do you feel stuck?",
    hint: "Name the turbulence without judging the aircraft.",
  },
  {
    key: "becoming",
    title: "Who are you becoming?",
    hint: "The hero version of you — even if the suit still feels big.",
  },
  {
    key: "naturePlace",
    title: "Which place in nature calms you?",
    hint: "Forest path, open water, mountains, rain on a window…",
  },
  {
    key: "seasonWord",
    title: "One word for this season of your life?",
    hint: "Becoming, soft, rebuilding, curious…",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setLocalAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const state = loadState()
    if (!state.profile) {
      router.replace("/auth")
      return
    }
    if (state.answers) setLocalAnswers(state.answers)
    setReady(true)
  }, [router])

  const q = QUESTIONS[step]
  const progress = ((step + 1) / QUESTIONS.length) * 100

  function next() {
    if (!answers[q.key].trim()) return
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1)
      return
    }
    setAnswers(answers)
    router.push("/preferences")
  }

  if (!ready) {
    return <main className="flex flex-1 items-center justify-center p-8 text-muted-foreground">Loading…</main>
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-12">
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>
            Question {step + 1} of {QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`}
            />
          ))}
        </div>
      </div>

      <Card className="glass fade-in border-white/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">{q.title}</CardTitle>
          <CardDescription className="text-base">{q.hint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Textarea
            value={answers[q.key]}
            onChange={(e) =>
              setLocalAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
            }
            rows={5}
            placeholder="Write a few honest lines…"
            className="resize-none rounded-2xl bg-white/80 text-base"
          />
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            <ShinyButton
              onClick={next}
              disabled={!answers[q.key].trim()}
              className="!px-6 !py-3 !text-base"
            >
              {step === QUESTIONS.length - 1 ? "Continue" : "Next"}
            </ShinyButton>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
