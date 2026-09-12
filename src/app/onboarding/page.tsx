import { getCachedProfile } from "@/lib/data-server"
import { EMPTY_ANSWERS } from "@/lib/types"
import { OnboardingForm } from "./onboarding-form"

export default async function OnboardingPage() {
  const profile = await getCachedProfile()
  return <OnboardingForm initialAnswers={profile?.answers ?? EMPTY_ANSWERS} />
}
