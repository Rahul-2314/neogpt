import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getChatHistory } from "../api/authAPI";
import { useNavigate, useParams } from "react-router-dom";

const FULL = 256;
const MINI = 56;

const PenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" />
  </svg>
);

const ChevronIcon = ({ left }) => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d={left ? "M10 4L6 8l4 4" : "M6 4l4 4-4 4"} />
  </svg>
);

const MenuIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="2" y1="4" x2="14" y2="4" />
    <line x1="2" y1="8" x2="14" y2="8" />
    <line x1="2" y1="12" x2="14" y2="12" />
  </svg>
);

function timeLabel(d) {
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const ThreadItem = ({ chat, isActive, onSelect }) => {
  const preview = chat.messages?.[0]?.text || chat.messages?.[0]?.message || "New conversation";

  return (
    <button
      onClick={() => onSelect(chat.threadId)}
      className="w-full text-left rounded-xl transition-all block mb-2"
      style={{
        padding: "10px 12px",
        background: isActive ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.02)",
        border: isActive
          ? "1px solid rgba(34,197,94,0.35)"
          : "1px solid rgba(34,197,94,0.08)",
        boxShadow: isActive ? "0 0 12px rgba(34,197,94,0.08)" : "none",
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(34,197,94,0.05)";
          e.currentTarget.style.borderColor = "rgba(34,197,94,0.18)";
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          e.currentTarget.style.borderColor = "rgba(34,197,94,0.08)";
        }
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: isActive ? "var(--accent)" : "",
            animation: isActive ? "pulse-dot 2s ease-in-out infinite" : "none",
          }}
        />
        <span
          className="text-[9px] font-black uppercase tracking-[0.16em]"
          style={{ color: isActive ? "var(--accent)" : "var(--text-faint)" }}
        >
          {isActive ? "Active" : ""}
        </span>
      </div>

      <p
        className={`text-[12.5px] truncate leading-snug ${isActive ? "font-semibold" : "font-normal"}`}
        style={{ color: isActive ? "var(--text-white)" : "var(--text-secondary)" }}
      >
        {preview}
      </p>

      <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--text-faint)" }}>
        {timeLabel(chat.updatedAt)}
      </p>
    </button>
  );
};

const ChatSidebar = ({ activeThread, setActiveThread, onNewChat, isMinimized, setIsMinimized }) => {
  const [history,     setHistory]     = useState([]);
  const [mini,        setMini]        = useState(Boolean(isMinimized));
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 768);
  const navigate     = useNavigate();
  const { threadId } = useParams();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    getChatHistory().then(setHistory).catch(e => console.error("Sidebar:", e.message));
  }, [activeThread]);

  useEffect(() => { setMini(Boolean(isMinimized)); }, [isMinimized]);

  useEffect(() => {
    if (threadId && threadId !== activeThread) setActiveThread(threadId);
  }, [threadId]);

  const toggle = () => {
    const next = !mini;
    setMini(next);
    if (typeof setIsMinimized === "function") setIsMinimized(next);
  };

  const handleSelect = (id) => {
    setActiveThread(id);
    navigate(`/chat/${id}`);
    if (isMobile) setMobileOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <div
          className="fixed z-40 flex gap-2"
          style={{ top: "4.25rem", left: "0.875rem" }}
        >
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setMobileOpen(v => !v)}
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 38, height: 38,
              background: mobileOpen ? "var(--accent)" : "rgba(8,13,10,0.92)",
              color: mobileOpen ? "#000" : "var(--accent)",
              border: `1.5px solid ${mobileOpen ? "var(--accent)" : "rgba(34,197,94,0.35)"}`,
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <MenuIcon />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onNewChat}
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 38, height: 38,
              background: "rgba(8,13,10,0.92)",
              color: "var(--accent)",
              border: "1.5px solid rgba(34,197,94,0.35)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <PenIcon />
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-30"
                style={{ background: "rgba(4,8,6,0.72)", backdropFilter: "blur(3px)" }}
              />

              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 32 }}
                className="fixed top-0 left-0 bottom-0 z-40 flex flex-col"
                style={{
                  width: "min(300px, 82vw)",
                  background: "var(--navy-card)",
                  borderRight: "1px solid rgba(34,197,94,0.15)",
                  boxShadow: "8px 0 40px rgba(0,0,0,0.6)",
                }}
              >
                <div
                  className="flex items-center justify-between h-14 px-4 flex-shrink-0"
                  style={{ borderBottom: "1px solid rgba(34,197,94,0.1)" }}
                >
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.22em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Threads
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { onNewChat(); setMobileOpen(false); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        color: "var(--text-muted)",
                        border: "1px solid rgba(34,197,94,0.15)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.15)"; }}
                    >
                      <PenIcon />
                    </button>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm"
                      style={{
                        color: "var(--text-muted)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--text-white)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto neo-scrollbar px-3 py-3">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 text-xl"
                        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.14)" }}
                      >
                        💬
                      </div>
                      <p className="text-xs font-medium leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        No threads yet.<br />Start a new chat!
                      </p>
                    </div>
                  ) : (
                    history.map(chat => (
                      <ThreadItem
                        key={chat.threadId}
                        chat={chat}
                        isActive={activeThread === chat.threadId}
                        onSelect={handleSelect}
                      />
                    ))
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      animate={{ width: mini ? MINI : FULL }}
      transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-14 left-0 z-30 flex flex-col overflow-hidden"
      style={{
        height: "calc(100vh - 3.5rem)",
        background: "var(--navy-card)",
        borderRight: "1px solid rgba(34,197,94,0.1)",
      }}
    >
      <div
        className={`flex items-center h-12 px-3 flex-shrink-0 ${mini ? "justify-center" : "justify-between"}`}
        style={{ borderBottom: "1px solid rgba(34,197,94,0.08)" }}
      >
        {!mini && (
          <span className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
            Threads
          </span>
        )}

        <div className={`flex items-center ${mini ? "flex-col gap-2" : "gap-1"}`}>
          {!mini && (
            <button
              onClick={onNewChat}
              title="New thread"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(34,197,94,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}
            >
              <PenIcon />
            </button>
          )}
          <button
            onClick={toggle}
            title={mini ? "Expand" : "Collapse"}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-white)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; }}
          >
            <ChevronIcon left={!mini} />
          </button>
        </div>
      </div>

      {mini && (
        <div className="flex flex-col items-center pt-4 gap-3">
          <button
            onClick={onNewChat}
            title="New thread"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: "var(--text-muted)", border: "1px solid rgba(34,197,94,0.14)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "rgba(34,197,94,0.1)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.14)"; }}
          >
            <PenIcon />
          </button>
        </div>
      )}

      <AnimatePresence>
        {!mini && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex-1 overflow-y-auto neo-scrollbar px-2.5 py-3"
          >
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 text-xl"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.14)" }}
                >
                  💬
                </div>
                <p className="text-xs font-medium leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  No threads yet.<br />Start a new chat!
                </p>
              </div>
            ) : (
              history.map(chat => (
                <ThreadItem
                  key={chat.threadId}
                  chat={chat}
                  isActive={activeThread === chat.threadId}
                  onSelect={handleSelect}
                />
              ))
            )}
            <div className="h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default ChatSidebar;