import type { Metadata } from "next"
import { Bebas_Neue, DM_Sans, Fraunces, Geist_Mono } from "next/font/google"
import { AmbienceToggle } from "@/components/ambience-toggle"
import "./globals.css"

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
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
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${serif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col font-sans">
        {children}
        <AmbienceToggle />
      </body>
    </html>
  )
}
