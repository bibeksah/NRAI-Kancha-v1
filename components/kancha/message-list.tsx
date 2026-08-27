"use client"

import { useEffect, useRef } from "react"
import { MessageItem } from "./message-item"
import { StarterPrompts } from "./starter-prompts"
import type { ChatMessage } from "@/lib/storage/chat-sessions"
import { Loader2 } from "lucide-react"

interface MessageListProps {
  messages: ChatMessage[]
  isGenerating?: boolean
  language?: "en" | "ne"
  onSelectPrompt: (prompt: string) => void
  onRegenerateLast?: () => void
}

export function MessageList({
  messages,
  isGenerating,
  language = "en",
  onSelectPrompt,
  onRegenerateLast
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isGenerating])

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <StarterPrompts onSelectPrompt={onSelectPrompt} language={language} />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-3">
      {messages.map((message, idx) => {
        const isLast = idx === messages.length - 1
        return (
          <MessageItem
            key={message.id || idx}
            message={message}
            isGenerating={isLast && isGenerating && message.role === "assistant"}
            language={language}
            onSelectPrompt={onSelectPrompt}
            onRegenerate={isLast && message.role === "assistant" && !isGenerating ? onRegenerateLast : undefined}
          />
        )
      })}

      {isGenerating && messages[messages.length - 1]?.role === "user" && (
        <div className="w-full max-w-4xl mx-auto px-4 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div className="p-3.5 rounded-2xl bg-card border border-border/80 text-xs text-muted-foreground shadow-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Kancha is thinking and querying reform databases...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
