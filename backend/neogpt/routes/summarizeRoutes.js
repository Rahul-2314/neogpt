import express from "express";
import userMiddleware from "../Auth/middlewares/User.js";
import { generate } from "../chatbot.js";

const router = express.Router();

router.post("/", userMiddleware, async (req, res) => {
	try {
		const { content, language = "English" } = req.body;

		if (!content || !Array.isArray(content) || content.length === 0)
			return res.status(400).json({ msg: "content array required" });

		const fullText = content
			.map((s) => `## ${s.heading}\n${s.content}`)
			.join("\n\n")
			.slice(0, 4000);

		const prompt = `You are a helpful assistant. Analyze the following webpage content and respond ONLY with valid JSON (no markdown, no backticks) in this exact shape:
{
  "tldr": "one sentence summary",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "sections": [
    { "heading": "section heading", "summary": "2-3 sentence summary of this section" }
  ]
}

Webpage content:
${fullText}

Language for all text values: ${language}.
Respond with JSON only.`;

		const threadId = "summary_" + Date.now().toString(36);
		const { reply } = await generate(prompt, threadId, language);

		let parsed;
		try {
			const clean = reply.replace(/```json|```/g, "").trim();
			parsed = JSON.parse(clean);
		} catch {
			parsed = {
				tldr: (reply || "No summary available").slice(0, 200),
				keyPoints: [],
				sections: content.map((s) => ({
					heading: s?.heading || "No Heading",
					summary: (s?.content || "").slice(0, 120),
				})),
			};
		}

		return res.status(200).json(parsed);
	} catch (err) {
		console.error("Summarize error:", err);
		return res.status(500).json({ msg: "Failed to summarize" });
	}
});

export default router;
