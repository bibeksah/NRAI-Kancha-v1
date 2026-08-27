import { searchManifesto, getManifestoItemById } from "./knowledge/manifesto-store"
import { searchConstitution } from "./knowledge/constitution-data"
import { executeImpactCalc } from "./tools/impact-calc"

export interface FallbackAgentResponse {
  reasoning: string
  content: string
  toolCalls: Array<{ tool: string; input: any; result: any }>
  suggestedQuestions: string[]
}

export async function generateLocalFallbackResponse(
  query: string,
  lang: "en" | "ne" = "en"
): Promise<FallbackAgentResponse> {
  const isNe = lang === "ne" || /[\u0900-\u097F]/.test(query)
  const qLower = query.toLowerCase()

  // 1. Tool execution locally
  const matchedReforms = searchManifesto(query, 3)
  const matchedConstitution = searchConstitution(query)
  const impactData = await executeImpactCalc({ topic: query })

  const topReform = matchedReforms[0]
  const toolCalls = [
    {
      tool: "search_reforms",
      input: { query, limit: 3 },
      result: { count: matchedReforms.length, reforms: matchedReforms.map(r => ({ id: r.id, title: r.title })) }
    }
  ]

  let reasoning = isNe
    ? `१. प्रयोगकर्ताको प्रश्न: "${query}" लाई विश्लेषण गरियो।\n२. नेपाल सुधारको ३१ बुँदे घोषणापत्र र नेपालको संविधान २०७२ बाट सम्बन्धित सुधार तथा प्रमाणहरू संकलन गरियो।\n३. प्राथमिकता प्राप्त सुधार: #${topReform ? topReform.id : '1'} को कार्ययोजना र अन्तर्राष्ट्रिय अभ्यासहरू समावेश गरी उत्तर तयार पारियो।`
    : `1. Analyzed user query: "${query}"\n2. Executed local semantic retrieval across all 31 Nepal Reform blueprints and Constitution 2072 provisions.\n3. Identified primary matching reform: #${topReform ? topReform.id : '1'} with implementation roadmap and global evidence.`

  let content = ""

  if (topReform) {
    if (isNe) {
      content = `### 🇳🇵 नेपाल सुधार एजेन्डा: [Reform #${topReform.id}: ${topReform.title}]

**समस्याको संक्षेप:**
${topReform.problem.short}

---

### 🛠️ मुख्य समाधानका चरणहरू:
${topReform.solution.short.map((s, idx) => `${idx + 1}. **${s}**`).join("\n")}

---

### 🌍 अन्तर्राष्ट्रिय सफल अभ्यासहरू (Global Evidence):
${topReform.realWorldEvidence.short.map(e => `* 🌐 ${e}`).join("\n")}

---

### ⏱️ कार्यान्वयन समयसीमा र लक्ष्य:
* **समयसीमा:** ${topReform.timeline} (प्राथमिकता: **${topReform.priority}**)
* **लक्ष्य:** ${topReform.performanceTargets.slice(0, 2).join(", ")}

> 💡 *यो जवाफ नेपाल सुधार ज्ञान भण्डारबाट तयार गरिएको हो। थप गहिरो विश्लेषणका लागि DeepSeek API Key सक्रिय गर्नुहोस्।*`
    } else {
      content = `### 🇳🇵 Nepal Reform Blueprint: [Reform #${topReform.id}: ${topReform.title}]

**Problem Overview:**
${topReform.problem.short}

---

### 🛠️ Phased Reform Solutions:
${topReform.solution.short.map((s, idx) => `${idx + 1}. **${s}**`).join("\n")}

---

### 🌍 Real-World Comparative Evidence:
${topReform.realWorldEvidence.short.map(e => `* 🌐 ${e}`).join("\n")}

---

### ⏱️ Implementation Timeline & Key Targets:
* **Timeline:** ${topReform.timeline} (Priority: **${topReform.priority}**)
* **Performance Targets:** ${topReform.performanceTargets.slice(0, 3).join("; ")}
* **Legal / Constitutional Anchor:** ${topReform.legalFoundation || "Constitution of Nepal 2072"}

> 💡 *Grounded in the official Nepal Reforms Knowledge Base. DeepSeek reasoning engine available once API key is provided.*`
    }
  } else {
    if (isNe) {
      content = `नमस्ते! म **कान्छा (NRAI Kancha)** हुँ, नेपाल सुधार (Nepal Reforms) को एआई सहायक।

तपाईंले नेपालको **३१ बुँदे सुधार योजना**, अख्तियार दुरुपयोग नियन्त्रण, प्रत्यक्ष निर्वाचित कार्यकारी, डिजिटल सार्वजनिक सेवा, शिक्षा-स्वास्थ्य सुधार, परराष्ट्र नीति वा पर्यटन विकासका बारेमा कुनै पनि प्रश्न सोध्न सक्नुहुन्छ।

कृपया तल दिइएका उदाहरण प्रश्नहरूबाट सुरु गर्नुहोस् वा आफ्नो प्रश्न टाइप गर्नुहोस्!`
    } else {
      content = `Namaste! I am **NRAI Kancha**, your dedicated AI Civic Agent for **Nepal Reforms** (nepalreforms.com).

I can answer questions regarding any of Nepal's **31 Core Governance Reforms**, including CIAA independence, direct executive elections, civil service meritocracy, transparent procurement, foreign policy, and tourism modernization.

Ask me a specific question or choose from the suggested prompts below!`
    }
  }

  const suggestedQuestions = isNe
    ? [
        "अख्तियारलाई पूर्ण स्वायत्त कसरी बनाउन सकिन्छ?",
        "नेपालमा प्रत्यक्ष निर्वाचित प्रधानमन्त्री व्यवस्था कसरी लागू गर्ने?",
        "सरकारी सेवाहरूलाई १००% डिजिटल बनाउन के गर्नुपर्छ?"
      ]
    : [
        "How will the CIAA reform achieve an 80% conviction rate?",
        "What are the constitutional steps for directly elected PM?",
        "How will electronic procurement prevent contractor cartels?"
      ]

  return {
    reasoning,
    content,
    toolCalls,
    suggestedQuestions
  }
}
