import { type NextRequest } from "next/server"
import { runKanchaAgent } from "@/lib/kancha-agent/agent"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, language, model, clientApiKey: bodyKey, clientBaseUrl: bodyBaseUrl } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Header overrides take precedence if provided
    const clientApiKey = request.headers.get("x-deepseek-api-key") || bodyKey || undefined
    const clientBaseUrl = request.headers.get("x-deepseek-base-url") || bodyBaseUrl || undefined

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = runKanchaAgent({
            messages,
            language: language || "en",
            model: model || process.env.DEEPSEEK_MODEL || "deepseekv4-flash",
            clientApiKey,
            clientBaseUrl
          })

          for await (const event of generator) {
            const data = `data: ${JSON.stringify(event)}\n\n`
            controller.enqueue(encoder.encode(data))
          }

          controller.close()
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err)
          const errorEvent = `data: ${JSON.stringify({ type: "error", content: errorMsg })}\n\n`
          controller.enqueue(encoder.encode(errorEvent))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Content-Type-Options": "nosniff"
      }
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to process chat request"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
