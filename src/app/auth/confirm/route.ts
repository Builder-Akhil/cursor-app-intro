import { type EmailOtpType } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { safeInternalPath } from "@/lib/paths"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = safeInternalPath(searchParams.get("next"), "/onboarding")
  const code = searchParams.get("code")

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      redirect(next)
    }
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      redirect(next)
    }
    const pkceMissing = (error.message ?? "").toLowerCase().includes("code verifier")
    if (pkceMissing) {
      redirect("/login?confirmed=1")
    }
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/auth/error?error=Missing confirmation token")
}
