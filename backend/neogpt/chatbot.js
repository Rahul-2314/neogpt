import "dotenv/config";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";
import Chat from "./models/chat.js";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

function truncate(content, maxLength = 1000) {
	if (!content) return "";
	return content.length > maxLength
		? content.slice(0, maxLength) + "..."
		: content;
}

async function webSearch({ query }) {
	console.log("Web search:", query);
	try {
		const response = await tvly.search(query, { maxResults: 3 });
		if (!response?.results?.length) return "No results found.";
		return truncate(response.results.map((r) => r.content).join("\n\n"), 1000);
	} catch (err) {
		console.error("webSearch error:", err.message);
		return "Search failed.";
	}
}

function buildSystemPrompt(language) {
	return `You are Neo — a friendly, witty AI assistant built by Rahul Chowdhury and Rohit Dhar. You feel like chatting with a knowledgeable friend, not a robot.

	Tone rules:
	- Warm, natural, conversational — match the user's energy
	- If they're casual, be casual. If they're formal, be crisp.
	- Use humour lightly when appropriate
	- Short answers unless depth is needed
	- Never say "Certainly!", "Of course!", "Great question!" — just answer
	
	Language: always respond in ${language}. If the user mixes languages (Hinglish, Tanglish etc.), match their style naturally.
	
	Tool: use webSearch only for real-time, local, or unknown info. Never mention the tool.
	
	Location: India. Date: ${new Date().toUTCString()}.`;
}

function trimHistory(messages) {
	if (messages.length > 14) {
		messages.splice(1, messages.length - 14);
	}
}

async function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

const MODELS = [
	"openai/gpt-oss-20b",
	"llama-3.1-8b-instant",
	"openai/gpt-oss-120b",
	"llama-3.3-70b-versatile",
];

export async function generate(userMessage, threadId, language) {
	const systemPrompt = { role: "system", content: buildSystemPrompt(language) };

	let messages = cache.get(threadId);
	if (!messages) {
		try {
			const chatFromDB = await Chat.findOne({ threadId });
			if (chatFromDB?.messages?.length > 0) {
				console.log(`Restoring thread ${threadId} from MongoDB`);
				messages = [
					systemPrompt,
					...chatFromDB.messages.map((m) => ({
						role: m.role,
						content: m.text,
					})),
				];
			} else {
				messages = [systemPrompt];
			}
		} catch (err) {
			console.error("MongoDB load error:", err.message);
			messages = [systemPrompt];
		}
	}

	messages[0] = systemPrompt;

	messages.push({
		role: "user",
		content: userMessage + ` [Reply in: ${language}]`,
	});

	trimHistory(messages);

	const tools = [
		{
			type: "function",
			function: {
				name: "webSearch",
				description:
					"Search the internet for real-time or unknown information.",
				parameters: {
					type: "object",
					properties: { query: { type: "string" } },
					required: ["query"],
				},
			},
		},
	];

	for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
		const model = MODELS[modelIndex];
		const retries = 3;

		for (let attempt = 1; attempt <= retries; attempt++) {
			try {
				const completion = await groq.chat.completions.create({
					temperature: 0.3,
					model,
					messages,
					tools,
					tool_choice: "auto",
					max_tokens: 800,
				});

				const msg = completion.choices?.[0]?.message;
				if (!msg || (!msg.content && !msg.tool_calls))
					throw new Error("Empty response");

				messages.push(msg);

				if (!msg.tool_calls) {
					cache.set(threadId, messages);
					return {
						reply: msg.content,
						tokensUsed: completion.usage?.total_tokens ?? 0,
					};
				}

				for (const tool of msg.tool_calls) {
					if (tool.function.name === "webSearch") {
						const result = await webSearch(JSON.parse(tool.function.arguments));
						messages.push({
							tool_call_id: tool.id,
							role: "tool",
							name: "webSearch",
							content: result,
						});
					}
				}
			} catch (err) {
				console.error(`Model ${model} attempt ${attempt}:`, err.message);

				if (err.status === 429) {
					const wait = attempt === 1 ? 2000 : attempt === 2 ? 5000 : 10000;
					console.log(
						`Rate limited — waiting ${wait}ms before retry ${attempt}`,
					);
					await sleep(wait);
					continue;
				}

				if (err.status === 413) {
					messages.splice(1, messages.length - 8);
					continue;
				}

				break;
			}
		}

		console.log(`All retries exhausted for ${model}, trying next model...`);
	}

	return {
		reply: "Yaar, kuch technical issue aa gaya. Ek baar phir try karo!",
		tokensUsed: 0,
	};
}
