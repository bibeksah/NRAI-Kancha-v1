// Azure OAuth authentication utilities
export interface AzureOAuthConfig {
  clientId: string
  tenantId: string
  redirectUri: string
  scopes: string[]
}

export class AzureOAuthService {
  private config: AzureOAuthConfig

  constructor(config: AzureOAuthConfig) {
    this.config = config
  }

  // Generate authorization URL for Azure AD login
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: "code",
      redirect_uri: this.config.redirectUri,
      response_mode: "query",
      scope: this.config.scopes.join(" "),
      state: state,
    })

    return `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/authorize?${params.toString()}`
  }

  // Generate random state for CSRF protection
  generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Open login popup
  openLoginPopup(authUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const width = 500
      const height = 600
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const popup = window.open(
        authUrl,
        "Azure Login",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no`,
      )

      if (!popup) {
        reject(new Error("Failed to open popup. Please allow popups for this site."))
        return
      }

      // Poll for popup closure or message
      const pollTimer = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(pollTimer)
            reject(new Error("Login popup was closed"))
          }
        } catch (e) {
          // Ignore cross-origin errors
        }
      }, 500)

      // Listen for message from popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === "azure-oauth-success") {
          clearInterval(pollTimer)
          window.removeEventListener("message", messageHandler)
          popup.close()
          resolve(event.data.code)
        } else if (event.data.type === "azure-oauth-error") {
          clearInterval(pollTimer)
          window.removeEventListener("message", messageHandler)
          popup.close()
          reject(new Error(event.data.error))
        }
      }

      window.addEventListener("message", messageHandler)
    })
  }
}
