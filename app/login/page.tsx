"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [showSetupInstructions, setShowSetupInstructions] = useState(false)
  const [redirectUri, setRedirectUri] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRedirectUri(`${window.location.origin}/auth/callback`)
    }
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID
      const tenantId = process.env.NEXT_PUBLIC_AZURE_TENANT_ID

      if (!clientId || !tenantId) {
        throw new Error(
          "Azure OAuth configuration is missing. Please add NEXT_PUBLIC_AZURE_CLIENT_ID and NEXT_PUBLIC_AZURE_TENANT_ID environment variables.",
        )
      }

      const state = Math.random().toString(36).substring(7)
      sessionStorage.setItem("oauth_state", state)

      const authUrl = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`)
      authUrl.searchParams.set("client_id", clientId)
      authUrl.searchParams.set("response_type", "code")
      authUrl.searchParams.set("redirect_uri", redirectUri)
      authUrl.searchParams.set("response_mode", "query")
      authUrl.searchParams.set("scope", "https://cognitiveservices.azure.com/.default openid profile email")
      authUrl.searchParams.set("state", state)

      // Redirect to Azure login
      window.location.href = authUrl.toString()
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError(err instanceof Error ? err.message : "Failed to login. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Azure Authentication</h1>
          <p className="text-muted-foreground">Sign in with your Microsoft account to access the AI chatbot</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Authentication Error</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
              {error.includes("redirect URI") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => setShowSetupInstructions(!showSetupInstructions)}
                >
                  {showSetupInstructions ? "Hide" : "Show"} Setup Instructions
                </Button>
              )}
            </div>
          </div>
        )}

        {showSetupInstructions && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-3">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Configure Redirect URI in Azure AD</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">Follow these steps:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>
                  Go to{" "}
                  <a
                    href="https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    Azure Portal → App Registrations
                  </a>
                </li>
                <li>Find your app (ID: {process.env.NEXT_PUBLIC_AZURE_CLIENT_ID})</li>
                <li>Click "Authentication" in the left menu</li>
                <li>Under "Platform configurations", click "Add a platform"</li>
                <li>Select "Web"</li>
                <li>
                  Add this Redirect URI:
                  <div className="mt-1 p-2 bg-background rounded border border-border font-mono text-xs break-all">
                    {redirectUri}
                  </div>
                </li>
                <li>Click "Configure" and then "Save"</li>
              </ol>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button onClick={handleLogin} disabled={isLoading || !redirectUri} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Redirecting to Azure...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 mr-2" />
                Login with Azure
              </>
            )}
          </Button>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium">What happens next:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>You'll be redirected to Microsoft login page</li>
              <li>Sign in with your Azure account credentials</li>
              <li>Grant permissions for the application</li>
              <li>You'll be redirected back to the chatbot</li>
            </ol>
          </div>

          {redirectUri && (
            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Current Redirect URI:</p>
              <div className="p-2 bg-muted rounded text-xs font-mono break-all">{redirectUri}</div>
              <p className="text-xs text-muted-foreground">
                Make sure this URI is added to your Azure AD app registration.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              This mimics the 'az login' flow, allowing secure token-based authentication with Azure AI services.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
