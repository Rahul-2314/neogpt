import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_neogpt.png";
import { G, G2, FUTURE, STACK, iv, bs } from "./landing/constants";
import HeroSection from "./landing/HeroSection";
import {
	FeaturesSection,
	BusinessSection,
	PricingSection,
} from "./landing/ProductSections";

// ── Roadmap ==================================================
const RoadmapSection = () => (
	<section id="future" className="py-20 sm:py-20 px-4 sm:px-6 relative z-10">
		<div className="max-w-5xl mx-auto">
			<motion.div {...iv(0)} className="text-center mb-10 sm:mb-12">
				<p
					className="text-xs font-bold tracking-[0.22em] uppercase mb-3"
					style={{ color: "#4ade80" }}
				>
					Roadmap
				</p>
				<h2
					className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
					style={{ color: "var(--text-white)" }}
				>
					What's coming next
				</h2>
				<p
					className="mt-3 text-sm sm:text-base max-w-md mx-auto"
					style={{ color: "var(--text-secondary)" }}
				>
					NeoGPT is evolving from a chatbot into a full-fledged vernacular AI
					ecosystem.
				</p>
			</motion.div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{FUTURE.map((f, i) => (
					<motion.div
						key={f.title}
						{...iv(i * 0.06)}
						className="feature-card relative rounded-2xl p-5 sm:p-6 overflow-hidden cursor-default"
						style={{
							background: "var(--navy-card)",
							border: "1px solid rgba(34,197,94,0.08)",
						}}
						whileHover={{
							borderColor: f.color + "44",
							boxShadow: "0 8px 38px rgba(0,0,0,0.55)",
							y: -4,
						}}
						transition={bs}
					>
						<motion.div
							className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
							style={{
								background: `radial-gradient(circle, ${f.color}, transparent)`,
								filter: "blur(18px)",
							}}
							initial={{ opacity: 0.08 }}
							whileHover={{ opacity: 0.22 }}
							transition={{ duration: 0.3 }}
						/>
						<div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{f.icon}</div>
						<div className="flex items-center gap-2 mb-2">
							<h3
								className="font-bold text-[14px] sm:text-[15px]"
								style={{ color: "var(--text-white)" }}
							>
								{f.title}
							</h3>
							<span
								className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
								style={{
									background: `rgba(${G2},0.1)`,
									color: "#4ade80",
									border: `1px solid rgba(${G2},0.2)`,
								}}
							>
								Soon
							</span>
						</div>
						<p
							className="text-xs sm:text-sm leading-relaxed"
							style={{ color: "var(--text-secondary)" }}
						>
							{f.desc}
						</p>
					</motion.div>
				))}
			</div>
		</div>
	</section>
);

// ── CTA ===========================================
const CTASection = ({ handleCTA }) => (
	<section className="py-12 sm:py-16 px-4 sm:px-6 relative z-10">
		<div className="max-w-4xl mx-auto">
			<motion.div
				{...iv(0)}
				className="relative rounded-3xl p-8 sm:p-10 md:p-14 text-center overflow-hidden"
				style={{
					background: "linear-gradient(135deg,#0D1A0F,#0A1208)",
					border: `1px solid rgba(${G2},0.14)`,
				}}
				whileHover={{ borderColor: `rgba(${G2},0.3)` }}
				transition={{ duration: 0.35 }}
			>
				<div
					className="absolute inset-0 rounded-3xl pointer-events-none"
					style={{
						background: `radial-gradient(ellipse 90% 70% at 50% 0%, rgba(${G2},0.1), transparent)`,
					}}
				/>
				<div
					className="absolute bottom-0 left-0 right-0 h-px"
					style={{
						background: `linear-gradient(90deg, transparent, rgba(${G2},0.5), transparent)`,
					}}
				/>
				<div className="relative z-10">
					<motion.p
						className="text-4xl sm:text-5xl mb-4 sm:mb-5 font-mono"
						animate={{ rotate: [0, 6, -4, 0] }}
						transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
					>
						🌥️
					</motion.p>
					<h2
						className="text-xl sm:text-2xl md:text-4xl font-extrabold mb-4 tracking-tight leading-tight"
						style={{ color: "var(--text-white)" }}
					>
						Not just multilingual —<br />
						<span className="gradient-text">
							multi-cultural, multimodal,
							<br className="hidden sm:block" />
							emotionally aware
						</span>
					</h2>
					<p
						className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-7 sm:mb-8"
						style={{ color: "var(--text-secondary)" }}
					>
						From a Marwari trader to a Tamil student to a Bengali grandmother —
						every conversation understood, every response felt.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
						<motion.button
							onClick={handleCTA}
							className="btn-glow text-black font-bold text-sm sm:text-base px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl w-full sm:w-auto"
							style={{ background: G }}
							whileHover={{ scale: 1.06, filter: "brightness(1.08)" }}
							whileTap={{ scale: 0.95 }}
							transition={bs}
						>
							Start conversation →
						</motion.button>
						<motion.a
							href="#pricing"
							className="btn-glow bg-white font-bold text-sm sm:text-base px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl w-full sm:w-auto text-center"
							style={{ color: "green" }}
							whileHover={{ color: G }}
							transition={{ duration: 0.15 }}
						>
							View pricing 👆
						</motion.a>
					</div>
				</div>
			</motion.div>
		</div>
	</section>
);

