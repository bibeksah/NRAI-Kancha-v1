"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, Languages } from "lucide-react"
import { cn } from "@/lib/utils"
import { SpeechService, type Language } from "@/lib/speech-service"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const speechServiceRef = useRef<SpeechService | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeSpeechService()
      const token = sessionStorage.getItem("azure_access_token")
      if (token) {
        setAccessToken(token)
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const initializeSpeechService = async () => {
    try {
      const response = await fetch("/api/speech-token")
      const data = await response.json()

      if (data.token && data.region) {
        speechServiceRef.current = new SpeechService({})
        speechServiceRef.current.updateToken(data.token, data.region)
      } else {
        console.error("[v0] Failed to get speech token:", data.error)
      }
    } catch (error) {
      console.error("[v0] Failed to initialize speech service:", error)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          accessToken: accessToken,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        let errorData
        try {
          errorData = JSON.parse(text)
        } catch {
          throw new Error(`Server error: ${text}`)
        }
        throw new Error(errorData.error || "Failed to send message")
      }

      const data = await response.json()

      if (data.messages) {
        setMessages(data.messages)

        // Auto-speak the last assistant message
        if (autoSpeak) {
          const lastMessage = data.messages[data.messages.length - 1]
          if (lastMessage.role === "assistant") {
            await speakText(lastMessage.content)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          error instanceof Error ? `Error: ${error.message}` : "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const startListening = async () => {
    if (!speechServiceRef.current) return

    setIsListening(true)
    try {
      await speechServiceRef.current.recognizeSpeech(
        language,
        (text) => {
          setInput(text)
          setIsListening(false)
          // Auto-send after recognition
          sendMessage(text)
        },
        (error) => {
          console.error("Speech recognition error:", error)
          setIsListening(false)
        },
      )
    } catch (error) {
      console.error("Failed to start listening:", error)
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stopRecognition()
    }
    setIsListening(false)
  }

  const speakText = async (text: string) => {
    if (!speechServiceRef.current || isSpeaking) return

    setIsSpeaking(true)
    try {
      await speechServiceRef.current.synthesizeSpeech(text, language)
    } catch (error) {
      console.error("Speech synthesis error:", error)
    } finally {
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stopSynthesis()
    }
    setIsSpeaking(false)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ne" : "en"))
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="text-muted-foreground hover:text-foreground"
            title={`Switch to ${language === "en" ? "Nepali" : "English"}`}
          >
            <Languages className="w-5 h-5" />
          </Button>
          <div className="px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground">
            {language === "en" ? "EN" : "NE"}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className="text-muted-foreground hover:text-foreground"
            title={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
          >
            {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Languages className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {language === "en" ? "Welcome to AI Assistant" : "एआई सहायकमा स्वागत छ"}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {language === "en"
                ? "Start a conversation by typing or using voice input. I support both English and Nepali."
                : "टाइप गरेर वा आवाज इनपुट प्रयोग गरेर कुराकानी सुरु गर्नुहोस्। म अंग्रेजी र नेपाली दुवै समर्थन गर्छु।"}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-3 max-w-[85%]", message.role === "user" ? "ml-auto flex-row-reverse" : "")}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {message.role === "user" ? "U" : "AI"}
            </div>
            <Card
              className={cn(
                "p-3 rounded-2xl",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-70 hover:opacity-100"
                    onClick={() => speakText(message.content)}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
              AI
            </div>
            <Card className="p-3 rounded-2xl bg-card">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">{language === "en" ? "Thinking..." : "सोच्दै..."}</span>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button
            type="button"
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className={cn("flex-shrink-0", isListening && "bg-destructive hover:bg-destructive/90")}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === "en" ? "Type your message..." : "आफ्नो सन्देश टाइप गर्नुहोस्..."}
            disabled={isLoading || isListening}
            className="flex-1 bg-background"
          />

          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || isListening}
            className="flex-shrink-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>

        {isListening && (
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            {language === "en" ? "Listening..." : "सुन्दै..."}
          </div>
        )}
      </div>
    </div>
  )
}
