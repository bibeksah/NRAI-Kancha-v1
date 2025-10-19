import { type NextRequest, NextResponse } from "next/server"
import { AzureAssistantService } from "@/lib/azure-assistant"

export const runtime = "nodejs"

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
  return new AzureAssistantService(endpoint, apiKey, assistantId)
}

export async function POST(request: NextRequest) {
  try {
    const { message, threadId } = await request.json()
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }
    const service = getAssistantService()
    let activeThreadId = threadId
    if (!activeThreadId) {
      activeThreadId = await service.createThread()
    }
    const messages = await service.sendMessage(activeThreadId, message)
    return NextResponse.json({ messages, threadId: activeThreadId })
  } catch (error) {
    let errorMessage = "Failed to process message"
    if (error instanceof Error) {
      errorMessage = error.message
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

export async function GET(request: NextRequest) {
  try {
    const threadId = request.nextUrl.searchParams.get("threadId")
    if (!threadId) {
      return NextResponse.json({ error: "threadId is required" }, { status: 400 })
    }
    const service = getAssistantService()
    const messages = await service.getThreadMessages(threadId)
    return NextResponse.json({ messages })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve messages"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
