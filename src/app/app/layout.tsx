import { redirect } from "next/navigation"
import { AppNav } from "@/components/app-nav"
import { getCachedProfile } from "@/lib/data-server"
import { profileHasAnswers } from "@/lib/data"
import { hasEnvVars } from "@/lib/supabase/env"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!hasEnvVars()) redirect("/signup")

  const profile = await getCachedProfile()
  if (!profile) redirect("/login")
  if (!profile.onboardingComplete) {
    redirect(profileHasAnswers(profile) ? "/preferences" : "/onboarding")
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppNav />
      <div className="flex-1">{children}</div>
    </div>
  )
}
