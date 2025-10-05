import { type NextRequest, NextResponse } from "next/server"
import { AzureAgentService } from "@/lib/azure-agent"

export const runtime = "nodejs"

let agentService: AzureAgentService | null = null

function getAgentService(accessToken?: string) {
  const projectUrl = process.env.AZURE_AI_PROJECT_URL
  const agentId = process.env.AZURE_AI_AGENT_ID
  const apiKey = process.env.AZURE_AI_API_KEY

  if (!projectUrl || !agentId) {
    throw new Error(
      "Missing required environment variables: AZURE_AI_PROJECT_URL and AZURE_AI_AGENT_ID. " +
        "Please add them in Project Settings > Environment Variables.",
    )
  }

  if (accessToken) {
    console.log("[v0] Using OAuth access token for authentication")
    return new AzureAgentService(projectUrl, agentId, undefined, accessToken)
  }

  // Use cached service for API key authentication
  if (!agentService) {
    console.log("[v0] Initializing Azure Agent Service with API key")
    agentService = new AzureAgentService(projectUrl, agentId, apiKey)
  }

  return agentService
}

export async function POST(request: NextRequest) {
  try {
    const { message, threadId, accessToken } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("[v0] Processing chat message:", { hasAccessToken: !!accessToken, hasThreadId: !!threadId })

    if (accessToken && typeof accessToken !== "string") {
      return NextResponse.json({ error: "Invalid access token format" }, { status: 400 })
    }

    const service = getAgentService(accessToken)

    // Initialize thread if not exists
    if (!threadId) {
      console.log("[v0] Initializing new thread")
      await service.initialize()
    }

    // Send message and get response
    console.log("[v0] Sending message to Azure agent")
    const messages = await service.sendMessage(message)
    console.log("[v0] Received response with", messages.length, "messages")

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Chat API error:", error)

    let errorMessage = "Failed to process message"
    let errorDetails = undefined

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack

      // Provide helpful hints for common authentication errors
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        errorMessage +=
          " - Check that your access token is valid and has the correct scope (https://cognitiveservices.azure.com/.default)"
      } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
        errorMessage += " - Check that your account has the Contributor role on the Azure AI Project"
      } else if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        errorMessage += " - Verify that AZURE_AI_PROJECT_URL and AZURE_AI_AGENT_ID are correct"
      }
    } else if (typeof error === "object" && error !== null) {
      errorMessage = JSON.stringify(error)
    } else {
      errorMessage = String(error)
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorDetails : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const service = getAgentService()
    const messages = await service.getThreadMessages()
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Get messages error:", error)

    let errorMessage = "Failed to retrieve messages"

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === "object" && error !== null) {
      errorMessage = JSON.stringify(error)
    } else {
      errorMessage = String(error)
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
