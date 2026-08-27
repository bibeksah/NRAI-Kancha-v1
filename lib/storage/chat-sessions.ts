export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  reasoning?: string
  toolSteps?: Array<{
    tool: string
    input: any
    result: any
  }>
  timestamp: string
  error?: boolean
  reformsCited?: string[]
}

export interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
  language: "en" | "ne"
  model: string
}

const SESSIONS_STORAGE_KEY = "nrai-kancha-sessions"
const ACTIVE_SESSION_ID_KEY = "nrai-kancha-active-session-id"
const USER_CONFIG_KEY = "nrai-kancha-user-config"

export interface UserAgentConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
  autoSpeak?: boolean
  language?: "en" | "ne"
  speechRate?: number
}

export function loadUserConfig(): UserAgentConfig {
  if (typeof window === "undefined") return { model: "deepseekv4-flash", language: "ne", autoSpeak: false }
  try {
    const raw = localStorage.getItem(USER_CONFIG_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    // ignore
  }
  return { model: "deepseekv4-flash", language: "ne", autoSpeak: false }
}

export function saveUserConfig(config: UserAgentConfig) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(USER_CONFIG_KEY, JSON.stringify(config))
  } catch (e) {
    // ignore
  }
}

export function loadAllSessions(): ChatSession[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (e) {
    console.error("[Storage] Error loading sessions:", e)
  }
  return []
}

export function saveAllSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  } catch (e) {
    console.error("[Storage] Error saving sessions:", e)
  }
}

export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACTIVE_SESSION_ID_KEY)
}

export function setActiveSessionId(id: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(ACTIVE_SESSION_ID_KEY, id)
}

export function createNewSession(lang: "en" | "ne" = "ne", model = "deepseekv4-flash"): ChatSession {
  const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  const newSession: ChatSession = {
    id: newId,
    title: lang === "ne" ? "नयाँ कुराकानी" : "New Conversation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    language: lang,
    model
  }

  const sessions = loadAllSessions()
  sessions.unshift(newSession)
  saveAllSessions(sessions)
  setActiveSessionId(newId)
  return newSession
}

export function updateSession(session: ChatSession) {
  const sessions = loadAllSessions()
  const idx = sessions.findIndex(s => s.id === session.id)
  session.updatedAt = new Date().toISOString()

  // Generate an automated smart title if it's the first user message
  if (session.messages.length > 0 && session.title.startsWith("New ") || session.title.startsWith("नयाँ ")) {
    const firstUserMsg = session.messages.find(m => m.role === "user")?.content
    if (firstUserMsg) {
      session.title = firstUserMsg.slice(0, 40) + (firstUserMsg.length > 40 ? "..." : "")
    }
  }

  if (idx >= 0) {
    sessions[idx] = session
  } else {
    sessions.unshift(session)
  }
  saveAllSessions(sessions)
}

export function deleteSession(sessionId: string): ChatSession[] {
  let sessions = loadAllSessions()
  sessions = sessions.filter(s => s.id !== sessionId)
  saveAllSessions(sessions)
  return sessions
}

export function exportChatMarkdown(session: ChatSession): string {
  const lines: string[] = [
    `# ${session.title}`,
    `*Date: ${new Date(session.createdAt).toLocaleDateString()} | Model: ${session.model}*`,
    `---`,
    ""
  ]

  session.messages.forEach(m => {
    const speaker = m.role === "user" ? "👤 **Citizen / User**" : "🇳🇵 **NRAI Kancha (AI Agent)**"
    lines.push(`### ${speaker}`)
    if (m.reasoning) {
      lines.push(`> 🧠 *Reasoning / Thoughts:*\n> ${m.reasoning.replace(/\n/g, "\n> ")}\n`)
    }
    lines.push(m.content)
    lines.push("\n---\n")
  })

  return lines.join("\n")
}
