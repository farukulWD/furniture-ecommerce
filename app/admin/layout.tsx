"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/admin/sidebar"
import { useAuth } from "@/context/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isLoading && (!isAuthenticated || (user && user.role !== "admin"))) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router, user])

  // Show nothing while checking authentication
  if (isLoading || !isAuthenticated || (user && user.role !== "admin")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-screen">
          <main className="p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  )
}
