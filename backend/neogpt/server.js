import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";


import userRoutes from "./Auth/routes/UserRoutes.js";
import ChatRoutes from "./routes/ChatRoutes.js";
import summarizeRoutes from "./routes/summarizeRoutes.js";

const chatLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: { msg: "Too many messages — slow down a bit!" },
});

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// app.use(
// 	cors({
// 		origin: [
// 			"http://localhost:5173", 
// 			"https://neogpt-blue.vercel.app",
// 		],
// 		methods: ["GET", "POST", "PUT", "DELETE"],
// 		allowedHeaders: ["Content-Type", "Authorization"],
// 		credentials: true,
// 	})
// );

app.get("/", (req, res) => {
	res.send("Welcome to NeoGPT!");
});

app.use("/user", userRoutes);
app.use("/chat", chatLimiter, ChatRoutes);
app.use("/summarize", summarizeRoutes);

// MongoDB Connection
mongoose
	.connect(process.env.MONGO_URI || "mongodb://localhost:27017/neogpt")
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
