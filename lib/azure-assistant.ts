import { AzureOpenAI } from "openai"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export class AzureAssistantService {
  private client: AzureOpenAI
  private assistantId: string

  constructor(endpoint: string, apiKey: string, assistantId: string) {
    console.log("[Assistant] Initializing Azure OpenAI Assistant Service")
    console.log("[Assistant] Endpoint:", endpoint)
    console.log("[Assistant] Assistant ID:", assistantId)

    if (!endpoint || !apiKey || !assistantId) {
      throw new Error("Missing required configuration: endpoint, apiKey, or assistantId")
    }

    // Initialize Azure OpenAI client
    this.client = new AzureOpenAI({
      endpoint: endpoint,
      apiKey: apiKey,
      apiVersion: "2024-05-01-preview",
    })

    this.assistantId = assistantId
    console.log("[Assistant] Service initialized successfully")
  }

  async createThread(): Promise<string> {
    try {
      console.log("[Assistant] Creating new thread")

      // Create a new thread
      const thread = await this.client.beta.threads.create({})
      
      if (!thread || !thread.id) {
        throw new Error("Failed to create thread: Invalid response")
      }

      console.log("[Assistant] Thread created:", thread.id)
      
      return thread.id
    } catch (error) {
      console.error("[Assistant] Error creating thread:", error)
      throw new Error(`Failed to create thread: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async sendMessage(threadId: string, content: string): Promise<Message[]> {
    try {
      console.log("[Assistant] Adding user message to thread:", threadId)
      
      // Add user message to thread
      await this.client.beta.threads.messages.create(threadId, {
        role: "user",
        content: content,
      })

      console.log("[Assistant] Creating run with assistant:", this.assistantId)
      
      // Create and poll the run until completion using SDK helper
      const run = await this.client.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: this.assistantId,
      })

      console.log("[Assistant] Run finished with status:", run.status)

      if (run.status === "failed") {
        const errorMessage = run.last_error?.message || "Unknown error"
        console.error("[Assistant] Run failed:", errorMessage)
        throw new Error(`Assistant run failed: ${errorMessage}`)
      }

      if (run.status === "cancelled") {
        throw new Error("Assistant run was cancelled")
      }

      if (run.status === "expired") {
        throw new Error("Assistant run expired")
      }

      console.log("[Assistant] Run completed successfully, retrieving messages")

      // Get all messages from the thread
      const messages = await this.client.beta.threads.messages.list(threadId)

      // Convert to our Message format
      const formattedMessages: Message[] = []
      
      for (const message of messages.data) {
        // Only process text content
        const textContent = message.content.find((c) => c.type === "text")
        
        if (textContent && "text" in textContent) {
          // Remove citations from the text
          let cleanedText = this.removeCitations(textContent.text.value)
          // Normalize markdown to ensure proper rendering (lists, spacing, breaks)
          cleanedText = this.normalizeMarkdown(cleanedText)
          
          formattedMessages.push({
            id: message.id,
            role: message.role as "user" | "assistant",
            content: cleanedText,
            timestamp: new Date(message.created_at * 1000), // Convert Unix timestamp to Date
          })
        }
      }

      // Reverse to get chronological order (API returns newest first)
      formattedMessages.reverse()

      console.log("[Assistant] Retrieved", formattedMessages.length, "messages")
      return formattedMessages
    } catch (error) {
      console.error("[Assistant] Error in sendMessage:", error)
      // Provide additional context when possible
      if (error && typeof error === "object" && "message" in (error as Record<string, unknown>)) {
        const msg = (error as { message?: unknown }).message
        console.error("[Assistant] Error details:", typeof msg === "string" ? msg : String(msg))
      }
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Remove citation markers from text
   * Removes patterns like:
   * - 【6:0†source】
   * - 【35†source】
   * - [doc1]
   * - [doc2]
   * - [1]
   * - etc.
   */
  private removeCitations(text: string): string {
    // Remove citations in the format 【6:0†source】or 【35†source】
    let cleaned = text.replace(/【\d+:?\d*†source】/g, "")
    
    // Remove citations in the format [doc1], [doc2], etc.
    cleaned = cleaned.replace(/\[doc\d+\]/g, "")
    
    // Remove simple numbered citations [1], [2], etc. at the end of sentences
    cleaned = cleaned.replace(/\[\d+\]/g, "")
    
    // Remove any remaining citation-like patterns
    cleaned = cleaned.replace(/\[\d+:?\d*\]/g, "")
      // Clean up any double spaces left after removing citations
      cleaned = cleaned.replace(/\s{2,}/g, " ")
    
      // Trim whitespace
      cleaned = cleaned.trim()
    
      return cleaned
    }

  /**
   * Normalize markdown spacing so ReactMarkdown renders as expected.
   * - Ensures a blank line before list items (bulleted or numbered)
   * - Collapses 3+ newlines to just two
   * - Trims stray spaces around newlines
   */
  private normalizeMarkdown(text: string): string {
    let out = text
      // Insert blank line after sentence punctuation before a numbered or hyphen list
      .replace(/([.:;])\s+(?=(\d+\.\s))/g, "$1\n\n")
      .replace(/([.:;])\s+(?=(-\s|\*\s))/g, "$1\n\n")
      // Ensure blank line before a numbered list like "1. Item"
      .replace(/([^\n])\n(\d+\.\s)/g, "$1\n\n$2")
      // Ensure blank line before hyphen bullets "- Item"
      .replace(/([^\n])\n(-\s)/g, "$1\n\n$2")
      // Ensure blank line before asterisk bullets "* Item"
      .replace(/([^\n])\n(\*\s)/g, "$1\n\n$2")
      // If numbers appear inline separated only by spaces, break them into new items
  .replace(/\s+(?=(\d+\.\s))/g, "\n\n")
      // Collapse excessive blank lines
      .replace(/\n{3,}/g, "\n\n")
      // Trim spaces at line ends
      .replace(/[ \t]+\n/g, "\n")
      .trim()

    return out
  }


  async getThreadMessages(threadId: string): Promise<Message[]> {
    try {
      const messages = await this.client.beta.threads.messages.list(threadId)

      const formattedMessages: Message[] = []
      
      for (const message of messages.data) {
        const textContent = message.content.find((c) => c.type === "text")
        
        if (textContent && "text" in textContent) {
          // Remove citations from the text
          let cleanedText = this.removeCitations(textContent.text.value)
          
          formattedMessages.push({
            id: message.id,
            role: message.role as "user" | "assistant",
            content: cleanedText,
            timestamp: new Date(message.created_at * 1000),
          })
        }
      }

      formattedMessages.reverse()
      return formattedMessages
    } catch (error) {
      console.error("[Assistant] Error getting messages:", error)
      throw new Error(`Failed to get messages: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
