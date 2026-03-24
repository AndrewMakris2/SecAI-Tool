# SecAI+ Study Platform

A production-quality, AI-powered study platform for the **CompTIA SecAI+** certification. Built with React, Vite, TypeScript, and Tailwind CSS.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **200 Practice Questions** | Hard-coded, scenario-based, domain-tagged questions with detailed explanations |
| 🃏 **100 Flashcards** | Flip-card study with spaced-repetition style status tracking |
| 📖 **12 Study Guides** | Article-style deep dives into every SecAI+ domain |
| 💡 **75 Facts & Tips** | Bite-sized facts, myths, tips, terms, and exam pointers |
| 🤖 **AI Tutor** | Multi-mode AI coach (OpenAI, Anthropic, Groq, OpenRouter) |
| 📊 **Analytics Dashboard** | Score history, domain performance, confidence patterns |
| ⚡ **Exam Pressure Mode** | Timed hard-mode quiz with performance summary |
| 🎯 **Domain Readiness Meter** | Per-domain readiness score based on all study activity |
| 🔁 **Missed Question Recovery** | Auto-builds re-quiz from missed questions |
| 🏆 **Achievements & Badges** | 12 unlockable achievements to motivate study |

---

## 🚀 Quick Start (Local)

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
git clone https://github.com/your-username/secai-study.git
cd secai-study
npm install
npm run dev
```

The app opens at **http://localhost:5173**.

---

## 🌐 Deploy to Netlify

### Option A — Netlify CLI (recommended)

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir dist
```

### Option B — Netlify UI (drag & drop)

1. Run `npm run build` — output goes to `dist/`
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Deploy manually**
3. Drag the `dist/` folder into the upload zone
4. Done — your site is live

### Option C — Git integration (auto-deploy on push)

1. Push the repo to GitHub
2. In Netlify: **Add new site** → **Import from Git** → select the repo
3. Build settings are already in `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy** — every `git push` auto-deploys

> The included `netlify.toml` handles SPA routing (all paths → `index.html`).

---

## 🤖 AI Tutor Setup

The AI Tutor requires an API key from your chosen provider. The key is stored **in your browser's localStorage only** — it is never sent anywhere except directly to the AI provider's API.

### Supported Providers (v1)

| Provider | Status | Notes |
|---|---|---|
| **OpenAI** | ✅ Fully implemented | GPT-4o, GPT-4-turbo, GPT-3.5-turbo |
| **Anthropic** | ✅ Fully implemented | Claude 3.5 Sonnet, Claude 3 Haiku |
| **Groq** | ✅ Fully implemented | Llama 3, Mixtral (very fast, free tier) |
| **OpenRouter** | ✅ Fully implemented | Aggregates 100+ models |
| **Gemini** | 🔜 Stubbed | Ready to implement |

### How to get API keys

- **OpenAI:** https://platform.openai.com/api-keys
- **Anthropic:** https://console.anthropic.com/settings/keys
- **Groq (free):** https://console.groq.com/keys
- **OpenRouter:** https://openrouter.ai/keys

### Entering your key in the app

Go to **Settings → AI Configuration** or the **AI Tutor** page → it prompts you on first visit.

---

## 🔄 Swapping AI Providers

The provider system is modular. Each provider lives in its own file:

```
src/services/
  aiProvider.ts          ← Main dispatcher (reads config, calls right provider)
  providers/
    openai.ts            ← OpenAI implementation
    anthropic.ts         ← Anthropic implementation
    groq.ts              ← Groq implementation
    openrouter.ts        ← OpenRouter implementation
```

To add a new provider (e.g., Gemini):

1. Create `src/services/providers/gemini.ts` following the pattern in `openai.ts`
2. Export a `sendGeminiMessage(messages, apiKey, model)` function
3. In `aiProvider.ts`, add a `case 'gemini':` branch in the `sendAIMessage` dispatcher
4. Add `'gemini'` to the `AIProvider` union type in `src/types/index.ts`
5. Add it to the provider selector in `src/pages/Settings.tsx`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/         # Sidebar, Header, MobileNav, Layout wrapper
│   └── ui/             # Button, Card, Badge, Modal, ProgressBar, Toast, etc.
├── data/
│   ├── questions-part1.ts   # Questions 1-100
│   ├── questions-part2.ts   # Questions 101-200
│   ├── questions.ts         # Barrel combining both
│   ├── flashcards.ts        # 100 flashcards
│   ├── facts.ts             # 75 study facts/tips/myths
│   ├── glossary.ts          # 20 glossary terms
│   └── studyGuides.ts       # 12 study guide sections
├── hooks/
│   ├── useLocalStorage.ts   # Typed localStorage hook
│   ├── useQuiz.ts           # Quiz engine hook
│   └── useTheme.ts          # Theme management hook
├── pages/
│   ├── Landing.tsx          # Marketing/hero page
│   ├── Onboarding.tsx       # First-run setup flow
│   ├── Dashboard.tsx        # Study hub + progress overview
│   ├── Quiz.tsx             # Full quiz engine
│   ├── QuestionBank.tsx     # Browse/filter all 200 questions
│   ├── Flashcards.tsx       # Flip-card study session
│   ├── StudyGuides.tsx      # Article-style learning pages
│   ├── Facts.tsx            # Facts, myths, tips, glossary
│   ├── AITutor.tsx          # AI chat interface
│   ├── Analytics.tsx        # Performance charts & insights
│   └── Settings.tsx         # App config & AI key management
├── services/
│   ├── aiProvider.ts        # Main AI dispatcher
│   └── providers/           # Per-provider implementations
├── store/
│   └── useAppStore.ts       # Zustand store (persisted to localStorage)
├── types/
│   └── index.ts             # All TypeScript interfaces and types
└── utils/
    ├── analytics.ts         # Quiz analytics calculations
    ├── cn.ts                # Tailwind class merging utility
    ├── readiness.ts         # Domain readiness score calculator
    └── storage.ts           # localStorage helpers
```

---

## 🛠️ Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🔒 Security Note

**API keys are stored in browser localStorage.** This is a frontend-only v1 app — there is no backend. This means:

- ✅ Easy to use, no account needed
- ✅ Keys never leave your browser (except to the AI provider directly)
- ⚠️ Any JS running on the page could access localStorage — use a key with **minimal permissions/spend limits**
- ⚠️ Keys are visible in browser DevTools to anyone with physical access

For a production deployment with shared access, see v2 recommendations below.

---

## 🗺️ Suggested v2 Improvements

### Backend & Auth
- Add a Node/Express or Next.js backend
- Supabase or Firebase for auth + cloud sync
- Store API keys server-side (encrypted) instead of localStorage
- User accounts, study groups, leaderboards

### Content
- Admin content editor (add/edit questions, flashcards, guides)
- Markdown-based content management
- Community-contributed questions with review queue
- Notes section (per-question annotations)

### Learning Engine
- Real spaced repetition engine (SM-2 algorithm for flashcards)
- Adaptive quiz engine (adjusts difficulty based on performance)
- Predicted exam readiness score with confidence interval

### AI Enhancements
- Streaming AI responses for better UX
- AI-generated personalized study plans
- Voice input/output for the tutor
- Auto-generated mini quizzes from study guide content

### Analytics
- Export quiz reports as PDF
- Compare performance over time with trend graphs
- Study time tracking (active vs. passive)

---

## 📝 License

MIT — use it, fork it, build on it. Not affiliated with CompTIA.

> This platform contains original practice content inspired by SecAI+ exam objectives. It is not official CompTIA study material and does not reproduce copyrighted exam content.
