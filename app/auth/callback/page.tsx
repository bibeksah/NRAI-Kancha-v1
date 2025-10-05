"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing authentication...")

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const error = searchParams.get("error")
      const errorDescription = searchParams.get("error_description")

      if (error) {
        setStatus("error")
        setMessage(errorDescription || error)
        return
      }

      if (!code || !state) {
        setStatus("error")
        setMessage("Missing authorization code or state")
        return
      }

      const savedState = sessionStorage.getItem("oauth_state")
      if (state !== savedState) {
        setStatus("error")
        setMessage("Invalid state parameter. Possible CSRF attack.")
        return
      }

      try {
        const response = await fetch("/api/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to exchange token")
        }

        const { accessToken } = await response.json()

        sessionStorage.setItem("azure_access_token", accessToken)
        sessionStorage.removeItem("oauth_state")

        setStatus("success")
        setMessage("Authentication successful! Redirecting to chatbot...")

        setTimeout(() => {
          router.push("/")
        }, 1500)
      } catch (err) {
        console.error("[v0] Token exchange error:", err)
        setStatus("error")
        setMessage(err instanceof Error ? err.message : "Failed to complete authentication")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <h2 className="text-xl font-semibold text-foreground">Processing...</h2>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Success!</h2>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Authentication Failed</h2>
            </>
          )}

          <p className="text-muted-foreground">{message}</p>
        </div>
      </Card>
    </div>
  )
}
