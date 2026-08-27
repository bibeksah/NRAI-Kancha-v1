"use client"

import { useState } from "react"
import {
  MessageSquare,
  Plus,
  Trash2,
  Download,
  Search,
  X,
  ExternalLink,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { exportChatMarkdown, type ChatSession } from "@/lib/storage/chat-sessions"
import { getAllCategories } from "@/lib/kancha-agent/knowledge/manifesto-store"

interface ChatSidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onDeleteSession: (id: string) => void
  onClearAll: () => void
  isOpen: boolean
  onClose: () => void
  onSelectTopic?: (topic: string) => void
  language?: "en" | "ne"
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAll,
  isOpen,
  onClose,
  onSelectTopic,
  language = "en"
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const isNe = language === "ne"

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = [
    "Anti-Corruption",
    "Governance",
    "Digital Services",
    "Procurement",
    "Economy",
    "Education & Health"
  ]

  const handleExport = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation()
    const md = exportChatMarkdown(session)
    const blob = new Blob([md], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kancha-chat-${session.id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteSession(id)
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 sm:w-80 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-primary/10 text-primary">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-sidebar-foreground">
              {isNe ? "कुराकानी इतिहास" : "Chat History"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onNewSession}
              className="h-7 px-2 text-xs font-semibold gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isNe ? "नयाँ" : "New"}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0 md:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-sidebar-border">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
            <Input
              type="text"
              placeholder={isNe ? "कुराकानी खोज्नुहोस्..." : "Search chats..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-sidebar-accent/50 border-sidebar-border"
            />
          </div>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground px-4">
              {searchQuery
                ? (isNe ? "कुनै कुराकानी भेटिएन" : "No chats matched your search")
                : (isNe ? "अहिलेसम्म कुनै कुराकानी छैन" : "No conversations yet")}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id)
                    onClose()
                  }}
                  className={`group relative flex items-center justify-between p-2 rounded-lg text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold border border-sidebar-border"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{session.title}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleExport(session, e)}
                      className="p-1 hover:text-foreground text-muted-foreground rounded"
                      title="Export Markdown"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(session.id, e)}
                      className="p-1 hover:text-destructive text-muted-foreground rounded"
                      title="Delete Chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Quick Reform Topic Shortcuts */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            {isNe ? "सुधार एजेन्डा शीर्षकहरू" : "Explore Agendas"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectTopic?.(cat)
                  onClose()
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-sidebar-accent hover:bg-primary/10 hover:text-primary border border-sidebar-border transition-colors cursor-pointer text-muted-foreground"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-sidebar-border flex items-center justify-between text-[11px] text-muted-foreground">
          <a
            href="https://nepalreforms.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
          >
            <span>nepalreforms.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          {sessions.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-destructive transition-colors text-[10px]"
            >
              {isNe ? "सबै मेटाउनुहोस्" : "Clear all"}
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
