"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { setAmbienceEnabledAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { fetchProfile } from "@/lib/data"
import { hasEnvVars } from "@/lib/supabase/env"

export function AmbienceToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  const [canPersist, setCanPersist] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!hasEnvVars()) {
        if (!cancelled) setReady(true)
        return
      }
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          if (!cancelled) setReady(true)
          return
        }
        const profile = await fetchProfile(supabase)
        if (!cancelled) {
          setEnabled(profile?.ambienceEnabled ?? false)
          setCanPersist(true)
          setReady(true)
        }
      } catch {
        if (!cancelled) setReady(true)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.28
    audio.loop = true
    if (enabled) {
      void audio.play().catch(() => {
        setEnabled(false)
        if (canPersist) void setAmbienceEnabledAction(false)
      })
    } else {
      audio.pause()
    }
  }, [enabled, ready, canPersist])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    if (canPersist) void setAmbienceEnabledAction(next)
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
        className="fixed bottom-4 right-4 z-50 size-11 rounded-none border-2 border-ink bg-volt text-ink shadow-[4px_4px_0_0_var(--ink)]"
      >
        {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      </Button>
    </>
  )
}
