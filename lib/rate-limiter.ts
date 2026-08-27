/**
 * Simple in-memory rate limiter for API routes
 * Uses sliding window algorithm for accurate rate limiting
 */

interface RateLimitEntry {
  timestamps: number[]
  blocked: boolean
  blockUntil?: number
}

interface RateLimiterConfig {
  windowMs: number      // Time window in milliseconds
  maxRequests: number   // Max requests per window
  blockDurationMs?: number  // How long to block after exceeding limit
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  constructor() {
    // Cleanup old entries every 5 minutes
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000)
    }
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @param config - Rate limit configuration
   * @returns Object with allowed status and metadata
   */
  check(identifier: string, config: RateLimiterConfig): {
    allowed: boolean
    remaining: number
    resetAt: number
    retryAfter?: number
  } {
    const now = Date.now()
    const { windowMs, maxRequests, blockDurationMs = 60000 } = config

    let entry = this.store.get(identifier)

    // Initialize entry if not exists
    if (!entry) {
      entry = { timestamps: [], blocked: false }
      this.store.set(identifier, entry)
    }

    // Check if currently blocked
    if (entry.blocked && entry.blockUntil) {
      if (now < entry.blockUntil) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: entry.blockUntil,
          retryAfter: Math.ceil((entry.blockUntil - now) / 1000)
        }
      }
      // Block period expired, reset
      entry.blocked = false
      entry.blockUntil = undefined
      entry.timestamps = []
    }

    // Filter timestamps within the current window
    const windowStart = now - windowMs
    entry.timestamps = entry.timestamps.filter(ts => ts > windowStart)

    const remaining = maxRequests - entry.timestamps.length

    if (remaining <= 0) {
      // Rate limit exceeded - block the client
      entry.blocked = true
      entry.blockUntil = now + blockDurationMs

      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.blockUntil,
        retryAfter: Math.ceil(blockDurationMs / 1000)
      }
    }

    // Add current request timestamp
    entry.timestamps.push(now)

    return {
      allowed: true,
      remaining: remaining - 1,
      resetAt: now + windowMs
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier)
  }

  /**
   * Cleanup old entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now()
    const maxAge = 10 * 60 * 1000 // 10 minutes

    for (const [key, entry] of this.store.entries()) {
      const latestTimestamp = Math.max(...entry.timestamps, entry.blockUntil ?? 0)
      if (now - latestTimestamp > maxAge) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Destroy the rate limiter and clean up resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.store.clear()
  }
}

// Singleton instance for the application
export const rateLimiter = new RateLimiter()

// Pre-configured rate limit configs
export const RATE_LIMITS = {
  // Chat API - 20 requests per minute per IP
  chat: {
    windowMs: 60 * 1000,
    maxRequests: 20,
    blockDurationMs: 60 * 1000
  },
  // Speech token - 10 requests per minute per IP
  speechToken: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    blockDurationMs: 30 * 1000
  },
  // Auth endpoints - 5 requests per minute per IP (stricter)
  auth: {
    windowMs: 60 * 1000,
    maxRequests: 5,
    blockDurationMs: 120 * 1000
  },
  // General API - 60 requests per minute per IP
  general: {
    windowMs: 60 * 1000,
    maxRequests: 60,
    blockDurationMs: 30 * 1000
  }
} as const

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP.trim()
  }

  // Fallback - in production this should be set by your reverse proxy
  return 'unknown'
}

/**
 * Create rate limit response with proper headers
 */
export function createRateLimitResponse(retryAfter: number, resetAt: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Reset': new Date(resetAt).toISOString()
      }
    }
  )
}
