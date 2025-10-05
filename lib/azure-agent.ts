import { AIProjectClient } from "@azure/ai-projects"
import { DefaultAzureCredential } from "@azure/identity"
import { AzureKeyCredential } from "@azure/core-auth"
import type { TokenCredential, AccessToken, GetTokenOptions } from "@azure/core-auth"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

class CustomTokenCredential implements TokenCredential {
  private token: string
  private expiresOn: number

  constructor(token: string) {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid access token provided")
    }
    this.token = token
    // Token expires in 1 hour (3600 seconds) from now
    this.expiresOn = Date.now() + 3600 * 1000
  }

  async getToken(scopes: string | string[], options?: GetTokenOptions): Promise<AccessToken | null> {
    console.log("[v0] CustomTokenCredential.getToken called with scopes:", scopes)

    // Check if token is expired
    if (Date.now() >= this.expiresOn) {
      console.error("[v0] Access token has expired")
      return null
    }

    // Validate that the requested scope matches Azure Cognitive Services
    const scopeArray = Array.isArray(scopes) ? scopes : [scopes]
    const validScope = scopeArray.some(
      (scope) => scope.includes("cognitiveservices.azure.com") || scope.includes(".default"),
    )

    if (!validScope) {
      console.warn("[v0] Warning: Requested scope may not match Azure Cognitive Services:", scopes)
    }

    return {
      token: this.token,
      expiresOnTimestamp: this.expiresOn,
    }
  }
}

export class AzureAgentService {
  private client: AIProjectClient
  private agentId: string
  private threadId: string | null = null
  private authMethod: string

  constructor(projectUrl: string, agentId: string, apiKey?: string, accessToken?: string) {
    try {
      console.log("[v0] Initializing Azure Agent Service")
      console.log("[v0] Project URL:", projectUrl)
      console.log("[v0] Agent ID:", agentId)
      console.log("[v0] Has API Key:", !!apiKey)
      console.log("[v0] Has Access Token:", !!accessToken)

      if (!projectUrl.startsWith("https://")) {
        throw new Error("Project URL must start with https://")
      }

      if (accessToken) {
        console.log("[v0] Using OAuth access token authentication")
        this.authMethod = "OAuth Token"
        this.client = new AIProjectClient(projectUrl, new CustomTokenCredential(accessToken))
      } else if (apiKey) {
        console.log("[v0] Using API key authentication")
        this.authMethod = "API Key"
        this.client = new AIProjectClient(projectUrl, new AzureKeyCredential(apiKey))
      } else {
        console.log("[v0] Using DefaultAzureCredential authentication")
        this.authMethod = "DefaultAzureCredential"
        this.client = new AIProjectClient(projectUrl, new DefaultAzureCredential())
      }
      this.agentId = agentId
      console.log("[v0] Azure Agent Service initialized successfully with", this.authMethod)
    } catch (error) {
      console.error("[v0] Failed to initialize Azure Agent Service")
      console.error("[v0] Error type:", typeof error)
      console.error("[v0] Error constructor:", error?.constructor?.name)
      console.error("[v0] Full error:", error)

      const errorMessage = this.extractErrorMessage(error)
      throw new Error(`Failed to initialize Azure client (${this.authMethod || "Unknown"}): ${errorMessage}`)
    }
  }

  private extractErrorMessage(error: unknown): string {
    console.log("[v0] Extracting error message from:", typeof error)

    if (error === null || error === undefined) {
      return "Unknown error (null or undefined)"
    }

    if (error instanceof Error) {
      console.log("[v0] Error is an Error instance:", error.message)
      return error.message || "Unknown error"
    }

    if (typeof error === "object") {
      const errorObj = error as any

      // Log all properties for debugging
      console.log("[v0] Error object keys:", Object.keys(errorObj))

      // Try different error message properties
      if (errorObj.message && typeof errorObj.message === "string") {
        return errorObj.message
      }
      if (errorObj.error && typeof errorObj.error === "string") {
        return errorObj.error
      }
      if (errorObj.code && typeof errorObj.code === "string") {
        return `Error code: ${errorObj.code}`
      }
      if (errorObj.statusCode) {
        return `HTTP ${errorObj.statusCode}: ${errorObj.statusMessage || "Unknown error"}`
      }

      // Try to stringify the error object
      try {
        const stringified = JSON.stringify(errorObj, null, 2)
        console.log("[v0] Stringified error:", stringified)
        return stringified
      } catch (stringifyError) {
        console.log("[v0] Failed to stringify error:", stringifyError)
        return "Complex error object (cannot stringify)"
      }
    }

    const fallback = String(error)
    console.log("[v0] Fallback error string:", fallback)
    return fallback
  }

