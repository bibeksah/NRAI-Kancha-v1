import { AgentsClient } from "@azure/ai-agents"
import { DefaultAzureCredential } from "@azure/identity"
import { AzureKeyCredential } from "@azure/core-auth"
import { isRestError } from "@azure/core-rest-pipeline"
import type { TokenCredential, AccessToken, GetTokenOptions } from "@azure/core-auth"
import type { PipelinePolicy, PipelineRequest, PipelineResponse, SendRequest } from "@azure/core-rest-pipeline"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Custom TokenCredential for user-provided OAuth tokens
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

  async getToken(scopes: string | string[]): Promise<AccessToken | null> {
    console.log("[v0] CustomTokenCredential.getToken called with scopes:", scopes)

    // Check if token is expired
    if (Date.now() >= this.expiresOn) {
      console.error("[v0] Access token has expired")
      return null
    }

    // Azure AI services may request different scopes:
    // - https://ai.azure.com/.default
    // - https://cognitiveservices.azure.com/.default
    // We accept both since our token is valid for cognitive services
    const scopeArray = Array.isArray(scopes) ? scopes : [scopes]
    console.log("[v0] Returning token for scopes:", scopeArray)

    return {
      token: this.token,
      expiresOnTimestamp: this.expiresOn,
    }
  }
}

// Custom pipeline policy to log raw responses
function createResponseLoggerPolicy(): PipelinePolicy {
  return {
    name: "ResponseLoggerPolicy",
    async sendRequest(request: PipelineRequest, next: SendRequest): Promise<PipelineResponse> {
      const response = await next(request)
      
      // Log the response for debugging
      console.log("[v0] HTTP Response:", {
        status: response.status,
        statusText: response.statusText,
        url: request.url,
      })
      
      // If there's an error status, log the body
      if (response.status >= 400) {
        console.error("[v0] Error Response Details:")
        console.error("[v0]   Status:", response.status)
        console.error("[v0]   Status Text:", response.statusText)
        console.error("[v0]   URL:", request.url)
        
        // Try to get the response body
        if (response.bodyAsText) {
          console.error("[v0]   Response Body:", response.bodyAsText)
        }
      }
      
      return response
    },
  }
}

export class AzureAgentService {
  private client: AgentsClient
  private agentId: string
  private threadId: string | null = null
  private authMethod: string

  constructor(projectUrl: string, agentId: string, apiKey?: string, accessToken?: string) {
    this.agentId = agentId
    let method: string = "Unknown"
    
    try {
      console.log("[v0] Initializing Azure Agent Service")
      console.log("[v0] Project URL:", projectUrl)
      console.log("[v0] Agent ID:", agentId)
      console.log("[v0] Has API Key:", !!apiKey)
      console.log("[v0] Has Access Token:", !!accessToken)

      if (!projectUrl.startsWith("https://")) {
        throw new Error("Project URL must start with https://")
      }

      // Use AgentsClient directly instead of AIProjectClient
      if (accessToken) {
        method = "OAuth Token"
        this.authMethod = method
        // Create client with custom pipeline policy to log responses
        this.client = new AgentsClient(projectUrl, new CustomTokenCredential(accessToken), {
          additionalPolicies: [
            {
              policy: createResponseLoggerPolicy(),
              position: "perRetry",
            },
          ],
        })
      } else if (apiKey) {
        method = "API Key"
        this.authMethod = method
        this.client = new AgentsClient(projectUrl, new AzureKeyCredential(apiKey), {
          additionalPolicies: [
            {
              policy: createResponseLoggerPolicy(),
              position: "perRetry",
            },
          ],
        })
      } else {
        method = "DefaultAzureCredential"
        this.authMethod = method
        this.client = new AgentsClient(projectUrl, new DefaultAzureCredential(), {
          additionalPolicies: [
            {
              policy: createResponseLoggerPolicy(),
              position: "perRetry",
            },
          ],
        })
      }
      
      console.log("[v0] Azure Agent Service initialized successfully with", this.authMethod)
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error)
      throw new Error(`Failed to initialize Azure client (${method}): ${errorMessage}`)
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error === null || error === undefined) {
      return "Unknown error (null or undefined)"
    }

    // Handle RestError from Azure SDK
    if (isRestError(error)) {
      const parts = [
        `HTTP ${error.statusCode || 'Unknown'}`,
        error.message || 'No message',
        error.code ? `[Code: ${error.code}]` : null,
        error.details ? `[Details: ${JSON.stringify(error.details)}]` : null,
      ].filter(Boolean)
      return parts.join(" ")
    }

    if (error instanceof Error) {
      return error.message || "Unknown error"
    }

