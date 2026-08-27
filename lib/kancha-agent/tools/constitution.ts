import { getConstitutionArticleByNumber, searchConstitution, constitutionArticles } from "../knowledge/constitution-data"
import { getManifestoItemById } from "../knowledge/manifesto-store"

export interface ConstitutionInput {
  articleOrTopic: string
}

export async function executeConstitutionAnalysis(input: ConstitutionInput) {
  const query = input.articleOrTopic.trim()

  const directArticle = getConstitutionArticleByNumber(query)
  if (directArticle) {
    const linkedReforms = directArticle.reformIds.map(id => {
      const item = getManifestoItemById(id)
      return item ? { id: item.id, title: item.title, category: item.category } : { id, title: `Reform #${id}` }
    })

    return {
      found: true,
      article: directArticle.article,
      title: directArticle.title,
      nepaliTitle: directArticle.nepaliTitle,
      summary: directArticle.summary,
      relevanceToReforms: directArticle.relevanceToReforms,
      linkedReforms
    }
  }

  const matches = searchConstitution(query)
  if (matches.length > 0) {
    return {
      found: true,
      query,
      count: matches.length,
      articles: matches.map(a => ({
        article: a.article,
        title: a.title,
        nepaliTitle: a.nepaliTitle,
        summary: a.summary,
        relevanceToReforms: a.relevanceToReforms,
        reformIds: a.reformIds
      }))
    }
  }

  return {
    found: false,
    query,
    message: `No specific constitutional article directly matched "${query}". Constitution of Nepal 2072 provisions include Article 76 (Executive), Articles 238-239 (CIAA), Article 242 (Lok Sewa), Article 274 (Amendments), and Schedules 5-9 (Jurisdictions).`,
    availableArticles: constitutionArticles.map(a => `${a.article}: ${a.title}`)
  }
}
