import React, { useState } from "react";
import { extractContent, summarizePage, getActiveTab } from "../utils/api";
import SectionCard from "../components/SectionCard";

export default function SummaryView({ language }) {
	const [phase, setPhase] = useState("idle");
	const [result, setResult] = useState(null);
	const [sections, setSections] = useState([]);
	const [cached, setCached] = useState(false);
	const [error, setError] = useState("");

	const token = localStorage.getItem("neogpt_token") || "";

	const run = async () => {
		if (!token) {
			setError("Set your NeoGPT token in Settings first.");
			return;
		}
		setError("");
		setPhase("reading");
		try {
			const [tab, content] = await Promise.all([
				getActiveTab(),
				extractContent(),
			]);
			if (!content.length)
				throw new Error("Could not read this page. Try a different page.");
			setPhase("summarizing");
			const res = await summarizePage(content, tab.url);
			setResult(res.data);
			setSections(
				content.map((s, i) => ({
					...s,
					summary: res.data?.sections?.[i]?.summary || null,
				})),
			);
			setCached(res.fromCache || false);
			setPhase("done");
		} catch (e) {
			const msg = e.message;
			if (msg === "401") setError("Token expired. Update it in Settings.");
			else if (msg === "429") setError("Too many requests. Wait a moment.");
			else setError(msg || "Failed to summarize. Please try again.");
			setPhase("idle");
		}
	};

	if (phase !== "done")
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					flex: 1,
					padding: "0 20px",
					textAlign: "center",
				}}
			>
				<div
					style={{
						width: 52,
						height: 52,
						borderRadius: 16,
						marginBottom: 14,
						fontSize: 24,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: "rgba(34,197,94,0.08)",
						border: "1px solid var(--bdr2)",
					}}
				>
					📂
				</div>
				<p
					style={{
						fontWeight: 800,
						fontSize: "0.9rem",
						color: "var(--tw)",
						marginBottom: 5,
					}}
				>
					Summarize this page
				</p>
				<p
					style={{
						fontSize: "0.72rem",
						color: "var(--ts)",
						lineHeight: 1.55,
						marginBottom: 18,
						maxWidth: 260,
					}}
				>
					AI-powered TLDR, key points and section summaries. Works on any page.
				</p>
				{error && (
					<div
						style={{
							width: "100%",
							marginBottom: 12,
							padding: "8px 12px",
							borderRadius: 10,
							fontSize: "0.72rem",
							background: "rgba(239,68,68,0.09)",
							border: "1px solid rgba(239,68,68,0.22)",
							color: "#f87171",
						}}
					>
						{error}
					</div>
				)}
				<button
					onClick={run}
					disabled={phase !== "idle"}
					style={{
						width: "100%",
						padding: "10px 0",
						borderRadius: 12,
						fontWeight: 800,
						fontSize: "0.82rem",
						background: phase !== "idle" ? "rgba(34,197,94,0.38)" : "var(--ac)",
						color: "#000",
						border: "none",
						cursor: phase !== "idle" ? "not-allowed" : "pointer",
						boxShadow:
							phase === "idle" ? "0 0 16px rgba(34,197,94,0.28)" : "none",
						transition: "all 0.2s",
					}}
				>
					{phase === "idle"
						? "Summarize Page"
						: phase === "reading"
							? "Reading page…"
							: "Generating summary…"}
				</button>
			</div>
		);

	return (
		<div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 10,
				}}
			>
				<span
					style={{
						fontSize: "0.65rem",
						fontWeight: 900,
						textTransform: "uppercase",
						letterSpacing: "0.18em",
						color: "var(--ac)",
					}}
				>
					Summary
				</span>
				<div style={{ display: "flex", gap: 6, alignItems: "center" }}>
					{cached && (
						<span
							style={{
								fontSize: "0.6rem",
								fontWeight: 700,
								padding: "2px 7px",
								borderRadius: 100,
								background: "rgba(34,197,94,0.1)",
								border: "1px solid var(--bdr)",
								color: "var(--ac)",
							}}
						>
							cached
						</span>
					)}
					<button
						onClick={() => {
							setPhase("idle");
							setResult(null);
							setSections([]);
						}}
						style={{
							fontSize: "0.65rem",
							color: "var(--tm)",
							background: "none",
							border: "none",
							cursor: "pointer",
						}}
					>
						↺ Redo
					</button>
				</div>
			</div>

			{result?.tldr && (
				<div
					style={{
						background: "var(--bg2)",
						border: "1px solid var(--bdr2)",
						borderRadius: 10,
						padding: "10px 12px",
						marginBottom: 8,
					}}
				>
					<p
						style={{
							fontSize: "0.6rem",
							fontWeight: 900,
							textTransform: "uppercase",
							letterSpacing: "0.16em",
							color: "var(--ac)",
							marginBottom: 5,
						}}
					>
						TLDR
					</p>
					<p
						style={{ fontSize: "0.76rem", lineHeight: 1.6, color: "var(--tw)" }}
					>
						{result.tldr}
					</p>
				</div>
			)}

			{result?.keyPoints?.length > 0 && (
				<div
					style={{
						background: "var(--bg2)",
						border: "1px solid var(--bdr)",
						borderRadius: 10,
						padding: "10px 12px",
						marginBottom: 8,
					}}
				>
					<p
						style={{
							fontSize: "0.6rem",
							fontWeight: 900,
							textTransform: "uppercase",
							letterSpacing: "0.16em",
							color: "var(--ac)",
							marginBottom: 7,
						}}
					>
						Key Points
					</p>
					{result.keyPoints.map((pt, i) => (
						<div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
							<span
								style={{
									color: "var(--ac)",
									flexShrink: 0,
									fontSize: "0.72rem",
									marginTop: 1,
								}}
							>
								✓
							</span>
							<span
								style={{
									fontSize: "0.72rem",
									lineHeight: 1.55,
									color: "var(--ts)",
								}}
							>
								{pt}
							</span>
						</div>
					))}
				</div>
			)}

			{sections.length > 0 && (
				<>
					<p
						style={{
							fontSize: "0.6rem",
							fontWeight: 900,
							textTransform: "uppercase",
							letterSpacing: "0.16em",
							color: "var(--tm)",
							margin: "8px 0 6px",
						}}
					>
						Sections ({sections.length})
					</p>
					{sections.map((s, i) => (
						<SectionCard key={s.elementId || i} section={s} index={i} />
					))}
				</>
			)}
		</div>
	);
}
