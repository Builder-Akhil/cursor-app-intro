import { Suspense } from "react"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AuthLoading />}>{children}</Suspense>
}

function AuthLoading() {
  return (
    <main className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
      Preparing the taxiway…
    </main>
  )
}
