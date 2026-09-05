"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppNav } from "@/components/app-nav"
import { loadState } from "@/lib/storage"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const state = loadState()
    if (!state.profile) {
      router.replace("/auth")
      return
    }
    if (!state.onboardingComplete) {
      router.replace(state.answers ? "/preferences" : "/onboarding")
      return
    }
    setOk(true)
  }, [router])

  if (!ok) {
    return (
      <main className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
        Preparing your cabin…
      </main>
    )
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppNav />
      <div className="flex-1">{children}</div>
    </div>
  )
}
