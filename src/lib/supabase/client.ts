import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"
import { getPublicSupabaseEnv } from "./env"

export function createClient() {
  const { url, key } = getPublicSupabaseEnv()
  return createBrowserClient<Database>(url, key)
}