// Stack + Footer ==========================================
const StackAndFooter = () => {
	const navigate = useNavigate();
	return (
		<>
			<section
				id="stack"
				className="py-12 sm:py-14 px-4 sm:px-6 relative z-10"
				style={{ borderTop: "1px solid rgba(34,197,94,0.07)" }}
			>
				<div className="max-w-5xl mx-auto text-center">
					<p
						className="text-xs uppercase tracking-[0.2em] mb-6 sm:mb-7 font-bold"
						style={{ color: "var(--text-secondary)", fontFamily: "fantasy" }}
					>
						Built with
					</p>
					<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
						{STACK.map((t, i) => (
							<motion.span
								key={t}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									delay: i * 0.04,
									type: "spring",
									stiffness: 260,
									damping: 22,
								}}
								className="text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl cursor-default"
								style={{
									background: `rgba(${G2},0.04)`,
									border: `1px solid rgba(${G2},0.1)`,
									color: "var(--text-muted)",
									fontFamily: "fantasy",
									fontStretch: "extra-expanded",
								}}
								whileHover={{
									color: G,
									borderColor: `rgba(${G2},0.3)`,
									backgroundColor: `rgba(${G2},0.08)`,
									transition: "duration: 0.18",
								}}
							>
								{t}
							</motion.span>
						))}
					</div>
				</div>
			</section>

			<footer
				className="py-6 sm:py-8 px-4 sm:px-6 relative z-10"
				style={{ borderTop: "1px solid rgba(34,197,94,0.07)" }}
			>
				<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
					<motion.div
						className="flex items-center gap-2.5 cursor-pointer"
						onClick={() => navigate("/home")}
						whileHover={{ scale: 1.03 }}
						transition={bs}
					>
						<img src={logo} alt="NeoGPT" className="w-6 h-6 sm:w-7 sm:h-7" />
						<span
							className="font-extrabold text-sm"
							style={{ color: "var(--text-white)" }}
						>
							NeoGPT
						</span>
						<span
							className="text-xs sm:text-sm italic hidden sm:inline"
							style={{ color: "var(--text-white)", fontFamily: "monospace" }}
						>
							— AI That Speaks You
						</span>
					</motion.div>
					<div
						className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs"
						style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}
					>
						{["#", "#features", "#business", "#pricing", "#future"].map(
							(href, i) => (
								<a
									key={href}
									href={href}
									className="hover:text-white transition-colors"
								>
									{["Home", "Features", "Business", "Pricing", "Roadmap"][i]}
								</a>
							),
						)}
					</div>
					<p
						className="text-xs text-center"
						style={{
							color: "var(--text-white)",
							fontFamily: "monospace",
							fontWeight: "bolder",
						}}
					>
						© {new Date().getFullYear()}, NeoGPT - by{" "}
						<span style={{ color: "#25D565" }}>
							<a
								href="https://rahulchowdhury.in/"
								className="hover:text-white hover:underline transition-colors"
								target="_blank"
							>
								Rahul Chowdhury
							</a>
						</span>
						.
					</p>
				</div>
			</footer>
		</>
	);
};

// ── Main Orchestrator ─────────────────────────────────────────────
const LandingPage = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("authToken");
	const handleCTA = () => navigate(token ? "/chat" : "/auth");

	return (
		<div
			className="min-h-screen overflow-x-hidden"
			style={{ background: "var(--navy)", color: "var(--text-white)" }}
		>
			<HeroSection handleCTA={handleCTA} token={token} />
			<FeaturesSection />
			<BusinessSection />
			<PricingSection handleCTA={handleCTA} token={token} />
			<RoadmapSection />
			<CTASection handleCTA={handleCTA} />
			<StackAndFooter />
		</div>
	);
};

export default LandingPage;
