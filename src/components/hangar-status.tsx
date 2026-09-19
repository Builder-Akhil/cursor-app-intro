"use client"

import { useEffect, useState } from "react"

export function HangarUnreachableBanner() {
  const [down, setDown] = useState(false)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!url || !key) return

    // GoTrue answers 401 without the apikey header, which is not an outage.
    fetch(`${url}/auth/v1/health`, {
      cache: "no-store",
      headers: { apikey: key },
    })
      .then((response) => {
        if (!response.ok) setDown(true)
      })
      .catch(() => setDown(true))
  }, [])

  if (!down) return null

  return (
    <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
      Tower is silent. The hangar URL in <code>.env.local</code> does not resolve — like swinging toward a Daily Bugle that is no longer on the map. Create a live Supabase project, paste{" "}
      <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, then restart.
    </p>
  )
}
