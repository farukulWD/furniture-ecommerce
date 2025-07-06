import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Providers } from "./providers"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ComparisonButton from "@/components/comparison-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MS Furniture - Premium Furniture Store",
  description: "Shop premium furniture for your home and office",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ComparisonButton />
        </Providers>
      </body>
    </html>
  )
}
