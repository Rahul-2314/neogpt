<div align="center">

<img src="frontend/src/assets/logo_neogpt.png" alt="NeoGPT Logo" width="90" height="90" />

# NeoGPT

### AI That Speaks You —

**Culturally intelligent · 35+ Indian languages · Zero translation**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-neogpt--blue.vercel.app-22C55E?style=flat-square&logo=vercel&logoColor=white)](https://neogpt-blue.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://neogpt-1.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/Rahul-2314/neogpt?style=flat-square&color=22C55E)](https://github.com/Rahul-2314/neogpt/stargazers)

</div>

---

## What is NeoGPT?

NeoGPT is a multilingual AI chatbot built for India's linguistic diversity. It understands how people actually speak — Hinglish, Tanglish, Banglish, code-mixed conversations — without needing translation. Built as a college project by [Rahul Chowdhury](https://github.com/Rahul-2314).

```
User: "Yaar, aaj market mein kya hua? TCS ke baare mein bata."
Neo:  "TCS aaj ₹3,842 pe close hua — 1.2% ki badhot ke saath 🚀"
```

---

## Repository Structure

```
neogpt/
├── frontend/          # React + Vite web app  →  Vercel
├── backend/neogpt/    # Express + Node.js API →  Render
└── extension/         # Chrome MV3 extension  →  Chrome Web Store
```

---

## Features

| Feature | Status |
|---|---|
| 35+ Indian languages + code-mixed dialects | ✅ Live |
| Real-time web search via Tavily | ✅ Live |
| Persistent threads with shareable URLs | ✅ Live |
| Redis thread cache — <50ms resume | ✅ Live |
| Dual-LLM fallback with exponential backoff | ✅ Live |
| Emotion-aware, tone-matching responses | ✅ Live |
| Token usage tracking + plan limits | ✅ Live |
| JWT auth with per-user API keys | ✅ Live |
| Chrome extension — summarize any webpage | ✅ Live |
| Context-aware chat inside extension | ✅ Live |
| Voice AI (regional accents) | 🔜 Roadmap |
| RAG document Q&A | 🔜 Roadmap |
| WhatsApp / Telegram integration | 🔜 Roadmap |

---

## Tech Stack

**Frontend** — React 18, Vite, Tailwind CSS, Framer Motion, React Router

**Backend** — Node.js, Express, MongoDB Atlas, Redis (ioredis), Groq SDK, Tavily

**AI / Inference** — Groq (`openai/gpt-oss-20b` primary, `llama-3.3-70b-versatile` fallback)

**Auth** — JWT, bcrypt, UUID-based API keys

**Infra** — Vercel (frontend), Render (backend), MongoDB Atlas, Upstash Redis

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (free tier works)
- Redis instance — [Upstash](https://upstash.com) free tier recommended
- [Groq API key](https://console.groq.com)
- [Tavily API key](https://tavily.com)

---

## Frontend — `frontend/`

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev        # dev server at localhost:5173
npm run build      # production build → dist/
```

**Deploy to Vercel:**

```bash
vercel --prod
# set VITE_API_BASE_URL=https://your-render-url.onrender.com
```

### Frontend Structure

```
frontend/src/
├── pages/
│   ├── LandingPage.jsx          # marketing page
│   ├── AuthPage.jsx             # login / signup
│   └── ChatPage.jsx             # main chat UI
├── pages/landing/
│   ├── constants.js             # all data, pricing, CHAT_DEMO
│   ├── ChatPreview.jsx          # looping live demo widget
│   ├── HeroSection.jsx          # navbar + hero + particles
│   └── ProductSections.jsx      # features, business, pricing
├── components/
│   ├── Navbar.jsx               # top nav with token usage bar
│   ├── ChatSidebar.jsx          # thread list, mobile drawer
│   ├── ChatContainer.jsx        # message bubbles
│   ├── InputBox.jsx             # textarea with send button
│   └── LanguageSelect.jsx       # 35 language dropdown
└── api/
    ├── apiClient.js             # axios + 401 interceptor
    └── authAPI.js               # login, register, chat history
```

---

## Backend — `backend/neogpt/`

```bash
cd backend/neogpt
npm install
```

Create `backend/neogpt/.env`:

```env
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/neogpt
REDIS_URL=rediss://your-upstash-url:6379
JWT_SECRET=your_jwt_secret
```

```bash
node server.js      # starts on port 5000
```

**Deploy to Render:**
- Build command: `npm install`
- Start command: `node server.js`
- Add all env vars in Render dashboard

### Backend Structure

```
backend/neogpt/
├── server.js                    # Express app, CORS, route registration
├── chatbot.js                   # generate() — LLM + tool call loop
├── models/
│   ├── chat.js                  # Chat schema (username, threadId, messages[])
│   └── ...
├── routes/
│   ├── ChatRoutes.js            # POST /chat · GET /history · GET /:threadId
│   └── summarizeRoutes.js       # POST /summarize (for extension)
├── Auth/
│   ├── config.js                # PLAN_LIMITS — free/pro/premium/premium+
│   ├── models/User.js           # User schema with plan + token tracking
│   ├── middlewares/
│   │   ├── User.js              # JWT verify middleware
│   │   └── TokenLimit.js        # monthly quota check + auto-reset
│   └── routes/UserRoutes.js     # register, login, profile, plan update
└── utils/
    └── multerConfig.js          # file upload config
```

### API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/user/register` | — | Create account |
| `POST` | `/user/login` | — | Returns JWT |
| `GET` | `/user/` | JWT | Get current user |
| `PUT` | `/user/language` | JWT | Update language preference |
| `POST` | `/chat` | JWT | Send message, get AI reply |
| `GET` | `/chat/history` | JWT | All threads for user |
| `GET` | `/chat/:threadId` | JWT | Messages in a thread |
| `POST` | `/summarize` | JWT | Summarize webpage (extension) |

### Token Plans

| Plan | Monthly tokens | Price |
|---|---|---|
| Free | 50,000 | ₹0 |
| Pro | 500,000 | ₹250/mo |
| Premium | 2,000,000 | ₹700/mo |
| Premium+ | Unlimited | ₹1,200/mo |

Tokens reset on the 1st of each month. Counter increments from `completion.usage.total_tokens` after every Groq call.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq inference API |
| `TAVILY_API_KEY` | ✅ | Real-time web search |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `REDIS_URL` | ✅ | Redis for 24h thread cache |
| `JWT_SECRET` | ✅ | Token signing secret |
| `PORT` | — | Default: 5000 |

---

## Chrome Extension — `extension/`

The NeoGPT extension lets you summarize any webpage, ask questions about its content, and get AI-powered explanations of selected text — all powered by the same backend.

### Load in Chrome (dev mode)

```bash
cd extension
# no build step required — pure MV3
```

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Open the extension popup → Settings → paste your NeoGPT JWT token

### Extension Structure

```
extension/
├── manifest.json        # MV3 manifest
├── background.js        # service worker — message hub, API calls, 1h cache
├── content.js           # DOM extraction, scroll-to-section, highlight, toolbar
└── popup/
    ├── popup.html       # entry point
    ├── App.jsx          # tab shell — Summary / Chat / Settings
    ├── views/
    │   ├── SummaryView.jsx   # TLDR + key points + section cards
    │   ├── ChatView.jsx      # context-aware chat with selection actions
    │   └── SettingsView.jsx  # token, language, cache controls
    └── components/
        ├── SectionCard.jsx   # clickable section with scroll-on-click
        └── ChatBubble.jsx    # message bubble with markdown
```

### Extension Features

- **Summarize page** — extracts headings + content, sends to `/summarize`, returns TLDR + bullet points + section summaries
- **Section navigation** — click any section card → smoothly scrolls to + highlights the DOM element (yellow fade, 2s)
- **Context-aware chat** — ask questions about the full page or a highlighted selection
- **Floating toolbar** — select any text on the page → mini toolbar appears with Summarize / Explain / Translate
- **1h cache** — summaries cached by URL in `chrome.storage.local` to avoid repeat API calls
- **Language toggle** — English, Hindi, Hinglish, Tamil, Bengali and more

### Setting up the token

After logging in to [neogpt-blue.vercel.app](https://neogpt-blue.vercel.app):

1. Open DevTools → Application → Local Storage
2. Copy the value of `authToken`
3. Paste it into the extension Settings tab

> The extension uses the same `/chat` and `/summarize` endpoints as the web app, so your token quota is shared.

---

## Architecture Overview

```
Browser / Extension
        │
        ▼
  Express API (Render)
        │
   ┌────┼────┐
   │         │
JWT       Rate limit
verify    (20 req/min)
   │         │
   └────┬────┘
        │
   Token quota
   (plan check)
        │
   generate() — chatbot.js
        │
   ┌────┼────────────┐
   │                 │
Redis cache      MongoDB fallback
(24h TTL)        (thread restore)
   │
Groq LLM call
   │
tool_calls? ──yes──▶ Tavily search ──▶ second LLM pass
   │no
   ▼
save to Redis + MongoDB
increment tokensUsed
return { reply, tokensUsed }
```

**Model fallback order** (on rate limit / error):
1. `openai/gpt-oss-20b` — primary
2. `llama-3.1-8b-instant` — fast fallback
3. `openai/gpt-oss-120b` — heavy fallback
4. `llama-3.3-70b-versatile` — final fallback

Each model gets 3 attempts with exponential backoff (2s → 5s → 10s) on 429s before switching.

---

## Local Development — Full Stack

```bash
# terminal 1 — backend
cd backend/neogpt
cp .env.example .env   # fill in your keys
node server.js

# terminal 2 — frontend
cd frontend
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
npm run dev

# extension — load unpacked from extension/ in chrome://extensions
```

---

## Contributing

```bash
# fork → clone → branch
git checkout -b feature/your-feature

# make changes, then
git commit -m "feat: your feature description"
git push origin feature/your-feature
# open a PR
```

---

## Roadmap

- [ ] Voice AI — regional accent synthesis (Tamil, Bengali, Marathi)
- [ ] RAG — upload PDFs, get answers in your language
- [ ] Thread forking — clone and branch conversations
- [ ] WhatsApp / Telegram integration
- [ ] Adaptive learning — remember your slang over time
- [ ] Mobile app (React Native)

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

Built with ❤️ by [Rahul Chowdhury](https://github.com/Rahul-2314) · UEM Jaipur

[Live Demo](https://neogpt-blue.vercel.app) · [Report Bug](https://github.com/Rahul-2314/neogpt/issues) · [Request Feature](https://github.com/Rahul-2314/neogpt/issues)

</div>
