export interface DeepSeekMessage {
  role: "system" | "user" | "assistant" | "tool"
  content: string | null
  name?: string
  tool_call_id?: string
  tool_calls?: Array<{
    id: string
    type: "function"
    function: {
      name: string
      arguments: string
    }
  }>
}

export interface DeepSeekStreamChunk {
  id: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
      reasoning_content?: string
      tool_calls?: Array<{
        index: number
        id?: string
        type?: "function"
        function?: {
          name?: string
          arguments?: string
        }
      }>
    }
    finish_reason: string | null
  }>
}

export interface DeepSeekClientConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
}

export class DeepSeekClient {
  private apiKey: string
  private baseUrl: string
  private defaultModel: string

  constructor(config?: DeepSeekClientConfig) {
    this.apiKey =
      config?.apiKey ||
      process.env.DEEPSEEK_API_KEY ||
      ""

    let rawBaseUrl =
      config?.baseUrl ||
      process.env.DEEPSEEK_BASE_URL ||
      "https://api.deepseek.com"

    // Normalize base URL
    rawBaseUrl = rawBaseUrl.replace(/\/+$/, "")
    this.baseUrl = rawBaseUrl

    this.defaultModel =
      config?.model ||
      process.env.DEEPSEEK_MODEL ||
      "deepseek-v4-flash"
  }

  hasApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0)
  }

  getModel(requestedModel?: string): string {
    let model = (requestedModel && requestedModel.trim().length > 0)
      ? requestedModel.trim()
      : this.defaultModel

    // Normalize common model name formats
    if (model === "deepseekv4-flash" || model === "deepseekv4_flash") {
      return "deepseek-v4-flash"
    }
    if (model === "deepseekv4-pro" || model === "deepseekv4_pro") {
      return "deepseek-v4-pro"
    }
    if (model === "deepseekv3" || model === "deepseek-v3") {
      return "deepseek-chat"
    }
    return model
  }

  /**
   * Non-streaming Chat Completion
   */
  async chatCompletion(params: {
    messages: DeepSeekMessage[]
    tools?: any[]
    model?: string
    temperature?: number
    max_tokens?: number
  }): Promise<{
    message: DeepSeekMessage
    reasoning?: string
    tool_calls?: any[]
    finish_reason: string
  }> {
    if (!this.apiKey) {
      throw new Error("DeepSeek API Key is not configured.")
    }

    const endpoint = `${this.baseUrl}/chat/completions`
    const model = this.getModel(params.model)

    const payload: Record<string, any> = {
      model,
      messages: params.messages,
      temperature: params.temperature ?? 0.3,
      max_tokens: params.max_tokens ?? 4096,
      stream: false
    }

    if (params.tools && params.tools.length > 0) {
      payload.tools = params.tools
      payload.tool_choice = "auto"
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const choice = data.choices?.[0]
    if (!choice) {
      throw new Error("No response choices returned by DeepSeek API.")
    }

    return {
      message: choice.message,
      reasoning: choice.message.reasoning_content || undefined,
      tool_calls: choice.message.tool_calls || undefined,
      finish_reason: choice.finish_reason
    }
  }

  /**
   * Streaming Chat Completion using fetch and Server-Sent Events parser
   */
  async *streamChatCompletion(params: {
    messages: DeepSeekMessage[]
    tools?: any[]
    model?: string
    temperature?: number
    max_tokens?: number
  }): AsyncGenerator<
    | { type: "token"; text: string }
    | { type: "reasoning"; text: string }
    | { type: "tool_calls"; tool_calls: any[] }
    | { type: "finish"; finish_reason: string }
  > {
    if (!this.apiKey) {
      throw new Error("DeepSeek API Key is not configured.")
    }

    const endpoint = `${this.baseUrl}/chat/completions`
    const model = this.getModel(params.model)

    const payload: Record<string, any> = {
      model,
      messages: params.messages,
      temperature: params.temperature ?? 0.3,
      max_tokens: params.max_tokens ?? 4096,
      stream: true
    }

    if (params.tools && params.tools.length > 0) {
      payload.tools = params.tools
      payload.tool_choice = "auto"
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`)
    }

    if (!response.body) {
      throw new Error("ReadableStream not available from DeepSeek response.")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    // Tool call accumulator across chunks
    const toolCallAccumulator: Record<
      number,
      { id: string; name: string; arguments: string }
    > = {}

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith("data:")) continue

          const dataStr = trimmed.slice(5).trim()
          if (dataStr === "[DONE]") {
            // Emit any accumulated tool calls before finishing
            const finalToolCalls = Object.values(toolCallAccumulator).map(tc => ({
              id: tc.id,
              type: "function" as const,
              function: {
                name: tc.name,
                arguments: tc.arguments
              }
            }))
            if (finalToolCalls.length > 0) {
              yield { type: "tool_calls", tool_calls: finalToolCalls }
            }
            yield { type: "finish", finish_reason: "stop" }
            return
          }

          try {
            const chunk: DeepSeekStreamChunk = JSON.parse(dataStr)
            const choice = chunk.choices?.[0]
            if (!choice) continue

            const delta = choice.delta

            // Reasoning stream (DeepSeek R1 / Reasoner mode)
            if (delta.reasoning_content) {
              yield { type: "reasoning", text: delta.reasoning_content }
            }

            // Normal text token stream
            if (delta.content) {
              yield { type: "token", text: delta.content }
            }

            // Tool call deltas
            if (delta.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index ?? 0
                if (!toolCallAccumulator[idx]) {
                  toolCallAccumulator[idx] = {
                    id: tc.id || `call_${Date.now()}_${idx}`,
                    name: tc.function?.name || "",
                    arguments: ""
                  }
                }
                if (tc.id) {
                  toolCallAccumulator[idx].id = tc.id
                }
                if (tc.function?.name) {
                  toolCallAccumulator[idx].name = tc.function.name
                }
                if (tc.function?.arguments) {
                  toolCallAccumulator[idx].arguments += tc.function.arguments
                }
              }
            }

            if (choice.finish_reason) {
              const finalToolCalls = Object.values(toolCallAccumulator).map(tc => ({
                id: tc.id,
                type: "function" as const,
                function: {
                  name: tc.name,
                  arguments: tc.arguments
                }
              }))

              if (finalToolCalls.length > 0) {
                yield { type: "tool_calls", tool_calls: finalToolCalls }
              }

              yield { type: "finish", finish_reason: choice.finish_reason }
            }
          } catch (err) {
            // Ignore parse errors on individual malformed heartbeat lines
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}
