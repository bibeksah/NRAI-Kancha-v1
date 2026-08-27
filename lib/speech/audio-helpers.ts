/**
 * Strips markdown and special characters to ensure crisp and natural text-to-speech synthesis
 */
export function stripMarkdownForSpeech(text: string): string {
  if (!text) return ""

  return text
    // Remove reasoning or think tags
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove headers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold and italics
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    // Remove blockquotes and hr
    .replace(/^>\s+/gm, "")
    .replace(/^[-*_]{3,}$/gm, "")
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // Remove emojis that may cause synthesis stutter
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    // Normalize whitespace
    .replace(/\n{2,}/g, ". ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Detects if text contains primarily Nepali Devanagari characters
 */
export function isNepaliText(text: string): boolean {
  if (!text) return false
  const devanagariPattern = /[\u0900-\u097F]/
  return devanagariPattern.test(text)
}
