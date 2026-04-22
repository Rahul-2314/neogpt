export function md(text = "") {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.+?)\*/g, "<em>$1</em>")
		.replace(/`(.+?)`/g, "<code>$1</code>")
		.replace(
			/^### (.+)$/gm,
			"<p style='font-weight:700;font-size:0.78rem;margin:5px 0 2px;color:var(--ac)'>$1</p>",
		)
		.replace(
			/^## (.+)$/gm,
			"<p style='font-weight:700;font-size:0.82rem;margin:6px 0 2px;color:var(--tw)'>$1</p>",
		)
		.replace(/^- (.+)$/gm, "<li>$1</li>")
		.replace(
			/(<li>[\s\S]*?<\/li>)+/g,
			(m) => `<ul style='padding-left:0.9rem;margin:3px 0'>${m}</ul>`,
		)
		.replace(/\n\n+/g, "</p><p>")
		.replace(/^(?!<[pul])([^\n<].+)$/gm, "<p>$1</p>")
		.replace(/<p><\/p>/g, "");
}
