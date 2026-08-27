"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, User, Volume2, VolumeX, Copy, Check, RotateCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageReasoning } from "./message-reasoning"
import { ReformBadge } from "./reform-badge"
import { VoiceVisualizer } from "./voice-visualizer"
import { defaultSpeechService, type SpeechLanguage } from "@/lib/speech/speech-service"
import type { ChatMessage } from "@/lib/storage/chat-sessions"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

interface MessageItemProps {
  message: ChatMessage
  isGenerating?: boolean
  language?: "en" | "ne"
  onSelectPrompt?: (prompt: string) => void
  onRegenerate?: () => void
}

export function MessageItem({
  message,
  isGenerating,
  language = "en",
  onSelectPrompt,
  onRegenerate
}: MessageItemProps) {
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const isUser = message.role === "user"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // ignore
    }
  }

  const handleSpeak = async () => {
    if (isSpeaking) {
      defaultSpeechService.stopSpeaking()
      setIsSpeaking(false)
      return
    }

    setIsSpeaking(true)
    await defaultSpeechService.speak(message.content, {
      language: language as SpeechLanguage,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    })
  }

  // Parse reform citation brackets like [Reform #1: ...] into interactive components
  const renderFormattedContent = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom link or text parser for reform badges
          p: ({ children }) => <p className="my-2.5 leading-relaxed text-foreground/95 first:mt-0 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mt-3.5 mb-2 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1.5 text-foreground">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-outside ml-5 my-2 space-y-1 text-foreground/90">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-5 my-2 space-y-1 text-foreground/90">{children}</ol>,
          li: ({ children }) => <li className="pl-1 text-xs sm:text-sm">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/40 pl-3.5 py-1 italic my-2.5 bg-primary/5 rounded-r-md text-foreground/80 text-xs sm:text-sm">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const isInline = !match && !String(children).includes("\n")
            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary font-medium" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <pre className="bg-muted/80 p-3 rounded-lg overflow-x-auto my-2 border border-border/60 text-xs font-mono">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`w-full max-w-4xl mx-auto px-4 py-3 flex gap-3 sm:gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm shadow-xs transition-all ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-xs font-medium ml-auto"
            : "bg-card border border-border/80 text-card-foreground rounded-bl-xs"
        }`}
      >
        {/* Assistant Header Badge & Voice Visualizer */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-primary tracking-tight">
              NRAI Kancha
            </span>
            {isSpeaking && <VoiceVisualizer isActive={isSpeaking} mode="speaking" label="Playing audio" />}
          </div>
        )}

        {/* Reasoning / Thought Accordion */}
        {!isUser && (
          <MessageReasoning
            reasoning={message.reasoning}
            toolSteps={message.toolSteps}
            isGenerating={isGenerating}
          />
        )}

        {/* Message Content */}
        <div className="markdown-body leading-relaxed text-xs sm:text-sm">
          {renderFormattedContent(message.content)}
        </div>

        {/* Error Flag */}
        {message.error && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 p-2 rounded">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Response encountered an error</span>
          </div>
        )}

        {/* Assistant Action Bar */}
        {!isUser && !isGenerating && message.content && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSpeak}
                className="h-7 px-2 text-xs hover:text-foreground hover:bg-muted cursor-pointer"
                title={isSpeaking ? "Stop audio" : "Listen to answer"}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 text-destructive mr-1" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 mr-1" />
                )}
                <span>{isSpeaking ? "Stop" : "Listen"}</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs hover:text-foreground hover:bg-muted cursor-pointer"
                title="Copy response"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>

            {onRegenerate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-7 px-2 text-xs hover:text-foreground hover:bg-muted cursor-pointer"
                title="Regenerate response"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Retry</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted border border-border text-foreground flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  )
}
