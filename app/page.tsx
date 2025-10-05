"use client"

import { Chatbot } from "@/components/chatbot"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have an access token
        const token = sessionStorage.getItem("azure_access_token")

        // Check if API key is configured (fallback authentication)
        const response = await fetch("/api/auth/check")
        const { requiresOAuth } = await response.json()

        // If OAuth is required and no token, redirect to login
        if (requiresOAuth && !token) {
          router.push("/login")
          return
        }

        setIsCheckingAuth(false)
      } catch (error) {
        console.error("[v0] Auth check error:", error)
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  if (isCheckingAuth) {
    return (
      <main className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen w-full">
      <Chatbot />
    </main>
  )
}
