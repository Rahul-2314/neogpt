import React from "react";

const LANGUAGES = [
  "Assamese", "Awadhi", "Bengali", "Bhili", "Bhojpuri", "Bodo",
  "Chhattisgarhi", "Dogri", "English", "Garhwali", "Gondi", "Gujarati",
  "Haryanvi", "Hindi", "Khasi", "Kokborok", "Konkani", "Kumaoni",
  "Maithili", "Malayalam", "Manipuri (Meitei)", "Marathi", "Marwari",
  "Mizo", "Nepali", "Odia", "Punjabi", "Rajasthani", "Sanskrit",
  "Santali", "Sindhi", "Tamil", "Telugu", "Tulu", "Urdu",
];

const LanguageSelect = ({ language, setLanguage, small = false }) => (
  <div className="relative">
    <select
      value={language || ""}
      onChange={e => setLanguage(e.target.value)}
      className="appearance-none cursor-pointer font-semibold outline-none transition-all"
      style={{
        background: "rgba(34,197,94,0.08)",
        border: "1px solid rgba(34,197,94,0.22)",
        borderRadius: 10,
        color: "var(--text-white)",
        fontSize: small ? "0.72rem" : "0.82rem",
        padding: small ? "5px 28px 5px 10px" : "7px 34px 7px 12px",
        width: small ? 112 : 152,
        WebkitAppearance: "none",
      }}
      onFocus={e  => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.55)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)"; }}
      onBlur={e   => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.22)"; e.currentTarget.style.boxShadow = "none"; }}>
      <option value="" style={{ background: "#131A14" }}>Language</option>
      {LANGUAGES.map(l => (
        <option key={l} value={l} style={{ background: "#131A14" }}>{l}</option>
      ))}
    </select>

    <svg
      className="absolute pointer-events-none"
      style={{
        right: small ? 8 : 10,
        top: "50%",
        transform: "translateY(-50%)",
        width: 10, height: 10,
        color: "var(--accent)",
        opacity: 0.7,
      }}
      viewBox="0 0 10 6" fill="none">
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </div>
);

export default LanguageSelect;