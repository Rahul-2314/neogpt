import React, { useState, useRef, useEffect } from "react";

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2L7 9M14 2L9.5 14L7 9L2 6.5L14 2Z" />
  </svg>
);

const InputBox = ({ onSend, sidebarOffset = 256 }) => {
  const [input,   setInput]   = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef           = useRef(null);

  const handleSend = () => {
    const val = input.trim();
    if (!val) return;
    onSend(val);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  const canSend = input.trim().length > 0;

  return (
    <div className="fixed bottom-0 z-40 transition-all duration-300"
      style={{ left: sidebarOffset, right: 0 }}>

      <div className="px-3 sm:px-5 py-3"
        style={{
          background: "rgba(7,11,8,0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(34,197,94,0.1)",
        }}>
        <div className="max-w-2xl mx-auto">

          <div className="relative rounded-2xl overflow-hidden transition-all"
            style={{
              background: "var(--navy-card)",
              border: focused
                ? "1px solid rgba(34,197,94,0.5)"
                : "1px solid rgba(34,197,94,0.15)",
              boxShadow: focused
                ? "0 0 0 3px rgba(34,197,94,0.08), 0 4px 24px rgba(0,0,0,0.4)"
                : "0 2px 12px rgba(0,0,0,0.3)",
            }}>

            {focused && (
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)" }} />
            )}

            <div className="flex items-end gap-2 px-4 py-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={1}
                placeholder="Message NeoGPT in any language…"
                className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
                style={{
                  minHeight: 24, maxHeight: 140,
                  color: "var(--text-white)",
                  caretColor: "var(--accent)",
                }} />

              <button onClick={handleSend} disabled={!canSend}
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 mb-0.5"
                style={{
                  background: canSend
                    ? "linear-gradient(135deg, var(--accent) 0%, #4ade80 100%)"
                    : "rgba(255,255,255,0.06)",
                  color:  canSend ? "#000" : "var(--text-faint)",
                  cursor: canSend ? "pointer" : "not-allowed",
                  border: "none",
                  boxShadow: canSend ? "0 0 12px rgba(34,197,94,0.35)" : "none",
                  transform: canSend ? "scale(1)" : "scale(0.95)",
                }}>
                <SendIcon />
              </button>
            </div>
          </div>

          <p className="text-center mt-1.5 select-none text-[10px]" style={{ color: "var(--text-faint)" }}>
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputBox;