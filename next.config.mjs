/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: '.',
  },
  images: {
    unoptimized: true,
  },
  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // X-Frame-Options removed - using CSP frame-ancestors instead for more flexibility
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.openai.azure.com https://*.api.cognitive.microsoft.com https://*.cognitiveservices.azure.com wss://*.stt.speech.microsoft.com wss://*.tts.speech.microsoft.com https://va.vercel-scripts.com",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-ancestors 'self' https://nepalreforms.com https://www.nepalreforms.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          }
        ]
      },
      {
        // Stricter headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ]
  },
  // Optimize for production
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
}

export default nextConfig
