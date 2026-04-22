// const API_BASE = "https://neogpt-1.onrender.com";
const API_BASE = "http://localhost:5000";

const CACHE_TTL = 60 * 60 * 1000;

async function getCached(key) {
	const result = await chrome.storage.local.get(key);
	const entry = result[key];
	if (!entry) return null;
	if (Date.now() - entry.timestamp > CACHE_TTL) {
		await chrome.storage.local.remove(key);
		return null;
	}
	return entry.data;
}

async function setCache(key, data) {
	await chrome.storage.local.set({ [key]: { data, timestamp: Date.now() } });
}

async function callAPI(endpoint, body, token) {
	const res = await fetch(`${API_BASE}${endpoint}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(body),
	});
	if (!res.ok) throw new Error(`API ${res.status}`);
	return res.json();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	(async () => {
		try {
			const { token, language = "English" } = msg;

			if (msg.type === "SUMMARIZE_PAGE") {
				const cacheKey = "summary_" + btoa(msg.url).slice(0, 40);
				const cached = await getCached(cacheKey);
				if (cached) {
					sendResponse({ success: true, data: cached, fromCache: true });
					return;
				}

				const data = await callAPI(
					"/summarize",
					{ content: msg.content, language },
					token,
				);
				await setCache(cacheKey, data);
				sendResponse({ success: true, data });
			} else if (msg.type === "CHAT_QUERY") {
				const threadId =
					msg.threadId ||
					Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
				const data = await callAPI(
					"/chat",
					{
						message: msg.query,
						threadId,
						language,
						context: msg.context,
					},
					token,
				);
				sendResponse({ success: true, data, threadId });
			} else if (msg.type === "SELECTION_ACTION") {
				const promptMap = {
					summarize_selection: `Summarize this text concisely in ${language}: "${msg.text}"`,
					explain_selection: `Explain this clearly in ${language}: "${msg.text}"`,
					translate_selection: `Translate this to ${language}: "${msg.text}"`,
				};
				const query = promptMap[msg.action] || msg.text;
				const threadId = Date.now().toString(36);
				const data = await callAPI(
					"/chat",
					{ message: query, threadId, language },
					token,
				);
				sendResponse({ success: true, data, query, threadId });
			} else if (msg.type === "CLEAR_CACHE") {
				await chrome.storage.local.clear();
				sendResponse({ success: true });
			}
		} catch (err) {
			sendResponse({ success: false, error: err.message });
		}
	})();
	return true;
});

chrome.contextMenus.removeAll(() => {
	chrome.contextMenus.create({
		id: "neogpt-explain",
		title: "NeoGPT: Explain selection",
		contexts: ["selection"],
	});
	chrome.contextMenus.create({
		id: "neogpt-summarize",
		title: "NeoGPT: Summarize selection",
		contexts: ["selection"],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	chrome.tabs.sendMessage(tab.id, {
		type:
			info.menuItemId === "neogpt-explain"
				? "explain_selection"
				: "summarize_selection",
		text: info.selectionText,
	});
});

chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content.js"],
	});
});
