import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelect from "./LanguageSelect";
import { getUser, updateUserLanguage } from "../api/authAPI";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_neogpt.png";

const Navbar = ({ language, setLanguage }) => {
	const [user, setUser] = useState(null);
	const [showProfile, setShowProfile] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	// Load user info when Navbar mounts
	useEffect(() => {
		const loadUser = async () => {
			try {
				const data = await getUser();
				setUser(data);
				setLanguage(data.language || "English"); // sync parent ChatPage
			} catch (err) {
				console.error("Navbar getUser error:", err.message);
			}
		};
		loadUser();
	}, [setLanguage]);

	// Handle language change (update both backend + frontend)
	const handleLanguageChange = async (newLang) => {
		try {
			setLanguage(newLang); // update parent ChatPage immediately
			const res = await updateUserLanguage(newLang); // update backend
			setUser((prev) => (prev ? { ...prev, language: res.language } : prev));

			// Update stored user info
			localStorage.setItem(
				"user",
				JSON.stringify({ ...(user || {}), language: res.language })
			);

			console.log("🌐 Language updated to:", res.language);
		} catch (err) {
			console.error("handleLanguageChange error:", err.message);
		}
	};

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setShowProfile(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Logout function
	const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		navigate("/home");
	};

	return (
		<nav className="w-full bg-gradient-to-r from-[#00111F] via-[#002A4A] to-[#0B3B5C] text-white flex justify-between items-center px-6 py-3 shadow-md fixed top-0 z-50">
			{/* 🔹 Logo Section */}
			<div
				className="flex  items-center gap-2 cursor-pointer"
				onClick={() => navigate("/home")}
			>
				<img src={logo} alt="logo" className="w-10 h-10" />
				<div className="bg-cyan-500 text-black font-extrabold text-xl rounded-full px-4 py-1 shadow-md">
					NeoGPT
				</div>
				<span className="text-gray-300 italic hidden sm:inline">
					AI That Speaks You
				</span>
			</div>

			{/* 🔹 Right Section */}
			<div className="flex items-center gap-4 relative">
				{/* 🌐 Language Select */}
				<LanguageSelect
					language={language}
					setLanguage={handleLanguageChange}
					small
				/>

				{/* 👤 Profile Avatar */}
				{user ? (
					<>
						<div
							onClick={() => setShowProfile((prev) => !prev)}
							className="cursor-pointer rounded-full bg-cyan-500 text-black font-bold w-10 h-10 flex items-center justify-center hover:scale-105 transition"
						>
							{user.fullname ? user.fullname.charAt(0).toUpperCase() : "?"}
						</div>

						{/* 🧩 Profile Dropdown */}
						<AnimatePresence>
							{showProfile && (
								<motion.div
									ref={dropdownRef}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.18 }}
									className="absolute right-0 top-14 bg-neutral-800 rounded-xl border border-gray-600 w-64 shadow-xl p-4"
								>
									<h3 className="text-lg font-semibold text-cyan-400 mb-1">
										{user.fullname}
									</h3>
									<p className="text-gray-400 text-sm mb-1">@{user.username}</p>
									<p className="text-gray-400 text-sm mb-3">
										🌐 Language:{" "}
										<span className="text-amber-400 font-medium">
											{user.language || "Not set"}
										</span>
									</p>
									<button
										onClick={handleLogout}
										className="w-full py-2 mt-2 bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full text-black font-semibold hover:opacity-90 transition"
									>
										Logout
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</>
				) : (
					<div className="text-gray-300">Not logged in</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
