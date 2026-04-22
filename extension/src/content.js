(() => {
	if (window.__neogptLoaded) return;
	window.__neogptLoaded = true;

	let toolbarEl = null;
	let highlightedEl = null;
	let selectionTimeout = null;

	function cleanText(t) {
		return (t || "").replace(/\s+/g, " ").trim();
	}

	function shouldSkip(el) {
		const tag = el.tagName?.toLowerCase() || "";
		const skip = [
			"script",
			"style",
			"nav",
			"footer",
			"header",
			"aside",
			"noscript",
			"iframe",
			"svg",
			"button",
			"form",
		];
		if (skip.includes(tag)) return true;
		const cls = (el.className || "").toString().toLowerCase();
		const id = (el.id || "").toLowerCase();
		const bad = [
			"ad",
			"advert",
			"banner",
			"cookie",
			"popup",
			"modal",
			"nav",
			"sidebar",
			"social",
			"share",
			"comment",
			"newsletter",
			"subscribe",
			"overlay",
			"toolbar",
			"menu",
		];
		return bad.some((p) => cls.includes(p) || id.includes(p));
	}

	function extractStructuredContent() {
		const results = [];
		const headings = document.querySelectorAll("h1,h2,h3");

		headings.forEach((h, idx) => {
			if (shouldSkip(h)) return;
			const headingText = cleanText(h.textContent);
			if (!headingText || headingText.length < 3) return;
			if (!h.id) h.id = `neogpt-sec-${idx}`;

			const parts = [];
			let next = h.nextElementSibling;
			let depth = 0;
			while (next && depth < 10) {
				const t = next.tagName?.toLowerCase();
				if (["h1", "h2", "h3"].includes(t)) break;
				if (!shouldSkip(next)) {
					const txt = cleanText(next.textContent);
					if (txt.length > 20) parts.push(txt);
				}
				next = next.nextElementSibling;
				depth++;
			}

			if (parts.length) {
				results.push({
					heading: headingText,
					content: parts.join(" ").slice(0, 800),
					elementId: h.id,
					level: h.tagName.toLowerCase(),
				});
			}
		});

		if (!results.length) {
			const txt = cleanText(document.body?.innerText || "");
			results.push({
				heading: document.title || "Page",
				content: txt.slice(0, 2000),
				elementId: "body",
				level: "h1",
			});
		}
		return results;
	}

	function scrollToSection(elementId) {
		const el =
			elementId === "body"
				? document.body
				: document.getElementById(elementId) ||
					document.querySelector(`[id="${elementId}"]`);
		if (!el) return;
		el.scrollIntoView({ behavior: "smooth", block: "start" });
		highlightSection(el);
	}

	function highlightSection(el) {
		if (highlightedEl) {
			Object.assign(highlightedEl.style, {
				transition: "",
				background: "",
				outline: "",
			});
		}
		el.style.transition = "outline 0.2s, background 0.2s";
		el.style.outline = "2px solid #22C55E";
		el.style.background = "rgba(34,197,94,0.06)";
		highlightedEl = el;
		setTimeout(() => {
			if (highlightedEl !== el) return;
			el.style.transition = "outline 1.5s, background 1.5s";
			el.style.outline = "2px solid transparent";
			el.style.background = "transparent";
			setTimeout(() => {
				Object.assign(el.style, {
					transition: "",
					outline: "",
					background: "",
				});
			}, 1500);
		}, 2200);
	}

	function removeToolbar() {
		toolbarEl?.remove();
		toolbarEl = null;
	}

	function injectStyle() {
		if (document.getElementById("neogpt-style")) return;
		const s = document.createElement("style");
		s.id = "neogpt-style";
		s.textContent = `
      @keyframes ngFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      #neogpt-toolbar { animation: ngFadeIn 0.18s ease; }
      .ng-btn {
        background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.28);
        color:#4ade80; font-size:11px; font-weight:700; padding:4px 11px;
        border-radius:7px; cursor:pointer; white-space:nowrap;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        transition:background 0.15s;
      }
      .ng-btn:hover { background:rgba(34,197,94,0.24); }
    `;
		document.head.appendChild(s);
	}

	function createToolbar(x, y, text) {
		removeToolbar();
		injectStyle();
		const tb = document.createElement("div");
		tb.id = "neogpt-toolbar";
		Object.assign(tb.style, {
			position: "fixed",
			top: `${Math.max(8, y - 50)}px`,
			left: `${Math.min(window.innerWidth - 240, Math.max(8, x - 70))}px`,
			zIndex: "2147483647",
			background: "#0D1B0F",
			border: "1px solid rgba(34,197,94,0.3)",
			borderRadius: "10px",
			padding: "5px 6px",
			display: "flex",
			gap: "5px",
			boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
		});
		[
			["Summarize", "summarize"],
			["Explain", "explain"],
			["Translate", "translate"],
		].forEach(([label, action]) => {
			const btn = document.createElement("button");
			btn.className = "ng-btn";
			btn.textContent = label;
			btn.onclick = () => {
				chrome.runtime.sendMessage({ type: "SELECTION_ACTION", action, text });
				removeToolbar();
				window.getSelection()?.removeAllRanges();
			};
			tb.appendChild(btn);
		});
		document.body.appendChild(tb);
		toolbarEl = tb;
	}

	document.addEventListener("mouseup", (e) => {
		if (toolbarEl?.contains(e.target)) return;
		clearTimeout(selectionTimeout);
		selectionTimeout = setTimeout(() => {
			const sel = window.getSelection();
			const text = sel?.toString().trim();
			if (text && text.length > 8) {
				const rect = sel.getRangeAt(0).getBoundingClientRect();
				createToolbar(rect.left + rect.width / 2, rect.top, text);
			} else {
				removeToolbar();
			}
		}, 180);
	});

	document.addEventListener("mousedown", (e) => {
		if (toolbarEl && !toolbarEl.contains(e.target)) removeToolbar();
	});

	chrome.runtime.onMessage.addListener((msg, _, respond) => {
		if (msg.type === "EXTRACT_CONTENT") {
			respond({ success: true, data: extractStructuredContent() });
		}
		if (msg.type === "SCROLL_TO") {
			scrollToSection(msg.elementId);
			respond({ success: true });
		}
		if (msg.type === "GET_SELECTION") {
			respond({
				success: true,
				text: window.getSelection()?.toString().trim() || "",
			});
		}
		return true;
	});
})();
