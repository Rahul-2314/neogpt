(() => {
	let toolbarEl = null;
	let highlightedEl = null;
	let selectionTimeout = null;

	function cleanText(text) {
		return text.replace(/\s+/g, " ").trim();
	}

	function shouldSkip(el) {
		const tag = el.tagName?.toLowerCase();
		const skipTags = [
			"script",
			"style",
			"nav",
			"footer",
			"header",
			"aside",
			"noscript",
			"iframe",
			"svg",
		];
		if (skipTags.includes(tag)) return true;
		const cls = (el.className || "").toLowerCase();
		const id = (el.id || "").toLowerCase();
		const skipPatterns = [
			"ad",
			"advertisement",
			"banner",
			"cookie",
			"popup",
			"modal",
			"overlay",
			"sidebar",
			"social",
			"share",
			"comment",
			"newsletter",
			"subscription",
		];
		return skipPatterns.some((p) => cls.includes(p) || id.includes(p));
	}

	function extractStructuredContent() {
		const result = [];
		const headings = document.querySelectorAll("h1, h2, h3");

		headings.forEach((heading, idx) => {
			if (shouldSkip(heading)) return;

			const headingText = cleanText(heading.textContent);
			if (!headingText || headingText.length < 3) return;

			if (!heading.id) heading.id = `neogpt-section-${idx}`;

			const contentParts = [];
			let next = heading.nextElementSibling;
			let depth = 0;

			while (next && depth < 8) {
				const tag = next.tagName?.toLowerCase();
				if (["h1", "h2", "h3"].includes(tag)) break;
				if (!shouldSkip(next)) {
					const text = cleanText(next.textContent);
					if (text.length > 20) contentParts.push(text);
				}
				next = next.nextElementSibling;
				depth++;
			}

			if (contentParts.length > 0) {
				result.push({
					heading: headingText,
					content: contentParts.join(" ").slice(0, 800),
					elementId: heading.id,
					level: heading.tagName.toLowerCase(),
				});
			}
		});

		if (result.length === 0) {
			const body = document.body;
			const text = cleanText(body.innerText || body.textContent || "");
			result.push({
				heading: document.title || "Page Content",
				content: text.slice(0, 2000),
				elementId: "body",
				level: "h1",
			});
		}

		return result;
	}

	function scrollToSection(elementId) {
		const el =
			document.getElementById(elementId) ||
			document.querySelector(`[id="${elementId}"]`);
		if (!el) return;

		el.scrollIntoView({ behavior: "smooth", block: "start" });
		highlightSection(el);
	}

	function highlightSection(el) {
		if (highlightedEl) {
			highlightedEl.style.transition = "";
			highlightedEl.style.backgroundColor = "";
			highlightedEl.style.borderRadius = "";
			highlightedEl.style.padding = "";
		}

		el.style.transition = "background-color 0.3s ease";
		el.style.backgroundColor = "#fef08a";
		el.style.borderRadius = "4px";
		el.style.padding = "2px 4px";
		highlightedEl = el;

		setTimeout(() => {
			if (highlightedEl === el) {
				el.style.transition = "background-color 1.5s ease";
				el.style.backgroundColor = "transparent";
				setTimeout(() => {
					el.style.transition = "";
					el.style.backgroundColor = "";
					el.style.borderRadius = "";
					el.style.padding = "";
				}, 1500);
			}
		}, 2000);
	}

	function removeToolbar() {
		if (toolbarEl) {
			toolbarEl.remove();
			toolbarEl = null;
		}
	}

	function createToolbar(x, y, selectedText) {
		removeToolbar();

		const toolbar = document.createElement("div");
		toolbar.id = "neogpt-toolbar";
		toolbar.style.cssText = `
      position: fixed;
      top: ${Math.max(8, y - 52)}px;
      left: ${Math.min(window.innerWidth - 230, Math.max(8, x - 60))}px;
      z-index: 2147483647;
      background: #111827;
      border: 1px solid rgba(34,197,94,0.3);
      border-radius: 10px;
      padding: 5px 6px;
      display: flex;
      gap: 4px;
      align-items: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      animation: neogpt-fade-in 0.15s ease;
    `;

		const style = document.createElement("style");
		style.textContent = `
      @keyframes neogpt-fade-in { from { opacity:0; transform: translateY(-4px); } to { opacity:1; transform: translateY(0); } }
      .neogpt-tb-btn {
        background: rgba(34,197,94,0.1);
        border: 1px solid rgba(34,197,94,0.2);
        color: #4ade80;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 6px;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s;
      }
      .neogpt-tb-btn:hover { background: rgba(34,197,94,0.22); }
    `;
		document.head.appendChild(style);

		const actions = [
			{ label: "Summarize", action: "summarize_selection" },
			{ label: "Explain", action: "explain_selection" },
			{ label: "Translate", action: "translate_selection" },
		];

		actions.forEach(({ label, action }) => {
			const btn = document.createElement("button");
			btn.className = "neogpt-tb-btn";
			btn.textContent = label;
			btn.onclick = () => {
				chrome.runtime.sendMessage({ type: action, text: selectedText });
				removeToolbar();
			};
			toolbar.appendChild(btn);
		});

		document.body.appendChild(toolbar);
		toolbarEl = toolbar;
	}

	document.addEventListener("mouseup", (e) => {
		clearTimeout(selectionTimeout);
		selectionTimeout = setTimeout(() => {
			const selection = window.getSelection();
			const text = selection?.toString().trim();

			if (text && text.length > 10) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();
				createToolbar(
					rect.left + rect.width / 2,
					rect.top + window.scrollY,
					text,
				);
			} else {
				removeToolbar();
			}
		}, 200);
	});

	document.addEventListener("mousedown", (e) => {
		if (toolbarEl && !toolbarEl.contains(e.target)) removeToolbar();
	});

	chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
		if (msg.type === "EXTRACT_CONTENT") {
			sendResponse({ success: true, data: extractStructuredContent() });
		}
		if (msg.type === "SCROLL_TO_SECTION") {
			scrollToSection(msg.elementId);
			sendResponse({ success: true });
		}
		if (msg.type === "GET_SELECTED_TEXT") {
			const text = window.getSelection()?.toString().trim() || "";
			sendResponse({ success: true, text });
		}
		return true;
	});
})();
