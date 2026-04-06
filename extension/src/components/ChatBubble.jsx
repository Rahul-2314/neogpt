import React from "react";
import { md } from "../utils/md";

const Dots = () => (
	<div style={{ display: "flex", gap: 4, padding: "2px 0" }}>
		{[0, 1, 2].map((i) => (
			<span
				key={i}
				style={{
					width: 6,
					height: 6,
					borderRadius: "50%",
					background: "var(--ac)",
					display: "inline-block",
					animation: "typingBounce 1.2s ease-in-out infinite",
					animationDelay: `${i * 0.18}s`,
				}}
			/>
		))}
	</div>
);

export default function ChatBubble({ msg }) {
	const isUser = msg.role === "user";
	const isThinking =
		!isUser && (msg.text === "Thinking..." || msg.text === "Thinking…");

	return (
		<div
			style={{
				display: "flex",
				gap: 7,
				marginBottom: 10,
				flexDirection: isUser ? "row-reverse" : "row",
			}}
		>
			<div
				style={{
					width: 22,
					height: 22,
					borderRadius: 7,
					flexShrink: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 9,
					fontWeight: 900,
					marginTop: 2,
					background: isUser ? "var(--ac)" : "var(--bg3)",
					border: isUser ? "none" : "1px solid var(--bdr2)",
					color: isUser ? "#000" : "var(--ac)",
				}}
			>
				{isUser ? "U" : "N"}
			</div>
			<div
				style={{
					maxWidth: "82%",
					padding: "8px 11px",
					borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
					fontSize: "0.74rem",
					lineHeight: 1.6,
					background: isUser ? "var(--ac)" : "var(--bg2)",
					color: isUser ? "#000" : "var(--ts)",
					border: isUser ? "none" : "1px solid var(--bdr)",
					fontWeight: isUser ? 500 : 400,
					wordBreak: "break-word",
				}}
			>
				{isThinking ? (
					<Dots />
				) : (
					<div
						className="prose"
						dangerouslySetInnerHTML={{ __html: md(msg.text) }}
					/>
				)}
			</div>
		</div>
	);
}
