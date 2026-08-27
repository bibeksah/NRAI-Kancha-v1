import { type NextRequest, NextResponse } from "next/server"
import { rateLimiter, RATE_LIMITS, getClientIP, createRateLimitResponse } from "@/lib/rate-limiter"

export const runtime = "nodejs"

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  return response
}

export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request)

  // Rate limiting - stricter for token endpoint
  const rateCheck = rateLimiter.check(`speech-token:${clientIP}`, RATE_LIMITS.speechToken)
  if (!rateCheck.allowed) {
    return createRateLimitResponse(rateCheck.retryAfter!, rateCheck.resetAt)
  }

  try {
    const subscriptionKey = process.env.SPEECH_KEY
    const region = process.env.SPEECH_REGION

    if (!subscriptionKey || !region) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Speech service not configured" },
          { status: 500 }
        )
      )
    }

    // Get authorization token from Azure Speech Service
    const tokenResponse = await fetch(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      }
    )

    if (!tokenResponse.ok) {
      throw new Error("Failed to get speech token")
    }

    const token = await tokenResponse.text()

    const response = NextResponse.json({ token, region })
    response.headers.set('X-RateLimit-Remaining', rateCheck.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(rateCheck.resetAt).toISOString())

    return addSecurityHeaders(response)
  } catch (error) {
    console.error("[Speech Token] Error:", error)
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to get speech token" },
        { status: 500 }
      )
    )
  }
}
