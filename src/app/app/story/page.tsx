import { getCachedProfile } from "@/lib/data-server"
import { EMPTY_ANSWERS } from "@/lib/types"
import { StoryForm } from "./story-form"

export const maxDuration = 90

export default async function StoryModePage() {
  const profile = await getCachedProfile()
  return (
    <StoryForm
      name={profile?.name ?? "Friend"}
      category={profile?.category ?? "seeker"}
      initialAnswers={profile?.answers ?? EMPTY_ANSWERS}
    />
  )
}
