import { type NextRequest, NextResponse } from "next/server"
import { AzureAssistantService } from "@/lib/azure-assistant"

export const runtime = "nodejs"

let assistantService: AzureAssistantService | null = null

function getAssistantService() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT
  const apiKey = process.env.AZURE_OPENAI_KEY
  const assistantId = process.env.AZURE_ASSISTANT_ID

  if (!endpoint || !apiKey || !assistantId) {
    throw new Error(
      "Missing required environment variables: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, and AZURE_ASSISTANT_ID. " +
        "Please add them to your .env.local file.",
    )
  }

  // Use cached service to maintain thread continuity
  if (!assistantService) {
    console.log("[API] Initializing Azure OpenAI Assistant Service")
    assistantService = new AzureAssistantService(endpoint, apiKey, assistantId)
  }

  return assistantService
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("[API] Processing chat message")

    const service = getAssistantService()

    // Send message and get response
    console.log("[API] Sending message to assistant")
    const messages = await service.sendMessage(message)
    console.log("[API] Received response with", messages.length, "messages")

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[API] Chat error:", error)

    let errorMessage = "Failed to process message"

    if (error instanceof Error) {
      errorMessage = error.message
      
      // Provide helpful hints for common errors
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        errorMessage += " - Check that AZURE_OPENAI_KEY is valid"
      } else if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        errorMessage += " - Verify that AZURE_OPENAI_ENDPOINT and AZURE_ASSISTANT_ID are correct"
      } else if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
        errorMessage += " - API rate limit exceeded, please try again later"
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const service = getAssistantService()
    const messages = await service.getThreadMessages()
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[API] Get messages error:", error)

    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve messages"

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
