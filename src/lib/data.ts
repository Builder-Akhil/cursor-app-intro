import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database, Json } from "@/lib/supabase/database.types"
import {
  EMPTY_ANSWERS,
  type Answers,
  type AppProfile,
  type Category,
  type Entry,
} from "@/lib/types"

export const HISTORY_LIMIT = 200
export const TEMPLATE_MODEL = "fable-template-v1"

export type FableClient = SupabaseClient<Database>

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
type EntryRow = Database["public"]["Tables"]["entries"]["Row"]

export function answersFromProfile(row: ProfileRow): Answers | null {
  const answers: Answers = {
    hope: row.hope ?? "",
    stuck: row.stuck ?? "",
    becoming: row.becoming ?? "",
    naturePlace: row.nature_place ?? "",
    seasonWord: row.season_word ?? "",
  }
  if (!Object.values(answers).some((value) => value.trim())) return null
  return answers
}

export function profileHasAnswers(profile: AppProfile) {
  return Boolean(profile.answers)
}

export function mapProfile(row: ProfileRow): AppProfile {
  return {
    id: row.id,
    name: row.name || "Friend",
    email: row.email,
    answers: answersFromProfile(row),
    category: row.category,
    onboardingComplete: row.onboarding_complete,
    ambienceEnabled: row.ambience_enabled,
    createdAt: row.created_at,
  }
}

export function mapEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    prompt: row.prompt ?? undefined,
    imageUrl: row.image_url ?? undefined,
    createdAt: row.created_at,
  }
}

export function snapshotAnswers(answers: Answers | null): Json {
  const next = answers ?? EMPTY_ANSWERS
  return {
    hope: next.hope,
    stuck: next.stuck,
    becoming: next.becoming,
    naturePlace: next.naturePlace,
    seasonWord: next.seasonWord,
  }
}

export async function fetchProfile(
  supabase: FableClient
): Promise<AppProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").maybeSingle()
  if (error) throw error
  return data ? mapProfile(data) : null
}

export async function ensureProfile(
  supabase: FableClient,
  user: { id: string; email?: string | null; user_metadata?: { name?: string } }
): Promise<AppProfile> {
  const existing = await fetchProfile(supabase)
  if (existing) return existing

  const name =
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()) ||
    "Friend"
  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    name,
    email: user.email ?? "",
  })
  if (error && error.code !== "23505") throw error

  const created = await fetchProfile(supabase)
  if (!created) {
    throw new Error("Could not open your hangar badge. Try signing in again.")
  }
  return created
}

export async function fetchEntries(supabase: FableClient): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT)
  if (error) throw error
  return (data ?? []).map(mapEntry)
}

export function authErrorMessage(message: string) {
  const text = message.toLowerCase()
  if (text.includes("invalid login") || text.includes("invalid credentials")) {
    return "Those call signs do not match. Check email and password."
  }
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "A hangar already exists for that email. Sign in instead."
  }
  if (text.includes("password should be") || text.includes("password is known")) {
    return "Choose a stronger password — at least 8 characters."
  }
  if (text.includes("rate") || text.includes("too many")) {
    return "Too many attempts. Give the engines a minute, then try again."
  }
  if (text.includes("email")) {
    return "Use a real email so we can find your hangar later."
  }
  return "Something went wrong on the taxiway. Try again."
}

export function isCategory(value: string | null | undefined): value is Category {
  return (
    value === "seeker" ||
    value === "builder" ||
    value === "healer" ||
    value === "wanderer"
  )
}
