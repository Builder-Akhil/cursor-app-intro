import "server-only"
import { after } from "next/server"

type SignupPayload = {
  name: string
  email: string
}

function webhookUrl() {
  return process.env.N8N_WEBHOOK_URL?.trim() ?? ""
}

export async function notifyN8nSignup(payload: SignupPayload) {
  const url = webhookUrl()
  if (!url) return

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
      }),
      cache: "no-store",
      signal: controller.signal,
    })
    if (!response.ok) {
      console.error("n8n onboarding webhook refused the payload", response.status)
    }
  } catch (error) {
    console.error("n8n onboarding webhook did not complete", error)
  } finally {
    clearTimeout(timeout)
  }
}

export function queueN8nSignup(payload: SignupPayload) {
  const name = payload.name.trim()
  const email = payload.email.trim().toLowerCase()
  if (!name || !email.includes("@")) return
  if (!webhookUrl()) return

  const run = () => {
    void notifyN8nSignup({ name, email })
  }

  try {
    after(run)
  } catch {
    run()
  }
}
