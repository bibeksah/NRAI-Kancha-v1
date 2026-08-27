"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Key, Bot, Volume2, Save, RotateCcw, ShieldAlert, Cpu } from "lucide-react"
import { loadUserConfig, saveUserConfig, type UserAgentConfig } from "@/lib/storage/chat-sessions"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfigUpdated?: (config: UserAgentConfig) => void
}

export function SettingsModal({ open, onOpenChange, onConfigUpdated }: SettingsModalProps) {
  const [config, setConfig] = useState<UserAgentConfig>({
    apiKey: "",
    baseUrl: "https://api.deepseek.com",
    model: "deepseekv4-flash",
    autoSpeak: false,
    speechRate: 1.0
  })
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (open) {
      const current = loadUserConfig()
      setConfig(current)
      setSavedSuccess(false)
    }
  }, [open])

  const handleSave = () => {
    saveUserConfig(config)
    onConfigUpdated?.(config)
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      onOpenChange(false)
    }, 600)
  }

  const handleReset = () => {
    const defaults: UserAgentConfig = {
      apiKey: "",
      baseUrl: "https://api.deepseek.com",
      model: "deepseekv4-flash",
      autoSpeak: false,
      speechRate: 1.0
    }
    setConfig(defaults)
    saveUserConfig(defaults)
    onConfigUpdated?.(defaults)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card text-card-foreground border-border shadow-2xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Bot className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">Kancha AI Agent Settings</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure DeepSeek AI model parameters, API key, and speech playback options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          {/* DeepSeek API Key */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-primary" /> DeepSeek API Key
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">Stored locally</span>
            </Label>
            <Input
              type="password"
              placeholder="sk-..."
              value={config.apiKey || ""}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="text-xs font-mono h-9 bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              Overrides the server <code className="text-primary">DEEPSEEK_API_KEY</code> if provided.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" /> DeepSeek Model
            </Label>
            <Select
              value={config.model || "deepseekv4-flash"}
              onValueChange={(val) => setConfig({ ...config, model: val })}
            >
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek-v4-flash" className="text-xs font-medium">
                  ⚡ deepseek-v4-flash (Fast & Autonomous)
                </SelectItem>
                <SelectItem value="deepseek-v4-pro" className="text-xs font-medium">
                  🚀 deepseek-v4-pro (High Capability)
                </SelectItem>
                <SelectItem value="deepseek-chat" className="text-xs">
                  💬 deepseek-chat (DeepSeek V3 Standard)
                </SelectItem>
                <SelectItem value="deepseek-reasoner" className="text-xs">
                  🧠 deepseek-reasoner (DeepSeek R1 Reasoning)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Base URL */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              API Base URL (Optional)
            </Label>
            <Input
              type="text"
              placeholder="https://api.deepseek.com"
              value={config.baseUrl || ""}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              className="text-xs font-mono h-9 bg-background"
            />
          </div>

          {/* Auto Speak Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-primary" /> Auto-Speak Answers (TTS)
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Automatically synthesize speech for incoming responses
              </p>
            </div>
            <Switch
              checked={Boolean(config.autoSpeak)}
              onCheckedChange={(checked) => setConfig({ ...config, autoSpeak: checked })}
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="text-xs font-semibold bg-primary text-primary-foreground"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            {savedSuccess ? "Saved!" : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
