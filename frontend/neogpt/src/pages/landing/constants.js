export const G  = "#22C55E";
export const G2 = "34,197,94";

export const LANGUAGES = [
  "Hindi","Tamil","Bengali","Marwari","Telugu","Gujarati","Punjabi","Marathi",
  "Urdu","Odia","Malayalam","Kannada","Bhojpuri","Awadhi","Hinglish","Banglish",
  "Tanglish","Dogri","Maithili","Santali","Konkani","Bodo","Sindhi","Nepali",
];

export const CHAT_DEMO = [
  { role: "user", text: "Yaar, kya aaj market me kuch naya hua?" },
  { role: "ai",   text: "Haan! Aaj Nifty 0.8% upar gaya. Tech stocks mein bhi achi movement thi. Koi specific stock ke baare mein jaanna hai?" },
  { role: "user", text: "TCS ke baare mein bata" },
  { role: "ai",   text: "TCS aaj ₹3,842 pe close hua — 1.2% ki badhot ke saath. Q3 results strong the 🚀" },
  { role: "user", text: "Ek Marwari poem likh do friendship pe" },
  { role: "ai",   text: "Zaroor! 🌼\nDost woh hove jo rahe saath,\nSukh-dukh mein thaame haath.\nMarwari dharti ri baat niraali,\nDosti mein jeevan khushhaali." },
  { role: "user", text: "Tamil mein explain karo AI kya hai" },
  { role: "ai",   text: "AI என்பது கணினியை மனித மூளை போல் சிந்திக்க வைக்கும் தொழில்நுட்பம். இது தரவிலிருந்து கற்று பதில் சொல்லும் 🤖" },
  { role: "user", text: "What's trending in AI today?" },
  { role: "ai",   text: "🔍 Searching web...\n\nToday: multimodal models, AI agents doing real tasks, and on-device inference — exactly what NeoGPT is building toward!" },
  { role: "user", text: "Hinglish mein — life ka secret kya hai?" },
  { role: "ai",   text: "Simple hai dost 😄 — apni boli mein socho, apne log ke saath raho, aur thoda AI ka bhi help lo!" },
];

export const FUTURE = [
  { icon: "🎙️", title: "Regional Voice AI",    desc: "Tamil rural tone, Bengali soft accent, Marathi rhythm — accent-aware speech synthesis.", color: "#4ade80" },
  { icon: "🖼️", title: "Multimodal Input",     desc: "Scan handwritten regional text, signboards, documents. Vision + voice capability.",        color: "#a3e635" },
  { icon: "🧵", title: "Thread Forking",        desc: "Clone any chat, fork by language or tone. Great for education and support training.",       color: "#34d399" },
  { icon: "📚", title: "RAG Documents",         desc: "Upload government PDFs, legal papers, textbooks — get answers in your language.",           color: "#22C55E" },
  { icon: "📱", title: "WhatsApp & Telegram",   desc: "NeoGPT on platforms India already uses. Offline mode for low-bandwidth areas.",             color: "#86efac" },
  { icon: "🧠", title: "Adaptive Learning",     desc: "Learns your slang, regional preferences, and cultural patterns over time.",                 color: "#6ee7b7" },
];

export const STACK = [
  "React + Vite","Node.js","Express","MongoDB Atlas","Redis",
  "Groq LLM","Tavily","JWT Auth","Vercel","Render",
];

export const SMALL_CARDS = [
  { col: G,         icon: "⚡", val: "<50ms",           sub: "Thread resume\nvia Redis cache",                         border: `rgba(${G2},0.18)`,       big: true,  delay: 0.08 },
  { col: "#86efac", icon: "🔗", val: "Persistent URLs",  sub: "Share a link, resume any conversation on any device",    border: "rgba(134,239,172,0.16)", big: false, delay: 0.14 },
  { col: "#34d399", icon: "🔍", val: "Live Web Search",   sub: "Tavily auto-triggers when fresh data is needed",         border: "rgba(52,211,153,0.16)",  big: false, delay: 0.1  },
  { col: "#a3e635", icon: "❤️", val: "Emotion-Aware",    sub: "Detects sentiment and cultural cues in code-mixed text", border: "rgba(163,230,53,0.16)",  big: false, delay: 0.16 },
];

