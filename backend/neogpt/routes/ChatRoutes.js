import express from "express";
import Chat from "../models/chat.js";
import User from "../Auth/models/User.js";
import userMiddleware from "../Auth/middlewares/User.js";
import tokenLimitMiddleware from "../Auth/middlewares/TokenLimit.js";
import { PLAN_LIMITS } from "../Auth/config.js";
import { generate } from "../chatbot.js";

const router = express.Router();

router.post("/", userMiddleware, tokenLimitMiddleware, async (req, res) => {
	try {
		const { threadId, message, language } = req.body;
		const user = req.user;

		if (!threadId || !message)
			return res.status(400).json({ msg: "threadId and message required" });

		const { reply, tokensUsed } = await generate(message, threadId, language);

		await User.findByIdAndUpdate(user._id, { $inc: { tokensUsed } });

		let chat = await Chat.findOne({ username: user.username, threadId });
		if (!chat)
			chat = new Chat({ username: user.username, threadId, messages: [] });

		chat.messages.push({ role: "user", text: message });
		chat.messages.push({ role: "assistant", text: reply });
		await chat.save();

		const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS.free;
		const remaining = Math.max(0, limit - (user.tokensUsed + tokensUsed));

		return res.status(200).json({
			message: reply,
			usage: {
				tokensUsed: user.tokensUsed + tokensUsed,
				tokensRemaining: remaining,
				limit,
				plan: user.plan,
			},
		});
	} catch (err) {
		console.error("Chat POST error:", err);
		return res.status(500).json({ msg: "Internal Server Error" });
	}
});

router.get("/history", userMiddleware, async (req, res) => {
	try {
		const chats = await Chat.find({ username: req.username }).sort({
			updatedAt: -1,
		});
		res.json(chats);
	} catch (err) {
		console.error("Chat history error:", err);
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

router.get("/:threadId", userMiddleware, async (req, res) => {
	try {
		const chat = await Chat.findOne({
			username: req.username,
			threadId: req.params.threadId,
		});
		if (!chat) return res.status(200).json({ messages: [] });
		res.json(chat.messages);
	} catch (err) {
		console.error("Chat thread fetch error:", err);
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

export default router;
