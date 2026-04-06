// const API_BASE = "https://neogpt-1.onrender.com";
const API_BASE = "http://localhost:5000";

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function cached(key) {
	const r = await chrome.storage.local.get(key);
	const e = r[key];
	if (!e || Date.now() - e.ts > CACHE_TTL) {
		await chrome.storage.local.remove(key);
		return null;
	}
	return e.data;
}

async function cache(key, data) {
	await chrome.storage.local.set({ [key]: { data, ts: Date.now() } });
}

async function neogptChat({ message, threadId, language, token }) {
	const res = await fetch(`${API_BASE}/chat`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ message, threadId, language }),
	});
	if (res.status === 401) throw new Error("401");
	if (res.status === 429) throw new Error("429");
	if (!res.ok) throw new Error(`${res.status}`);
	return res.json();
}

async function neogptSummarize({ content, language, token }) {
	const res = await fetch(`${API_BASE}/summarize`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ content, language }),
	});
	if (!res.ok) throw new Error(`${res.status}`);
	return res.json();
}

chrome.runtime.onMessage.addListener((msg, _, respond) => {
	(async () => {
		try {
			const { token, language = "English" } = msg;

			if (msg.type === "SUMMARIZE_PAGE") {
				const key = "sum_" + btoa(encodeURIComponent(msg.url)).slice(0, 40);
				const hit = await cached(key);
				if (hit) {
					respond({ ok: true, data: hit, fromCache: true });
					return;
				}
				const data = await neogptSummarize({
					content: msg.content,
					language,
					token,
				});
				await cache(key, data);
				respond({ ok: true, data });
			} else if (msg.type === "CHAT") {
				const tid =
					msg.threadId ||
					Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
				const data = await neogptChat({
					message: msg.message,
					threadId: tid,
					language,
					token,
				});
				respond({ ok: true, data, threadId: tid });
			} else if (msg.type === "SELECTION_ACTION") {
				const promptMap = {
					summarize: `Summarize this text concisely: "${msg.text}"`,
					explain: `Explain this clearly: "${msg.text}"`,
					translate: `Translate this to ${language}: "${msg.text}"`,
				};
				const tid = "sel_" + Date.now().toString(36);
				const data = await neogptChat({
					message: promptMap[msg.action] || msg.text,
					threadId: tid,
					language,
					token,
				});
				respond({ ok: true, data, threadId: tid });
			} else if (msg.type === "CLEAR_CACHE") {
				await chrome.storage.local.clear();
				respond({ ok: true });
			}
		} catch (err) {
			respond({ ok: false, error: err.message });
		}
	})();
	return true;
});

chrome.contextMenus.removeAll(() => {
	chrome.contextMenus.create({
		id: "ng-explain",
		title: "NeoGPT: Explain",
		contexts: ["selection"],
	});
	chrome.contextMenus.create({
		id: "ng-summarize",
		title: "NeoGPT: Summarize",
		contexts: ["selection"],
	});
	chrome.contextMenus.create({
		id: "ng-translate",
		title: "NeoGPT: Translate",
		contexts: ["selection"],
	});
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	const actionMap = {
		"ng-explain": "explain",
		"ng-summarize": "summarize",
		"ng-translate": "translate",
	};
	const action = actionMap[info.menuItemId];
	if (!action) return;
	const { token = "", language = "English" } = await chrome.storage.sync.get([
		"token",
		"language",
	]);
	const promptMap = {
		summarize: `Summarize this text concisely: "${info.selectionText}"`,
		explain: `Explain this clearly: "${info.selectionText}"`,
		translate: `Translate this to ${language}: "${info.selectionText}"`,
	};
	const tid = "ctx_" + Date.now().toString(36);
	const data = await neogptChat({
		message: promptMap[action],
		threadId: tid,
		language,
		token,
	}).catch(() => null);
	if (data) {
		chrome.notifications.create({
			type: "basic",
			iconUrl: "icons/icon48.png",
			title: "NeoGPT",
			message: (data.message || "").slice(0, 200),
		});
	}
});
