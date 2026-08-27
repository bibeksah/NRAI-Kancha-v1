"use client"

import { ShieldCheck, Vote, Laptop, Landmark, Sparkles } from "lucide-react"

interface StarterPromptsProps {
  onSelectPrompt: (prompt: string) => void
  language?: "en" | "ne"
}

export function StarterPrompts({ onSelectPrompt, language = "en" }: StarterPromptsProps) {
  const isNe = language === "ne"

  const categories = [
    {
      icon: ShieldCheck,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: isNe ? "अख्तियार र भ्रष्टाचार नियन्त्रण" : "CIAA & Anti-Corruption",
      prompts: isNe
        ? [
            "अख्तियारलाई पूर्ण स्वायत्त बनाउने ५ बुँदे योजना के हो?",
            "सिंगापुरको CPIB जस्तै नेपालमा ८०% मुद्दा जित्न के गर्नुपर्छ?"
          ]
        : [
            "How will making CIAA independent achieve an 80% conviction rate?",
            "What statutory reforms are needed in Phase 1 for asset freezing?"
          ]
    },
    {
      icon: Vote,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
      title: isNe ? "स्थिर सरकार र प्रत्यक्ष निर्वाचन" : "Executive Stability & Elections",
      prompts: isNe
        ? [
            "नेपालमा प्रत्यक्ष निर्वाचित प्रधानमन्त्री व्यवस्था कसरी लागू गर्ने?",
            "१८० दिनभित्र स्वच्छ ताजा निर्वाचन सम्पन्न गर्ने कार्ययोजना के हो?"
          ]
        : [
            "What constitutional amendments are needed for directly elected PM?",
            "How will 24-hour campaign finance transparency eliminate corruption?"
          ]
    },
    {
      icon: Laptop,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: isNe ? "१००% डिजिटल सरकारी सेवा" : "Digital Public Infrastructure",
      prompts: isNe
        ? [
            "सरकारी कार्यालयका लाइन र घुसखोरी अन्त्य गर्न सबै सेवा कसरी अनलाइन लैजाने?",
            "नागरिक एपलाई एकीकृत डिजिटल सार्वजनिक सेवामा कसरी बदल्ने?"
          ]
        : [
            "How will digitizing all citizen services eliminate middleman bribery?",
            "What are the lessons from Estonia's e-Governance for Nepal?"
          ]
    },
    {
      icon: Landmark,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: isNe ? "पारदर्शी ठेक्का र बजेट" : "Public Procurement & Budget",
      prompts: isNe
        ? [
            "विकास आयोजनामा हुने ढिलासुस्ती र बजेट चुहावट कसरी रोकिन्छ?",
            "ठेक्का प्रणालीमा 'Mean-based' प्रतिस्पर्धा किन आवश्यक छ?"
          ]
        : [
            "How will mean-based awarding stop contractor cartels and delayed roads?",
            "How much money can Nepal save annually by plugging procurement leaks?"
          ]
    }
  ]

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 py-6 px-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          {isNe ? "३१ बुँदे नेपाल सुधार एजेन्डा" : "31 Core Nepal Reform Agendas"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {isNe ? "म कान्छा, तपाईंलाई के मद्दत गर्न सक्छु?" : "What reform would you like to explore?"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {isNe
            ? "नेपालको सुशासन, अख्तियार सुधार, स्थिर सरकार, र डिजिटल सेवा सम्बन्धी प्रमाण-आधारित ज्ञान।"
            : "Explore evidence-based blueprints, constitutional articles, and global benchmarks for Nepal."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {categories.map((cat, idx) => {
          const Icon = cat.icon
          return (
            <div
              key={idx}
              className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  {cat.title}
                </h3>
              </div>
              <div className="space-y-1.5">
                {cat.prompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => onSelectPrompt(p)}
                    className="w-full text-left p-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-transparent hover:border-border/60 transition-all cursor-pointer leading-snug"
                  >
                    👉 {p}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
