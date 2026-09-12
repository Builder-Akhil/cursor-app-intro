import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <Card className="glass border-white/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">Could not clear you in</CardTitle>
          <CardDescription className="text-base">
            {error || "The confirmation link did not work. Request a new one from sign up."}
          </CardDescription>
          <Link href="/login" className="pt-2 text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </CardHeader>
      </Card>
    </main>
  )
}
