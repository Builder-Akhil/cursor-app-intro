"use server"

import { redirect } from "next/navigation"
import { authErrorMessage } from "@/lib/data"
import { queueN8nSignup } from "@/lib/n8n"
import { safeInternalPath } from "@/lib/paths"
import { createClient } from "@/lib/supabase/server"
import { hasEnvVars } from "@/lib/supabase/env"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function notifySignupWebhookAction(input: {
  name: string
  email: string
}) {
  try {
    await queueN8nSignup({
      name: String(input.name ?? ""),
      email: String(input.email ?? ""),
    })
  } catch {
    // Radio can fail; hangar doors still open.
  }
  return { ok: true as const }
}

export async function loginAction(formData: FormData) {
  if (!hasEnvVars()) {
    return { error: "The hangar keys are not plugged in yet. Add Supabase env vars." }
  }

  const email = normalizeEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")
  const next = safeInternalPath(String(formData.get("next") ?? "") || "/app")

  if (!email.includes("@") || !password) {
    return { error: "Add email and password to taxi in." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: authErrorMessage(error.message) }

  redirect(next)
}

export async function signOutAction() {
  if (hasEnvVars()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  redirect("/")
}
