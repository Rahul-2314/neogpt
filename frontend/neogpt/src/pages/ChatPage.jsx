import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import InputBox from "../components/InputBox";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import { getUser, getChatByThreadId } from "../api/authAPI";

const SIDEBAR_W      = 256;
const SIDEBAR_MINI_W = 56;
const MOBILE_BP      = 768;

const ChatPage = () => {
  const { threadId } = useParams();
  const navigate     = useNavigate();
  const API_BASE     = import.meta.env.VITE_API_BASE_URL || "https://neogpt-1.onrender.com";

  const [messages,            setMessages]            = useState([]);
  const [language,            setLanguage]            = useState("English");
  const [activeThread,        setActiveThread]        = useState(threadId || null);
  const [isSidebarMinimized,  setIsSidebarMinimized]  = useState(false);
  const [isMobile,            setIsMobile]            = useState(window.innerWidth < MOBILE_BP);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BP;
      setIsMobile(mobile);
      if (mobile) setIsSidebarMinimized(true);
    };
    window.addEventListener("resize", onResize);
    if (window.innerWidth < MOBILE_BP) setIsSidebarMinimized(true);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    getUser()
      .then(d => setLanguage(d.language || "English"))
      .catch(e => console.error("ChatPage getUser:", e.message));
  }, []);

  useEffect(() => {
    if (!threadId) {
      const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
      setActiveThread(id);
      navigate(`/chat/${id}`, { replace: true });
    }
  }, [threadId, navigate]);

  useEffect(() => {
    if (!activeThread) return;
    getChatByThreadId(activeThread)
      .then(d => setMessages(d.messages || d))
      .catch(() => setMessages([]));
  }, [activeThread]);

  useEffect(() => {
    if (activeThread && threadId !== activeThread)
      navigate(`/chat/${activeThread}`, { replace: true });
  }, [activeThread, threadId, navigate]);

  const handleNewChat = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    setActiveThread(id);
    setMessages([]);
    navigate(`/chat/${id}`);
    if (isMobile) setIsSidebarMinimized(true);
  };

  const handleSend = async (text) => {
    const token = localStorage.getItem("authToken");
    if (!token) { navigate("/auth"); return; }
    if (!activeThread) { handleNewChat(); return; }

    setMessages(p => [...p, { role: "user", text }, { role: "assistant", text: "Thinking..." }]);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ threadId: activeThread, message: text, language }),
      });

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/auth");
        return;
      }

      const data = await res.json();
      setMessages(p => [...p.slice(0, -1), { role: "assistant", text: data.message }]);
    } catch (err) {
      console.error("Chat error:", err.message);
      setMessages(p => [
        ...p.slice(0, -1),
        { role: "assistant", text: "⚠️ Error connecting to server. Please try again." },
      ]);
    }
  };

  const sidebarExpanded = !isSidebarMinimized;
  const sidebarOffset   = isMobile ? 0 : (isSidebarMinimized ? SIDEBAR_MINI_W : SIDEBAR_W);
  const showOverlay     = isMobile && sidebarExpanded;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--navy)" }}>

      <Navbar language={language} setLanguage={setLanguage} />

      <ChatSidebar
        activeThread={activeThread}
        setActiveThread={(id) => {
          setActiveThread(id);
          if (isMobile) setIsSidebarMinimized(true);
        }}
        onNewChat={handleNewChat}
        isMinimized={isSidebarMinimized}
        setIsMinimized={setIsSidebarMinimized}
      />

      {showOverlay && (
        <div
          onClick={() => setIsSidebarMinimized(true)}
          className="fixed inset-0 z-20"
          style={{ background: "rgba(4,8,6,0.7)", backdropFilter: "blur(2px)" }}
        />
      )}

      <div
        className="flex flex-col transition-all duration-300"
        style={{
          marginLeft: sidebarOffset,
          marginTop: "3.5rem",
          height: "calc(100vh - 3.5rem)",
        }}>
        <ChatContainer messages={messages} />
        <InputBox onSend={handleSend} sidebarOffset={sidebarOffset} />
      </div>
    </div>
  );
};

export default ChatPage;