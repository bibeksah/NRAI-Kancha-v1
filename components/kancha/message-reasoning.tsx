"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Brain, Wrench, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MessageReasoningProps {
  reasoning?: string
  toolSteps?: Array<{
    tool: string
    input: any
    result: any
  }>
  isGenerating?: boolean
}

export function MessageReasoning({ reasoning, toolSteps, isGenerating }: MessageReasoningProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasReasoning = Boolean(reasoning && reasoning.trim().length > 0)
  const hasTools = Boolean(toolSteps && toolSteps.length > 0)

  if (!hasReasoning && !hasTools && !isGenerating) {
    return null
  }

  const toolLabels: Record<string, string> = {
    search_reforms: "Searching Reform Blueprint",
    get_reform_details: "Inspecting Phased Roadmap",
    get_comparative_evidence: "Pulling Global Evidence",
    analyze_constitutional_impact: "Analyzing Constitution 2072",
    calculate_reform_impact: "Computing Fiscal Metrics"
  }

  return (
    <div className="mb-3 rounded-lg border border-border/80 bg-muted/30 overflow-hidden text-xs transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Brain className={`w-3.5 h-3.5 text-primary ${isGenerating ? "animate-pulse" : ""}`} />
          <span className="font-semibold text-foreground/90">
            {isGenerating ? "Kancha is analyzing & thinking..." : "Thought Process & Agent Steps"}
          </span>
          {hasTools && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border text-muted-foreground">
              {toolSteps!.length} {toolSteps!.length === 1 ? "tool" : "tools"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-border/60 space-y-3 bg-muted/10">
          {/* Tool Execution Steps */}
          {hasTools && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
                <Wrench className="w-3 h-3 text-primary" /> Autonomous Tools Executed:
              </span>
              <div className="space-y-1.5">
                {toolSteps!.map((step, idx) => (
                  <div
                    key={idx}
                    className="rounded border border-border/70 bg-card p-2.5 space-y-1 font-mono text-[11px]"
                  >
                    <div className="flex items-center justify-between font-sans">
                      <span className="font-semibold text-primary">
                        {toolLabels[step.tool] || step.tool}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Completed
                      </span>
                    </div>
                    {step.input && Object.keys(step.input).length > 0 && (
                      <div className="text-[10px] text-muted-foreground truncate">
                        Input: {JSON.stringify(step.input)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning / Thinking Stream */}
          {hasReasoning && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
                <Brain className="w-3 h-3 text-primary" /> Deep Reasoning:
              </span>
              <div className="p-2.5 rounded bg-muted/50 text-foreground/90 font-mono text-[11px] whitespace-pre-wrap leading-relaxed border border-border/50 max-h-60 overflow-y-auto">
                {reasoning}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
