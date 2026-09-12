"use client"

import { useState } from "react"
import Image from "next/image"
import { BookOpen, Mountain } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Entry } from "@/lib/types"

export function HistoryList({ entries }: { entries: Entry[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = entries.find((e) => e.id === openId) ?? null

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 fade-up">
        <h1 className="text-3xl font-medium tracking-tight">History</h1>
        <p className="mt-2 text-muted-foreground">
          Everything you&apos;ve done across Story Mode and Vision Board — newest first.
        </p>
      </div>

      {entries.length === 0 ? (
        <Card className="glass border-white/70 shadow-none">
          <CardHeader>
            <CardTitle>No entries yet</CardTitle>
            <CardDescription>
              Generate a story or hero prompt and it will land here like a stamped logbook page.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setOpenId(entry.id === openId ? null : entry.id)}
              className={`fade-up w-full text-left ${
                i === 0
                  ? "delay-1"
                  : i === 1
                    ? "delay-2"
                    : i === 2
                      ? "delay-3"
                      : i === 3
                        ? "delay-4"
                        : ""
              }`}
            >
              <Card className="border-white/70 shadow-none glass transition hover:bg-white/70">
                <CardHeader className="flex-row items-start gap-3 space-y-0">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    {entry.type === "story" ? (
                      <BookOpen className="size-4" />
                    ) : (
                      <Mountain className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-base">{entry.title}</CardTitle>
                    <CardDescription>
                      {entry.type === "story" ? "Story" : "Vision"} ·{" "}
                      {new Date(entry.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      )}

      {open && (
        <Card className="glass mt-6 fade-in border-white/70 shadow-none">
          <CardHeader>
            <CardTitle>{open.title}</CardTitle>
            <CardDescription>
              {open.type === "story" ? "Story" : "Vision"} ·{" "}
              {new Date(open.createdAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {open.imageUrl && (
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={open.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}
            <p className="whitespace-pre-wrap leading-relaxed">{open.body}</p>
            {open.prompt && (
              <pre className="whitespace-pre-wrap rounded-2xl bg-secondary/80 p-4 text-sm">
                {open.prompt}
              </pre>
            )}
            <Button type="button" variant="ghost" onClick={() => setOpenId(null)}>
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
