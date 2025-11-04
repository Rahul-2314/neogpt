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
				setHistory(data);
			} catch (err) {
				console.error("Error loading history:", err.message);
			}
		};
		loadHistory();
	}, [activeThread]);

	// sync parent -> local
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
	};

	const toggle = () => {
		const newState = !isMinimizedLocal;
		setIsMinimizedLocal(newState);
		if (typeof setIsMinimized === "function") setIsMinimized(newState);
	};

	return (
		<motion.aside
			initial={{ x: -200, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.28 }}
			className={`text-white fixed top-20 left-0 z-30 border-r border-gray-700 backdrop-blur-lg transition-all duration-300 ${
				isMinimizedLocal ? "w-16" : "w-64"
			} h-[calc(100vh-5rem)]`}
		>
			{/* header */}
			<div className="p-4 flex justify-between items-center border-b border-gray-700">
				{!isMinimizedLocal && (
					<h2 className="text-cyan-400 font-semibold text-lg">Chat History</h2>
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
						aria-label={
							isMinimizedLocal ? "Expand sidebar" : "Minimize sidebar"
						}
					>
						{isMinimizedLocal ? (
							<ChevronRight size={18} />
						) : (
							<ChevronLeft size={18} />
						)}
					</button>
				</div>
			</div>

			{/* scrollable list */}
			<AnimatePresence>
				{!isMinimizedLocal && (
					<motion.div
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						className="mt-2 px-2 py-2"
					>
						{/* the actual scroll container */}
						<div
							className="overflow-y-auto scroll-smooth no-scrollbar max-h-[calc(100vh-9rem)]"
							/* NOTE: max-h leaves space for header + input area — adjust if your input box is taller */
						>
							{history.length === 0 ? (
								<p className="text-gray-400 text-sm px-4">No chats yet</p>
							) : (
								history.map((chat) => (
									<div
										key={chat.threadId}
										onClick={() => handleSelectThread(chat.threadId)}
										className={`cursor-pointer px-4 py-3 mb-2 rounded-lg mx-2 border transition-all ${
											activeThread === chat.threadId
												? "bg-cyan-600/40 border-cyan-400"
												: "border-cyan-600/20 hover:bg-cyan-500/10"
										}`}
									>
										<p className="truncate text-sm text-gray-100">
											{chat.messages?.[0]?.text || "New conversation"}
										</p>
										<p className="text-xs text-gray-400 mt-2">
											{new Date(chat.updatedAt).toLocaleString()}
										</p>
									</div>
								))
							)}

							{/* Add extra bottom padding to avoid being hidden by fixed InputBox */}
							<div className="h-40" />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.aside>
	);
};

export default ChatSidebar;
