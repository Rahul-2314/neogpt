import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, registerUser, findUser } from "../api/authAPI";
import Navbar from "../components/Navbar";

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [fullname, setFullname] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [language, setLanguage] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			let token;
			let userData;

			if (isLogin) {
				token = await loginUser(username, password);
				userData = await findUser(username);
			} else {
				token = await registerUser(fullname, username, password);
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#00111F] via-[#002A4A] to-[#0B3B5C] flex flex-col items-center justify-center">
			{/* Navbar at top */}
			<Navbar language={language} setLanguage={setLanguage} />

			{/* Form container */}
			<div className="mt-24 w-full flex items-center justify-center px-4">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="bg-neutral-900/80 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-700"
				>
					<h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">
						{isLogin ? "Welcome Back" : "Create Account"}
					</h1>

					<form onSubmit={handleSubmit} className="space-y-4">
						<AnimatePresence mode="wait">
							{!isLogin && (
								<motion.input
									key="fullname"
									type="text"
									placeholder="Full Name"
									value={fullname}
									onChange={(e) => setFullname(e.target.value)}
									className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
									required
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								/>
							)}
						</AnimatePresence>

						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
							required
						/>

						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
							required
						/>

						{error && (
							<p className="text-red-400 text-sm bg-red-900/30 p-2 rounded-lg text-center">
								⚠️ {error}
							</p>
						)}

						<motion.button
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							type="submit"
							disabled={loading}
							className="w-full py-2 rounded-full bg-gradient-to-r from-cyan-500 to-amber-500 font-semibold text-black shadow-lg hover:shadow-cyan-500/30 transition"
						>
							{loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
						</motion.button>
					</form>

					<p className="text-gray-400 text-sm text-center mt-5">
						{isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="text-cyan-400 hover:underline font-medium"
						>
							{isLogin ? "Sign Up" : "Login"}
						</button>
					</p>
				</motion.div>
			</div>
		</div>
	);
};

export default AuthPage;
