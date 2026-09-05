"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { loadState, setAmbienceEnabled } from "@/lib/storage"
import { Button } from "@/components/ui/button"

export function AmbienceToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const state = loadState()
    setEnabled(state.ambienceEnabled)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.28
    audio.loop = true
    if (enabled) {
      void audio.play().catch(() => {
        // Autoplay blocked until user gesture — toggle stays off visually next click
        setEnabled(false)
        setAmbienceEnabled(false)
      })
    } else {
      audio.pause()
    }
  }, [enabled, ready])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    setAmbienceEnabled(next)
  }

  if (!ready) return null

  return (
    <>
      <audio ref={audioRef} src="/audio/ambience.mp3" preload="none" />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={toggle}
        aria-label={enabled ? "Mute ambience" : "Play ambience"}
        title={enabled ? "Mute cabin ambience" : "Optional ambience (off by default)"}
        className="fixed bottom-4 right-4 z-50 size-11 rounded-full border border-border/80 bg-white/80 shadow-md backdrop-blur"
      >
        {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      </Button>
    </>
  )
}
