"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  Languages,
  Copy,
  Trash2,
  RefreshCw,
  Check,
  Sparkles,
  Download,
  Settings,
  MessageSquare,
  AlertCircle,
  WifiOff,
  Bot,
  User,
  X,
  Square
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SpeechService, type Language } from "@/lib/speech-service"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import type { Components } from "react-markdown"
import DOMPurify from "isomorphic-dompurify"
import { storedMessagesSchema, languageSchema, safeParseJSON } from "@/lib/validation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  error?: boolean
}

// Message limit per conversation
const MAX_MESSAGES_PER_CONVERSATION = 10

// Storage keys - centralized for consistency
const STORAGE_KEYS = {
  messages: "nrai-kancha-messages",
  threadId: "nrai-kancha-thread-id",
  language: "nrai-kancha-language",
  autoSpeak: "nrai-kancha-auto-speak"
} as const

const EXAMPLE_PROMPTS = {
  en: [
    "How will the manifesto fight corruption?",
    "How will it make the government stable?",
    "How will it grow Nepal's economy?",
    "How will it digitize government services?"
  ],
  ne: [
    "घोषणापत्रले भ्रष्टाचार कसरी नियन्त्रण गर्छ?",
    "यसले सरकारलाई स्थिर कसरी बनाउँछ?",
    "यसले नेपालको अर्थतन्त्र कसरी बढाउँछ?",
    "यसले सरकारी सेवाहरूलाई डिजिटल कसरी बनाउँछ?"
  ]
} as const

// Animation variants - memoized outside component
const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25
    }
  }
}

const settingsPanelVariants = {
  hidden: { opacity: 0, x: 300 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    x: 300,
    transition: { duration: 0.2 }
  }
}

/**
 * Safely read from localStorage with validation
 */
function safeGetStorage<T>(key: string, validator: (val: unknown) => T | null, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback

    const parsed = JSON.parse(stored)
    const validated = validator(parsed)
    return validated !== null ? validated : fallback
  } catch {
    // Remove corrupted data
    localStorage.removeItem(key)
    return fallback
  }
}

/**
 * Safely set localStorage
 */
function safeSetStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error)
  }
}

/**
 * Sanitize content for safe display
 */
function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [], // Strip all HTML for plain text
    ALLOWED_ATTR: []
  })
}

/**
 * Preprocess markdown to fix common formatting issues
 * - Extracts inline headings from list items
 * - Ensures proper spacing around headings
 */
