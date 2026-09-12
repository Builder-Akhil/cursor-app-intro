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
  { href: "/app/dashboard", label: "Board", icon: LayoutDashboard },
  { href: "/app/history", label: "Log", icon: History },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/app" className="flex items-center gap-2 text-paper">
          <span className="flex size-9 items-center justify-center bg-volt text-sm font-display text-ink">
            F
          </span>
          <span className="font-display text-2xl tracking-wide">FABLE</span>
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
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-display tracking-[0.16em] uppercase transition-colors",
                  active
                    ? "bg-volt text-ink"
                    : "text-paper/75 hover:bg-paper/10 hover:text-paper"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-display tracking-[0.16em] uppercase text-paper/75 transition-colors hover:bg-crimson hover:text-paper"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Out</span>
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}