    if (typeof error === "object") {
      const errorObj = error as any

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
        return JSON.stringify(errorObj, null, 2)
      } catch {
        return "Complex error object (cannot stringify)"
      }
    }

    return String(error)
  }

  async initialize() {
    try {
      console.log("[v0] Creating new thread with", this.authMethod)
      
      // Verify the client has the expected structure
      if (!this.client || typeof this.client !== "object") {
        throw new Error("Azure client is not properly initialized")
      }
      
      if (!this.client.threads || typeof this.client.threads !== "object") {
        throw new Error("Azure client.threads is not available. This might indicate a version mismatch or authentication issue.")
      }
      
      if (!this.client.threads.create || typeof this.client.threads.create !== "function") {
        throw new Error("Azure client.threads.create is not a function. This might indicate a version mismatch or authentication issue.")
      }

      console.log("[v0] Client structure verified successfully")
      console.log("[v0] Calling threads.create()...")

      // Wrap the SDK call in comprehensive error handling
      let thread: any
      try {
        thread = await this.client.threads.create()
      } catch (sdkError: any) {
        console.error("[v0] SDK Error Details:")
        console.error("[v0]   Error type:", typeof sdkError)
        console.error("[v0]   Error constructor:", sdkError?.constructor?.name)
        console.error("[v0]   Is RestError:", isRestError(sdkError))
        console.error("[v0]   Error keys:", sdkError && typeof sdkError === 'object' ? Object.keys(sdkError) : 'N/A')
        
        if (isRestError(sdkError)) {
          console.error("[v0]   Status Code:", sdkError.statusCode)
          console.error("[v0]   Error Code:", sdkError.code)
          console.error("[v0]   Message:", sdkError.message)
          console.error("[v0]   Details:", sdkError.details)
          console.error("[v0]   Request URL:", sdkError.request?.url)
          console.error("[v0]   Response:", sdkError.response)
        }
        
        // Log the full error object for debugging
        console.error("[v0]   Full SDK Error:", sdkError)
        
        // Re-throw to be caught by outer catch
        throw sdkError
      }
      
      console.log("[v0] Thread created successfully")
      console.log("[v0] Thread response type:", typeof thread)
      console.log("[v0] Thread ID:", thread?.id)

      // Validate thread response
      if (!thread || typeof thread !== "object") {
        throw new Error("Thread creation failed: Invalid response from Azure SDK")
      }

      if (!thread.id || typeof thread.id !== "string") {
        console.error("[v0] Invalid thread object:", thread)
        throw new Error("Thread creation failed: Response does not contain a valid thread ID")
      }

      this.threadId = thread.id
      console.log("[v0] Thread initialized with ID:", this.threadId)
      return thread.id
    } catch (error) {
      console.error("[v0] Thread creation error in outer catch:")
      console.error("[v0]   Error type:", typeof error)
      console.error("[v0]   Error name:", error?.constructor?.name)
      
      // Enhanced error logging for RestError
      if (isRestError(error)) {
        console.error("[v0] RestError details:")
        console.error("[v0]   Status Code:", error.statusCode)
        console.error("[v0]   Error Code:", error.code)
        console.error("[v0]   Message:", error.message)
        console.error("[v0]   Details:", error.details)
        console.error("[v0]   Request:", error.request?.url)
        
        // Provide helpful messages based on status code
        if (error.statusCode === 401) {
          throw new Error(
            `Authentication failed (HTTP 401): ${error.message}. ` +
            `Please check that your access token or API key is valid and has the correct permissions. ` +
            `Required scope: https://cognitiveservices.azure.com/.default or https://ai.azure.com/.default`
          )
        } else if (error.statusCode === 403) {
          throw new Error(
            `Authorization failed (HTTP 403): ${error.message}. ` +
            `Please check that your account has the Contributor role on the Azure AI Project resource.`
          )
        } else if (error.statusCode === 404) {
          throw new Error(
            `Resource not found (HTTP 404): ${error.message}. ` +
            `Please verify that AZURE_AI_PROJECT_URL and AZURE_AI_AGENT_ID are correct.`
          )
        } else if (error.statusCode === 429) {
          throw new Error(
            `Rate limit exceeded (HTTP 429): ${error.message}. ` +
            `Please wait and try again later.`
          )
        }
      }

      // Log full error for debugging
      console.error("[v0] Full error object:", error)
      console.error("[v0] Error stack:", error instanceof Error ? error.stack : 'No stack')

      const errorMessage = this.extractErrorMessage(error)
      throw new Error(`Thread creation failed: ${errorMessage}`)
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
      await this.client.messages.create(this.threadId!, "user", content)

      console.log("[v0] Creating run with agent:", this.agentId)
      // Create and poll run
      let run = await this.client.runs.create(this.threadId!, this.agentId)

      while (run.status === "queued" || run.status === "in_progress") {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        run = await this.client.runs.get(this.threadId!, run.id)
        console.log("[v0] Run status:", run.status)
      }

      if (run.status === "failed") {
        const errorMsg = run.lastError ? this.extractErrorMessage(run.lastError) : "Unknown error"
        console.error("[v0] Run failed with error:", errorMsg)
        throw new Error(`Agent run failed: ${errorMsg}`)
      }

      console.log("[v0] Run completed, retrieving messages")
      // Retrieve all messages
      const messages = this.client.messages.list(this.threadId!)

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
      console.error("[v0] Error in sendMessage:", error)
      
      if (isRestError(error)) {
        console.error("[v0] RestError in sendMessage:")
        console.error("[v0]   Status Code:", error.statusCode)
        console.error("[v0]   Message:", error.message)
      }
      
      const errorMessage = this.extractErrorMessage(error)
      throw new Error(`Failed to send message: ${errorMessage}`)
    }
  }

  async getThreadMessages(): Promise<Message[]> {
    if (!this.threadId) {
      return []
    }

    try {
      const messages = this.client.messages.list(this.threadId)

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
