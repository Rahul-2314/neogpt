function token() {
	return localStorage.getItem("neogpt_token") || "";
}
function language() {
	return localStorage.getItem("neogpt_lang") || "English";
}

function send(msg) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{ ...msg, token: token(), language: language() },
			(res) => {
				if (chrome.runtime.lastError)
					return reject(new Error(chrome.runtime.lastError.message));
				if (!res?.ok) return reject(new Error(res?.error || "API error"));
				resolve(res);
			},
		);
	});
}

async function activeTab() {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab;
}

function tabMsg(tab, msg) {
	return new Promise((resolve) => {
		chrome.tabs.sendMessage(tab.id, msg, (res) => {
			if (chrome.runtime.lastError) return resolve(null);
			resolve(res);
		});
	});
}

export async function extractContent() {
	const tab = await activeTab();
	const res = await tabMsg(tab, { type: "EXTRACT_CONTENT" });
	return res?.data || [];
}

export async function getActiveTab() {
	return activeTab();
}

export async function summarizePage(content, url) {
	return send({ type: "SUMMARIZE_PAGE", content, url });
}

export async function chat(message, threadId) {
	return send({ type: "CHAT", message, threadId });
}

export async function selectionAction(action, text) {
	return send({ type: "SELECTION_ACTION", action, text });
}

export async function scrollTo(elementId) {
	const tab = await activeTab();
	return tabMsg(tab, { type: "SCROLL_TO", elementId });
}

export async function getSelection() {
	const tab = await activeTab();
	const res = await tabMsg(tab, { type: "GET_SELECTION" });
	return res?.text || "";
}

export async function clearCache() {
	return send({ type: "CLEAR_CACHE" });
}
