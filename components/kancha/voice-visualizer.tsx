"use client"

import { motion } from "framer-motion"

interface VoiceVisualizerProps {
  isActive: boolean
  mode?: "listening" | "speaking"
  label?: string
}

export function VoiceVisualizer({ isActive, mode = "speaking", label }: VoiceVisualizerProps) {
  if (!isActive) return null

  const isListening = mode === "listening"
  const barColor = isListening ? "bg-red-500" : "bg-primary"

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary shadow-xs">
      <div className="flex items-center gap-1 h-3.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className={`w-0.75 rounded-full ${barColor}`}
            animate={{
              height: ["4px", "14px", "4px"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold tracking-tight">
        {label || (isListening ? "Listening..." : "Speaking...")}
      </span>
    </div>
  )
}
