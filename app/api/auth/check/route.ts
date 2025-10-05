import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  // Check if API key is configured
  const apiKey = process.env.AZURE_AI_API_KEY

  // If API key exists, OAuth is optional
  // If no API key, OAuth is required
  return NextResponse.json({
    requiresOAuth: !apiKey,
    hasApiKey: !!apiKey,
  })
}
