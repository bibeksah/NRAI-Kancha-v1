"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { Send, Mic, MicOff, Square, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { VoiceVisualizer } from "./voice-visualizer"
import { defaultSpeechService, type SpeechLanguage } from "@/lib/speech/speech-service"

interface ChatInputProps {
  onSendMessage: (text: string) => void
  onStopGeneration?: () => void
  isGenerating?: boolean
  language?: "en" | "ne"
  modelName?: string
  disabled?: boolean
}

export function ChatInput({
  onSendMessage,
  onStopGeneration,
  isGenerating,
  language = "en",
  modelName = "deepseekv4-flash",
  disabled = false
}: ChatInputProps) {
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [stopRecognitionFn, setStopRecognitionFn] = useState<(() => void) | null>(null)
  const [micError, setMicError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isNe = language === "ne"

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }, [input])

  const handleSend = () => {
    if (!input.trim() || isGenerating || disabled) return
    const text = input.trim()
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    onSendMessage(text)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleListening = async () => {
    if (isListening) {
      stopRecognitionFn?.()
      setIsListening(false)
      setStopRecognitionFn(null)
      return
    }

    setMicError(null)
    setIsListening(true)

    try {
      const stopFn = await defaultSpeechService.startRecognition(
        {
          onResult: (text: string) => {
            setInput(prev => (prev ? `${prev} ${text}` : text))
          },
          onError: (err: string) => {
            setMicError(err)
            setIsListening(false)
          },
          onEnd: () => {
            setIsListening(false)
          }
        },
        language as SpeechLanguage
      )
      setStopRecognitionFn(() => stopFn)
    } catch (e) {
      setMicError(e instanceof Error ? e.message : "Failed to access microphone")
      setIsListening(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-6 pt-2">
      <div className="relative rounded-2xl border border-border/90 bg-card/95 backdrop-blur-md shadow-lg p-2.5 sm:p-3 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
        {/* Voice Visualizer Bar if listening */}
        {isListening && (
          <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-destructive/10 border border-destructive/20 rounded-lg">
            <VoiceVisualizer isActive={isListening} mode="listening" label={isNe ? "सुन्दै छ (बोल्नुहोस्)..." : "Listening (Speak now)..."} />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleListening}
              className="h-6 text-[11px] text-destructive hover:bg-destructive/20 px-2"
            >
              Done
            </Button>
          </div>
        )}

        {micError && (
          <div className="flex items-center gap-1.5 px-3 py-1 mb-2 bg-destructive/10 text-destructive text-xs rounded">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{micError}</span>
          </div>
        )}

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isNe
              ? "नेपालको ३१ सुधार योजना, अख्तियार, निर्वाचन, परराष्ट्र वा बजेटबारे सोध्नुहोस्..."
              : "Ask about Nepal's 31 reforms, CIAA, elections, constitution, tourism, or budget..."
          }
          disabled={disabled || isGenerating}
          rows={1}
          className="min-h-[44px] max-h-[180px] w-full resize-none border-0 bg-transparent p-2 text-sm text-foreground focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground/70"
        />

        <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-1">
          <div className="flex items-center gap-2">
            {/* Model Badge */}
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
              <Sparkles className="w-3 h-3 text-primary" />
              {modelName}
            </span>

            {/* Mic Toggle Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleListening}
              disabled={disabled || isGenerating}
              className={`h-8 w-8 p-0 rounded-full cursor-pointer ${
                isListening
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title={isListening ? "Stop listening" : "Speak (Voice input)"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isGenerating ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onStopGeneration}
                className="h-8 px-3 rounded-full text-xs font-semibold cursor-pointer gap-1"
              >
                <Square className="w-3 h-3 fill-current" /> Stop
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || disabled}
                className="h-8 px-3.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all cursor-pointer gap-1.5 shadow-xs"
              >
                <span>{isNe ? "पठाउनुहोस्" : "Send"}</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
