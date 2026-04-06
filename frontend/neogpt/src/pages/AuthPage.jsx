import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, registerUser, findUser } from "../api/authAPI";
import logo from "../assets/logo_neogpt.png";

const AuthPage = ({ mode = "login" }) => {
  const navigate   = useNavigate();
  const [isLogin,  setIsLogin]  = useState(mode !== "signup");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPw,   setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let token, userData;
      if (isLogin) {
        token    = await loginUser(username, password);
        userData = await findUser(username);

        
      } else {
        token    = await registerUser(fullname, username, password);
        userData = { fullname, username };
      }
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/chat");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // token set

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--navy)" }}>

      {/* Logo — top left */}
      <div className="px-6 pt-5">
        <button onClick={() => navigate("/home")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src={logo} alt="NeoGPT" className="w-8 h-8" />
          <span className="font-extrabold text-[15px]" style={{ color: "var(--text-white)" }}>
            NeoGPT
          </span>
        </button>
      </div>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
          style={{ maxWidth: 380 }}>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl mb-6"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {[["Log in", true], ["Sign up", false]].map(([label, val]) => (
              <button key={label}
                onClick={() => { setIsLogin(val); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: isLogin === val ? "var(--accent)" : "transparent",
                  color:      isLogin === val ? "#000" : "var(--text-muted)",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <h1 className="font-extrabold mb-1" style={{ fontSize: "1.25rem", color: "var(--text-white)", letterSpacing: "-0.3px" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            {isLogin ? "Log in to resume your conversations." : "Free forever. No credit card needed."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div key="fullname"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                    Full name
                  </label>
                  <input type="text" placeholder="fullname"
                    value={fullname} onChange={e => setFullname(e.target.value)}
                    className="input-neo w-full px-4 py-3 rounded-xl text-sm font-medium"
                    required />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                Username
              </label>
              <input type="text" placeholder="username"
                value={username} onChange={e => setUsername(e.target.value)}
                className="input-neo w-full px-4 py-3 rounded-xl text-sm font-medium"
                required />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="input-neo w-full px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ paddingRight: "2.8rem" }}
                  required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base leading-none"
                  style={{ background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
                  title={showPw ? "Hide password" : "Show password"}>
                  {showPw ? "🙈" : "🐵"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
                  style={{
                    background: "rgba(239,68,68,0.09)",
                    border: "1px solid rgba(239,68,68,0.28)",
                    color: "#FCA5A5",
                  }}>
                  <span className="mt-0.5 flex-shrink-0">⚠</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" disabled={loading}
              whileHover={{ filter: loading ? "none" : "brightness(1.08)" }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full py-3 rounded-xl font-extrabold text-sm btn-glow"
              style={{
                background: loading ? "rgba(34,197,94,0.45)" : "var(--accent)",
                color: "#000", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: loading ? "none" : "0 0 20px rgba(34,197,94,0.28)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}>
              {loading ? "Please wait…" : isLogin ? "Log in →" : "Create account →"}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => { setIsLogin(v => !v); setError(""); }}
              className="font-bold underline"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontFamily: "inherit", fontSize: "inherit" }}>
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;