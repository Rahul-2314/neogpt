import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelect from "./LanguageSelect";
import { getUser, updateUserLanguage } from "../api/authAPI";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_neogpt.png";

const Navbar = ({ language, setLanguage, tokenUsage }) => {
	const [user, setUser] = useState(null);
	const [showProfile, setShowProfile] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				const data = await getUser();
				setUser(data);
				setLanguage(data.language || "English");
			} catch (err) {
				console.error("Navbar getUser:", err.message);
			}
		})();
	}, [setLanguage]);

	const formatPlan = (plan) => {
		if (!plan) return "Free";

		return plan
			.replace("_plus", "+")
			.replace("_", " ")
			.replace(/\b\w/g, (c) => c.toUpperCase());
	};

	const handleLanguageChange = async (lang) => {
		try {
			setLanguage(lang);
			const res = await updateUserLanguage(lang);
			setUser((p) => (p ? { ...p, language: res.language } : p));
			localStorage.setItem(
				"user",
				JSON.stringify({ ...(user || {}), language: res.language }),
			);
		} catch (err) {
			console.error("lang update:", err.message);
		}
	};

	useEffect(() => {
		const handler = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target))
				setShowProfile(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
		navigate("/home");
	};

  console.log(tokenUsage);

	const initials = user?.fullname
		? user.fullname
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "?";

	return (
		<nav
			className="w-full fixed top-0 z-50 h-14 flex items-center"
			style={{
				background: "rgba(7,11,8,0.86)",
				backdropFilter: "blur(22px)",
				borderBottom: "1px solid rgba(34,197,94,0.12)",
			}}
		>
			<div className="w-full px-3 sm:px-5 flex items-center justify-between gap-3">
				<button
					onClick={() => navigate("/home")}
					className="flex items-center gap-2 flex-shrink-0 group"
				>
					<img src={logo} alt="NeoGPT" className="w-7 h-7 sm:w-8 sm:h-8" />
					<span
						className="font-extrabold text-[15px] tracking-tight sm:block transition-colors group-hover:text-[var(--accent)]"
						style={{ color: "var(--text-white)" }}
					>
						NeoGPT
					</span>
				</button>

				<div
					className="flex items-center gap-2 sm:gap-3 relative"
					ref={dropdownRef}
				>
					<LanguageSelect
						language={language}
						setLanguage={handleLanguageChange}
						small
					/>

					{user ? (
						<>
							<button
								onClick={() => setShowProfile((p) => !p)}
								className="relative w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 transition-all"
								style={{
									background: showProfile
										? "var(--accent)"
										: "linear-gradient(135deg, var(--accent) 0%, #4ade80 100%)",
									color: "#000",
									boxShadow: showProfile
										? "0 0 0 2px rgba(34,197,94,0.5), 0 0 12px rgba(34,197,94,0.3)"
										: "none",
								}}
							>
								{initials}
							</button>

							<AnimatePresence>
								{showProfile && (
									<motion.div
										initial={{ opacity: 0, y: -6, scale: 0.96 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: -6, scale: 0.96 }}
										transition={{ type: "spring", stiffness: 380, damping: 28 }}
										className="absolute right-0 top-[2.75rem] w-64 rounded-2xl p-1 z-50"
										style={{
											background: "var(--navy-card)",
											border: "1px solid rgba(34,197,94,0.18)",
											boxShadow:
												"0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.05)",
										}}
									>
										<div className="px-4 pt-4 pb-3">
											<div className="flex items-center gap-3 mb-4">
												<div
													className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-sm flex-shrink-0"
													style={{
														background:
															"linear-gradient(135deg, var(--accent) 0%, #4ade80 100%)",
													}}
												>
													{initials}
												</div>
												<div className="overflow-hidden flex-1">
													<div className="flex items-center gap-2">
														<p
															className="font-bold text-sm truncate"
															style={{ color: "var(--text-white)" }}
														>
															{user.fullname}
														</p>

														{/* Badge */}
														<div className="relative group">
															<span
																className="font-bold rounded-full cursor-pointer"
																style={{
																	background: "rgba(34,197,94,0.1)",
																	// border: "1px solid rgba(34,197,94,0.25)",
																	color: "var(--accent)",
																}}
															>
																ⓥ
															</span>

															{/* Tooltip */}
															<div
																className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
																style={{
																	background: "#111",
																	color: "#fff",
																	border: "1px solid rgba(255,255,255,0.1)",
																}}
															>
																-{user.username}
															</div>
														</div>
													</div>
													<span
														className="text-xs font-bold px-2 py-0.5 rounded-full"
														style={{
															background: "rgba(34,197,94,0.1)",
															border: "1px solid rgba(34,197,94,0.25)",
															color: "var(--accent)",
														}}
													>
														{formatPlan(user.plan)}
													</span>
												</div>
											</div>

											<div
												className="rounded-xl px-3 py-2.5 mb-3 flex items-center justify-between"
												style={{
													background: "rgba(34,197,94,0.07)",
													border: "1px solid rgba(34,197,94,0.14)",
												}}
											>
												<span
													className="text-xs font-medium"
													style={{ color: "var(--text-secondary)" }}
												>
													Language
												</span>
												<span
													className="text-xs font-bold"
													style={{ color: "var(--accent)" }}
												>
													{user.language || "Not set"}
												</span>
											</div>
											{tokenUsage && (
												<div style={{ marginBottom: 10 }}>
													<div
														style={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "center",
															marginBottom: 5,
														}}
													>
														<span
															className="text-xs"
															style={{ color: "var(--text-muted)" }}
														>
															Tokens
														</span>
														<span
															className="text-xs font-bold"
															style={{ color: "var(--accent)" }}
														>
															{(tokenUsage.tokensUsed / 1000).toFixed(1)}k
															{" / "}
															{tokenUsage.limit === Infinity
																? "∞"
																: `${(tokenUsage.limit / 1000).toFixed(0)}k`}
														</span>
													</div>
													<div
														style={{
															height: 4,
															borderRadius: 4,
															background: "rgba(255,255,255,0.08)",
															overflow: "hidden",
														}}
													>
														<div
															style={{
																height: "100%",
																borderRadius: 4,
																background:
																	tokenUsage.tokensUsed / tokenUsage.limit >
																	0.85
																		? "#f87171"
																		: "var(--accent)",
																width:
																	tokenUsage.limit === Infinity
																		? "6%"
																		: `${Math.min(100, (tokenUsage.tokensUsed / tokenUsage.limit) * 100)}%`,
																transition: "width 0.5s ease",
															}}
														/>
													</div>
													<div
														style={{
															display: "flex",
															justifyContent: "space-between",
															marginTop: 4,
														}}
													>
														<span
															className="text-[10px]"
															style={{ color: "var(--text-faint)" }}
														>
															{tokenUsage.plan} plan
														</span>
														<span
															className="text-[10px]"
															style={{ color: "var(--text-faint)" }}
														>
															{tokenUsage.plan !== "premium_plus"
																? `${(tokenUsage.tokensRemaining / 1000).toFixed(0)}k left`
																: "Unlimited"}
														</span>
													</div>
													{tokenUsage.plan != "premium_plus" &&
														tokenUsage.tokensUsed / tokenUsage.limit > 0.8 && (
															<a
																href="/home#pricing"
																className="block text-center text-[10px] font-bold mt-2 py-1.5 rounded-lg"
																style={{
																	background: "rgba(34,197,94,0.1)",
																	border: "1px solid rgba(34,197,94,0.25)",
																	color: "var(--accent)",
																	textDecoration: "none",
																}}
															>
																Upgrade plan →
															</a>
														)}
												</div>
											)}
										</div>

										<div className="px-1 pb-1">
											<button
												onClick={handleLogout}
												className="w-full py-2.5 text-sm font-semibold rounded-xl transition-all"
												style={{
													background: "rgba(239,68,68,0.08)",
													border: "1px solid rgba(239,68,68,0.18)",
													color: "#f87171",
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.background =
														"rgba(239,68,68,0.15)";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.background =
														"rgba(239,68,68,0.08)";
												}}
											>
												Log out
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</>
					) : (
						<button
							onClick={() => navigate("/auth")}
							className="btn-glow text-black text-xs font-bold px-4 py-2 rounded-xl transition-all"
							style={{ background: "var(--accent)" }}
						>
							Log in
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;