"use server"

import {
  authErrorMessage,
  isCategory,
  mapEntry,
  snapshotAnswers,
  uploadVisionImage,
} from "@/lib/data"
import { requireProfile, requireUser } from "@/lib/data-server"
import { createClient } from "@/lib/supabase/server"
import { hasEnvVars } from "@/lib/supabase/env"
import {
  generateStoryWithLuna,
  generateVisionImageWithFlare,
  writeVisionPromptWithLuna,
  STORY_MODEL,
  VISION_IMAGE_MODEL,
} from "@/lib/openai"
import { EMPTY_ANSWERS, type Answers, type Category, type Entry } from "@/lib/types"

export async function joinWaitlistAction(
  email: string
): Promise<{ ok: boolean; already: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase()
  if (!normalized || !normalized.includes("@")) {
    return { ok: false, already: false, error: "Enter a valid email to join." }
  }
  if (!hasEnvVars()) {
    return { ok: false, already: false, error: "Waitlist hangar is not connected yet." }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("waitlist").insert({ email: normalized })
  if (error) {
    if (error.code === "23505") return { ok: true, already: true }
    return { ok: false, already: false, error: "Could not join the waitlist. Try again." }
  }
  return { ok: true, already: false }
}

export async function saveAnswersAction(
  answers: Answers
): Promise<{ error?: string }> {
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase
      .from("profiles")
      .update({
        hope: answers.hope.trim(),
        stuck: answers.stuck.trim(),
        becoming: answers.becoming.trim(),
        nature_place: answers.naturePlace.trim(),
        season_word: answers.seasonWord.trim(),
      })
      .eq("id", user.id)
    if (error) return { error: authErrorMessage(error.message) }
    return {}
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save answers." }
  }
}

export async function saveCategoryAction(
  category: Category
): Promise<{ error?: string }> {
  if (!isCategory(category)) return { error: "Pick a callsign to continue." }
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase
      .from("profiles")
      .update({
        category,
        onboarding_complete: true,
      })
      .eq("id", user.id)
    if (error) return { error: authErrorMessage(error.message) }
    return {}
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save your callsign." }
  }
}

export async function setAmbienceEnabledAction(
  enabled: boolean
): Promise<{ error?: string }> {
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase
      .from("profiles")
      .update({ ambience_enabled: enabled })
      .eq("id", user.id)
    if (error) return { error: authErrorMessage(error.message) }
    return {}
  } catch {
    return {}
  }
}

export async function createStoryAction(
  answers: Answers
): Promise<{ entry?: Entry; error?: string }> {
  try {
    const { supabase, user, profile } = await requireProfile()
    const category = profile.category ?? "seeker"
    await supabase
      .from("profiles")
      .update({
        hope: answers.hope.trim(),
        stuck: answers.stuck.trim(),
        becoming: answers.becoming.trim(),
        nature_place: answers.naturePlace.trim(),
        season_word: answers.seasonWord.trim(),
      })
      .eq("id", user.id)

    const generated = await generateStoryWithLuna(profile.name, answers, category)
    const { data, error } = await supabase
      .from("entries")
      .insert({
        user_id: user.id,
        type: "story",
        status: "ready",
        source: "ai",
        title: generated.title,
        body: generated.body,
        answers_snapshot: snapshotAnswers(answers),
        category_snapshot: category,
        model: generated.model || STORY_MODEL,
      })
      .select("*")
      .single()

    if (error || !data) {
      return { error: error ? authErrorMessage(error.message) : "Could not file that story." }
    }
    return { entry: mapEntry(data) }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not file that story." }
  }
}

export async function createVisionAction(): Promise<{ entry?: Entry; error?: string }> {
  try {
    const { supabase, user, profile } = await requireProfile()
    const category = profile.category ?? "seeker"
    const answers = profile.answers ?? EMPTY_ANSWERS
    const brief = await writeVisionPromptWithLuna(profile.name, answers, category)
    const image = await generateVisionImageWithFlare(brief.prompt)
    const stored = await uploadVisionImage(
      supabase,
      user.id,
      image.bytes,
      image.contentType
    )
    const { data, error } = await supabase
      .from("entries")
      .insert({
        user_id: user.id,
        type: "vision",
        status: "ready",
        source: "ai",
        title: brief.title,
        body: brief.body,
        prompt: brief.prompt,
        image_url: stored.imageUrl,
        image_path: stored.path,
        answers_snapshot: snapshotAnswers(answers),
        category_snapshot: category,
        model: `${VISION_IMAGE_MODEL}+${STORY_MODEL}`,
      })
      .select("*")
      .single()

    if (error || !data) {
      return { error: error ? authErrorMessage(error.message) : "Could not print that poster." }
    }
    return { entry: mapEntry(data) }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not print that poster." }
  }
}
