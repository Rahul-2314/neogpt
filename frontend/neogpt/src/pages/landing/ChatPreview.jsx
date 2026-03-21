import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { G, G2, CHAT_DEMO } from "./constants";

const USER_PAUSE = 1500;
const AI_TYPING  = 1000;
const AI_PAUSE   = 2200;
const MAX_SHOWN  = 4;

// Each message rendered at a fixed slot height so the container never jumps
const BUBBLE_GAP = 10; // px gap between bubbles — must match gap-2.5 (10px)

const Bubble = ({ msg, exiting }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2 w-full flex-shrink-0 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
          isUser ? "text-black" : "border"
        }`}
        style={
          isUser
            ? { background: G }
            : { background: "#131A14", borderColor: "rgba(34,197,94,0.15)", color: "#6B7D6F" }
        }
      >
        {isUser ? "U" : "N"}
      </div>

      {/* Text bubble */}
      <div
        className={`max-w-[83%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
          isUser ? "rounded-tr-sm text-black" : "rounded-tl-sm"
        }`}
        style={
          isUser
            ? { background: G }
            : { background: "#131A14", border: "1px solid rgba(34,197,94,0.1)", color: "#C8D8CB" }
        }
      >
        {msg.text}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-2 w-full flex-shrink-0">
    <div className="w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-bold"
      style={{ background: "#131A14", borderColor: "rgba(34,197,94,0.15)", color: "#6B7D6F" }}>
      N
    </div>
    <div className="rounded-xl rounded-tl-sm px-3 py-2.5 flex gap-1.5 items-center"
      style={{ background: "#131A14", border: "1px solid rgba(34,197,94,0.1)" }}>
      {[0, 1, 2].map(j => (
        <span key={j} className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#4ade80", animation: `typingBounce 1.2s ease-in-out ${j * 0.18}s infinite` }} />
      ))}
    </div>
  </div>
);

const ChatPreview = () => {
  // `queue` is an array of {id, role, text} — we only keep MAX_SHOWN + typing in view
  const [queue,  setQueue]  = useState([]);
  const [typing, setTyping] = useState(false);
  const idxRef   = useRef(0);
  const idCount  = useRef(0);
  const timerRef = useRef(null);

  const enqueue = (msg) => {
    const item = { id: idCount.current++, ...msg };
    setQueue(prev => {
      const next = [...prev, item];
      // keep only the last MAX_SHOWN — oldest naturally scrolls off
      return next.length > MAX_SHOWN ? next.slice(next.length - MAX_SHOWN) : next;
    });
  };

  const step = () => {
    const msg = CHAT_DEMO[idxRef.current % CHAT_DEMO.length];
    idxRef.current++;

    if (msg.role === "user") {
      enqueue(msg);
      timerRef.current = setTimeout(step, USER_PAUSE);
    } else {
      // show typing first
      setTyping(true);
      timerRef.current = setTimeout(() => {
        setTyping(false);
        enqueue(msg);
        timerRef.current = setTimeout(step, AI_PAUSE);
      }, AI_TYPING);
    }
  };

  useEffect(() => {
    timerRef.current = setTimeout(step, 700);
    return () => clearTimeout(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#070B08",
        border: "1px solid rgba(34,197,94,0.12)",
        height: 420,
        width: "100%",
      }}
    >
      {/* ── Window chrome ── */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 flex-shrink-0"
        style={{ background: "rgba(34,197,94,0.03)", borderBottom: "1px solid rgba(34,197,94,0.08)" }}
      >
        {["#FF5F5799", "#FEBC2E99", "#28C84099"].map((c, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-3 text-[10px] font-mono" style={{ color: "var(--text-faint)" }}>
          neogpt.ai/chat/multilingual-demo
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#4ade80", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
          <span className="text-[10px] font-semibold" style={{ color: "#4ade80" }}>live</span>
        </div>
      </div>

      {/* ── Message area ──
            Strategy: absolute-positioned list pinned to BOTTOM of a relative container.
            New messages animate in from y+14. Old messages fade out upward via y-10.
            The container itself never changes height → zero layout shift.
      ── */}
      <div className="flex-1 relative overflow-hidden">
        {/* absolute column anchored to bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3 flex flex-col"
          style={{ gap: BUBBLE_GAP }}
        >
          <AnimatePresence initial={false} mode="sync">
            {queue.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -14,
                  transition: { duration: 0.28, ease: "easeIn" },
                }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              >
                <Bubble msg={msg} />
              </motion.div>
            ))}

            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, transition: { duration: 0.2, ease: "easeIn" } }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Input mock ── */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.09)" }}
        >
          <span className="text-xs flex-1" style={{ color: "var(--text-faint)" }}>
            Kuch bhi poochho…
          </span>
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-black"
            style={{ background: G }}
          >
            ↑
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;