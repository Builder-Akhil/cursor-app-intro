"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { authErrorMessage } from "@/lib/data"
import { safeInternalPath, siteOrigin } from "@/lib/paths"
import { createClient } from "@/lib/supabase/server"
import { hasEnvVars } from "@/lib/supabase/env"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

async function confirmRedirectTo() {
  const headerStore = await headers()
  const origin = headerStore.get("origin") || siteOrigin()
  return `${origin}/auth/confirm`
}

export async function signupAction(formData: FormData) {
  if (!hasEnvVars()) {
    return { error: "The hangar keys are not plugged in yet. Add Supabase env vars." }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")

  if (!name) return { error: "Add your name so the logbook knows who is flying." }
  if (!email.includes("@")) return { error: "Use a real email so we can find your hangar later." }
  if (password.length < 8) return { error: "Password must be at least 8 characters." }
  if (password !== confirm) return { error: "Those two passwords do not match." }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: await confirmRedirectTo(),
    },
  })

  if (error) return { error: authErrorMessage(error.message) }
  if (!data.session) {
    redirect("/signup?checkEmail=1")
  }

  redirect("/onboarding")
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
