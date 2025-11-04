import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import InputBox from "../components/InputBox";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import { getUser, getChatByThreadId } from "../api/authAPI";

const ChatPage = () => {
	const { threadId } = useParams();
	const navigate = useNavigate();

	const [messages, setMessages] = useState([]);
	const [language, setLanguage] = useState("English");
	const [activeThread, setActiveThread] = useState(threadId || null);
	const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const data = await getUser();
				setLanguage(data.language || "English");
			} catch (err) {
				console.error("chat getUser error:", err.message);
			}
		};
		loadUser();
	}, []);

	useEffect(() => {
		if (!threadId) {
			const newId =
				Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
			setActiveThread(newId);
			navigate(`/chat/${newId}`, { replace: true });
		}
	}, [threadId, navigate]);

	useEffect(() => {
		if (!activeThread) return;
		const loadThread = async () => {
			try {
				const data = await getChatByThreadId(activeThread);
				setMessages(data.messages || data);
			} catch (err) {
				console.warn("🆕 New chat, no previous history yet.");
				setMessages([]);
			}
		};
		loadThread();
	}, [activeThread]);

	useEffect(() => {
		if (activeThread && threadId !== activeThread) {
			navigate(`/chat/${activeThread}`, { replace: true });
		}
	}, [activeThread, threadId, navigate]);

	const handleNewChat = () => {
		const newId =
			Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
		setActiveThread(newId);
		setMessages([]);
		navigate(`/chat/${newId}`);
	};

	const handleSend = async (text) => {
		const token = localStorage.getItem("authToken");
		if (!token) {
			alert("Session expired. Please log in again.");
			window.location.href = "/auth";
			return;
		}
		if (!activeThread) {
			handleNewChat();
			return;
		}
		const userMsg = { role: "user", text };
		setMessages((prev) => [
			...prev,
			userMsg,
			{ role: "assistant", text: "Thinking..." },
		]);
		try {
			const response = await fetch("http://localhost:5000/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					threadId: activeThread,
					message: text,
					language,
				}),
			});
			const data = await response.json();
			setMessages((prev) => [
				...prev.slice(0, -1),
				{ role: "assistant", text: data.message },
			]);
		} catch (err) {
			console.error("Chat error:", err.message);
			setMessages((prev) => [
				...prev.slice(0, -1),
				{ role: "assistant", text: "⚠️ Error connecting to server." },
			]);
		}
	};

	// sidebar width values (in px or rem) used by InputBox + chat wrapper
	const sidebarExpandedWidth = 256; // 16rem => 16 * 16 = 256px (tailwind 'w-64')
	const sidebarMinWidth = 64; // 4rem => 64px (tailwind 'w-16')

	return (
		<div className="bg-neutral-900 text-white min-h-screen pt-20 flex">
			<Navbar language={language} setLanguage={setLanguage} />

			<ChatSidebar
				activeThread={activeThread}
				setActiveThread={setActiveThread}
				onNewChat={handleNewChat}
				// pass toggle state and setter
				isMinimized={isSidebarMinimized}
				setIsMinimized={setIsSidebarMinimized}
			/>

			{/* Content area — use inline style marginLeft to avoid tailwind calc issues */}
			<div
				className="flex-1 transition-all duration-300"
				style={{
					marginLeft: isSidebarMinimized
						? `${sidebarMinWidth}px`
						: `${sidebarExpandedWidth}px`,
				}}
			>
				<ChatContainer messages={messages} />
				<InputBox
					onSend={handleSend}
					sidebarOffset={
						isSidebarMinimized ? sidebarMinWidth : sidebarExpandedWidth
					}
				/>
			</div>
		</div>
	);
};

export default ChatPage;
