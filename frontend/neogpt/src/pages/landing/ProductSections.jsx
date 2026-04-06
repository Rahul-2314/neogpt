import React, { useState } from "react";
import { motion } from "framer-motion";
import { G, G2, LANGUAGES, SMALL_CARDS, BUSINESS_CASES, PRICING, TOKEN_INFO, iv, bs } from "./constants";

// ── BentoLangs ────────────────────────────────────────────────────
const BentoLangs = () => (
  <div className="flex flex-wrap gap-2 mt-4">
    {LANGUAGES.slice(0, 12).map((l, i) => (
      <motion.span key={l} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay:i*0.04, type:"spring", stiffness:400, damping:22 }}
        whileHover={{ scale:1.1 }}
        className="text-xs px-2.5 py-1 rounded-full font-medium cursor-default"
        style={{ background:`rgba(${G2},${0.08+(i%4)*0.025})`, color:G, border:`1px solid rgba(${G2},0.2)` }}>
        {l}
      </motion.span>
    ))}
    <span className="text-xs px-2.5 py-1 rounded-full border"
      style={{ color:"var(--text-muted)", borderColor:"rgba(255,255,255,0.08)" }}>+23 more</span>
  </div>
);

// ── Features Bento ────────────────────────────────────────────────
export const FeaturesSection = () => (
  <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
    <div className="max-w-5xl mx-auto">
      <motion.div {...iv(0)} className="text-center mb-10 sm:mb-12">
        <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color:G }}>What's live</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color:"var(--text-white)" }}>
          Built for India's voice
        </h2>
        <p className="mt-3 text-sm sm:text-base max-w-md mx-auto" style={{ color:"var(--text-secondary)" }}>
          Every feature designed around how India actually communicates.
        </p>
      </motion.div>

      {/* Mobile: stack. md+: bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Languages big — 2 col on md+ */}
        <motion.div {...iv(0)}
          className="md:col-span-2 relative rounded-2xl p-5 sm:p-6 overflow-hidden cursor-default"
          style={{ background:"var(--navy-card)", border:"1px solid rgba(34,197,94,0.1)", minHeight:240 }}
          whileHover={{ borderColor:`rgba(${G2},0.32)`, boxShadow:"0 10px 44px rgba(0,0,0,0.6)", y:-3 }}
          transition={bs}>
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full pointer-events-none"
            style={{ background:`radial-gradient(circle, rgba(${G2},0.2), transparent)`, filter:"blur(24px)" }} />
          <div className="text-4xl mb-3">🌐</div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-extrabold text-base sm:text-lg" style={{ color:"var(--text-white)" }}>35+ Indian Languages</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background:`rgba(${G2},0.12)`, color:"#4ade80", border:`1px solid rgba(${G2},0.25)` }}>Live</span>
          </div>
          <p className="text-sm mb-4 max-w-xs" style={{ color:"var(--text-secondary)" }}>
            Hinglish, Banglish, Tanglish and 32 more — no translation needed.
          </p>
          <BentoLangs />
        </motion.div>

        {/* Small stat cards */}
        {SMALL_CARDS.map(({ col, icon, val, sub, border, big, delay }) => (
          <motion.div key={val} {...iv(delay)}
            className="relative rounded-2xl p-4 sm:p-5 overflow-hidden cursor-default"
            style={{ background:"var(--navy-card)", border:`1px solid ${border}` }}
            whileHover={{ borderColor:col+"55", boxShadow:"0 6px 32px rgba(0,0,0,0.5)", y:-3 }} transition={bs}>
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
              style={{ background:`radial-gradient(circle, ${col}, transparent)`, opacity:0.2, filter:"blur(14px)" }} />
            <div className="text-2xl mb-3">{icon}</div>
            <div className="mb-1"
              style={big ? { color:col, fontSize:"1.6rem", fontWeight:800 } : { color:"var(--text-white)", fontWeight:700, fontSize:"0.9rem" }}>
              {val}
            </div>
            <p className="text-xs font-medium whitespace-pre-line" style={{ color:"var(--text-secondary)" }}>{sub}</p>
          </motion.div>
        ))}

        {/* Fallback full width */}
        <motion.div {...iv(0.2)}
          className="md:col-span-3 relative rounded-2xl p-5 sm:p-6 overflow-hidden cursor-default"
          style={{ background:"linear-gradient(135deg,#0D1A0F,#0A1208)", border:`1px solid rgba(${G2},0.18)` }}
          whileHover={{ borderColor:`rgba(${G2},0.4)`, boxShadow:"0 10px 44px rgba(0,0,0,0.6)", y:-3 }} transition={bs}>
          <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-72 pointer-events-none"
            style={{ background:`radial-gradient(ellipse at right, rgba(${G2},0.07), transparent)` }} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-3xl sm:text-4xl flex-shrink-0">🔄</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-extrabold text-sm sm:text-base" style={{ color:"var(--text-white)" }}>Dual-LLM Fallback System</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background:`rgba(${G2},0.12)`, color:"#4ade80", border:`1px solid rgba(${G2},0.22)` }}>
                  99.9% uptime
                </span>
              </div>
              <p className="text-xs sm:text-sm" style={{ color:"var(--text-secondary)" }}>
                Routes between Groq models automatically. If one becomes slow or context-limited, NeoGPT switches instantly.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              {["openai/gpt-oss-20b","llama-3.3-70b"].map(m => (
                <span key={m} className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg"
                  style={{ background:`rgba(${G2},0.05)`, border:`1px solid rgba(${G2},0.12)`, color:"var(--text-muted)" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// ── Business Use Cases ────────────────────────────────────────────
export const BusinessSection = () => (
  <section id="business" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
    <div className="max-w-5xl mx-auto">
      <motion.div {...iv(0)} className="text-center mb-10 sm:mb-12">
        <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color:"#86efac" }}>For Business</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color:"var(--text-white)" }}>
          How businesses use NeoGPT
        </h2>
        <p className="mt-3 text-sm sm:text-base max-w-lg mx-auto" style={{ color:"var(--text-secondary)" }}>
          From fintech to government — vernacular AI that works for every kind of Indian business.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BUSINESS_CASES.map((c, i) => (
          <motion.div key={c.title} {...iv(i * 0.07)}
            className="relative rounded-2xl p-5 sm:p-6 overflow-hidden cursor-default"
            style={{ background:"var(--navy-card)", border:`1px solid rgba(${G2},0.09)` }}
            whileHover={{ borderColor:`rgba(${G2},0.28)`, boxShadow:"0 8px 38px rgba(0,0,0,0.5)", y:-4 }} transition={bs}>
            <div className="text-3xl mb-4">{c.icon}</div>
            <h3 className="font-bold text-[14px] sm:text-[15px] mb-2" style={{ color:"var(--text-white)" }}>{c.title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color:"var(--text-secondary)" }}>{c.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map(t => (
                <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background:`rgba(${G2},0.08)`, color:"#4ade80", border:`1px solid rgba(${G2},0.18)` }}>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA strip */}
      <motion.div {...iv(0.2)} className="mt-8 sm:mt-10 rounded-2xl p-6 sm:p-8 text-center"
        style={{ background:`rgba(${G2},0.05)`, border:`1px solid rgba(${G2},0.15)` }}>
        <p className="text-sm sm:text-base font-semibold mb-1" style={{ color:"var(--text-white)" }}>
          Want NeoGPT integrated into your product?
        </p>
        <p className="text-xs sm:text-sm mb-4" style={{ color:"var(--text-secondary)" }}>
          API access available on Premium & Premium+ plans. Enterprise custom pricing available.
        </p>
        <motion.a href="#pricing"
          className="inline-block text-black text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl"
          style={{ background:G }}
          whileHover={{ filter:"brightness(1.08)" }} whileTap={{ scale:0.96 }} transition={bs}>
          See pricing →
        </motion.a>
      </motion.div>
    </div>
  </section>
);

// ── Pricing Section ───────────────────────────────────────────────
export const PricingSection = ({ handleCTA, token }) => {
	const [annual, setAnnual] = useState(false);

	return (
		<section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10">
			<div className="max-w-6xl mx-auto">
				<motion.div {...iv(0)} className="text-center mb-10 sm:mb-12">
					<p
						className="text-xs font-bold tracking-[0.22em] uppercase mb-3"
						style={{ color: "#fbbf24" }}
					>
						Pricing
					</p>
					<h2
						className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
						style={{ color: "var(--text-white)" }}
					>
						Simple, token-based pricing
					</h2>
					<p
						className="mt-3 text-sm sm:text-base max-w-md mx-auto"
						style={{ color: "var(--text-secondary)" }}
					>
						Pay for what you use. Tokens power every response — more tokens,
						more conversations.
					</p>

					{/* Token explain */}
					<div
						className="inline-flex flex-wrap justify-center gap-3 mt-5 px-4 sm:px-6 py-3 rounded-xl"
						style={{
							background: `rgba(${G2},0.05)`,
							border: `1px solid rgba(${G2},0.12)`,
						}}
					>
						<span
							className="text-xs font-medium"
							style={{ color: "var(--text-muted)" }}
						>
							💡 1 token ≈ 4 chars
						</span>
						{TOKEN_INFO.examples.map((e) => (
							<span
								key={e.action}
								className="text-xs"
								style={{ color: "var(--text-secondary)" }}
							>
								<span style={{ color: "var(--text-white)", fontWeight: 600 }}>
									{e.tokens}
								</span>{" "}
								{e.action}
							</span>
						))}
					</div>

					{/* Annual pricing toggle */}
					<div className="flex items-center justify-center gap-3 mt-6">
						<span
							className="text-xs sm:text-sm font-medium"
							style={{
								color: annual ? "var(--text-muted)" : "var(--text-white)",
							}}
						>
							Monthly
						</span>
						<button
							onClick={() => setAnnual(!annual)}
							className="relative w-11 h-6 rounded-full transition-colors"
							style={{ background: annual ? G : "rgba(255,255,255,0.12)" }}
						>
							<span
								className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
								style={{ left: annual ? "22px" : "2px" }}
							/>
						</button>
						<span
							className="text-xs sm:text-sm font-medium"
							style={{
								color: annual ? "var(--text-white)" : "var(--text-muted)",
							}}
						>
							Annual{" "}
							<span
								className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
								style={{ background: `rgba(${G2},0.15)`, color: "#4ade80" }}
							>
								-20%
							</span>
						</span>
					</div>
				</motion.div>

				{/* Cards — 1 col mobile, 2 col sm, 4 col xl */}
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
					{PRICING.map((plan, i) => {
						const rawPrice = parseInt(plan.price.replace(/[₹,]/g, "")) || 0;
						const displayPrice =
							rawPrice === 0
								? "₹0"
								: annual
									? `₹${Math.floor(rawPrice * 0.8)}`
									: plan.price;

						return (
							<motion.div
								key={plan.name}
								{...iv(i * 0.08)}
								className="relative rounded-2xl p-5 sm:p-6 flex flex-col overflow-hidden"
								style={{
									background: plan.highlight
										? `rgba(${G2},0.07)`
										: "var(--navy-card)",
									border: plan.highlight
										? `2px solid ${plan.accent}`
										: `1px solid ${plan.accentBorder}`,
								}}
								whileHover={{ y: -4, boxShadow: `0 12px 44px rgba(0,0,0,0.6)` }}
								transition={bs}
							>
								{/* Popular badge */}
								{plan.highlight && (
									<div className="absolute top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2">
										<span
											className="text-[10px] font-bold px-3 py-1 rounded-full"
											style={{ background: plan.accent, color: "#000" }}
										>
											{plan.badge}
										</span>
									</div>
								)}

								{/* Pricing Plan header */}
								<div className="mb-5">
									<div className="flex items-center justify-between mb-2">
										<span
											className="text-xs font-bold px-2.5 py-1 rounded-lg"
											style={{
												background: plan.accentBg,
												color: plan.accent,
												border: `1px solid ${plan.accentBorder}`,
											}}
										>
											{plan.name}
										</span>
										<span
											className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
											style={{
												background: `rgba(${G2},0.08)`,
												color: "#4ade80",
												border: `1px solid rgba(${G2},0.18)`,
											}}
										>
											{plan.tokens}
										</span>
									</div>
									<div className="flex items-baseline gap-1 mt-3">
										<span
											className="text-3xl sm:text-4xl font-extrabold"
											style={{ color: "var(--text-white)" }}
										>
											{displayPrice}
										</span>
										{plan.period && (
											<span
												className="text-sm"
												style={{ color: "var(--text-muted)" }}
											>
												{plan.period}
											</span>
										)}
									</div>
									{annual && rawPrice > 0 && (
										<p
											className="text-[10px] mt-1"
											style={{ color: "#4ade80" }}
										>
											Save ₹{Math.floor(rawPrice * 0.2 * 12)}/year
										</p>
									)}
									<p
										className="text-xs mt-1.5"
										style={{ color: "var(--text-muted)" }}
									>
										{plan.tagline}
									</p>
								</div>

								{/* Features */}
								<ul className="space-y-2.5 flex-1 mb-6">
									{plan.features.map((f) => (
										<li key={f.text} className="flex items-start gap-2.5">
											<span
												className="flex-shrink-0 text-xs mt-0.5"
												style={{
													color: f.ok ? "#4ade80" : "var(--text-faint)",
												}}
											>
												{f.ok ? "✓" : "✕"}
											</span>
											<span
												className="text-xs leading-relaxed"
												style={{
													color: f.ok
														? "var(--text-secondary)"
														: "var(--text-faint)",
												}}
											>
												{f.text}
											</span>
										</li>
									))}
								</ul>

								{/* CTA */}
								<motion.button
									onClick={async () => {
										if (!token) {
											// Not logged in → store plan & redirect
											if (plan.name !== "Free") {
												localStorage.setItem(
													"selectedPlan",
													plan.name.toLowerCase().replace("+", "_plus"),
												);
											}
											navigate("/auth");
											return;
										}

										// ✅ User already logged in → directly set plan
										if (plan.name !== "Free") {
											try {
												const selectedPlan = plan.name
													.toLowerCase()
													.replace("+", "_plus");

												await fetch(
													`${import.meta.env.VITE_API_BASE_URL}/user/plan`,
													{
														method: "POST",
														headers: {
															"Content-Type": "application/json",
															Authorization: `Bearer ${token}`,
														},
														body: JSON.stringify({ plan: selectedPlan }),
													},
												);

												// Optional: update local state
												localStorage.setItem("userPlan", selectedPlan);

												// ✅ Notify success
												alert(`${plan.name} purchase successful 🎉`);
											} catch (err) {
												console.error("Plan update failed:", err);
												alert("Something went wrong. Try again.");
											}
										}
									}}
									className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
									style={
										plan.highlight
											? { background: plan.accent, color: "#000" }
											: {
													background: plan.accentBg,
													color: plan.accent,
													border: `1px solid ${plan.accentBorder}`,
												}
									}
									whileHover={{ filter: "brightness(1.1)" }}
									whileTap={{ scale: 0.97 }}
									transition={bs}
								>
									{/* {token ? "Switch to " + plan.name : plan.cta} */}
									{plan.cta}
								</motion.button>
							</motion.div>
						);
					})}
				</div>

				{/* Token refill note */}
				<motion.p
					{...iv(0.3)}
					className="text-center text-xs mt-6"
					style={{ color: "var(--text-muted)" }}
				>
					Tokens reset every month. Unused tokens don't carry over. Need more?
					Top-up packs coming soon.
				</motion.p>
			</div>
		</section>
	);
};