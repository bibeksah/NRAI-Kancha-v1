import { z } from 'zod'

/**
 * Validation schemas for API requests
 */

// Maximum message length (prevents excessively large payloads)
const MAX_MESSAGE_LENGTH = 10000

// Thread ID format (Azure OpenAI thread IDs)
const THREAD_ID_REGEX = /^thread_[a-zA-Z0-9]+$/

/**
 * Chat message request schema
 */
export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(MAX_MESSAGE_LENGTH, `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`)
    .transform(val => val.trim()),
  threadId: z
    .string()
    .regex(THREAD_ID_REGEX, 'Invalid thread ID format')
    .optional()
    .nullable()
})

/**
 * Thread ID query parameter schema
 */
export const threadIdSchema = z
  .string()
  .regex(THREAD_ID_REGEX, 'Invalid thread ID format')

/**
 * OAuth token request schema
 */
export const oauthTokenSchema = z.object({
  code: z
    .string()
    .min(1, 'Authorization code is required')
    .max(2048, 'Authorization code too long'),
  state: z
    .string()
    .min(1, 'State parameter is required')
    .max(256, 'State parameter too long')
})

/**
 * Message schema for localStorage validation
 */
export const storedMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.string().or(z.date()),
  error: z.boolean().optional()
})

export const storedMessagesSchema = z.array(storedMessageSchema)

/**
 * Language preference schema
 */
export const languageSchema = z.enum(['en', 'ne'])

/**
 * Sanitize user input to prevent XSS and injection attacks
 * This is a basic sanitizer - DOMPurify is used for rendering
 */
export function sanitizeInput(input: string): string {
  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Limit consecutive whitespace
    .replace(/\s{10,}/g, ' '.repeat(10))
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
}

/**
 * Validate and parse JSON safely
 */
export function safeParseJSON<T>(
  json: string,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(json)
    const result = schema.safeParse(parsed)

    if (result.success) {
      return { success: true, data: result.data }
    }

    return {
      success: false,
      error: result.error.issues.map((e: { message: string }) => e.message).join(', ')
    }
  } catch {
    return { success: false, error: 'Invalid JSON format' }
  }
}

/**
 * Type exports for use in components
 */
export type ChatRequest = z.infer<typeof chatRequestSchema>
export type StoredMessage = z.infer<typeof storedMessageSchema>
export type Language = z.infer<typeof languageSchema>
