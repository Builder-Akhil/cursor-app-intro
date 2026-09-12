"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, History, LayoutDashboard, LogOut, Mountain, Sparkles } from "lucide-react"
import { signOutAction } from "@/app/auth/actions"
import { cn } from "@/lib/utils"

const links = [
  { href: "/app", label: "Home", icon: Sparkles },
  { href: "/app/story", label: "Story", icon: BookOpen },
  { href: "/app/vision", label: "Vision", icon: Mountain },
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/history", label: "History", icon: History },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-mist/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/app" className="flex items-center gap-2 font-medium tracking-tight text-ink">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
            F
          </span>
          <span>Fable</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/app" ? pathname === "/app" : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
          <form action={signOutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}
