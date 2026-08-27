import { DeepSeekClient, type DeepSeekMessage } from "./deepseek-client"
import { KANCHA_TOOLS, executeAgentTool } from "./tools"
import { getSystemPromptWithLanguage } from "./prompts"
import { generateLocalFallbackResponse } from "./fallback-engine"

export interface AgentEvent {
  type: "reasoning" | "token" | "tool_start" | "tool_end" | "done" | "error"
  content?: string
  tool?: string
  input?: any
  result?: any
  messageId?: string
  metadata?: {
    model?: string
    tokensUsed?: number
    reformsCited?: string[]
  }
}

export interface RunAgentParams {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
  language?: "en" | "ne"
  model?: string
  clientApiKey?: string
  clientBaseUrl?: string
  temperature?: number
}

export async function* runKanchaAgent(
  params: RunAgentParams
): AsyncGenerator<AgentEvent> {
  const lang = params.language || "en"
  const model = params.model || process.env.DEEPSEEK_MODEL || "deepseekv4-flash"

  const client = new DeepSeekClient({
    apiKey: params.clientApiKey,
    baseUrl: params.clientBaseUrl,
    model
  })

  // If no API key is available, use high-fidelity local grounded engine
  if (!client.hasApiKey()) {
    const lastUserMessage = [...params.messages].reverse().find(m => m.role === "user")?.content || ""
    const fallback = await generateLocalFallbackResponse(lastUserMessage, lang)

    // Stream reasoning
    if (fallback.reasoning) {
      yield { type: "reasoning", content: fallback.reasoning }
    }

    // Stream tools
    for (const tc of fallback.toolCalls) {
      yield { type: "tool_start", tool: tc.tool, input: tc.input }
      yield { type: "tool_end", tool: tc.tool, result: tc.result }
    }

    // Stream content tokens
    const words = fallback.content.split(" ")
    for (const word of words) {
      yield { type: "token", content: word + " " }
      // Brief pause to simulate natural streaming cadence
      await new Promise(r => setTimeout(r, 15))
    }

    yield {
      type: "done",
      content: fallback.content,
      metadata: {
        model: "local-knowledge-engine (No API key set)",
        reformsCited: ["1"]
      }
    }
    return
  }

  // With API Key: Full Autonomous Multi-Step DeepSeek Agent Loop
  try {
    const systemPrompt = getSystemPromptWithLanguage(lang)
    
    // Assemble initial conversation messages
    const conversationMessages: DeepSeekMessage[] = [
      { role: "system", content: systemPrompt },
      ...params.messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    ]

    let iterations = 0
    const maxIterations = 5
    let finalAccumulatedText = ""

    while (iterations < maxIterations) {
      iterations++
      let currentToolCalls: any[] = []
      let roundAssistantContent = ""

      const stream = client.streamChatCompletion({
        messages: conversationMessages,
        tools: KANCHA_TOOLS,
        model,
        temperature: params.temperature ?? 0.2
      })

      for await (const chunk of stream) {
        if (chunk.type === "reasoning") {
          yield { type: "reasoning", content: chunk.text }
        } else if (chunk.type === "token") {
          roundAssistantContent += chunk.text
          finalAccumulatedText += chunk.text
          yield { type: "token", content: chunk.text }
        } else if (chunk.type === "tool_calls") {
          currentToolCalls = chunk.tool_calls
        }
      }

      // Check if DeepSeek requested tool executions
      if (currentToolCalls && currentToolCalls.length > 0) {
        // Append assistant tool call message to history
        conversationMessages.push({
          role: "assistant",
          content: roundAssistantContent || null,
          tool_calls: currentToolCalls
        })

        // Execute each tool
        for (const tc of currentToolCalls) {
          const toolName = tc.function?.name
          let toolArgs: Record<string, any> = {}
          try {
            toolArgs = tc.function?.arguments ? JSON.parse(tc.function.arguments) : {}
          } catch (e) {
            toolArgs = {}
          }

          yield {
            type: "tool_start",
            tool: toolName,
            input: toolArgs
          }

          const toolResult = await executeAgentTool(toolName, toolArgs)

          yield {
            type: "tool_end",
            tool: toolName,
            result: toolResult
          }

          // Feed tool response back into conversation
          conversationMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            name: toolName,
            content: JSON.stringify(toolResult)
          })
        }

        // Continue the loop to synthesize the final answer
        continue
      }

      // If no tool calls were requested, we have the complete response!
      break
    }

    yield {
      type: "done",
      content: finalAccumulatedText,
      metadata: {
        model,
        reformsCited: []
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    yield {
      type: "error",
      content: `DeepSeek Agent Error: ${errorMsg}`
    }
  }
}
