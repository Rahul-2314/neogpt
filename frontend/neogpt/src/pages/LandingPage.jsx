import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import hero from "../assets/hero.png";

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white bg-gradient-to-br from-[#00111F] via-[#002A4A] to-[#0B3B5C]">
			{/* 🔵 Animated glowing background — LOWER z-index */}
			<motion.div
				className="absolute w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl top-[-10rem] left-[-10rem] pointer-events-none z-0"
				animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
				transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-3xl bottom-[-10rem] right-[-10rem] pointer-events-none z-0"
				animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
				transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
			/>

			{/* 🌟 Foreground Content (Higher z-index) */}
			<div className="relative z-10 flex flex-col items-center px-6 text-center">
				<motion.h1
					initial={{ opacity: 0, y: -40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
					className="text-5xl md:text-6xl font-extrabold mb-4"
				>
					<span className="text-cyan-400">NeoGPT</span>
					<span className="text-amber-400"> — AI That Speaks You</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 1 }}
					className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10"
				>
					Bridging the gap between humans and machines — a culturally
					intelligent chatbot that understands your language, emotion, and
					context.
				</motion.p>

				<motion.img
					src={hero}
					alt="NeoGPT Illustration"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.5, duration: 1 }}
					className="w-[90%] md:w-[700px] rounded-2xl shadow-2xl mb-10"
				/>

				<motion.button
					whileHover={{
						scale: 1.05,
						boxShadow: "0 0 25px rgba(34,211,238,0.6)",
					}}
					whileTap={{ scale: 0.95 }}
					onClick={() => navigate("/chat")}
					className="bg-gradient-to-r from-cyan-500 to-amber-500 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all focus:outline-none z-20"
				>
					🚀 Start Chat
				</motion.button>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.3, duration: 1 }}
					className="absolute bottom-6 text-sm text-gray-400 italic"
				>
					“Where AI meets Humanity”
				</motion.div>
			</div>
		</div>
	);
};

export default LandingPage;
