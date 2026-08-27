import { getManifestoItemById } from "../knowledge/manifesto-store"

export interface ReformDetailsInput {
  reformId: string
}

export async function executeReformDetails(input: ReformDetailsInput) {
  const item = getManifestoItemById(input.reformId)

  if (!item) {
    return {
      found: false,
      error: `No reform found with ID ${input.reformId}. Please use search_reforms to discover valid IDs (1 to 31).`
    }
  }

  return {
    found: true,
    id: item.id,
    title: item.title,
    category: item.category,
    priority: item.priority,
    timeline: item.timeline,
    legalFoundation: item.legalFoundation || "Statutory regulation & Constitution of Nepal 2072",
    problem: {
      summary: item.problem.short,
      deepDive: item.problem.long
    },
    solution: {
      highlights: item.solution.short,
      phases: item.solution.long.phases
    },
    realWorldEvidence: item.realWorldEvidence,
    implementationRoadmap: item.implementation,
    performanceTargets: item.performanceTargets
  }
}
