import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { AmbienceToggle } from "@/components/ambience-toggle"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Fable — Your life as a story worth keeping",
  description:
    "Answer a few questions. Walk away with the story of your life — and a hero image of who you are becoming.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="relative min-h-full flex flex-col font-sans">
        {children}
        <AmbienceToggle />
      </body>
    </html>
  )
}
