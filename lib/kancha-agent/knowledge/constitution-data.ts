export interface ConstitutionArticle {
  article: string
  title: string
  nepaliTitle: string
  summary: string
  relevanceToReforms: string
  reformIds: string[]
}

export const constitutionArticles: ConstitutionArticle[] = [
  {
    article: "Article 76",
    title: "Constitution of Council of Ministers (Government Formation)",
    nepaliTitle: "मन्त्रीपरिषदको गठन",
    summary: "Governs appointment of the Prime Minister across sub-clauses (1) majority party, (2) coalition majority, (3) largest single party leader, (5) any individual MP who can show majority, and (7) dissolution of House of Representatives if no government can be formed.",
    relevanceToReforms: "Central to parliamentary stability. Frequent government collapses occur under coalition bargaining (76(2)/(3)). Reform #2 & #6 propose direct election of Chief Executives or fixed legislative terms to avoid opportunistic horse-trading.",
    reformIds: ["2", "6", "19"]
  },
  {
    article: "Article 238 & 239",
    title: "Commission for the Investigation of Abuse of Authority (CIAA)",
    nepaliTitle: "अख्तियार दुरुपयोग अनुसन्धान आयोग",
    summary: "Establishes CIAA as the constitutional body for investigating corruption and improper conduct of public officials, submitting reports to President.",
    relevanceToReforms: "Current CIAA jurisdiction was weakened in 2015 by removing 'improper conduct' (अनुचित कार्य) and cabinet policy decisions. Reform #1 calls for constitutional amendment to restore improper conduct jurisdiction, autonomous budget directly from consolidated fund, and direct independent prosecution powers.",
    reformIds: ["1", "4"]
  },
  {
    article: "Article 242",
    title: "Public Service Commission (Lok Sewa Aayog)",
    nepaliTitle: "लोक सेवा आयोग",
    summary: "Conducts competitive examinations for civil service recruitment and advises government on civil service conditions and appointments.",
    relevanceToReforms: "Civil service depoliticization (Reform #3). Meritocratic performance ratings, digitization of recruitment, and elimination of political trade unions.",
    reformIds: ["3", "5"]
  },
  {
    article: "Article 274",
    title: "Amendment of the Constitution",
    nepaliTitle: "संविधान संशोधन",
    summary: "Requires a two-thirds majority in both House of Representatives and National Assembly. If altering provincial boundaries or Schedule 6 powers, requires majority consent of concerned provincial assemblies.",
    relevanceToReforms: "Defines the roadmap for Phase 2 reforms (directly elected executive, CIAA budget entrenchment, electoral threshold changes).",
    reformIds: ["1", "6", "19", "20"]
  },
  {
    article: "Schedules 5 to 9",
    title: "Federal, Provincial, and Local Lists of Exclusive & Concurrent Powers",
    nepaliTitle: "संघ, प्रदेश र स्थानीय तहका अधिकार सूचीहरू",
    summary: "Schedule 5 (Federal powers), Schedule 6 (Provincial powers), Schedule 7 (Federal-Provincial concurrent), Schedule 8 (Local powers), Schedule 9 (Three-tier concurrent).",
    relevanceToReforms: "Fiscal Federalism (Reform #3 & #27). Ensuring local governments receive direct block grants and autonomous expenditure authority without Kathmandu bottlenecking.",
    reformIds: ["3", "27"]
  },
  {
    article: "Article 27",
    title: "Right to Information (RTI)",
    nepaliTitle: "सूचनाको हक",
    summary: "Every citizen has the right to demand and receive information on any matter of public importance or personal interest.",
    relevanceToReforms: "Public Procurement Transparency (Reform #8) & Open Data (Reform #27). Mandatory automated proactive disclosure of all government contracts, tenders, and budget allocations.",
    reformIds: ["7", "8", "27"]
  }
]

export function getConstitutionArticleByNumber(art: string): ConstitutionArticle | undefined {
  const clean = art.replace(/\D/g, "")
  return constitutionArticles.find(a => a.article.includes(clean))
}

export function searchConstitution(query: string): ConstitutionArticle[] {
  const q = query.toLowerCase()
  return constitutionArticles.filter(a => 
    a.article.toLowerCase().includes(q) ||
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.relevanceToReforms.toLowerCase().includes(q)
  )
}
