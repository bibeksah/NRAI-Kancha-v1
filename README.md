# 🇳🇵 NRAI Kancha (कान्छा) — Autonomous AI Civic Agent

**NRAI Kancha** is the official AI Civic Agent for [Nepal Reforms](https://nepalreforms.com), powered by **DeepSeek AI** (`deepseek-v4-flash`). It provides grounded, evidence-based, and non-partisan intelligence on Nepal's 27 Transformative Reform proposals, the Constitution of Nepal 2072, comparative global case studies, and budget accountability.

---

## 🌟 Key Features

- **⚡ DeepSeek AI Autonomous Engine**: Native streaming agent loop with `deepseek-v4-flash`, multi-turn function calling, and deep reasoning traces.
- **🧠 27 Reform Dossiers & Knowledge Base**: Complete structured implementation blueprints, problem analyses, phased solutions (Phase 1 Statutory & Phase 2 Constitutional), and performance targets.
- **⚖️ Constitutional Grounding**: Built-in analysis of the Constitution of Nepal 2072 (Article 76, Articles 238–239, Article 242, Article 274, Schedules 5–9).
- **🛠️ Autonomous Agent Tools**:
  - `search_reforms`: Keyword & semantic discovery across all 27 reforms.
  - `get_reform_details`: Complete phased implementation roadmaps.
  - `get_comparative_evidence`: Global benchmarks (Singapore CPIB, Hong Kong ICAC, Estonia e-Gov, Indonesia KPK).
  - `analyze_constitutional_impact`: Constitutional amendments and legal checks.
  - `calculate_reform_impact`: Fiscal savings, procurement leak reduction, and timeline projections.
- **🎙️ Bilingual Voice Support (STT & TTS)**:
  - Speech-to-Text with automatic language detection between **Nepali (नेपाली)** and **English**.
  - Text-to-Speech audio playback with live animated waveforms and browser Web Speech API fallback + Azure Speech Services.
- **🎨 Civic UI / UX**: Anti-slop design adhering to the Nepal Pine Emerald & Himalayan Slate palette, interactive citation modals, and multi-session local chat history.
- **📱 Embeddable Widget (`/embed`)**: Clean iframe-ready layout for embedding across `nepalreforms.com` or external civic platforms.

---

## 🚀 Quick Start

### 1. Install Dependencies (Always use Bun)

```bash
bun install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
# 🤖 DeepSeek AI Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash

# 🎙️ Azure Speech Services (Optional)
SPEECH_REGION=swedencentral
SPEECH_KEY=your_speech_key_here
NEXT_PUBLIC_SPEECH_REGION=swedencentral
NEXT_PUBLIC_SPEECH_KEY=your_speech_key_here
```

### 3. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Architecture Overview

```
NRAI-Kancha-v1/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Streaming DeepSeek Agent SSE endpoint
│   │   ├── health/route.ts      # Agent health and model status
│   │   └── speech-token/route.ts # Azure speech authorization
│   ├── embed/page.tsx           # Embeddable widget view
│   ├── globals.css              # Design tokens and styling
│   └── page.tsx                 # Main application page
├── components/
│   └── kancha/
│       ├── chat-container.tsx   # Master chat orchestrator
│       ├── chat-header.tsx      # Top bar, model pill & language toggle
│       ├── chat-sidebar.tsx     # Chat history & reform shortcuts
│       ├── chat-input.tsx       # Textarea & mic voice input
│       ├── message-item.tsx     # Message bubbles & action bar
│       ├── message-reasoning.tsx # Collapsible thought process viewer
│       ├── reform-badge.tsx     # Interactive reform citation modal
│       ├── starter-prompts.tsx  # Categorized starter questions
│       └── settings-modal.tsx   # API key and model configuration
└── lib/
    ├── kancha-agent/
    │   ├── agent.ts             # Multi-step autonomous agent loop
    │   ├── deepseek-client.ts   # DeepSeek API streaming client
    │   ├── prompts.ts           # Persona and system prompts
    │   ├── knowledge/           # 27 Reforms and Constitutional datasets
    │   └── tools/               # Autonomous agent tool implementations
    ├── speech/                  # STT / TTS dual engine
    └── storage/                 # Multi-chat local storage manager
```

---

## 🛠️ Build & Verification

```bash
bun run build
```

---

## 📜 License

MIT License — Built for the People of Nepal by [Nepal Reforms](https://nepalreforms.com).
