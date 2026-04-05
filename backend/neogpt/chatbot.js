// import readline from "node:readline/promises";
import "dotenv/config";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";
import Chat from "./models/chat.js"; // Added MongoDB model import

console.log("welcome to GenAI !!!");
console.log("API Key: " + process.env.GROQ_API_KEY);

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// adding state/memory to the chatbot
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // 24 hours

// ----------------- Helper: truncate content -----------------
function truncate(content, maxLength = 1500) {
	if (!content) return "";
	return content.length > maxLength
		? content.slice(0, maxLength) + "..."
		: content;
}

// ----------------- Tool Function -----------------
async function webSearch({ query }) {
	console.log("Calling web search.....");
	try {
		const response = await tvly.search(query);
		if (!response || !response.results) {
			console.error("Tavily API returned unexpected response:", response);
			return "No results found or API error.";
		}

		const summarized = response.results
			.map((r) => r.content)
			.slice(0, 5)
			.join("\n\n");
		return truncate(summarized, 1500);
	} catch (error) {
		console.error("Error in webSearch:", error);
		return "Error occurred during web search.";
	}
}

export async function generate(userMessage, threadId, language) {
	const baseMessages = [
		{
			role: "system",
			content: `You are Neo, a smart personal assistant created by Rahul Chowdhury and Rohit Dhar as their college project.
If you know the answer to a question, answer it directly in plain ${language}.
If the answer requires real-time, local, or up-to-date information, or if you don't know the answer, use the available tool.
You have access to the following tool:
searchWeb(query: string): Use this to search the internet for current or unknown information.
Decide when to use your own knowledge and when to use the tool.
Do not mention the tool unless needed.

Examples:
Q: What is the capital of France?
A: The capital of France is Paris.

Q: What's the weather in Mumbai right now?
A: (use the search tool to find the latest weather)

Q: Who is the Prime Minister of India?
A: The current Prime Minister of India is Narendra Modi.

Q: Tell me the latest IT news.
A: (use the search tool to get the latest news)

location: India.
current date and time: ${new Date().toUTCString()}
Do not expose your technology or LLM details.

always give output in language : ${language}.
always be polite.`,
		},
	];

	// Retrieve messages from cache or MongoDB
	let messages = cache.get(threadId);
	if (!messages) {
		try {
			const chatFromDB = await Chat.findOne({ threadId });
			if (chatFromDB && chatFromDB.messages.length > 0) {
				console.log(
					`🧠 Restoring chat memory from MongoDB for thread ${threadId}`
				);
				messages = [
					baseMessages[0],
					...chatFromDB.messages.map((msg) => ({
						role: msg.role,
						content: msg.text,
					})),
				];
			} else {
				messages = baseMessages;
			}
		} catch (err) {
			console.error("⚠️ MongoDB memory load error:", err.message);
			messages = baseMessages;
		}
		cache.set(threadId, messages);
	}

	messages.push({
		role: "user",
		content: userMessage + ` Output language (strict): ${language}`,
	});

	// ---------------- Keep conversation history short ----------------
	if (messages.length > 20) {
		messages.splice(1, messages.length - 20);
	}

	// ✅ FIX: Multi-model fallback (ONLY change here)
	const models = [
		"openai/gpt-oss-20b",
		"llama-3.3-70b-versatile",
	];

	const MAX_RETRIES = 3;
	let modelIndex = 0;

	while (modelIndex < models.length) {
		let attempts = 0;

		while (attempts < MAX_RETRIES) {
			try {
				attempts++;

				const completion = await groq.chat.completions.create({
					temperature: 0,
					model: models[modelIndex],
					messages: messages,
					tools: [
						{
							type: "function",
							function: {
								name: "webSearch",
								description:
									"Search the latest information and realtime data on the internet.",
								parameters: {
									type: "object",
									properties: {
										query: {
											type: "string",
											description:
												"The search query to perform search on.",
										},
									},
									required: ["query"],
								},
							},
						},
					],
					tool_choice: "auto",
				});

				const message = completion.choices?.[0]?.message;

				// ✅ validation added
				if (!message || (!message.content && !message.tool_calls)) {
					throw new Error("Empty response from model");
				}

				messages.push(message);

				const toolCalls = message.tool_calls;

				if (!toolCalls) {
					cache.set(threadId, messages);
					return message.content;
				}

				for (const tool of toolCalls) {
					const functionName = tool.function.name;
					const functionParams = tool.function.arguments;

					if (functionName === "webSearch") {
						const toolResult = await webSearch(
							JSON.parse(functionParams)
						);

						messages.push({
							tool_call_id: tool.id,
							role: "tool",
							name: functionName,
							content: toolResult,
						});
					}
				}
			} catch (err) {
				console.error(
					`LLM error (${models[modelIndex]}):`,
					err.message
				);

				if (err.status === 413) {
					messages.splice(1, messages.length - 10);
				}

				if (attempts >= MAX_RETRIES) break;
			}
		}

		// switch model
		console.log(`🔁 Switching to next model...`);
		modelIndex++;
	}

	return "⚠️ I couldn't get a response after trying multiple models.";
}

console.log("hello world");
