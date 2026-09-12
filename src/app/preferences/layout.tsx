import { redirect } from "next/navigation"
import { getCachedProfile } from "@/lib/data-server"
import { profileHasAnswers } from "@/lib/data"
import { hasEnvVars } from "@/lib/supabase/env"

export default async function PreferencesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!hasEnvVars()) redirect("/signup")
  const profile = await getCachedProfile()
  if (!profile) redirect("/login")
  if (!profileHasAnswers(profile)) redirect("/onboarding")
  return children
}
