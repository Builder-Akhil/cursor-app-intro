import type {
  Answers,
  Category,
  Entry,
  FableState,
  Profile,
  WaitlistItem,
} from "./types"

const STORAGE_KEY = "fable-v01-state"

const DEFAULT_STATE: FableState = {
  profile: null,
  answers: null,
  category: null,
  onboardingComplete: false,
  entries: [],
  waitlist: [],
  ambienceEnabled: false,
}

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage
}

export function loadState(): FableState {
  if (!canUseStorage()) return { ...DEFAULT_STATE, entries: [], waitlist: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE, entries: [], waitlist: [] }
    const parsed = JSON.parse(raw) as Partial<FableState>
    return {
      ...DEFAULT_STATE,
      ...parsed,
      entries: parsed.entries ?? [],
      waitlist: parsed.waitlist ?? [],
    }
  } catch {
    return { ...DEFAULT_STATE, entries: [], waitlist: [] }
  }
}

export function saveState(state: FableState) {
  if (!canUseStorage()) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function updateState(patch: Partial<FableState>): FableState {
  const next = { ...loadState(), ...patch }
  saveState(next)
  return next
}

export function setProfile(profile: Profile) {
  return updateState({ profile })
}

export function setAnswers(answers: Answers) {
  return updateState({ answers })
}

export function setCategory(category: Category) {
  return updateState({ category, onboardingComplete: true })
}

export function addEntry(entry: Entry) {
  const state = loadState()
  const next = { ...state, entries: [entry, ...state.entries] }
  saveState(next)
  return next
}

export function addWaitlistEmail(email: string): { ok: boolean; already: boolean } {
  const state = loadState()
  const normalized = email.trim().toLowerCase()
  if (!normalized) return { ok: false, already: false }
  if (state.waitlist.some((w) => w.email === normalized)) {
    return { ok: true, already: true }
  }
  const item: WaitlistItem = {
    email: normalized,
    joinedAt: new Date().toISOString(),
  }
  saveState({ ...state, waitlist: [item, ...state.waitlist] })
  return { ok: true, already: false }
}

export function setAmbienceEnabled(enabled: boolean) {
  return updateState({ ambienceEnabled: enabled })
}

export function findProfileByEmail(email: string): Profile | null {
  const state = loadState()
  if (
    state.profile &&
    state.profile.email.toLowerCase() === email.trim().toLowerCase()
  ) {
    return state.profile
  }
  return null
}

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
