import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code || !state) {
      return NextResponse.json({ error: "Missing code or state" }, { status: 400 })
    }

    const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID
    const clientSecret = process.env.AZURE_CLIENT_SECRET
    const tenantId = process.env.NEXT_PUBLIC_AZURE_TENANT_ID

    if (!clientId || !clientSecret || !tenantId) {
      return NextResponse.json(
        {
          error:
            "Azure OAuth configuration is missing. Please add NEXT_PUBLIC_AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, and NEXT_PUBLIC_AZURE_TENANT_ID environment variables.",
        },
        { status: 500 },
      )
    }

    // Exchange authorization code for access token
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: `${request.nextUrl.origin}/auth/callback`,
      grant_type: "authorization_code",
      scope: "https://ai.azure.com/.default openid profile email",
    })

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Token exchange error:", errorData)
      return NextResponse.json(
        {
          error: errorData.error_description || "Failed to exchange authorization code for token",
        },
        { status: response.status },
      )
    }

    const tokenData = await response.json()

    return NextResponse.json({
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type,
    })
  } catch (error) {
    console.error("[v0] Token exchange error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to exchange token",
      },
      { status: 500 },
    )
  }
}
