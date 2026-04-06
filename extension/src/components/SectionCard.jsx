import React, { useState } from "react";
import { scrollTo } from "../utils/api";
import { md } from "../utils/md";

export default function SectionCard({ section, index }) {
	const [open, setOpen] = useState(false);
	const [jumping, setJumping] = useState(false);

	const jump = async (e) => {
		e.stopPropagation();
		setJumping(true);
		await scrollTo(section.elementId);
		setTimeout(() => setJumping(false), 900);
	};

	return (
		<div
			className="fade-up"
			style={{
				background: "var(--bg2)",
				border: "1px solid var(--bdr)",
				borderRadius: 10,
				marginBottom: 6,
				overflow: "hidden",
				animationDelay: `${index * 0.04}s`,
			}}
		>
			<button
				onClick={() => setOpen((v) => !v)}
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					gap: 7,
					padding: "9px 11px",
					background: "none",
					border: "none",
					cursor: "pointer",
					textAlign: "left",
				}}
			>
				<span
					style={{
						fontSize: "0.6rem",
						fontWeight: 900,
						textTransform: "uppercase",
						letterSpacing: "0.14em",
						color: "var(--ac)",
						flexShrink: 0,
					}}
				>
					{section.level || "h2"}
				</span>
				<span
					style={{
						fontSize: "0.74rem",
						fontWeight: 600,
						color: "var(--tw)",
						flex: 1,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{section.heading}
				</span>
				<button
					onClick={jump}
					style={{
						fontSize: "0.65rem",
						fontWeight: 700,
						padding: "2px 8px",
						borderRadius: 6,
						background: jumping ? "var(--ac)" : "rgba(34,197,94,0.1)",
						color: jumping ? "#000" : "var(--ac)",
						border: `1px solid var(--bdr2)`,
						cursor: "pointer",
						flexShrink: 0,
					}}
				>
					{jumping ? "✓" : "Go →"}
				</button>
				<span style={{ color: "var(--tm)", fontSize: 9, flexShrink: 0 }}>
					{open ? "▲" : "▼"}
				</span>
			</button>

			{open && (
				<div style={{ padding: "0 11px 10px" }}>
					<div
						style={{ height: 1, background: "var(--bdr)", marginBottom: 8 }}
					/>
					{section.summary ? (
						<div
							className="prose"
							style={{ color: "var(--ts)", fontSize: "0.72rem" }}
							dangerouslySetInnerHTML={{ __html: md(section.summary) }}
						/>
					) : (
						<p
							style={{
								color: "var(--ts)",
								fontSize: "0.72rem",
								lineHeight: 1.55,
							}}
						>
							{(section.content || "").slice(0, 280)}…
						</p>
					)}
				</div>
			)}
		</div>
	);
}
