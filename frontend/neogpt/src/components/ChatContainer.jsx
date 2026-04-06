import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

const SUGGESTIONS = [
  "Hinglish kya hai?",
  "Explain RAG in Tamil",
  "Write a Marwari greeting",
  "What's trending today?",
];

const TypingDots = () => (
  <div className="flex items-center gap-1.5 py-0.5 px-1">
    {[0, 1, 2].map(i => (
      <span key={i}
        className="rounded-full"
        style={{
          width: 7, height: 7,
          background: "var(--accent)",
          opacity: 0.8,
          display: "inline-block",
          animation: "typingBounce 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.18}s`,
        }} />
    ))}
  </div>
);

const Avatar = ({ isUser }) => (
  <div
    className="rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-black"
    style={{
      width: 30, height: 30,
      marginTop: 2,
      ...(isUser ? {
        background: "linear-gradient(135deg, var(--accent) 0%, #4ade80 100%)",
        color: "#000",
        boxShadow: "0 2px 10px rgba(34,197,94,0.35)",
      } : {
        background: "var(--navy-card2)",
        border: "1px solid rgba(34,197,94,0.25)",
        color: "var(--accent)",
      }),
    }}>
    {isUser ? "U" : "N"}
  </div>
);

const MessageRow = ({ msg, idx }) => {
  const isUser     = msg.role === "user";
  const text       = msg.text || msg.message || "";
  const isThinking = !isUser && (text === "Thinking..." || text === "Thinking…");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: idx === 0 ? 0 : 0 }}
      className="flex w-full"
      style={{
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 10,
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}>

      <Avatar isUser={isUser} />

      <div style={{
        maxWidth: "min(72%, 480px)",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
      }}>
        <div style={{
          padding: "10px 14px",
          borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
          fontSize: "0.875rem",
          lineHeight: 1.65,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          ...(isUser ? {
            background: "linear-gradient(135deg, var(--accent) 0%, #4ade80 100%)",
            color: "#000",
            fontWeight: 500,
            boxShadow: "0 2px 16px rgba(34,197,94,0.22)",
          } : {
            background: "var(--navy-card2)",
            border: "1px solid rgba(34,197,94,0.12)",
            color: "var(--text-secondary)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          }),
        }}>
          {isThinking ? (
            <TypingDots />
          ) : (
            <div
              className="prose-chat"
              dangerouslySetInnerHTML={{ __html: marked.parse(text) }}
              style={{ minWidth: 0, wordBreak: "break-word" }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ChatContainer = ({ messages, userInitials }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-32">
        <div className="relative mb-5">
          <div style={{
            width: 64, height: 64,
            borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem",
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            boxShadow: "0 0 40px rgba(34,197,94,0.1)",
          }}>
            👋
          </div>
          <span style={{
            position: "absolute", top: -4, right: -4,
            width: 16, height: 16, borderRadius: "50%",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#000",
              animation: "pulse-dot 2s ease-in-out infinite",
              display: "block",
            }} />
          </span>
        </div>

        <h3 style={{
          fontWeight: 800, fontSize: "1.15rem",
          color: "var(--text-white)", letterSpacing: "-0.3px",
          marginBottom: "0.5rem",
        }}>
          Start your conversation
        </h3>
        <p style={{
          fontSize: "0.82rem", lineHeight: 1.6,
          color: "var(--text-secondary)", maxWidth: 280,
          marginBottom: "1.75rem",
        }}>
          Ask anything in Hindi, Tamil, Marwari, or any mix — NeoGPT understands how India actually speaks.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 340 }}>
          {SUGGESTIONS.map(s => (
            <span key={s} style={{
              fontSize: "0.72rem", fontWeight: 600,
              padding: "6px 14px", borderRadius: 100,
              background: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "var(--text-secondary)",
              cursor: "default",
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto neo-scrollbar"
      style={{ paddingTop: "1.75rem", paddingBottom: "8rem" }}>
      <div style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "0 12px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>
        {messages.map((msg, idx) => (
          <MessageRow key={idx} msg={msg} idx={idx} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatContainer;