import React, { useEffect, useRef } from "react";
import { marked } from "marked";

const ChatContainer = ({ messages }) => {
	const bottomRef = useRef(null);

	// Auto-scroll to bottom on new messages
	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	if (!messages || messages.length === 0)
		return (
			<div className="text-center text-gray-400 mt-10">
				Start a new conversation...
			</div>
		);

	return (
		<div
			className="
				p-10 
				space-y-3 
				overflow-y-auto 
				h-[80vh] 
				scroll-smooth
				pb-24
				no-scrollbar
				mx-2
				md:mx-4
			"
		>
			{messages.map((msg, idx) => (
				<div
					key={idx}
					className={`flex ${
						msg.role === "user" ? "justify-end" : "justify-start"
					}`}
				>
					<div
						className={`max-w-[80%] px-3 py-2 rounded-2xl shadow-sm ${
							msg.role === "user"
								? "bg-cyan-500/80 text-black rounded-br-none"
								: "bg-gray-700/80 text-white rounded-bl-none"
						}`}
					>
						<div
							className="text-sm md:text-base leading-relaxed"
							dangerouslySetInnerHTML={{
								__html: marked.parse(msg.text || msg.message || ""),
							}}
						/>
					</div>
				</div>
			))}

			{/* Invisible div for auto-scroll anchor */}
			<div ref={bottomRef} className="h-8" />
		</div>
	);
};

export default ChatContainer;
