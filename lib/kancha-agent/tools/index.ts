import { executeSearchReforms, type SearchReformsInput } from "./search-reforms"
import { executeReformDetails, type ReformDetailsInput } from "./reform-details"
import { executeComparativeEvidence, type ComparativeEvidenceInput } from "./comparative"
import { executeConstitutionAnalysis, type ConstitutionInput } from "./constitution"
import { executeImpactCalc, type ImpactCalcInput } from "./impact-calc"

export const KANCHA_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "search_reforms",
      description: "Search across the 31 official Nepal Reform proposals by keywords, problem statements, solutions, or category (e.g. Anti-Corruption, Governance, Economy, Digital, Education, Tourism, Foreign Policy).",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query or keyword (e.g. 'CIAA', 'elections', 'civil service', 'corruption', 'procurement', 'health', 'education', 'foreign policy', 'tourism')"
          },
          category: {
            type: "string",
            description: "Optional specific category filter (e.g. 'Anti-Corruption', 'Governance', 'Digital Services', 'Foreign Policy', 'Tourism Development')"
          },
          limit: {
            type: "number",
            description: "Max results to return (1-10, default 5)"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_reform_details",
      description: "Retrieve comprehensive details for a specific Nepal Reform proposal by ID (1 to 31), including detailed problem analysis, phased implementation solutions (Phase 1 Statutory, Phase 2 Constitutional), real-world evidence, and performance targets.",
      parameters: {
        type: "object",
        properties: {
          reformId: {
            type: "string",
            description: "The ID of the reform to look up (e.g. '1', '2', '6', '7', '8')"
          }
        },
        required: ["reformId"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "get_comparative_evidence",
      description: "Search international benchmarks and real-world case studies (e.g. Singapore CPIB, Hong Kong ICAC, Estonia e-Residency, Indonesia KPK, South Korea, Chile, Canada) relevant to Nepal's reforms.",
      parameters: {
        type: "object",
        properties: {
          countryOrTopic: {
            type: "string",
            description: "Country name or reform topic to search evidence for (e.g. 'Singapore', 'Hong Kong', 'Estonia', 'anti-corruption', 'procurement')"
          },
          reformId: {
            type: "string",
            description: "Optional reform ID to pull comparative evidence for"
          }
        }
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "analyze_constitutional_impact",
      description: "Query and cross-reference articles from the Constitution of Nepal 2072 (e.g. Article 76 for Cabinet formation, Articles 238-239 for CIAA, Article 242 for Lok Sewa, Article 274 for Amendments, Schedules 5-9 for Federalism) and their implications on governance reforms.",
      parameters: {
        type: "object",
        properties: {
          articleOrTopic: {
            type: "string",
            description: "Article number or constitutional topic (e.g. 'Article 76', 'Article 238', 'Article 274', 'prime minister appointment', 'budget independence', 'federalism')"
          }
        },
        required: ["articleOrTopic"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "calculate_reform_impact",
      description: "Calculate quantifiable projections for fiscal savings, administrative delay reduction, and governance performance targets for proposed reforms.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "Topic or area to calculate impact for (e.g. 'corruption', 'procurement leaks', 'digital services', 'government stability')"
          },
          reformId: {
            type: "string",
            description: "Optional specific reform ID"
          }
        },
        required: ["topic"]
      }
    }
  }
]

export async function executeAgentTool(name: string, args: Record<string, any>): Promise<any> {
  try {
    switch (name) {
      case "search_reforms":
        return await executeSearchReforms(args as SearchReformsInput)
      case "get_reform_details":
        return await executeReformDetails(args as ReformDetailsInput)
      case "get_comparative_evidence":
        return await executeComparativeEvidence(args as ComparativeEvidenceInput)
      case "analyze_constitutional_impact":
        return await executeConstitutionAnalysis(args as ConstitutionInput)
      case "calculate_reform_impact":
        return await executeImpactCalc(args as ImpactCalcInput)
      default:
        return { error: `Tool ${name} not recognized` }
    }
  } catch (error) {
    return {
      error: `Failed to execute tool ${name}: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}
