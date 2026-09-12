import "server-only"

import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { ensureProfile, fetchEntries } from "@/lib/data"
import type { AppProfile, Entry } from "@/lib/types"

export const getCachedProfile = cache(async (): Promise<AppProfile | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  return ensureProfile(supabase, user)
})

export const getCachedEntries = cache(async (): Promise<Entry[]> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) return []
  return fetchEntries(supabase)
})

export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error("Sign in to continue.")
  }
  return { supabase, user }
}

export async function requireProfile() {
  const { supabase, user } = await requireUser()
  const profile = await ensureProfile(supabase, user)
  return { supabase, user, profile }
}
