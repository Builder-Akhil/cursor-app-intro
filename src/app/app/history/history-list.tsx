"use client"

import { useState } from "react"
import Image from "next/image"
import { BookOpen, Mountain } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Entry } from "@/lib/types"

export function HistoryList({ entries }: { entries: Entry[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = entries.find((e) => e.id === openId) ?? null

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-10 fade-up">
        <p className="stamp text-xs text-crimson">Archive</p>
        <h1 className="display-title mt-2 text-7xl sm:text-8xl">Log</h1>
        <p className="mt-3 font-serif text-xl text-ink/75">
          Everything you have filed — newest first.
        </p>
      </div>

      {entries.length === 0 ? (
        <article className="glass p-6">
          <h2 className="font-display text-3xl uppercase">No entries yet</h2>
          <p className="mt-2 font-serif text-ink/70">
            Generate a story or hero still and it lands here like a stamped logbook page.
          </p>
        </article>
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
              <article className="glass flex items-start gap-4 p-4 transition hover:-translate-y-0.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center bg-volt text-ink">
                  {entry.type === "story" ? (
                    <BookOpen className="size-4" />
                  ) : (
                    <Mountain className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-2xl uppercase tracking-wide">
                    {entry.title}
                  </h2>
                  <p className="stamp mt-1 text-[11px] text-ink/60">
                    {entry.type === "story" ? "Story" : "Vision"} ·{" "}
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </article>
            </button>
          ))}
        </div>
      )}

      {open && (
        <article className="glass mt-6 fade-in p-6">
          <p className="stamp text-[11px] text-crimson">
            {open.type === "story" ? "Story" : "Vision"} ·{" "}
            {new Date(open.createdAt).toLocaleString()}
          </p>
          <h2 className="display-title mt-2 text-5xl">{open.title}</h2>
          <div className="mt-5 space-y-4">
            {open.imageUrl && (
              <div className="relative aspect-video overflow-hidden border-2 border-ink">
                <Image
                  src={open.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}
            <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed">{open.body}</p>
            {open.prompt && (
              <pre className="whitespace-pre-wrap border-2 border-ink bg-paper p-4 font-serif text-sm">
                {open.prompt}
              </pre>
            )}
            <Button
              type="button"
              variant="ghost"
              className="rounded-none"
              onClick={() => setOpenId(null)}
            >
              Close
            </Button>
          </div>
        </article>
      )}
    </main>
  )
}
