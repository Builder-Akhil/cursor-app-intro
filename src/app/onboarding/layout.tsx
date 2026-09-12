import { redirect } from "next/navigation"
import { getCachedProfile } from "@/lib/data-server"
import { hasEnvVars } from "@/lib/supabase/env"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!hasEnvVars()) redirect("/signup")
  const profile = await getCachedProfile()
  if (!profile) redirect("/login")
  if (profile.onboardingComplete) redirect("/app")
  return children
}
