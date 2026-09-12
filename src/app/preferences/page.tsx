import { getCachedProfile } from "@/lib/data-server"
import { suggestCategory } from "@/lib/stories"
import { EMPTY_ANSWERS } from "@/lib/types"
import { PreferencesForm } from "./preferences-form"

export default async function PreferencesPage() {
  const profile = await getCachedProfile()
  const suggested =
    profile?.category ?? suggestCategory(profile?.answers ?? EMPTY_ANSWERS)

  return <PreferencesForm initialCategory={suggested} />
}