  async initialize() {
    try {
      console.log("[v0] Creating new thread with", this.authMethod)
      console.log("[v0] Client object exists:", !!this.client)
      console.log("[v0] Client.agents exists:", !!this.client?.agents)
      console.log("[v0] Client.agents.threads exists:", !!this.client?.agents?.threads)

      if (!this.client || !this.client.agents || !this.client.agents.threads) {
        throw new Error("Azure client not properly initialized - missing agents.threads API")
      }

      const thread = await this.client.agents.threads.create()

      console.log("[v0] Thread created successfully")
      console.log("[v0] Thread object:", thread)
      console.log("[v0] Thread ID:", thread?.id)

      if (!thread || !thread.id) {
        throw new Error("Thread created but no ID returned")
      }

      this.threadId = thread.id
      console.log("[v0] Thread ID stored:", this.threadId)
      return thread.id
    } catch (error) {
      console.error("[v0] Failed to create thread")
      console.error("[v0] Error type:", typeof error)
      console.error("[v0] Error constructor:", error?.constructor?.name)
      console.error("[v0] Error keys:", error && typeof error === "object" ? Object.keys(error) : "N/A")
      console.error("[v0] Full error object:", error)

      if (error && typeof error === "object") {
        const errorObj = error as any
        console.error("[v0] Error.message:", errorObj.message)
        console.error("[v0] Error.code:", errorObj.code)
        console.error("[v0] Error.statusCode:", errorObj.statusCode)
        console.error("[v0] Error.response:", errorObj.response)
        console.error("[v0] Error.request:", errorObj.request)
      }

      const errorMessage = this.extractErrorMessage(error)
      throw new Error(`Failed to create thread: ${errorMessage}`)
    }
  }

  async sendMessage(content: string): Promise<Message[]> {
    try {
      if (!this.threadId) {
        console.log("[v0] No thread ID, initializing new thread")
        await this.initialize()
      }

      console.log("[v0] Creating user message in thread:", this.threadId)
      // Create user message
      await this.client.agents.messages.create(this.threadId!, "user", content)

      console.log("[v0] Creating run with agent:", this.agentId)
      // Create and poll run
      let run = await this.client.agents.runs.create(this.threadId!, this.agentId)

      while (run.status === "queued" || run.status === "in_progress") {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        run = await this.client.agents.runs.get(this.threadId!, run.id)
        console.log("[v0] Run status:", run.status)
      }

      if (run.status === "failed") {
        const errorMsg = run.lastError ? this.extractErrorMessage(run.lastError) : "Unknown error"
        console.error("[v0] Run failed with error:", errorMsg)
        throw new Error(`Run failed: ${errorMsg}`)
      }

      console.log("[v0] Run completed, retrieving messages")
      // Retrieve all messages
      const messages = await this.client.agents.messages.list(this.threadId!, {
        order: "asc",
      })

      const formattedMessages: Message[] = []
      for await (const m of messages) {
        const content = m.content.find((c) => c.type === "text" && "text" in c)
        if (content && "text" in content) {
          formattedMessages.push({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: content.text.value,
            timestamp: new Date(m.createdAt),
          })
        }
      }

      console.log("[v0] Retrieved", formattedMessages.length, "messages")
      return formattedMessages
    } catch (error) {
      console.error("[v0] Error in sendMessage")
      console.error("[v0] Full error object:", error)
      const errorMessage = this.extractErrorMessage(error)
      throw new Error(`Failed to send message: ${errorMessage}`)
    }
  }

  async getThreadMessages(): Promise<Message[]> {
    if (!this.threadId) {
      return []
    }

    try {
      const messages = await this.client.agents.messages.list(this.threadId, {
        order: "asc",
      })

      const formattedMessages: Message[] = []
      for await (const m of messages) {
        const content = m.content.find((c) => c.type === "text" && "text" in c)
        if (content && "text" in content) {
          formattedMessages.push({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: content.text.value,
            timestamp: new Date(m.createdAt),
          })
        }
      }

      return formattedMessages
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error)
      console.error("[v0] Error in getThreadMessages:", errorMessage)
      throw new Error(`Failed to get messages: ${errorMessage}`)
    }
  }
}
