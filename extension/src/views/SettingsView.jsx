import React, { useState } from "react";
import { clearCache } from "../utils/api";

const LANGS = [
	"English",
	"Hindi",
	"Hinglish",
	"Tamil",
	"Bengali",
	"Marwari",
	"Gujarati",
	"Telugu",
	"Punjabi",
	"Urdu",
];

export default function SettingsView({
	token,
	setToken,
	language,
	setLanguage,
}) {
	const [draft, setDraft] = useState(token);
	const [saved, setSaved] = useState(false);
	const [cleared, setCleared] = useState(false);

	const save = () => {
		const t = draft.trim();
		localStorage.setItem("neogpt_token", t);
		setToken(t);
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	const clear = async () => {
		await clearCache();
		setCleared(true);
		setTimeout(() => setCleared(false), 2000);
	};

	const changeLang = (l) => {
		setLanguage(l);
		localStorage.setItem("neogpt_lang", l);
	};

	const label = {
		fontSize: "0.62rem",
		fontWeight: 900,
		textTransform: "uppercase",
		// letterSpacing: "0.18em",
		color: "var(--ac)",
		display: "block",
		marginBottom: 7,
	};
	const card = {
		background: "var(--bg2)",
		border: "1px solid var(--bdr)",
		borderRadius: 10,
		padding: "12px 12px",
		marginBottom: 14,
	};

	return (
		<div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
			<div style={card}>
				<span style={label}>NeoGPT Auth Token</span>
				<input
					type="password"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					placeholder="Paste your JWT token from https://neogpt-blue.vercel.com"
					style={{
						width: "100%",
						padding: "8px 11px",
						borderRadius: 9,
						marginBottom: 9,
						background: "var(--bg3)",
						border: "1px solid var(--bdr)",
						color: "var(--tw)",
						fontSize: "0.72rem",
						outline: "none",
					}}
					onFocus={(e) => {
						e.target.style.borderColor = "rgba(34,197,94,0.45)";
					}}
					onBlur={(e) => {
						e.target.style.borderColor = "var(--bdr)";
					}}
				/>
				<p
					style={{
						fontSize: "0.62rem",
						color: "var(--tf)",
						marginBottom: 9,
						lineHeight: 1.5,
					}}
				>
					Log in at <a href="https://neogpt-blue.vercel.com">neogpt</a> → open
					DevTools → Application → Local Storage → copy authToken.
				</p>
				<button
					onClick={save}
					style={{
						width: "100%",
						padding: "8px 0",
						borderRadius: 9,
						fontWeight: 800,
						fontSize: "0.74rem",
						border: "none",
						cursor: "pointer",
						background: saved ? "rgba(34,197,94,0.18)" : "var(--ac)",
						color: saved ? "var(--ac)" : "#000",
						transition: "all 0.2s",
					}}
				>
					{saved ? "✓ Saved!" : "Save Auth-Token"}
				</button>
			</div>

			<div style={card}>
				<span style={label}>Response Language</span>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
					{LANGS.map((l) => (
						<button
							key={l}
							onClick={() => changeLang(l)}
							style={{
								fontSize: "0.68rem",
								fontWeight: 700,
								padding: "4px 10px",
								borderRadius: 8,
								cursor: "pointer",
								background:
									language === l ? "rgba(34,197,94,0.15)" : "var(--bg3)",
								border: `1px solid ${language === l ? "var(--bdr2)" : "var(--bdr)"}`,
								color: language === l ? "var(--ac)" : "var(--ts)",
								transition: "all 0.15s",
							}}
						>
							{l}
						</button>
					))}
				</div>
			</div>

			<div style={card}>
				<span style={label}>Cache</span>
				<p
					style={{
						fontSize: "0.68rem",
						color: "var(--ts)",
						marginBottom: 9,
						lineHeight: 1.5,
					}}
				>
					Page summaries are cached 1 hour. Clear if you want fresh results.
				</p>
				<button
					onClick={clear}
					style={{
						padding: "6px 14px",
						borderRadius: 9,
						fontWeight: 700,
						fontSize: "0.72rem",
						cursor: "pointer",
						background: cleared
							? "rgba(34,197,94,0.12)"
							: "rgba(239,68,68,0.08)",
						border: `1px solid ${cleared ? "var(--bdr2)" : "rgba(239,68,68,0.25)"}`,
						color: cleared ? "var(--ac)" : "#f87171",
						transition: "all 0.2s",
					}}
				>
					{cleared ? "✓ Cleared!" : "Clear all cache"}
				</button>
			</div>

			<p
				style={{
					fontSize: "0.6rem",
					textAlign: "center",
					color: "var(--tf)",
					marginTop: 4,
				}}
			>
				NeoGPT Extension v1.0.0 · github.com/Rahul-2314
			</p>
		</div>
	);
}
