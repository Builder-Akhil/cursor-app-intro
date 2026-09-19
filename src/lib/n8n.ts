import "server-only"

type SignupPayload = {
  name: string
  email: string
}

function webhookUrl() {
  return process.env.N8N_WEBHOOK_URL?.trim() ?? ""
}

function candidateUrls(url: string) {
  const urls = [url]
  if (url.includes("/webhook-test/")) {
    urls.push(url.replace("/webhook-test/", "/webhook/"))
  }
  return urls
}

async function postJson(url: string, payload: SignupPayload, signal: AbortSignal) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: payload.name, email: payload.email }),
    cache: "no-store",
    signal,
  })
}

async function getQuery(url: string, payload: SignupPayload, signal: AbortSignal) {
  const target = new URL(url)
  target.searchParams.set("name", payload.name)
  target.searchParams.set("email", payload.email)
  return fetch(target, { method: "GET", cache: "no-store", signal })
}

export async function notifyN8nSignup(payload: SignupPayload) {
  const url = webhookUrl()
  if (!url) return { ok: true, skipped: true as const }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    for (const target of candidateUrls(url)) {
      const posted = await postJson(target, payload, controller.signal)
      if (posted.ok) return { ok: true, status: posted.status }

      const got = await getQuery(target, payload, controller.signal)
      if (got.ok) return { ok: true, status: got.status }
    }
    console.error("n8n onboarding webhook refused every radio path")
    return { ok: false, status: 0 }
  } catch (error) {
    console.error("n8n onboarding webhook did not complete", error)
    return { ok: false, status: 0 }
  } finally {
    clearTimeout(timeout)
  }
}

export async function queueN8nSignup(payload: SignupPayload) {
  const name = payload.name.trim()
  const email = payload.email.trim().toLowerCase()
  if (!name || !email.includes("@")) return { ok: true, skipped: true as const }
  if (!webhookUrl()) return { ok: true, skipped: true as const }
  return notifyN8nSignup({ name, email })
}
