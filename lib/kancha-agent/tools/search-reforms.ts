import { searchManifesto, getManifestoItemsByCategory } from "../knowledge/manifesto-store"

export interface SearchReformsInput {
  query: string
  category?: string
  limit?: number
}

export async function executeSearchReforms(input: SearchReformsInput) {
  const limit = Math.min(input.limit || 5, 10)
  
  if (input.category && input.category.trim() !== "") {
    const categoryItems = getManifestoItemsByCategory(input.category)
    if (categoryItems.length > 0) {
      return {
        count: categoryItems.length,
        category: input.category,
        reforms: categoryItems.slice(0, limit).map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          priority: item.priority,
          problemSummary: item.problem.short,
          solutions: item.solution.short,
          timeline: item.timeline
        }))
      }
    }
  }

  const results = searchManifesto(input.query, limit)

  return {
    query: input.query,
    count: results.length,
    reforms: results.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      priority: item.priority,
      problemSummary: item.problem.short,
      solutions: item.solution.short,
      timeline: item.timeline,
      matchReasons: item.matchReasons
    }))
  }
}
