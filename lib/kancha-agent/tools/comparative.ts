import { manifestoData, getManifestoItemById } from "../knowledge/manifesto-store"

export interface ComparativeEvidenceInput {
  countryOrTopic?: string
  reformId?: string
}

export async function executeComparativeEvidence(input: ComparativeEvidenceInput) {
  if (input.reformId) {
    const item = getManifestoItemById(input.reformId)
    if (item) {
      return {
        reformId: item.id,
        reformTitle: item.title,
        evidence: item.realWorldEvidence
      }
    }
  }

  const query = (input.countryOrTopic || "").toLowerCase()
  const matches: Array<{
    reformId: string
    reformTitle: string
    country: string
    details: string
    impact: string
  }> = []

  manifestoData.forEach(item => {
    item.realWorldEvidence.long.forEach(ev => {
      if (
        !query ||
        ev.country.toLowerCase().includes(query) ||
        ev.details.toLowerCase().includes(query) ||
        ev.impact.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query)
      ) {
        matches.push({
          reformId: item.id,
          reformTitle: item.title,
          country: ev.country,
          details: ev.details,
          impact: ev.impact
        })
      }
    })
  })

  return {
    query: input.countryOrTopic,
    count: matches.length,
    matches: matches.slice(0, 8)
  }
}
