import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const pkceMissing = (error ?? "").toLowerCase().includes("code verifier")

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <Card className="glass border-white/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">
            {pkceMissing ? "Your hangar is ready" : "Could not clear you in"}
          </CardTitle>
          <CardDescription className="text-base">
            {pkceMissing
              ? "The confirmation link already stamped your badge. Sign in with the same email and password to taxi in."
              : error || "The confirmation link did not work. Request a new one from sign up."}
          </CardDescription>
          <Link
            href={pkceMissing ? "/login?confirmed=1" : "/login"}
            className="pt-2 text-sm text-primary hover:underline"
          >
            Sign in
          </Link>
        </CardHeader>
      </Card>
    </main>
  )
}
