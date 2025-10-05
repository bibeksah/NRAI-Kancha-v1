import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const subscriptionKey = process.env.SPEECH_KEY
    const region = process.env.SPEECH_REGION

    if (!subscriptionKey || !region) {
      return NextResponse.json({ error: "Speech service not configured" }, { status: 500 })
    }

    // Get authorization token from Azure Speech Service
    const tokenResponse = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to get speech token")
    }

    const token = await tokenResponse.text()

    return NextResponse.json({ token, region })
  } catch (error) {
    console.error("[v0] Speech token error:", error)
    return NextResponse.json({ error: "Failed to get speech token" }, { status: 500 })
  }
}
