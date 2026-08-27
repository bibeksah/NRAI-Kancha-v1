"use client"

import { Bot, Plus, Settings, Languages, Menu, Sparkles, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ChatHeaderProps {
  language: "en" | "ne"
  onToggleLanguage: () => void
  onNewChat: () => void
  onOpenSettings: () => void
  onToggleSidebar?: () => void
  modelName: string
  sessionTitle?: string
}

export function ChatHeader({
  language,
  onToggleLanguage,
  onNewChat,
  onOpenSettings,
  onToggleSidebar,
  modelName,
  sessionTitle
}: ChatHeaderProps) {
  const isNe = language === "ne"

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-5 border-b border-border/80 bg-card/90 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-2.5">
        {onToggleSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer md:hidden"
            title="Toggle Sessions Sidebar"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shadow-xs font-bold text-sm">
            🇳🇵
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-foreground">
                {isNe ? "कान्छा" : "NRAI Kancha"}
              </h1>
              <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 border-primary/30 text-primary bg-primary/5">
                {modelName}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground truncate max-w-[140px] sm:max-w-[240px]">
              {sessionTitle || (isNe ? "नेपाल सुधार एआई एजेन्ट" : "Nepal Reforms AI Agent")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language Toggle */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleLanguage}
          className="h-8 px-2 sm:px-2.5 text-xs font-medium border-border/80 hover:bg-muted cursor-pointer gap-1"
          title={isNe ? "Switch to English" : "नेपालीमा स्विच गर्नुहोस्"}
        >
          <Languages className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold">{isNe ? "नेपाली" : "EN"}</span>
        </Button>

        {/* New Chat Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="h-8 px-2.5 text-xs font-semibold border-border/80 hover:bg-muted cursor-pointer gap-1"
          title="Start a new conversation"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isNe ? "नयाँ कुराकानी" : "New Chat"}</span>
        </Button>

        {/* Settings Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          title="Settings & API Key"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
