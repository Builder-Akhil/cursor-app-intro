export function safeInternalPath(
  path: string | null | undefined,
  fallback = "/app"
) {
  if (!path) return fallback
  if (!path.startsWith("/")) return fallback
  if (path.startsWith("//")) return fallback
  if (path.includes("\\")) return fallback
  return path
}

export function siteOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"
}