// ── Business use cases ────────────────────────────────────────────
export const BUSINESS_CASES = [
  {
    icon: "🏪",
    title: "Vernacular Customer Support",
    desc: "Handle customer queries in Hindi, Tamil, Gujarati and more. Reduce support costs by 60% with AI that understands how your customers actually speak.",
    tags: ["E-commerce", "Retail", "FMCG"],
  },
  {
    icon: "🏫",
    title: "Regional Language Education",
    desc: "AI tutors that explain concepts in a student's native language. From Class 6 maths in Odia to competitive exam prep in Marathi.",
    tags: ["EdTech", "Schools", "Coaching"],
  },
  {
    icon: "🏦",
    title: "Financial Advisory",
    desc: "Help rural customers understand loans, insurance, and schemes in their own language. Bridge the financial literacy gap across Bharat.",
    tags: ["BankingFin", "Insurance", "MFI"],
  },
  {
    icon: "🏥",
    title: "Healthcare Communication",
    desc: "Explain diagnoses, prescriptions, and health schemes to patients in their native dialect. Improve health outcomes through language inclusion.",
    tags: ["Hospitals", "Telehealth", "Pharma"],
  },
  {
    icon: "🏛️",
    title: "Government & Public Services",
    desc: "Help citizens navigate schemes, fill forms, and access services in their language. Make government truly inclusive and accessible.",
    tags: ["GovTech", "NGOs", "Civic"],
  },
  {
    icon: "🎮",
    title: "Entertainment & Media",
    desc: "Localize content, build multilingual chatbots for fans, or create interactive stories in regional languages at scale.",
    tags: ["OTT", "Gaming", "Publishing"],
  },
];

// ── Token system info ─────────────────────────────────────────────
export const TOKEN_INFO = {
  description: "Tokens power every AI response. 1 message ≈ 100–400 tokens depending on length.",
  examples: [
    { action: "Short reply",    tokens: "~100" },
    { action: "Long answer",    tokens: "~400" },
    { action: "Web search",     tokens: "~600" },
    { action: "Document Q&A",   tokens: "~800" },
  ],
};

// ── Pricing plans ─────────────────────────────────────────────────
export const PRICING = [
  {
    name: "Free",
    price: "₹0",
    period: "",
    tagline: "Get started, no card needed",
    accent: "#6B7A99",
    accentBg: "rgba(107,122,153,0.1)",
    accentBorder: "rgba(107,122,153,0.2)",
    tokens: "50K tokens/month",
    highlight: false,
    features: [
      { text: "50,000 tokens / month",       ok: true  },
      { text: "10 chat threads",             ok: true  },
      { text: "5 languages",                 ok: true  },
      { text: "Thread URL sharing",          ok: true  },
      { text: "Document uploads",            ok: false },
      { text: "Web search (Tavily)",         ok: false },
      { text: "API access",                  ok: false },
      { text: "Priority support",            ok: false },
    ],
    cta: "Start for free",
  },
  {
    name: "Pro",
    price: "₹250",
    period: "/month",
    tagline: "For power users & creators",
    accent: G,
    accentBg: `rgba(${G2},0.1)`,
    accentBorder: `rgba(${G2},0.28)`,
    tokens: "500K tokens/month",
    highlight: false,
    features: [
      { text: "500,000 tokens / month",      ok: true  },
      { text: "Unlimited chat threads",      ok: true  },
      { text: "All 35+ languages",           ok: true  },
      { text: "Thread URL sharing",          ok: true  },
      { text: "10 document uploads / month", ok: true  },
      { text: "Web search (Tavily)",         ok: true  },
      { text: "API access",                  ok: false },
      { text: "Priority support",            ok: false },
    ],
    cta: "Get Pro",
  },
  {
    name: "Premium",
    price: "₹700",
    period: "/month",
    tagline: "For teams & professionals",
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.1)",
    accentBorder: "rgba(167,139,250,0.32)",
    tokens: "2M tokens/month",
    highlight: true,
    badge: "Most Popular",
    features: [
      { text: "2,000,000 tokens / month",    ok: true  },
      { text: "Unlimited chat threads",      ok: true  },
      { text: "All 35+ languages",           ok: true  },
      { text: "Thread URL sharing",          ok: true  },
      { text: "100 document uploads / month",ok: true  },
      { text: "Web search (Tavily)",         ok: true  },
      { text: "API access",                  ok: true  },
      { text: "Priority support",            ok: false },
    ],
    cta: "Get Premium",
  },
  {
    name: "Premium+",
    price: "₹1,200",
    period: "/month",
    tagline: "For enterprises & agencies",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.1)",
    accentBorder: "rgba(251,191,36,0.28)",
    tokens: "Unlimited tokens",
    highlight: false,
    features: [
      { text: "Unlimited tokens",            ok: true  },
      { text: "Unlimited chat threads",      ok: true  },
      { text: "All 35+ languages",           ok: true  },
      { text: "Thread URL sharing",          ok: true  },
      { text: "Unlimited document uploads",  ok: true  },
      { text: "Web search (Tavily)",         ok: true  },
      { text: "Full API access",             ok: true  },
      { text: "Dedicated priority support",  ok: true  },
    ],
    cta: "Get Premium+",
  },
];

// ── Spring helpers ────────────────────────────────────────────────
export const sp = (delay = 0) => ({
  initial:    { opacity: 0, y: 26 },
  animate:    { opacity: 1, y: 0 },
  transition: { type: "spring", stiffness: 240, damping: 22, delay },
});
export const iv = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { type: "spring", stiffness: 220, damping: 22, delay },
});
export const bs = { type: "spring", stiffness: 380, damping: 22 };