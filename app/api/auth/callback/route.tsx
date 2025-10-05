import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // Handle OAuth errors
  if (error) {
    return NextResponse.json(
      {
        error: error,
        description: errorDescription || "Authentication failed",
      },
      { status: 400 },
    )
  }

  if (!code || !state) {
    return NextResponse.json(
      {
        error: "missing_parameters",
        description: "Authorization code or state is missing",
      },
      { status: 400 },
    )
  }

  // Return HTML that sends message to parent window and closes popup
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authentication Successful</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #0a0a0a;
            color: #fff;
          }
          .container {
            text-align: center;
            padding: 2rem;
          }
          .icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1rem;
            border-radius: 50%;
            background: rgba(34, 197, 94, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .checkmark {
            width: 32px;
            height: 32px;
            color: #22c55e;
          }
          h1 {
            font-size: 1.5rem;
            margin: 0 0 0.5rem;
          }
          p {
            color: #a1a1aa;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">
            <svg class="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1>Authentication Successful</h1>
          <p>Exchanging authorization code for access token...</p>
        </div>
        <script>
          (async () => {
            try {
              const response = await fetch('/api/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  code: '${code}',
                  state: '${state}'
                })
              });

              const data = await response.json();

              if (response.ok && data.token) {
                // Store token in session storage
                sessionStorage.setItem('azure_access_token', JSON.stringify({
                  token: data.token,
                  expiresOnTimestamp: data.expiresOnTimestamp
                }));

                // Notify parent window
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'azure-auth-success',
                    token: data.token
                  }, window.location.origin);
                }

                // Close popup after a short delay
                setTimeout(() => window.close(), 1000);
              } else {
                throw new Error(data.error || 'Failed to exchange token');
              }
            } catch (error) {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'azure-auth-error',
                  error: error.message
                }, window.location.origin);
              }
              setTimeout(() => window.close(), 2000);
            }
          })();
        </script>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
