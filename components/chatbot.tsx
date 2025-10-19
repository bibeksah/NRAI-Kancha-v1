"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { 
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
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
  Trash,
  Download,
  Settings,
  MessageSquare,
  AlertCircle,
  WifiOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SpeechService, type Language } from "@/lib/speech-service"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  error?: boolean
}

const EXAMPLE_PROMPTS = {
  en: [
    "How will the manifesto fight corruption?",
    "How will it make the government stable?",
    "How will it grow Nepal’s economy?",
    "How will it digitize government services?"
  ],
  ne: [
    "घोषणापत्रले भ्रष्टाचार कसरी नियन्त्रण गर्छ?",
    "यसले सरकारलाई स्थिर कसरी बनाउँछ?",
    "यसले नेपालको अर्थतन्त्र कसरी बढाउँछ?",
    "यसले सरकारी सेवाहरूलाई डिजिटल कसरी बनाउँछ?"
  ]
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [retryingMessageId, setRetryingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const speechServiceRef = useRef<SpeechService | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

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

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("nrai-kancha-messages")
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages)
          const messagesWithDates = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(messagesWithDates)
        } catch (error) {
          console.error("Failed to load messages:", error)
        }
      }

      const savedLanguage = localStorage.getItem("nrai-kancha-language")
      if (savedLanguage) {
        setLanguage(savedLanguage as Language)
      }

      const savedAutoSpeak = localStorage.getItem("nrai-kancha-auto-speak")
      if (savedAutoSpeak !== null) {
        setAutoSpeak(savedAutoSpeak === "true")
      }

      initializeSpeechService()
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("nrai-kancha-messages", JSON.stringify(messages))
    }
  }, [messages])

  // Save language preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nrai-kancha-language", language)
    }
  }, [language])

  // Save auto-speak preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nrai-kancha-auto-speak", String(autoSpeak))
    }
  }, [autoSpeak])

  // Smooth scroll to bottom with performance optimization
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [messages, scrollToBottom])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        setShowClearDialog(true)
      }
      if (e.key === 'Escape') {
        setShowClearDialog(false)
        setShowSettingsDialog(false)
      }
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault()
        setShowSettingsDialog(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus management for accessibility
  useEffect(() => {
    if (showClearDialog || showSettingsDialog) {
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          // Simple focus trap
        }
      }
      window.addEventListener('keydown', handleTabKey)
      return () => window.removeEventListener('keydown', handleTabKey)
    }
  }, [showClearDialog, showSettingsDialog])

  const initializeSpeechService = async () => {
    try {
      const response = await fetch("/api/speech-token")
      const data = await response.json()

      if (data.token && data.region) {
        speechServiceRef.current = new SpeechService({})
        speechServiceRef.current.updateToken(data.token, data.region)
      } else {
        console.error("[NRAI Kancha] Failed to get speech token:", data.error)
      }
    } catch (error) {
      console.error("[NRAI Kancha] Failed to initialize speech service:", error)
    }
  }

  const sendMessage = async (text: string, isRetry: boolean = false, originalMessageId?: string) => {
    if (!text.trim()) return

    if (!isOnline) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: language === "en" 
          ? "You appear to be offline. Please check your internet connection and try again."
          : "तपाईं अफलाइन देखिनुहुन्छ। कृपया आफ्नो इन्टरनेट जडान जाँच गर्नुहोस् र फेरि प्रयास गर्नुहोस्।",
        timestamp: new Date(),
        error: true
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }

    if (!isRetry) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
    }

    setInput("")
    setIsLoading(true)
    if (isRetry && originalMessageId) {
      setRetryingMessageId(originalMessageId)
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
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
        const messagesWithDates = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          error: false
        }))
        setMessages(messagesWithDates)

        if (autoSpeak) {
          const lastMessage = data.messages[data.messages.length - 1]
          if (lastMessage.role === "assistant") {
            await speakText(lastMessage.content)
          }
        }
      }
    } catch (error) {
      console.error("[NRAI Kancha] Failed to send message:", error)
      
      if (isRetry && originalMessageId) {
        setMessages((prev) => prev.map(msg => 
          msg.id === originalMessageId 
            ? { 
                ...msg, 
                content: error instanceof Error 
                  ? `${language === "en" ? "Error" : "त्रुटि"}: ${error.message}` 
                  : language === "en" 
                    ? "Sorry, I encountered an error. Please try again."
                    : "माफ गर्नुहोस्, मैले त्रुटि सामना गरें। कृपया फेरि प्रयास गर्नुहोस्।",
                error: true
              }
            : msg
        ))
      } else {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: error instanceof Error 
            ? `${language === "en" ? "Error" : "त्रुटि"}: ${error.message}` 
            : language === "en" 
              ? "Sorry, I encountered an error. Please try again."
              : "माफ गर्नुहोस्, मैले त्रुटि सामना गरें। कृपया फेरि प्रयास गर्नुहोस्।",
          timestamp: new Date(),
          error: true
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
      setRetryingMessageId(null)
    }
  }

  const retryMessage = (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    if (messageIndex > 0) {
      const previousUserMessage = [...messages].slice(0, messageIndex).reverse().find(msg => msg.role === "user")
      if (previousUserMessage) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        sendMessage(previousUserMessage.content, true, messageId)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
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

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ne" : "en"))
  }

  const copyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy message:", error)
    }
  }

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }

  const regenerateResponse = async () => {
    if (messages.length < 2) return
    
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === "user")
    if (!lastUserMessage) return

    const indexOfLastUser = messages.findIndex(msg => msg.id === lastUserMessage.id)
    setMessages(messages.slice(0, indexOfLastUser + 1))
    
    await sendMessage(lastUserMessage.content)
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem("nrai-kancha-messages")
    setShowClearDialog(false)
    
    const announcement = language === "en" ? "Chat cleared" : "कुराकानी खाली गरियो"
    announceToScreenReader(announcement)
  }

  const exportChat = (format: 'txt' | 'json') => {
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
    
    const announcement = language === "en" ? "Chat exported" : "कुराकानी निर्यात गरियो"
    announceToScreenReader(announcement)
  }

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  // Preprocess markdown to ensure proper formatting
  const preprocessMarkdown = (content: string): string => {
    let processed = content;
    
    // Fix numbered lists that are on the same line
    // Pattern: "text. 2." should become "text.\n2."
    processed = processed.replace(/\.\s+(\d+)\.\s+/g, '.\n\n$1. ');
    
    // Ensure headings are at the start of a line and have proper spacing
    // Replace patterns like "text ### Heading" with "text\n\n### Heading"
    processed = processed.replace(/([^\n])(\s*)(#{1,6}\s+)/g, '$1\n\n$3');
    
    // Clean up any triple or more newlines
    processed = processed.replace(/\n{3,}/g, '\n\n');
    
    // Ensure proper spacing after headings
    processed = processed.replace(/(#{1,6}\s+[^\n]+)\n([^\n#])/g, '$1\n\n$2');
    
    return processed.trim();
  }

  // Custom components for ReactMarkdown to ensure proper rendering
  const markdownComponents: Components = {
    h1: (props) => <h1 className="text-2xl font-bold mt-6 mb-4 first:mt-0" {...props} />,
    h2: (props) => <h2 className="text-xl font-bold mt-5 mb-3 first:mt-0" {...props} />,
    h3: (props) => <h3 className="text-lg font-semibold mt-4 mb-2 first:mt-0" {...props} />,
    h4: (props) => <h4 className="text-base font-semibold mt-3 mb-2 first:mt-0" {...props} />,
    h5: (props) => <h5 className="text-sm font-semibold mt-3 mb-2 first:mt-0" {...props} />,
    h6: (props) => <h6 className="text-sm font-semibold mt-3 mb-2 first:mt-0" {...props} />,
    p: (props) => <p className="my-3 first:mt-0 last:mb-0 text-foreground" {...props} />,
    ul: (props) => <ul className="list-disc list-outside ml-6 my-3 space-y-1" {...props} />,
    ol: (props) => <ol className="list-decimal list-outside ml-6 my-3 space-y-1" {...props} />,
    li: (props) => <li className="pl-1 text-foreground" {...props} />,
    a: (props) => <a className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-normal" {...props} />,
    code: ({inline, ...props}) => 
      inline ? 
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} /> : 
        <code className="block bg-muted p-4 rounded-lg overflow-x-auto my-3 text-sm" {...props} />,
    pre: (props) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-3" {...props} />,
    blockquote: (props) => <blockquote className="border-l-4 border-primary/30 pl-4 italic my-3 text-muted-foreground" {...props} />,
    hr: (props) => <hr className="border-t border-border my-6" {...props} />,
    table: (props) => <table className="w-full border-collapse my-4" {...props} />,
    thead: (props) => <thead className="border-b-2 border-border" {...props} />,
    tbody: (props) => <tbody className="divide-y divide-border" {...props} />,
    tr: (props) => <tr className="hover:bg-muted/30 transition-colors" {...props} />,
    th: (props) => <th className="px-4 py-2 text-left font-semibold bg-muted/50" {...props} />,
    td: (props) => <td className="px-4 py-2" {...props} />,
    img: (props) => <img className="max-w-full h-auto rounded-lg my-3" {...props} />,
    strong: (props) => <strong className="font-bold text-primary" {...props} />,
    em: (props) => <em className="italic" {...props} />,
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-accent/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="relative z-10 bg-destructive text-destructive-foreground px-4 py-3 text-sm flex items-center justify-center gap-2 animate-slide-in shadow-medium" role="alert">
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">{language === "en" ? "You are offline" : "तपाईं अफलाइन हुनुहुन्छ"}</span>
        </div>
      )}

      {/* Enhanced Header */}
      <header 
        className="relative z-10 border-b border-border/40 bg-card/95 backdrop-blur-xl shadow-soft"
        role="banner"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-accent/[0.03] to-primary/[0.03]" />
        <div className="relative flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative" role="img" aria-label="NRAI Kancha logo">
              <div className="absolute inset-0 bg-primary/25 rounded-full blur-lg animate-pulse-glow" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-bg flex items-center justify-center shadow-medium hover-lift">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
                NRAI Kancha
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-0.5">
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    isOnline ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-destructive"
                  )} 
                  role="status"
                  aria-label={isOnline ? "Online" : "Offline"}
                />
                <span className="hidden sm:inline font-medium" aria-live="polite">
                  {isOnline ? (language === "en" ? "Online" : "अनलाइन") : (language === "en" ? "Offline" : "अफलाइन")}
                </span>
                {messages.length > 0 && (
                  <span className="text-xs" aria-label={`${messages.length} messages in conversation`}>
                    <span className="hidden sm:inline">•</span> {messages.length} {language === "en" ? "msg" : "सन्देश"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Main navigation">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="h-9 w-9 sm:h-11 sm:w-11 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-smooth rounded-xl touch-target"
              title={`Switch to ${language === "en" ? "Nepali" : "English"}`}
              aria-label={`Switch to ${language === "en" ? "Nepali" : "English"} language`}
            >
              <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div 
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl gradient-bg text-primary-foreground shadow-soft"
              aria-label={`Current language: ${language === "en" ? "English" : "Nepali"}`}
            >
              {language === "en" ? "EN" : "NE"}
            </div>
            {messages.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowClearDialog(true)}
                  className="h-9 w-9 sm:h-11 sm:w-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth rounded-xl touch-target"
                  title="Clear chat (Ctrl+K)"
                  aria-label="Clear chat history"
                >
                  <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => exportChat('txt')}
                  className="h-9 w-9 sm:h-11 sm:w-11 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-smooth rounded-xl touch-target"
                  title="Export chat"
                  aria-label="Export chat history"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettingsDialog(true)}
              className="h-9 w-9 sm:h-11 sm:w-11 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-smooth rounded-xl touch-target"
              title="Settings (Ctrl+/)"
              aria-label="Open settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Messages */}
      <main 
        ref={messagesContainerRef}
        className="relative z-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-5 scroll-smooth"
        role="main"
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-scale-in px-6 sm:px-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/25 to-accent/25 rounded-full blur-3xl" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full gradient-bg flex items-center justify-center shadow-strong hover-lift">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
              {language === "en" ? "Welcome to NRAI Kancha" : "NRAI Kancha मा स्वागत छ"}
            </h2>
            <p className="text-muted-foreground max-w-lg text-sm sm:text-base leading-relaxed mb-8 font-medium">
              {language === "en"
                ? "Your intelligent bilingual assistant. Start a conversation by typing or using voice input."
                : "तपाईंको बुद्धिमान द्विभाषी सहायक। टाइप गरेर वा आवाज इनपुट प्रयोग गरेर कुराकानी सुरु गर्नुहोस्।"}
            </p>
            
            <div className="w-full max-w-2xl">
              <p className="text-sm sm:text-base font-semibold text-muted-foreground mb-4">
                {language === "en" ? "Try asking:" : "प्रयास गर्नुहोस्:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list" aria-label="Example prompts">
                {EXAMPLE_PROMPTS[language].map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-4 px-5 hover:bg-accent/70 hover:border-primary/60 hover:shadow-medium transition-smooth rounded-2xl text-sm sm:text-base font-medium group"
                    onClick={() => sendMessage(prompt)}
                    aria-label={`Try asking: ${prompt}`}
                  >
                    <MessageSquare className="w-5 h-5 mr-3 flex-shrink-0 text-primary group-hover:scale-110 transition-smooth" aria-hidden="true" />
                    <span className="line-clamp-2">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <article
            key={message.id}
            className={cn(
              "flex gap-3 sm:gap-4 group",
              message.role === "user" ? "ml-auto flex-row-reverse animate-slide-in-right max-w-[85%] sm:max-w-[80%]" : "animate-slide-in-left max-w-[92%] sm:max-w-[88%]"
            )}
            role="article"
          >
            <div
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xs sm:text-sm shadow-medium transition-smooth",
                message.role === "user"
                  ? "gradient-bg text-primary-foreground shadow-primary/30 hover-lift"
                  : "bg-gradient-to-br from-secondary to-accent/40 text-secondary-foreground"
              )}
              aria-hidden="true"
            >
              {message.role === "user" ? "U" : "AI"}
            </div>
            <div className="flex-1 min-w-0">
              <Card
                className={cn(
                  "p-5 sm:p-6 rounded-3xl transition-smooth hover-lift",
                  message.role === "user"
                    ? "gradient-bg text-white shadow-strong shadow-primary/20"
                    : message.error
                    ? "bg-destructive/10 border-destructive/50 shadow-medium hover:shadow-strong border-2"
                    : "bg-card shadow-medium hover:shadow-strong border border-border/30"
                )}
              >
                {message.error && (
                  <div className="flex items-center gap-2 mb-3 text-destructive text-sm font-medium">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{language === "en" ? "Error" : "त्रुटि"}</span>
                  </div>
                )}
                
                <div className={cn("markdown-content", message.role === "user" && "user-message-content")}>
                  {message.role === "user" ? (
                    <p className="whitespace-pre-wrap m-0">{message.content}</p>
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {preprocessMarkdown(message.content)}
                    </ReactMarkdown>
                  )}
                </div>
                
                <div className={cn(
                  "flex items-center justify-between mt-4 pt-3.5 border-t",
                  message.role === "user" ? "border-white/15" : "border-border/30"
                )}>
                  <time 
                    className={cn(
                      "text-xs sm:text-sm font-medium",
                      message.role === "user" ? "text-white/75" : "text-muted-foreground"
                    )}
                    dateTime={message.timestamp.toISOString()}
                  >
                    {message.timestamp instanceof Date
                      ? message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </time>
                  
                  <div className="flex items-center gap-1.5 transition-opacity" role="toolbar">
                    {message.error ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive hover:bg-destructive/15 transition-smooth rounded-xl touch-target"
                        onClick={() => retryMessage(message.id)}
                        disabled={retryingMessageId === message.id}
                        aria-label="Retry message"
                      >
                        {retryingMessageId === message.id ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 sm:h-9 sm:w-9 transition-smooth rounded-xl touch-target",
                            message.role === "user" 
                              ? "text-white/75 hover:text-white hover:bg-white/15" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                          )}
                          onClick={() => copyMessage(message.content, message.id)}
                          aria-label="Copy message"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </Button>
                        
                        {message.role === "assistant" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-smooth rounded-xl touch-target"
                              onClick={() => speakText(message.content)}
                              disabled={isSpeaking}
                              aria-label="Read aloud"
                            >
                              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                            
                            {index === messages.length - 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-smooth rounded-xl touch-target"
                                onClick={regenerateResponse}
                                disabled={isLoading}
                                aria-label="Regenerate"
                              >
                                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                              </Button>
                            )}
                          </>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 sm:h-9 sm:w-9 transition-smooth rounded-xl touch-target",
                            message.role === "user" 
                              ? "text-white/75 hover:text-white hover:bg-white/15" 
                              : "text-muted-foreground hover:text-destructive hover:bg-destructive/15"
                          )}
                          onClick={() => deleteMessage(message.id)}
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </article>
        ))}

        {isLoading && (
          <div className="flex gap-3 sm:gap-4 max-w-[92%] sm:max-w-[88%] animate-slide-in-left" role="status" aria-live="polite">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-secondary to-accent/40 text-secondary-foreground flex items-center justify-center flex-shrink-0 font-bold text-xs sm:text-sm shadow-medium">
              AI
            </div>
            <Card className="p-5 sm:p-6 rounded-3xl bg-card shadow-medium border border-border/30">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce shadow-sm" style={{ animationDelay: "0ms" }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce shadow-sm" style={{ animationDelay: "150ms" }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce shadow-sm" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-sm sm:text-base font-medium text-muted-foreground">
                  {language === "en" ? "Thinking..." : "सोच्दै..."}
                </span>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Enhanced Input */}
  <footer className="relative z-10 px-4 py-4 sm:px-6 sm:py-5 border-t border-border/40 bg-card/95 backdrop-blur-xl shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]" role="contentinfo">
        <form onSubmit={handleSubmit} className="flex gap-2.5 sm:gap-3">
          <Button
            type="button"
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading || !isOnline}
            className={cn(
              "flex-shrink-0 h-12 w-12 sm:h-12 sm:w-12 transition-smooth rounded-2xl touch-target",
              isListening && "bg-destructive hover:bg-destructive/90 shadow-strong shadow-destructive/25 animate-pulse"
            )}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
          </Button>

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={language === "en" ? "Type your message..." : "आफ्नो सन्देश टाइप गर्नुहोस्..."}
            disabled={isLoading || isListening || !isOnline}
            className="flex-1 min-h-[48px] max-h-[150px] resize-none bg-background text-foreground placeholder:text-muted-foreground border-border/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-smooth text-base sm:text-lg py-3 sm:py-3.5 px-4 rounded-2xl"
            rows={1}
            aria-label="Message input"
          />

          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || isListening || !isOnline}
            className="flex-shrink-0 h-12 w-12 sm:h-12 sm:w-12 gradient-bg hover:shadow-strong hover:shadow-primary/25 transition-smooth disabled:opacity-50 rounded-2xl touch-target"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
            ) : (
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </Button>
        </form>

        {isListening && (
          <div className="mt-4 flex items-center justify-center gap-3 text-sm sm:text-base font-semibold text-destructive animate-pulse" role="status" aria-live="polite">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-destructive animate-ping" />
            </div>
            {language === "en" ? "Listening..." : "सुन्दै..."}
          </div>
        )} 
      </footer>

      {/* Dialogs */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogHeader>
          <DialogTitle>{language === "en" ? "Clear Chat History?" : "कुराकानी इतिहास खाली गर्ने?"}</DialogTitle>
          <DialogDescription>
            {language === "en" 
              ? "This will permanently delete all messages from this conversation. This action cannot be undone."
              : "यसले यस कुराकानीबाट सबै सन्देशहरू स्थायी रूपमा मेटाउनेछ। यो कार्य पूर्ववत गर्न सकिँदैन।"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowClearDialog(false)}>
            {language === "en" ? "Cancel" : "रद्द गर्नुहोस्"}
          </Button>
          <Button variant="destructive" onClick={clearChat}>
            <Trash className="w-4 h-4 mr-2" />
            {language === "en" ? "Clear Chat" : "खाली गर्नुहोस्"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {language === "en" ? "Settings" : "सेटिङहरू"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "en" ? "Language" : "भाषा"}</label>
            <div className="flex gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setLanguage("en")}
              >
                English
              </Button>
              <Button
                variant={language === "ne" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setLanguage("ne")}
              >
                नेपाली
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "en" ? "Auto-Speak" : "स्वत: बोल्नुहोस्"}</label>
            <div className="flex gap-2">
              <Button
                variant={autoSpeak ? "default" : "outline"}
                className="flex-1"
                onClick={() => setAutoSpeak(true)}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {language === "en" ? "On" : "चालु"}
              </Button>
              <Button
                variant={!autoSpeak ? "default" : "outline"}
                className="flex-1"
                onClick={() => setAutoSpeak(false)}
              >
                <VolumeX className="w-4 h-4 mr-2" />
                {language === "en" ? "Off" : "बन्द"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "en" ? "Export" : "निर्यात"}</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { exportChat('txt'); setShowSettingsDialog(false) }}
                disabled={messages.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                TXT
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { exportChat('json'); setShowSettingsDialog(false) }}
                disabled={messages.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setShowSettingsDialog(false)} className="w-full">
            {language === "en" ? "Close" : "बन्द गर्नुहोस्"}
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isLoading && (language === "en" ? "AI is thinking" : "AI सोच्दै छ")}
        {isListening && (language === "en" ? "Listening" : "सुन्दै")}
      </div>
    </div>
  )
}
