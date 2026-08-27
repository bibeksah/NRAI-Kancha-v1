"use client"

import { useState } from "react"
import { getManifestoItemById } from "@/lib/kancha-agent/knowledge/manifesto-store"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Sparkles, CheckCircle2, ShieldCheck, Globe, Calendar, ArrowRight } from "lucide-react"

interface ReformBadgeProps {
  reformId: string
  title?: string
}

export function ReformBadge({ reformId, title }: ReformBadgeProps) {
  const [open, setOpen] = useState(false)
  const item = getManifestoItemById(reformId)

  if (!item) {
    return (
      <Badge variant="outline" className="text-xs font-mono font-medium px-2 py-0.5 text-primary border-primary/30">
        Reform #{reformId} {title && `- ${title}`}
      </Badge>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 my-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/25 transition-all duration-200 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        title="Click to inspect complete reform blueprint"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span className="font-semibold">Reform #{item.id}:</span>
        <span className="truncate max-w-[220px]">{item.title}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-border/80 bg-card text-card-foreground shadow-2xl p-6 sm:p-7">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-0.5">
                Reform #{item.id}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground border-border">
                {item.category}
              </Badge>
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.priority} Priority • {item.timeline}
              </Badge>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {item.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4 text-sm">
            {/* The Problem */}
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
              <h4 className="font-semibold text-destructive flex items-center gap-2 text-sm">
                ⚠️ The Core Problem
              </h4>
              <p className="text-foreground/90 leading-relaxed text-xs sm:text-sm">
                {item.problem.long || item.problem.short}
              </p>
            </div>

            {/* Phased Solutions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Implementation Phases
              </h4>
              <div className="grid gap-3">
                {item.solution.long?.phases?.map((phase, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-muted/40 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary tracking-wide uppercase">
                        {phase.phase}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">{phase.title}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {phase.items.map((it, pIdx) => (
                        <li key={pIdx} className="text-xs sm:text-sm text-foreground/90 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )) || (
                  <ul className="space-y-1.5 pl-2">
                    {item.solution.short.map((s, idx) => (
                      <li key={idx} className="text-sm text-foreground/90 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Real World Evidence */}
            {item.realWorldEvidence?.long && item.realWorldEvidence.long.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Comparative Global Evidence
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {item.realWorldEvidence.long.map((ev, idx) => (
                    <div key={idx} className="rounded-lg border border-border/70 bg-card p-3 space-y-1.5 text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        🌍 {ev.country}
                      </span>
                      <p className="text-muted-foreground">{ev.details}</p>
                      <p className="text-primary font-medium">{ev.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Targets */}
            {item.performanceTargets && item.performanceTargets.length > 0 && (
              <div className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-xs sm:text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  Measurable Performance Targets
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.performanceTargets.map((target, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs font-normal py-1 px-2.5">
                      🎯 {target}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
