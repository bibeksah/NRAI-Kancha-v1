import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  const hasDeepSeekKey = Boolean(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY.trim().length > 0)
  const hasSpeechKey = Boolean(process.env.SPEECH_KEY && process.env.SPEECH_REGION)
  const model = process.env.DEEPSEEK_MODEL || "deepseekv4-flash"
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com"

  return NextResponse.json({
    status: "online",
    agent: "NRAI Kancha v2 (DeepSeek AI)",
    hasDeepSeekKey,
    hasSpeechKey,
    defaultModel: model,
    baseUrl,
    supportedModels: [
      "deepseekv4-flash",
      "deepseek-chat",
      "deepseek-reasoner"
    ],
    timestamp: new Date().toISOString()
  })
}
