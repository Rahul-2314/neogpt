import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo_neogpt.png";
import { G, G2, LANGUAGES, sp, bs } from "./constants";
import ChatPreview from "./ChatPreview";

const NAV_LINKS = [
  ["#",          "Home"],
  ["#features",  "Features"],
  ["#business",  "For Business"],
  ["#pricing",   "Pricing"],
  ["#future",    "Roadmap"],
];

// ── Particle Canvas ───────────────────────────────────────────────
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const pts       = useRef([]);
  const init = useCallback((W, H) => {
    const n = Math.floor((W * H) / 18000);
    pts.current = Array.from({ length: n }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.5+0.4,
      vx: (Math.random()-0.5)*0.22, vy: (Math.random()-0.5)*0.22,
      o: Math.random()*0.28+0.06,
    }));
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); let W, H;
    const resize = () => {
      W = window.innerWidth;
      H = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      canvas.width = W; canvas.height = H; init(W, H);
    };
    resize(); window.addEventListener("resize", resize);
    const LINK = 105;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.current.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      });
      for(let i=0;i<pts.current.length;i++){
        for(let j=i+1;j<pts.current.length;j++){
          const dx=pts.current[i].x-pts.current[j].x, dy=pts.current[i].y-pts.current[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<LINK){
            ctx.strokeStyle=`rgba(${G2},${(1-d/LINK)*0.12})`; ctx.lineWidth=0.6;
            ctx.beginPath(); ctx.moveTo(pts.current[i].x,pts.current[i].y);
            ctx.lineTo(pts.current[j].x,pts.current[j].y); ctx.stroke();
          }
        }
        const p=pts.current[i];
        ctx.fillStyle=`rgba(${G2},${p.o})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize",resize); };
  }, [init]);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity:0.55 }} />;
};

// ── Morphing Orb ─────────────────────────────────────────────────
const MorphOrb = ({ x, y, size, color, delay=0, duration=12 }) => (
  <motion.div className="absolute rounded-full pointer-events-none"
    style={{ left:x, top:y, width:size, height:size,
      background:`radial-gradient(circle at 35% 35%, ${color}, transparent 70%)`, filter:"blur(60px)" }}
    animate={{ scale:[1,1.2,0.88,1.14,1], x:[0,26,-16,12,0], y:[0,-20,16,-8,0], opacity:[0.15,0.26,0.1,0.22,0.15] }}
    transition={{ duration, delay, repeat:Infinity, ease:"easeInOut", repeatType:"mirror" }} />
);

// ── Language Ticker ───────────────────────────────────────────────
const LanguageTicker = () => {
  const doubled = [...LANGUAGES, ...LANGUAGES];
  return (
    <div className="relative overflow-hidden w-full py-3"
      style={{ maskImage:"linear-gradient(to right, transparent, black 7%, black 93%, transparent)" }}>
      <motion.div className="flex gap-3 w-max"
        animate={{ x:["0%","-50%"] }} transition={{ duration:32, ease:"linear", repeat:Infinity }}>
        {doubled.map((lang, i) => (
          <motion.span key={i} className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full cursor-default"
            style={{ background:`rgba(${G2},0.08)`, border:`1px solid rgba(${G2},0.22)`, color:G }}
            whileHover={{ scale:1.12, backgroundColor:`rgba(${G2},0.18)` }}
            transition={{ type:"spring", stiffness:400, damping:18 }}>
            {lang}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

// ── FloatBadge ────────────────────────────────────────────────────
const FloatBadge = ({ children, color, style, delay=0 }) => (
  <motion.div
    animate={{ y:[0,-8,0] }}
    transition={{ duration:3.5+delay, repeat:Infinity, ease:[0.45,0.05,0.55,0.95], delay }}
    className="absolute flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full z-20"
    style={{ background:"#0D150E", border:"1px solid rgba(34,197,94,0.18)", color, boxShadow:"0 4px 20px rgba(0,0,0,0.7)", ...style }}>
    {children}
  </motion.div>
);

// ── Hamburger icon (animates to X) ────────────────────────────────
const HamburgerIcon = ({ open }) => (
  <div style={{ width:18, height:13, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
    <span style={{
      display:"block", height:"1.5px", background:"currentColor", borderRadius:2,
      transition:"transform .25s ease",
      transform: open ? "rotate(45deg) translate(4px, 3.5px)" : "none",
    }} />
    <span style={{
      display:"block", height:"1.5px", background:"currentColor", borderRadius:2,
      transition:"opacity .2s",
      opacity: open ? 0 : 1,
    }} />
    <span style={{
      display:"block", height:"1.5px", background:"currentColor", borderRadius:2,
      transition:"transform .25s ease",
      transform: open ? "rotate(-45deg) translate(4px, -3.5px)" : "none",
    }} />
  </div>
);

// ── HeroSection ───────────────────────────────────────────────────
const HeroSection = ({ handleCTA, token }) => {
  const navigate   = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0,700], [0,-55]);
  const parallaxY = useSpring(rawY, { stiffness:70, damping:18 });

  const close = () => setMenuOpen(false);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* BG layers */}
      <div className="bg-lines-grid" />
      <div className="bg-lines-diagonal" />
      <div className="bg-vignette" />
      <div className="bg-scanline" />
      <ParticleCanvas />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <MorphOrb x="-8%"  y="3%"  size={520} color={`rgba(${G2},0.45)`}       delay={0} duration={14} />
        <MorphOrb x="70%"  y="0%"  size={380} color="rgba(52,211,153,0.32)"     delay={3} duration={11} />
        <MorphOrb x="26%"  y="50%" size={330} color="rgba(134,239,172,0.15)"    delay={6} duration={17} />
        <MorphOrb x="-5%"  y="70%" size={280} color={`rgba(${G2},0.22)`}        delay={2} duration={13} />
        <MorphOrb x="82%"  y="65%" size={260} color="rgba(74,222,128,0.18)"     delay={5} duration={10} />
      </div>

      {/* ── Navbar ── */}
      <style>{`
        @keyframes navFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%) }
          to   { transform: translateX(0) }
        }
        @keyframes drawerItem {
          from { opacity:0; transform: translateX(18px) }
          to   { opacity:1; transform: translateX(0) }
        }
      `}</style>

      <motion.nav
        initial={{ y:-24, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ type:"spring", stiffness:260, damping:24 }}
        className="w-full fixed top-0 z-50"
        style={{ background:"rgba(7,11,8,0.86)", backdropFilter:"blur(22px)", borderBottom:"1px solid rgba(34,197,94,0.1)" }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
            onClick={() => { navigate("/home"); close(); }}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} transition={bs}>
            <img src={logo} alt="NeoGPT" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="font-extrabold text-[15px] sm:text-[17px] tracking-tight" style={{ color:"var(--text-white)" }}>NeoGPT</span>
          </motion.div>

          {/* Desktop nav links — absolutely centered */}
          <div
            className="hidden md:flex items-center gap-6 lg:gap-10"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}>
            {NAV_LINKS.map(([href, label]) => (
              <motion.a key={label} href={href}
                className="text-sm font-medium whitespace-nowrap"
                style={{ color:"var(--text-white)" }}
                whileHover={{ color: G, y: -1 }}
                transition={bs}>
                {label}
              </motion.a>
            ))}
          </div>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* CTA button — always visible */}
            {token ? (
              <motion.button onClick={handleCTA}
                className="btn-glow text-black text-xs sm:text-sm font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl"
                style={{ background:G }}
                whileHover={{ scale:1.05, filter:"brightness(1.08)" }} whileTap={{ scale:0.95 }} transition={bs}>
                Open App →
              </motion.button>
            ) : (
              <>
                <motion.button onClick={() => navigate("/auth")}
                  className="text-xs sm:text-sm font-extrabold px-2 sm:px-3 rounded-xl hidden sm:block"
                  style={{ color:"var(--text-white)" }}
                  whileHover={{ color:G }} transition={{ duration:0.14 }}>
                  Log in
                </motion.button>
                <motion.button onClick={() => navigate("/authsign")}
                  className="btn-glow text-black text-xs sm:text-sm font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl"
                  style={{ background:G }}
                  whileHover={{ filter:"brightness(1.08)" }} whileTap={{ scale:0.95 }} transition={bs}>
                  Get started
                </motion.button>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex items-center justify-center rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                width: 36, height: 36,
                background: "none",
                border: `1.5px solid ${menuOpen ? G : "rgba(34,197,94,0.25)"}`,
                color: menuOpen ? G : "var(--text-secondary)",
                borderRadius: 8,
                cursor: "pointer",
                transition: "color .2s, border-color .2s",
                flexShrink: 0,
              }}>
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={close}
            style={{
              position: "fixed", inset: 0, zIndex: 280,
              background: "rgba(4,8,6,0.65)",
              backdropFilter: "blur(4px)",
              animation: "navFadeIn .22s ease",
            }}
          />

          {/* Drawer panel */}
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "min(300px, 82vw)",
            zIndex: 290,
            background: "rgba(8,13,10,0.98)",
            borderLeft: `1px solid rgba(${G2},0.18)`,
            backdropFilter: "blur(24px)",
            display: "flex", flexDirection: "column",
            animation: "drawerSlideIn .28s cubic-bezier(0.22, 1, 0.36, 1)",
            boxShadow: "-16px 0 60px rgba(0,0,0,0.6)",
          }}>

            {/* Drawer header */}
            <div style={{
              height: 60,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 1.5rem",
              borderBottom: "1px solid rgba(34,197,94,0.1)",
              flexShrink: 0,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}
                onClick={() => { navigate("/home"); close(); }}>
                <img src={logo} alt="NeoGPT" style={{ width:28, height:28 }} />
                <span style={{
                  fontWeight: 800, fontSize: "0.9rem",
                  color: G, letterSpacing: "-0.2px",
                  borderLeft: `2px solid ${G}`,
                  paddingLeft: 8, lineHeight: 1,
                }}>NeoGPT</span>
              </div>
              <button
                onClick={close}
                style={{
                  background: "none",
                  border: `1.5px solid rgba(${G2},0.25)`,
                  color: G, width: 32, height: 32,
                  borderRadius: 8, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", transition: "background .2s",
                }}>
                ✕
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex:1, padding:"1.25rem 1.5rem", display:"flex", flexDirection:"column", gap:2 }}>
              {NAV_LINKS.map(([href, label], i) => (
                <a key={label} href={href} onClick={close}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "0.8rem 0.5rem",
                    borderBottom: i < NAV_LINKS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    textDecoration: "none", color: "var(--text-white)",
                    opacity: 0,
                    animation: `drawerItem .32s cubic-bezier(0.22,1,0.36,1) ${0.06 + i * 0.055}s forwards`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = G; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-white)"; }}>

                  {/* Index number */}
                  <span style={{
                    fontFamily: "monospace", fontSize: "0.6rem",
                    color: "var(--text-muted)", letterSpacing: "0.12em",
                    width: 20, flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Label */}
                  <span style={{ fontSize: "0.92rem", fontWeight: 500, flex: 1, letterSpacing: "0.04em" }}>
                    {label}
                  </span>

                  {/* Arrow */}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke={`rgba(${G2},0.4)`} strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              ))}
            </nav>

            {/* Drawer footer — CTA */}
            <div style={{ padding:"0 1.5rem 2rem", flexShrink:0 }}>
              <div style={{
                height:1, marginBottom:"1.25rem",
                background:`linear-gradient(90deg, rgba(${G2},0.4), transparent)`,
              }} />
              {token ? (
                <button
                  onClick={() => { handleCTA(); close(); }}
                  style={{
                    width:"100%", padding:"0.75rem",
                    background: G, color:"#000",
                    fontWeight: 700, fontSize:"0.9rem",
                    borderRadius:10, border:"none", cursor:"pointer",
                    transition:"filter .2s",
                  }}>
                  Open App →
                </button>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <button
                    onClick={() => { navigate("/auth"); close(); }}
                    style={{
                      width:"100%", padding:"0.75rem",
                      background: G, color:"#000",
                      fontWeight: 700, fontSize:"0.9rem",
                      borderRadius:10, border:"none", cursor:"pointer",
                    }}>
                    Get started free
                  </button>
                  <button
                    onClick={() => { navigate("/auth"); close(); }}
                    style={{
                      width:"100%", padding:"0.7rem",
                      background: "none",
                      border: `1px solid rgba(${G2},0.25)`,
                      color: "var(--text-secondary)",
                      fontWeight: 600, fontSize:"0.85rem",
                      borderRadius:10, cursor:"pointer",
                      transition:"border-color .2s, color .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${G2},0.25)`; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                    Log in
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Hero ── */}
      <section className="relative pt-24 sm:pt-28 pb-4 px-4 sm:px-6 overflow-visible z-10">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:`linear-gradient(rgba(${G2},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${G2},0.04) 1px, transparent 1px)`,
          backgroundSize:"50px 50px",
          maskImage:"radial-gradient(ellipse 80% 65% at 50% 0%, black 30%, transparent 100%)",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left */}
            <div>
              <motion.div {...sp(0)} className="inline-flex items-center gap-2 mb-5 sm:mb-6 text-xs font-semibold px-4 py-1.5 rounded-full"
                style={{ background:`rgba(${G2},0.1)`, border:`1px solid rgba(${G2},0.28)`, color:G }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background:G, animation:"pulse-dot 2s ease-in-out infinite" }} />
                Powered by Groq · Tavily · MongoDB
              </motion.div>

              <motion.h1 {...sp(0.06)}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.06] tracking-tight mb-5 sm:mb-6"
                style={{ fontFamily:"'Playfair Display', serif" }}>
                <span style={{ color:"var(--text-white)", fontFamily:"'Playfair Display', serif" }}>NeoGPT :</span>
                <span className="gradient-text"> AI That</span>
                <span className="gradient-text"> Speaks You _</span>
              </motion.h1>

              <motion.p {...sp(0.12)} className="text-sm sm:text-base md:text-lg font-sans leading-relaxed mb-7 sm:mb-8 max-w-lg"
                style={{ color:"var(--text-secondary)" }}>
                A culturally intelligent chatbot that understands your language, emotion, and context.
                In Hindi, Tamil, Marwari — or any code-mixed mix. No translation. Just understanding.
              </motion.p>

              <motion.div {...sp(0.18)} className="flex flex-wrap gap-3 mb-8 sm:mb-10">
                <motion.button onClick={handleCTA}
                  className="btn-glow text-black font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl"
                  style={{ background:G }}
                  whileHover={{ filter:"brightness(1.08)" }} whileTap={{ scale:0.95 }} transition={bs}>
                  Start chatting 🌥️
                </motion.button>
                <motion.a href="#features"
                  className="font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl"
                  style={{ border:"2px solid grey", color:"var(--text-white)" }}
                  whileHover={{ borderColor:`rgba(${G2},0.5)`, color:G }}
                  whileTap={{ scale:0.97 }} transition={bs}>
                  See features ↓
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div {...sp(0.26)} className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-4">
                {[["35+","Languages"],["<50ms","Resume speed"],["∞","Chat history"],["99.9%","Uptime"]].map(([val, lbl], i) => (
                  <motion.div key={lbl} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    transition={{ type:"spring", stiffness:260, damping:22, delay:0.28+i*0.06 }}>
                    <div className="text-lg sm:text-xl font-extrabold" style={{ color:"var(--text-white)" }}>{val}</div>
                    <div className="text-[10px] sm:text-[11px] font-medium mt-0.5" style={{ color:"var(--text-muted)" }}>{lbl}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right — chat preview, hidden on small screens */}
            <motion.div style={{ y:parallaxY }} className="relative hidden md:block">
              <motion.div initial={{ opacity:0, x:36, scale:0.97 }} animate={{ opacity:1, x:0, scale:1 }}
                transition={{ type:"spring", stiffness:190, damping:24, delay:0.14 }} className="relative">
                <div className="absolute -inset-10 rounded-3xl pointer-events-none"
                  style={{ background:`radial-gradient(ellipse at center, rgba(${G2},0.1) 0%, transparent 65%)` }} />
                <ChatPreview />
                <FloatBadge color="#4ade80" style={{ top:-16, right:-16 }} delay={0}>
                  <span className="w-2 h-2 rounded-full" style={{ background:"#4ade80", animation:"pulse-dot 1.5s infinite" }} />
                  Live on Groq
                </FloatBadge>
                <FloatBadge color="#86efac" style={{ bottom:-16, left:-16 }} delay={1.4}>
                  🔗 URL Shareable
                </FloatBadge>
                <FloatBadge color="#34d399" style={{ bottom:48, right:-20 }} delay={2.6}>
                  ⚡ &lt;50ms
                </FloatBadge>
              </motion.div>
            </motion.div>
          </div>

          <motion.div {...sp(0.36)} className="mt-10 sm:mt-12">
            <LanguageTicker />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;