"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChatHeader } from "./chat-header"
import { ChatSidebar } from "./chat-sidebar"
import { MessageList } from "./message-list"
import { ChatInput } from "./chat-input"
import { SettingsModal } from "./settings-modal"
import {
  loadAllSessions,
  saveAllSessions,
  getActiveSessionId,
  setActiveSessionId,
  createNewSession,
  updateSession,
  deleteSession,
  loadUserConfig,
  type ChatSession,
  type ChatMessage,
  type UserAgentConfig
} from "@/lib/storage/chat-sessions"
import { defaultSpeechService, type SpeechLanguage } from "@/lib/speech/speech-service"

interface ChatContainerProps {
  initialLanguage?: "en" | "ne"
  isEmbedded?: boolean
}

export function ChatContainer({ initialLanguage = "ne", isEmbedded = false }: ChatContainerProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [language, setLanguage] = useState<"en" | "ne">(initialLanguage)
  const [userConfig, setUserConfig] = useState<UserAgentConfig>({
    model: "deepseekv4-flash",
    language: initialLanguage,
    autoSpeak: false
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)

  // Initialize sessions and config on mount
  useEffect(() => {
    const config = loadUserConfig()
    setUserConfig(config)
    if (config.language) {
      setLanguage(config.language)
    }

    const allSessions = loadAllSessions()
    const activeId = getActiveSessionId()

    let current = allSessions.find(s => s.id === activeId)
    if (!current) {
      if (allSessions.length > 0) {
        current = allSessions[0]
      } else {
        current = createNewSession(config.language || initialLanguage, config.model || "deepseekv4-flash")
        allSessions.push(current)
      }
    }

    setSessions(allSessions)
    setActiveSession(current)
    setActiveSessionId(current.id)
  }, [initialLanguage])

  // Switch session
  const handleSelectSession = (id: string) => {
    const target = sessions.find(s => s.id === id)
    if (target) {
      setActiveSession(target)
      setActiveSessionId(target.id)
      if (target.language) {
        setLanguage(target.language)
      }
    }
  }

  // Create new session
  const handleNewChat = () => {
    const newSess = createNewSession(language, userConfig.model || "deepseekv4-flash")
    setSessions(loadAllSessions())
    setActiveSession(newSess)
  }

  // Delete session
  const handleDeleteSession = (id: string) => {
    const updated = deleteSession(id)
    setSessions(updated)
    if (activeSession?.id === id) {
      if (updated.length > 0) {
        setActiveSession(updated[0])
        setActiveSessionId(updated[0].id)
      } else {
        const fresh = createNewSession(language, userConfig.model || "deepseekv4-flash")
        setSessions([fresh])
        setActiveSession(fresh)
      }
    }
  }

  // Clear all sessions
  const handleClearAll = () => {
    const fresh = createNewSession(language, userConfig.model || "deepseekv4-flash")
    saveAllSessions([fresh])
    setSessions([fresh])
    setActiveSession(fresh)
  }

  // Toggle language
  const handleToggleLanguage = () => {
    const nextLang = language === "en" ? "ne" : "en"
    setLanguage(nextLang)
    if (activeSession) {
      const updated = { ...activeSession, language: nextLang }
      setActiveSession(updated)
      updateSession(updated)
    }
  }

  // Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsGenerating(false)
  }

  // Master send message handler with streaming SSE
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isGenerating || !activeSession) return

      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString()
      }

      const assistantMsgId = `msg_${Date.now()}_assistant`
      const initialAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        reasoning: "",
        toolSteps: [],
        timestamp: new Date().toISOString()
      }

      const updatedMessages = [...activeSession.messages, userMsg, initialAssistantMsg]
      const updatedSession = { ...activeSession, messages: updatedMessages }

      setActiveSession(updatedSession)
      updateSession(updatedSession)
      setIsGenerating(true)

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        }
        if (userConfig.apiKey) {
          headers["x-deepseek-api-key"] = userConfig.apiKey
        }
        if (userConfig.baseUrl) {
          headers["x-deepseek-base-url"] = userConfig.baseUrl
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            messages: updatedMessages.slice(0, -1).map(m => ({
              role: m.role,
              content: m.content
            })),
            language,
            model: userConfig.model || "deepseekv4-flash",
            clientApiKey: userConfig.apiKey,
            clientBaseUrl: userConfig.baseUrl
          }),
          signal: abortController.signal
        })

        if (!response.ok) {
          throw new Error(`Chat API error (${response.status})`)
        }

        if (!response.body) {
          throw new Error("No response body available from streaming endpoint.")
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        let accumulatedContent = ""
        let accumulatedReasoning = ""
        const accumulatedToolSteps: Array<{ tool: string; input: any; result: any }> = []

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith("data:")) continue

            const jsonStr = trimmed.slice(5).trim()
            try {
              const event = JSON.parse(jsonStr)

              if (event.type === "reasoning") {
                accumulatedReasoning += event.content || ""
              } else if (event.type === "token") {
                accumulatedContent += event.content || ""
              } else if (event.type === "tool_start") {
                accumulatedToolSteps.push({
                  tool: event.tool,
                  input: event.input,
                  result: null
                })
              } else if (event.type === "tool_end") {
                const targetIdx = accumulatedToolSteps.findIndex(
                  ts => ts.tool === event.tool && ts.result === null
                )
                if (targetIdx >= 0) {
                  accumulatedToolSteps[targetIdx].result = event.result
                }
              } else if (event.type === "error") {
                accumulatedContent += `\n\n⚠️ *${event.content}*`
              }

              // Update live message state
              setActiveSession(prev => {
                if (!prev) return prev
                const msgs = [...prev.messages]
                const lastIdx = msgs.findIndex(m => m.id === assistantMsgId)
                if (lastIdx >= 0) {
                  msgs[lastIdx] = {
                    ...msgs[lastIdx],
                    content: accumulatedContent,
                    reasoning: accumulatedReasoning,
                    toolSteps: [...accumulatedToolSteps]
                  }
                }
                const updated = { ...prev, messages: msgs }
                updateSession(updated)
                return updated
              })
            } catch (err) {
              // ignore parse errors
            }
          }
        }

        // Auto-speak if enabled
        if (userConfig.autoSpeak && accumulatedContent) {
          defaultSpeechService.speak(accumulatedContent, {
            language: language as SpeechLanguage
          })
        }
      } catch (error) {
        if ((error as any)?.name === "AbortError") {
          console.log("[Chat] Request aborted by user.")
        } else {
          console.error("[Chat] Error:", error)
          setActiveSession(prev => {
            if (!prev) return prev
            const msgs = [...prev.messages]
            const lastIdx = msgs.findIndex(m => m.id === assistantMsgId)
            if (lastIdx >= 0) {
              msgs[lastIdx] = {
                ...msgs[lastIdx],
                content:
                  msgs[lastIdx].content ||
                  `⚠️ Unable to connect to DeepSeek agent. Please check your network connection or API settings.`,
                error: true
              }
            }
            const updated = { ...prev, messages: msgs }
            updateSession(updated)
            return updated
          })
        }
      } finally {
        setIsGenerating(false)
        abortControllerRef.current = null
      }
    },
    [activeSession, isGenerating, language, userConfig]
  )

  // Prompt trigger from starter cards
  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  // Regenerate last response
  const handleRegenerateLast = () => {
    if (!activeSession || activeSession.messages.length < 2) return
    const userMessages = activeSession.messages.filter(m => m.role === "user")
    const lastUserMsg = userMessages[userMessages.length - 1]
    if (lastUserMsg) {
      // Remove last assistant message
      const pruned = activeSession.messages.slice(0, -1)
      const updated = { ...activeSession, messages: pruned }
      setActiveSession(updated)
      updateSession(updated)
      handleSendMessage(lastUserMsg.content)
    }
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      {/* Session Sidebar */}
      {!isEmbedded && (
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSession?.id || null}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAll}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectTopic={(topic) => handleSendMessage(`Tell me about Nepal's reform agendas for ${topic}`)}
          language={language}
        />
      )}

      {/* Main Chat Arena */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
        <ChatHeader
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onNewChat={handleNewChat}
          onOpenSettings={() => setSettingsOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          modelName={userConfig.model || "deepseekv4-flash"}
          sessionTitle={activeSession?.title}
        />

        <MessageList
          messages={activeSession?.messages || []}
          isGenerating={isGenerating}
          language={language}
          onSelectPrompt={handleSelectPrompt}
          onRegenerateLast={handleRegenerateLast}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          isGenerating={isGenerating}
          language={language}
          modelName={userConfig.model || "deepseekv4-flash"}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onConfigUpdated={(cfg) => {
          setUserConfig(cfg)
          if (cfg.language) setLanguage(cfg.language)
        }}
      />
    </div>
  )
}
