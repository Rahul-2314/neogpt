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

		// Summarize & truncate results
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
	// -------------------------prompt message/input-------------------
	const baseMessages = [
		{
			role: "system",
			content: `You are Neo, a smart personal assistant created by Rahul Chowdhury.
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

	const MAX_RETRIES = 10;
	let attempts = 0;

	// ---------------- Keep conversation history short ----------------
	if (messages.length > 20) {
		// keep system + last 19 messages
		messages.splice(1, messages.length - 20);
	}

	// let model = "llama-3.3-70b-versatile"; // default heavy model
	let model = "openai/gpt-oss-20b"; // default heavy model

	while (attempts < MAX_RETRIES) {
		try {
			attempts++;
			//--------------------------llm invoke--------------------------
			const completion = await groq.chat.completions.create({
				temperature: 0,
				model: model,
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
										description: "The search query to perform search on.",
									},
								},
								required: ["query"],
							},
						},
					},
				],
				tool_choice: "auto",
			});

			messages.push(completion.choices[0].message);

			const toolCalls = completion.choices[0].message.tool_calls;

			if (!toolCalls) {
				// store messages in cache
				cache.set(threadId, messages);
				return completion.choices[0].message.content;
			}

			// if tool present
			for (const tool of toolCalls) {
				const functionName = tool.function.name;
				const functionParams = tool.function.arguments;

				if (functionName === "webSearch") {
					const toolResult = await webSearch(JSON.parse(functionParams));

					messages.push({
						tool_call_id: tool.id,
						role: "tool",
						name: functionName,
						content: toolResult,
					});
				}
			}
		} catch (err) {
			if (err.status === 413) {
				messages.splice(1, messages.length - 10);
				continue; // retry
			}
			console.error("LLM error:", err);
			return `Error in LLM call: ${err.message || err}`;
		}
	}
	return "⚠️ I couldn't get a response after multiple retries. Please try again later.";
}

console.log("hello world");