function preprocessMarkdown(content: string): string {
  let processed = content

  // Fix inline headings (e.g., "some text ### Heading more text")
  // Split them onto their own lines
  processed = processed.replace(/([^\n])(\s*)(#{1,6}\s+[^\n]+)/g, '$1\n\n$3')

  // Ensure headings have blank line before them (except at start)
  processed = processed.replace(/([^\n])\n(#{1,6}\s+)/g, '$1\n\n$2')

  // Ensure headings have blank line after them
  processed = processed.replace(/(#{1,6}\s+[^\n]+)\n([^#\n])/g, '$1\n\n$2')

  // Clean up excessive newlines (more than 2)
  processed = processed.replace(/\n{3,}/g, '\n\n')

  return processed.trim()
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>("en")
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [messageCount, setMessageCount] = useState(0)
  const [limitReached, setLimitReached] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const speechServiceRef = useRef<SpeechService | null>(null)

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load data from localStorage with validation
  useEffect(() => {
    if (typeof window === "undefined") return

    // Load messages with validation
    const savedMessages = safeGetStorage(
      STORAGE_KEYS.messages,
      (val) => {
        const result = safeParseJSON(JSON.stringify(val), storedMessagesSchema)
        if (result.success) {
          return result.data.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }
        return null
      },
      []
    )
    if (savedMessages.length > 0) {
      setMessages(savedMessages as Message[])
    }

    // Load thread ID
    const savedThreadId = localStorage.getItem(STORAGE_KEYS.threadId)
    if (savedThreadId && /^thread_[a-zA-Z0-9]+$/.test(savedThreadId)) {
      setThreadId(savedThreadId)
    }

    // Load language with validation
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language)
    if (savedLanguage) {
      const langResult = languageSchema.safeParse(savedLanguage)
      if (langResult.success) {
        setLanguage(langResult.data)
      }
    }

    // Load auto-speak preference
    const savedAutoSpeak = localStorage.getItem(STORAGE_KEYS.autoSpeak)
    if (savedAutoSpeak !== null) {
      setAutoSpeak(savedAutoSpeak === "true")
    }

    initializeSpeechService()
  }, [])

  // Save messages - debounced
  useEffect(() => {
    if (typeof window === "undefined" || messages.length === 0) return

    const timeoutId = setTimeout(() => {
      safeSetStorage(STORAGE_KEYS.messages, messages)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [messages])

  // Save threadId
  useEffect(() => {
    if (typeof window === "undefined" || !threadId) return
    localStorage.setItem(STORAGE_KEYS.threadId, threadId)
  }, [threadId])

  // Save preferences
  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.language, language)
    localStorage.setItem(STORAGE_KEYS.autoSpeak, String(autoSpeak))
  }, [language, autoSpeak])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [messages, scrollToBottom])

  const initializeSpeechService = async () => {
    try {
      const response = await fetch("/api/speech-token")
      const data = await response.json()

      if (data.token && data.region) {
        speechServiceRef.current = new SpeechService({})
        speechServiceRef.current.updateToken(data.token, data.region)
      }
    } catch (error) {
      console.error("Failed to initialize speech service:", error)
    }
  }

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !isOnline || limitReached) return

    // Sanitize input
    const sanitizedText = sanitizeContent(text.trim())
    if (!sanitizedText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: sanitizedText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sanitizedText, threadId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        // Handle message limit reached
        if (errorData.limitReached) {
          setLimitReached(true)
          setMessageCount(errorData.messageCount || MAX_MESSAGES_PER_CONVERSATION)
          throw new Error(errorData.message || "Message limit reached")
        }

        throw new Error(errorData.error || "Failed to send message")
      }

      const data = await response.json()

      // Update threadId if we got a new one
      if (data.threadId) {
        setThreadId(data.threadId)
      }

      if (data.messages) {
        const messagesWithDates = data.messages.map((msg: Record<string, unknown>) => ({
          ...msg,
          timestamp: new Date(msg.timestamp as string),
          error: false
        }))
        setMessages(messagesWithDates)

        // Update message count from server response
        if (typeof data.messageCount === 'number') {
          setMessageCount(data.messageCount)
        }
        if (data.remainingMessages === 0) {
          setLimitReached(true)
        }

        if (autoSpeak) {
          const lastMessage = data.messages[data.messages.length - 1]
          if (lastMessage.role === "assistant") {
            await speakText(lastMessage.content, lastMessage.id)
          }
        }
      }
    } catch (error) {
      const errorContent = error instanceof Error ? error.message : "Unknown error occurred"
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: language === "en"
          ? `Sorry, I encountered an error: ${errorContent}`
          : `माफ गर्नुहोस्, मैले त्रुटि सामना गरें: ${errorContent}`,
        timestamp: new Date(),
        error: true
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [isOnline, threadId, language, autoSpeak, limitReached])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }, [input, sendMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }, [input, sendMessage])

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }, [])

  const startListening = useCallback(async () => {
    if (!speechServiceRef.current) return

    setIsListening(true)
    try {
      await speechServiceRef.current.recognizeSpeech(
        (text) => {
          setInput(text)
          setIsListening(false)
          sendMessage(text)
        },
        (error) => {
          console.error("Speech recognition error:", error)
          setIsListening(false)
        }
      )
    } catch (error) {
      console.error("Failed to start listening:", error)
      setIsListening(false)
    }
  }, [sendMessage])

  const stopListening = useCallback(() => {
    speechServiceRef.current?.stopRecognition()
    setIsListening(false)
  }, [])

  const speakText = useCallback(async (text: string, messageId: string) => {
    if (!speechServiceRef.current || isSpeaking) return

    setIsSpeaking(true)
    setSpeakingMessageId(messageId)

    const pollInterval = setInterval(() => {
      if (speechServiceRef.current && !speechServiceRef.current.isSpeaking()) {
        clearInterval(pollInterval)
        setIsSpeaking(false)
        setSpeakingMessageId(null)
      }
    }, 100)

    try {
      await speechServiceRef.current.synthesizeSpeech(text)
    } catch (error) {
      console.error("Speech synthesis error:", error)
    } finally {
      clearInterval(pollInterval)
      setIsSpeaking(false)
      setSpeakingMessageId(null)
    }
  }, [isSpeaking])

  const stopSpeaking = useCallback(() => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stopSynthesis()
    }
    setIsSpeaking(false)
    setSpeakingMessageId(null)
  }, [])

  const copyMessage = useCallback(async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy message:", error)
    }
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    setThreadId(null)
    setMessageCount(0)
    setLimitReached(false)
    localStorage.removeItem(STORAGE_KEYS.messages)
    localStorage.removeItem(STORAGE_KEYS.threadId)
    setShowSettings(false)
  }, [])

  const regenerateResponse = useCallback(async () => {
    if (messages.length < 2) return

    const lastUserMessage = [...messages].reverse().find(msg => msg.role === "user")
    if (!lastUserMessage) return

    const indexOfLastUser = messages.findIndex(msg => msg.id === lastUserMessage.id)
    setMessages(messages.slice(0, indexOfLastUser + 1))

    await sendMessage(lastUserMessage.content)
  }, [messages, sendMessage])

  const exportChat = useCallback((format: 'txt' | 'json') => {
    let content = ''
    let filename = `nrai-kancha-chat-${new Date().toISOString().split('T')[0]}`

    if (format === 'json') {
      content = JSON.stringify(messages, null, 2)
      filename += '.json'
    } else {
      content = messages.map(msg => {
        const time = msg.timestamp.toLocaleString()
        return `[${time}] ${msg.role.toUpperCase()}: ${msg.content}\n`
      }).join('\n')
      filename += '.txt'
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [messages])

  // Memoized markdown components for better performance
  const markdownComponents: Components = useMemo(() => ({
    h1: (props) => <h1 className="text-2xl font-bold mt-6 mb-4 first:mt-0 text-foreground" {...props} />,
    h2: (props) => <h2 className="text-xl font-bold mt-5 mb-3 first:mt-0 text-foreground/95" {...props} />,
    h3: (props) => <h3 className="text-lg font-semibold mt-4 mb-2 first:mt-0 text-foreground/90" {...props} />,
    h4: (props) => <h4 className="text-base font-semibold mt-3 mb-2 first:mt-0 text-foreground/85" {...props} />,
    p: (props) => <p className="my-3 first:mt-0 last:mb-0 leading-7 text-foreground/90" {...props} />,
    ul: (props) => <ul className="list-disc list-outside ml-6 my-3 space-y-2" {...props} />,
    ol: (props) => <ol className="list-decimal list-outside ml-6 my-3 space-y-2" {...props} />,
    li: (props) => <li className="pl-1 leading-7" {...props} />,
    a: (props) => (
      <a
        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !className
      return isInline ? (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border border-border/30" {...props}>
          {children}
        </code>
      ) : (
        <code className={cn("block text-sm", className)} {...props}>
          {children}
        </code>
      )
    },
    pre: (props) => (
      <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto my-3 border border-border/30 text-sm" {...props} />
    ),
    blockquote: (props) => <blockquote className="border-l-4 border-primary/40 pl-4 italic my-3 text-muted-foreground bg-muted/30 py-2 rounded-r" {...props} />,
    hr: () => <hr className="border-t-2 border-border/50 my-6" />,
    table: (props) => <table className="w-full border-collapse my-4 border border-border rounded-lg overflow-hidden" {...props} />,
    thead: (props) => <thead className="bg-muted/50" {...props} />,
    th: (props) => <th className="px-4 py-2 text-left font-semibold border-b border-border" {...props} />,
    td: (props) => <td className="px-4 py-2 border-t border-border" {...props} />,
    tbody: (props) => <tbody {...props} />,
    tr: (props) => <tr className="hover:bg-muted/30 transition-colors" {...props} />,
    img: (props) => <img className="max-w-full h-auto rounded-lg my-3 border border-border/30" alt="" {...props} />,
    strong: (props) => <strong className="font-bold text-foreground" {...props} />,
  }), [])

  // Memoized example prompts for current language
  const currentPrompts = useMemo(() => EXAMPLE_PROMPTS[language], [language])

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-background relative">
      {/* Offline indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-destructive text-destructive-foreground px-4 py-3 text-sm flex items-center justify-center gap-2 shadow-medium"
          >
            <WifiOff className="w-4 h-4" />
            <span className="font-medium">
              {language === "en" ? "You are offline" : "तपाईं अफलाइन हुनुहुन्छ"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Header */}
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-20 border-b border-border/30 bg-white/80 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center shadow-soft"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                NRAI Kancha
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isOnline ? "bg-success animate-pulse-glow" : "bg-destructive"
                  )}
                />
                <span className="font-medium">
                  {isOnline ? (language === "en" ? "Online" : "अनलाइन") : (language === "en" ? "Offline" : "अफलाइन")}
                </span>
              </div>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="h-10 w-10 rounded-xl hover:bg-accent"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Settings Side Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            />

            {/* Settings Panel */}
            <motion.div
              variants={settingsPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-strong z-40 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    {language === "en" ? "Settings" : "सेटिङहरू"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(false)}
                    className="h-8 w-8 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Language */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    {language === "en" ? "Language" : "भाषा"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      className={cn(
                        "w-full",
                        language === "en" && "gradient-bg text-white"
                      )}
                      onClick={() => setLanguage("en")}
                    >
                      English
                    </Button>
                    <Button
                      variant={language === "ne" ? "default" : "outline"}
                      className={cn(
                        "w-full",
                        language === "ne" && "gradient-bg text-white"
                      )}
                      onClick={() => setLanguage("ne")}
                    >
                      नेपाली
                    </Button>
                  </div>
                </div>

                {/* Auto-Speak */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    {language === "en" ? "Auto-Speak" : "स्वत: बोल्नुहोस्"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={autoSpeak ? "default" : "outline"}
                      className={cn(
                        "w-full flex items-center gap-2",
                        autoSpeak && "gradient-bg text-white"
                      )}
                      onClick={() => setAutoSpeak(true)}
                    >
                      <Volume2 className="w-4 h-4" />
                      {language === "en" ? "On" : "चालु"}
                    </Button>
                    <Button
                      variant={!autoSpeak ? "default" : "outline"}
                      className={cn(
                        "w-full flex items-center gap-2",
                        !autoSpeak && "gradient-bg text-white"
                      )}
                      onClick={() => setAutoSpeak(false)}
                    >
                      <VolumeX className="w-4 h-4" />
                      {language === "en" ? "Off" : "बन्द"}
                    </Button>
                  </div>
                </div>

                {/* Export Chat */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {language === "en" ? "Export Chat" : "निर्यात"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => exportChat('txt')}
                      disabled={messages.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      TXT
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => exportChat('json')}
                      disabled={messages.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                </div>

                {/* Clear Chat */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <label className="text-sm font-semibold text-destructive flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    {language === "en" ? "Clear Conversation" : "कुराकानी खाली गर्नुहोस्"}
                  </label>
                  <Button
                    variant="outline"
                    className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                    onClick={clearChat}
                    disabled={messages.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {language === "en" ? "Clear All Messages" : "सबै सन्देश हटाउनुहोस्"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {language === "en"
                      ? "This will permanently delete all messages. This action cannot be undone."
                      : "यसले सबै सन्देशहरू स्थायी रूपमा मेटाउनेछ। यो कार्य पूर्ववत गर्न सकिँदैन।"}
                  </p>
                </div>

                {/* Info */}
                <div className="pt-4 border-t border-border space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {language === "en"
                      ? `${messages.length} message${messages.length !== 1 ? 's' : ''} in conversation`
                      : `कुराकानीमा ${messages.length} सन्देश`}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 max-w-4xl mx-auto w-full pb-32">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-6 py-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center shadow-medium mb-6"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 text-foreground">
              {language === "en" ? "Welcome to NRAI Kancha" : "NRAI Kancha मा स्वागत छ"}
            </h2>
            <p className="text-muted-foreground max-w-md text-base leading-relaxed mb-8">
              {language === "en"
                ? "Your intelligent bilingual assistant. Start a conversation by typing or using voice input."
                : "तपाईंको बुद्धिमान द्विभाषी सहायक। टाइप गरेर वा आवाज इनपुट प्रयोग गरेर कुराकानी सुरु गर्नुहोस्।"}
            </p>

            <div className="w-full max-w-2xl">
              <p className="text-sm font-semibold text-muted-foreground mb-4">
                {language === "en" ? "Try asking:" : "प्रयास गर्नुहोस्:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPrompts.map((prompt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-4 px-4 hover:bg-accent/70 hover:border-primary/40 transition-smooth rounded-2xl text-sm group"
                      onClick={() => sendMessage(prompt)}
                    >
                      <MessageSquare className="w-5 h-5 mr-3 flex-shrink-0 text-primary group-hover:scale-110 transition-smooth" />
                      <span className="line-clamp-2">{prompt}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={cn(
                "group py-6",
                message.role === "user" ? "flex justify-end" : ""
              )}
            >
              {message.role === "user" ? (
                /* USER MESSAGE - WITH BUBBLE */
                <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%]">
                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="gradient-bg text-white rounded-3xl px-5 py-4 shadow-medium"
                    >
                      <p className="whitespace-pre-wrap leading-7 text-white">{message.content}</p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
                        <span className="text-xs text-white/75">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg hover:bg-white/20 text-white"
                            onClick={() => copyMessage(message.content, message.id)}
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-8 h-8 rounded-full gradient-bg text-white shadow-soft flex items-center justify-center flex-shrink-0"
                  >
                    <User className="w-4 h-4" />
                  </motion.div>
                </div>
              ) : (
                /* AI MESSAGE - NO BUBBLE (CLEAN) */
                <div className="flex items-start gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0"
                  >
                    <Bot className="w-4 h-4" />
                  </motion.div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="text-sm font-semibold text-foreground">
                      AI
                    </div>

                    {message.error && (
                      <div className="flex items-center gap-2 mb-2 text-destructive text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        <span>{language === "en" ? "Error" : "त्रुटि"}</span>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none text-foreground/90">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={markdownComponents}
                      >
                        {preprocessMarkdown(message.content)}
                      </ReactMarkdown>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg hover:bg-accent"
                          onClick={() => copyMessage(message.content, message.id)}
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg hover:bg-accent"
                          onClick={() => {
                            if (speakingMessageId === message.id) {
                              stopSpeaking()
                            } else {
                              speakText(message.content, message.id)
                            }
                          }}
                          disabled={isSpeaking && speakingMessageId !== message.id}
                        >
                          {speakingMessageId === message.id ? (
                            <Square className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </motion.div>

                      {messages[messages.length - 1].id === message.id && (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg hover:bg-accent"
                            onClick={regenerateResponse}
                            disabled={isLoading}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </Button>
                        </motion.div>
                      )}

                      <span className="text-xs text-muted-foreground ml-auto">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group py-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-sm font-semibold text-foreground">AI</div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
                    <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {language === "en" ? "Thinking..." : "सोच्दै..."}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input - Sticky Bottom */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky bottom-0 z-20 px-4 py-4 sm:px-6 border-t border-border/30 bg-white/95 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto">
          {/* Message Limit Reached Banner */}
          {limitReached && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-amber-800">
                    {language === "en" ? "Message limit reached" : "सन्देश सीमा पुग्यो"}
                  </p>
                  <p className="text-sm text-amber-700">
                    {language === "en"
                      ? "You've used all 10 messages in this conversation."
                      : "तपाईंले यस कुराकानीमा सबै १० सन्देशहरू प्रयोग गर्नुभयो।"}
                  </p>
                </div>
                <Button
                  onClick={clearChat}
                  className="gradient-bg text-white hover:shadow-medium"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {language === "en" ? "New Chat" : "नयाँ च्याट"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Remaining Messages Indicator */}
          {messages.length > 0 && !limitReached && (
            <div className="mb-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>
                {language === "en"
                  ? `${MAX_MESSAGES_PER_CONVERSATION - messageCount} messages remaining`
                  : `${MAX_MESSAGES_PER_CONVERSATION - messageCount} सन्देशहरू बाँकी`}
              </span>
              {messageCount >= MAX_MESSAGES_PER_CONVERSATION - 3 && messageCount < MAX_MESSAGES_PER_CONVERSATION && (
                <span className="text-amber-600 font-medium">
                  {language === "en" ? "(Running low!)" : "(कम बाँकी!)"}
                </span>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading || !isOnline || limitReached}
                className={cn(
                  "h-11 w-11 rounded-2xl transition-smooth touch-target",
                  isListening && "bg-destructive hover:bg-destructive/90 shadow-medium animate-pulse-glow"
                )}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </motion.div>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                limitReached
                  ? (language === "en" ? "Start a new conversation to continue..." : "जारी राख्न नयाँ कुराकानी सुरु गर्नुहोस्...")
                  : (language === "en" ? "Message NRAI Kancha..." : "NRAI Kancha लाई सन्देश...")
              }
              disabled={isLoading || isListening || !isOnline || limitReached}
              className="flex-1 min-h-[44px] max-h-[150px] resize-none bg-background border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-smooth text-base py-3 px-4 rounded-2xl"
              rows={1}
            />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim() || isListening || !isOnline || limitReached}
                className="h-11 w-11 gradient-bg hover:shadow-medium transition-smooth disabled:opacity-50 rounded-2xl touch-target"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </motion.div>
          </form>

          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-destructive"
            >
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse-glow" />
              {language === "en" ? "Listening..." : "सुन्दै..."}
            </motion.div>
          )}
        </div>
      </motion.footer>
    </div>
  )
}
