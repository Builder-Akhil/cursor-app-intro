export type Category = "seeker" | "builder" | "healer" | "wanderer"

export type EntryType = "story" | "vision"

export interface Profile {
  name: string
  email: string
  createdAt: string
}

export interface Answers {
  hope: string
  stuck: string
  becoming: string
  naturePlace: string
  seasonWord: string
}

export interface AppProfile {
  id: string
  name: string
  email: string
  answers: Answers | null
  category: Category | null
  onboardingComplete: boolean
  ambienceEnabled: boolean
  createdAt: string
}

export interface Entry {
  id: string
  type: EntryType
  title: string
  body: string
  prompt?: string
  imageUrl?: string
  createdAt: string
}

export interface WaitlistItem {
  email: string
  joinedAt: string
}

export interface FableState {
  profile: Profile | null
  answers: Answers | null
  category: Category | null
  onboardingComplete: boolean
  entries: Entry[]
  waitlist: WaitlistItem[]
  ambienceEnabled: boolean
}

export const EMPTY_ANSWERS: Answers = {
  hope: "",
  stuck: "",
  becoming: "",
  naturePlace: "",
  seasonWord: "",
}

export const CATEGORY_META: Record<
  Category,
  { label: string; blurb: string; imageId: string }
> = {
  seeker: {
    label: "Seeker",
    blurb: "You look toward the horizon for who you’re becoming.",
    imageId: "photo-1506905925346-21bda4d32df4",
  },
  builder: {
    label: "Builder",
    blurb: "You turn quiet intentions into solid next steps.",
    imageId: "photo-1469474968028-56623f02e42e",
  },
  healer: {
    label: "Healer",
    blurb: "You mend what’s heavy and make space for hope.",
    imageId: "photo-1441974231531-c6227db76b6e",
  },
  wanderer: {
    label: "Wanderer",
    blurb: "You trust the path as it reveals itself in mist.",
    imageId: "photo-1470071459604-3b5ec3a7fe05",
  },
}

export function unsplashUrl(imageId: string, width = 1200) {
  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=${width}&q=80`
}
