import React, { useState, useEffect } from "react";
import SummaryView from "./views/SummaryView";
import ChatView from "./views/ChatView";
import SettingsView from "./views/SettingsView";
import logo from "./assets/logo_neogpt.png";

const TABS = [
	{ id: "summary", icon: "📃", label: "Summary" },
	{ id: "chat", icon: "💭", label: "Chat" },
	{ id: "settings", icon: "⚙️", label: "Settings" },
];

export default function App() {
	const [tab, setTab] = useState("summary");
	const [theme, setTheme] = useState(
		() => localStorage.getItem("neogpt_theme") || "dark",
	);
	const [token, setToken] = useState(
		() => localStorage.getItem("neogpt_token") || "",
	);
	const [language, setLanguage] = useState(
		() => localStorage.getItem("neogpt_lang") || "English",
	);
	const [url, setUrl] = useState("");

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("neogpt_theme", theme);
	}, [theme]);

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, ([t]) => {
			setUrl(t?.url ? t.url.replace(/^https?:\/\//, "").slice(0, 42) : "");
		});
	}, []);

	const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				background: "var(--bg)",
				color: "var(--tw)",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "8px 12px",
					background: "var(--bg2)",
					borderBottom: "1px solid var(--bdr)",
					flexShrink: 0,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<div
						style={{
							width: 28,
							height: 28,
							borderRadius: 8,
							fontSize: 14,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "rgba(34,197,94,0.1)",
							// border: "1px solid var(--bdr2)",
						}}
					>
						<img src={logo} alt="NeoGPT"/>
					</div>
					<div>
						<p
							style={{
								fontWeight: 800,
								fontSize: "0.78rem",
								color: "var(--tw)",
								lineHeight: 1.2,
								fontFamily: "'Playfair Display', serif",
							}}
						>
							NeoGPT - AI That Speaks You
						</p>
						<p
							style={{
								fontSize: "0.75rem",
								fontWeight: "bold",
								color: "var(--tf)",
								lineHeight: 1.2,
								maxWidth: 220,
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							{url || "No page loaded"}
						</p>
					</div>
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
					{token && (
						<span
							style={{
								fontSize: "0.58rem",
								fontWeight: 700,
								padding: "2px 7px",
								borderRadius: 100,
								background: "rgba(34,197,94,0.1)",
								border: "1px solid var(--bdr)",
								color: "var(--ac)",
							}}
						>
							✓ {language}
						</span>
					)}
					{!token && (
						<span
							style={{
								fontSize: "0.58rem",
								fontWeight: 700,
								padding: "2px 7px",
								borderRadius: 100,
								background: "rgba(239,68,68,0.08)",
								border: "1px solid rgba(239,68,68,0.22)",
								color: "#f87171",
								cursor: "pointer",
							}}
							onClick={() => setTab("settings")}
						>
							Set token →
						</span>
					)}
					<button
						onClick={toggleTheme}
						style={{
							width: 26,
							height: 26,
							borderRadius: 8,
							fontSize: 12,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "var(--bg3)",
							border: "1px solid var(--bdr)",
							cursor: "pointer",
						}}
						title="Toggle theme"
					>
						{theme === "dark" ? "☀️" : "🌙"}
					</button>
				</div>
			</div>

			<div
				style={{
					flex: 1,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{tab === "summary" && <SummaryView language={language} token={token} />}
				{tab === "chat" && <ChatView language={language} />}
				{tab === "settings" && (
					<SettingsView
						token={token}
						setToken={setToken}
						language={language}
						setLanguage={setLanguage}
					/>
				)}
			</div>

			<div
				style={{
					display: "flex",
					background: "var(--bg2)",
					borderTop: "1px solid var(--bdr)",
					flexShrink: 0,
				}}
			>
				{TABS.map((t) => (
					<button
						key={t.id}
						onClick={() => setTab(t.id)}
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							padding: "6px 0",
							background: "none",
							border: "none",
							cursor: "pointer",
							borderTop:
								tab === t.id ? "2px solid var(--ac)" : "2px solid transparent",
							transition: "border-color 0.15s",
						}}
					>
						<span style={{ fontSize: 14 }}>{t.icon}</span>
						<span
							style={{
								fontSize: "0.58rem",
								fontWeight: 700,
								marginTop: 2,
								color: tab === t.id ? "var(--ac)" : "white",
							}}
						>
							{t.label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
