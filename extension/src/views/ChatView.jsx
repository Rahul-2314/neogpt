import React, { useState, useEffect, useRef } from "react";
import {
	chat,
	extractContent,
	getSelection,
	selectionAction,
} from "../utils/api";
import ChatBubble from "../components/ChatBubble";

const THREAD_KEY = "neogpt_ext_thread";

const STARTERS = [
	"What is this page about?",
	"Summarize the main points",
	"What are the key takeaways?",
	"Explain the most important section",
];

export default function ChatView({ language }) {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [threadId, setThread] = useState(
		() => localStorage.getItem(THREAD_KEY) || "",
	);
	const [ctx, setCtx] = useState("page");
	const [pageData, setPageData] = useState(null);
	const [selText, setSelText] = useState("");
	const bottomRef = useRef(null);
	const taRef = useRef(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (!threadId) {
			const id =
				Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
			setThread(id);
			localStorage.setItem(THREAD_KEY, id);
		}
	}, []);

	useEffect(() => {
		extractContent()
			.then(setPageData)
			.catch(() => {});
		getSelection()
			.then((t) => {
				if (t) setSelText(t);
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (taRef.current) {
			taRef.current.style.height = "auto";
			taRef.current.style.height =
				Math.min(taRef.current.scrollHeight, 80) + "px";
		}
	}, [input]);

	const buildContext = () => {
		if (ctx === "selection" && selText) return selText;
		if (ctx === "page" && pageData?.length)
			return pageData
				.map((s) => `${s.heading}:\n${s.content}`)
				.join("\n\n")
				.slice(0, 3000);
		return "";
	};

	const send = async (overrideText) => {
		const text = (overrideText || input).trim();
		if (!text || loading) return;

		const token = localStorage.getItem("neogpt_token") || "";
		if (!token) {
			setMessages((p) => [
				...p,
				{
					role: "assistant",
					text: "⚠️ Please set your NeoGPT token in Settings.",
				},
			]);
			return;
		}

		setInput("");
		const contextNote = buildContext();
		const fullMessage = contextNote
			? `Context:\n${contextNote}\n\nQuestion: ${text}`
			: text;

		setMessages((p) => [
			...p,
			{ role: "user", text },
			{ role: "assistant", text: "Thinking…" },
		]);
		setLoading(true);

		try {
			const res = await chat(fullMessage, threadId);
			if (res.threadId) {
				setThread(res.threadId);
				localStorage.setItem(THREAD_KEY, res.threadId);
			}
			const reply = res.data?.message || "No response received.";
			setMessages((p) => [
				...p.slice(0, -1),
				{ role: "assistant", text: reply },
			]);
		} catch (e) {
			let txt = "⚠️ Error connecting to server.";
			if (e.message === "401") txt = "⚠️ Token expired. Update it in Settings.";
			if (e.message === "429") txt = "⏳ Too many requests. Wait a moment.";
			setMessages((p) => [...p.slice(0, -1), { role: "assistant", text: txt }]);
		} finally {
			setLoading(false);
		}
	};

	const doSelectionAction = async (action) => {
		if (!selText || loading) return;
		const promptMap = {
			summarize: `Summarize this text in ${language}: "${selText}"`,
			explain: `Explain this clearly in ${language}: "${selText}"`,
			translate: `Translate this to ${language}: "${selText}"`,
		};
		await send(promptMap[action]);
	};

	const newChat = () => {
		const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
		setThread(id);
		localStorage.setItem(THREAD_KEY, id);
		setMessages([]);
	};

	const onKey = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "7px 12px",
					borderBottom: "1px solid var(--bdr)",
					flexShrink: 0,
				}}
			>
				<div style={{ display: "flex", gap: 4 }}>
					{[
						["page", "Full page"],
						["selection", "Selection"],
					].map(([val, label]) => (
						<button
							key={val}
							onClick={() => setCtx(val)}
							style={{
								fontSize: "0.65rem",
								fontWeight: 700,
								padding: "3px 9px",
								borderRadius: 7,
								background: ctx === val ? "rgba(34,197,94,0.14)" : "none",
								color: ctx === val ? "var(--ac)" : "var(--tm)",
								border: `1px solid ${ctx === val ? "var(--bdr2)" : "transparent"}`,
								cursor: "pointer",
							}}
						>
							{label}
							{val === "selection" && selText && (
								<span
									style={{
										marginLeft: 4,
										padding: "0 3px",
										borderRadius: 3,
										background: "rgba(34,197,94,0.2)",
										fontSize: "0.55rem",
									}}
								>
									✓
								</span>
							)}
						</button>
					))}
				</div>
				<button
					onClick={newChat}
					style={{
						fontSize: "0.65rem",
						color: "var(--tm)",
						background: "none",
						border: "none",
						cursor: "pointer",
					}}
				>
					+ New
				</button>
			</div>

			{selText && ctx === "selection" && (
				<div
					style={{
						padding: "7px 12px",
						borderBottom: "1px solid var(--bdr)",
						flexShrink: 0,
					}}
				>
					<p
						style={{
							fontSize: "0.6rem",
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: "0.12em",
							color: "var(--tm)",
							marginBottom: 5,
						}}
					>
						Quick actions
					</p>
					<div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
						{[
							["summarize", "Summarize"],
							["explain", "Explain"],
							["translate", "Translate"],
						].map(([a, l]) => (
							<button
								key={a}
								onClick={() => doSelectionAction(a)}
								style={{
									fontSize: "0.65rem",
									fontWeight: 700,
									padding: "3px 10px",
									borderRadius: 7,
									background: "rgba(34,197,94,0.08)",
									border: "1px solid var(--bdr2)",
									color: "var(--ac)",
									cursor: "pointer",
								}}
							>
								{l}
							</button>
						))}
					</div>
					<p
						style={{
							fontSize: "0.6rem",
							color: "var(--tf)",
							marginTop: 4,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						"{selText.slice(0, 55)}…"
					</p>
				</div>
			)}

			<div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
				{messages.length === 0 && (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							height: "100%",
							textAlign: "center",
						}}
					>
						<div
							style={{
								width: 40,
								height: 40,
								borderRadius: 12,
								marginBottom: 10,
								fontSize: 18,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background: "rgba(34,197,94,0.08)",
								border: "1px solid var(--bdr)",
							}}
						>
							👋
						</div>
						<p
							style={{
								fontWeight: 700,
								fontSize: "0.8rem",
								color: "var(--tw)",
								marginBottom: 4,
							}}
						>
							Ask about this page
						</p>
						<p
							style={{
								fontSize: "0.68rem",
								color: "var(--tm)",
								marginBottom: 14,
								lineHeight: 1.5,
								maxWidth: 200,
							}}
						>
							Chat with NeoGPT using the page as context.
						</p>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 5,
								width: "100%",
								maxWidth: 240,
							}}
						>
							{STARTERS.map((q) => (
								<button
									key={q}
									onClick={() => send(q)}
									style={{
										textAlign: "left",
										fontSize: "0.68rem",
										padding: "6px 10px",
										borderRadius: 8,
										background: "var(--bg2)",
										border: "1px solid var(--bdr)",
										color: "var(--ts)",
										cursor: "pointer",
									}}
								>
									{q}
								</button>
							))}
						</div>
					</div>
				)}
				{messages.map((m, i) => (
					<ChatBubble key={i} msg={m} />
				))}
				<div ref={bottomRef} />
			</div>

			<div
				style={{
					padding: "8px 12px",
					borderTop: "1px solid var(--bdr)",
					flexShrink: 0,
				}}
			>
				<div
					style={{
						background: "var(--bg2)",
						border: "1px solid var(--bdr)",
						borderRadius: 12,
						display: "flex",
						alignItems: "flex-end",
						gap: 7,
						padding: "8px 10px",
						transition: "border-color 0.2s",
					}}
					onFocusCapture={(e) => {
						e.currentTarget.style.borderColor = "rgba(34,197,94,0.45)";
					}}
					onBlurCapture={(e) => {
						e.currentTarget.style.borderColor = "var(--bdr)";
					}}
				>
					<textarea
						ref={taRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={onKey}
						rows={1}
						placeholder="Ask about this page…"
						style={{
							flex: 1,
							resize: "none",
							background: "transparent",
							border: "none",
							outline: "none",
							fontSize: "0.74rem",
							lineHeight: 1.55,
							color: "var(--tw)",
							caretColor: "var(--ac)",
							minHeight: 20,
							maxHeight: 80,
						}}
					/>
					<button
						onClick={() => send()}
						disabled={!input.trim() || loading}
						style={{
							width: 28,
							height: 28,
							borderRadius: 9,
							border: "none",
							cursor: input.trim() && !loading ? "pointer" : "not-allowed",
							background:
								input.trim() && !loading
									? "var(--ac)"
									: "rgba(255,255,255,0.07)",
							color: input.trim() && !loading ? "#000" : "var(--tf)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 15,
							flexShrink: 0,
							marginBottom: 1,
						}}
					>
						↑
					</button>
				</div>
				<p
					style={{
						textAlign: "center",
						fontSize: "0.58rem",
						color: "var(--tf)",
						marginTop: 4,
					}}
				>
					Enter to send · Shift+Enter for new line
				</p>
			</div>
		</div>
	);
}
