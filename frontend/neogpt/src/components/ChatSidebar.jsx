import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getChatHistory } from "../api/authAPI";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ChatSidebar = ({
	activeThread,
	setActiveThread,
	onNewChat,
	isMinimized,
	setIsMinimized,
}) => {
	const [history, setHistory] = useState([]);
	const [isMinimizedLocal, setIsMinimizedLocal] = useState(
		Boolean(isMinimized)
	);
	const navigate = useNavigate();
	const { threadId } = useParams();

	useEffect(() => {
		const loadHistory = async () => {
			try {
				const data = await getChatHistory();
				setHistory(data || []);
			} catch (err) {
				console.error("Error loading history:", err.message);
			}
		};
		loadHistory();
	}, [activeThread]);

	useEffect(() => {
		setIsMinimizedLocal(Boolean(isMinimized));
	}, [isMinimized]);

	useEffect(() => {
		if (threadId && threadId !== activeThread) {
			setActiveThread(threadId);
		}
	}, [threadId]);

	const handleSelectThread = (id) => {
		setActiveThread(id);
		navigate(`/chat/${id}`);
		if (window.innerWidth < 768) toggle(); // auto-close sidebar on mobile
	};

	const toggle = () => {
		const newState = !isMinimizedLocal;
		setIsMinimizedLocal(newState);
		if (typeof setIsMinimized === "function") setIsMinimized(newState);
	};

	return (
		<>
			{/* Sidebar for larger screens */}
			<motion.aside
				initial={{ x: -200, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.28 }}
				className={`hidden md:block text-white fixed top-20 left-0 z-30 border-r border-gray-700 backdrop-blur-lg overflow-y-auto transition-all duration-300 ${
					isMinimizedLocal ? "w-16" : "w-64"
				} h-[calc(100vh-5rem)] no-scrollbar`}
			>
				<div className="p-4 flex justify-between items-center">
					{!isMinimizedLocal && (
						<h2 className="text-cyan-400 font-semibold text-lg">
							Chat History
						</h2>
					)}
					<div className="flex items-center gap-2">
						{!isMinimizedLocal && (
							<button
								onClick={onNewChat}
								className="bg-gradient-to-r from-cyan-500 to-amber-500 text-black font-bold text-sm px-3 py-1 rounded-full hover:opacity-90"
							>
								+
							</button>
						)}
						<button
							onClick={toggle}
							className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
						>
							{isMinimizedLocal ? (
								<ChevronRight size={18} />
							) : (
								<ChevronLeft size={18} />
							)}
						</button>
					</div>
				</div>

				<AnimatePresence>
					{!isMinimizedLocal && (
						<motion.div
							initial={{ opacity: 0, y: -6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							className="mt-2 space-y-1 pb-20"
						>
							{history.length === 0 ? (
								<p className="text-gray-400 text-sm px-4">No chats yet</p>
							) : (
								history.map((chat) => (
									<div
										key={chat.threadId}
										onClick={() => handleSelectThread(chat.threadId)}
										className={`cursor-pointer px-4 py-2 rounded-lg mx-2 border border-cyan-600/20 ${
											activeThread === chat.threadId
												? "bg-cyan-600/40 border-cyan-400"
												: "hover:bg-cyan-500/10"
										}`}
									>
										<p className="truncate text-sm text-gray-100">
											{chat.messages?.[0]?.text || "New conversation"}
										</p>
										<p className="text-xs text-gray-400">
											{new Date(chat.updatedAt).toLocaleString()}
										</p>
									</div>
								))
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</motion.aside>

			{/* Floating toggle button for mobile */}
			<button
				onClick={toggle}
				className="md:hidden fixed top-24 left-4 z-40 bg-cyan-600 text-white p-3 rounded-full shadow-lg focus:outline-none"
			>
				{isMinimizedLocal ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
			</button>

			{/* Slide-in mobile sidebar */}
			<AnimatePresence>
				{!isMinimizedLocal && (
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ duration: 0.3 }}
						className="md:hidden fixed inset-y-0 left-0 z-30 w-64 bg-neutral-900 border-r border-gray-700 overflow-y-auto no-scrollbar p-4"
					>
						<h2 className="text-cyan-400 font-semibold text-lg mb-3">
							Chat History
						</h2>
						<button
							onClick={onNewChat}
							className="bg-gradient-to-r from-cyan-500 to-amber-500 text-black font-bold text-sm px-3 py-1 rounded-full hover:opacity-90 mb-3"
						>
							+
						</button>

						<div className="space-y-1 pb-24">
							{history.length === 0 ? (
								<p className="text-gray-400 text-sm px-4">No chats yet</p>
							) : (
								history.map((chat) => (
									<div
										key={chat.threadId}
										onClick={() => handleSelectThread(chat.threadId)}
										className={`cursor-pointer px-4 py-2 rounded-lg border border-cyan-600/20 ${
											activeThread === chat.threadId
												? "bg-cyan-600/40 border-cyan-400"
												: "hover:bg-cyan-500/10"
										}`}
									>
										<p className="truncate text-sm text-gray-100">
											{chat.messages?.[0]?.text || "New conversation"}
										</p>
										<p className="text-xs text-gray-400">
											{new Date(chat.updatedAt).toLocaleString()}
										</p>
									</div>
								))
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default ChatSidebar;