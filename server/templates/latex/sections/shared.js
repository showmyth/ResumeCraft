import { escapeLaTeX } from "../../../services/latex/tex_utils.js";

// Every layout builder should route user-supplied strings through this
// before interpolating into LaTeX. Never interpolate raw content.
export const text = (value) => escapeLaTeX(value || "");

export function dateRange(item = {}) {
  return [item.startDate, item.endDate || (item.current ? "Present" : "")]
    .filter(Boolean)
    .map(text)
    .join(" -- ");
}

export function contactLine(personal = {}, { separator = " $|$ " } = {}) {
  return [personal.email, personal.phone, personal.location, personal.linkedin, personal.github, personal.website]
    .filter(Boolean)
    .map(text)
    .join(separator);
}

// A "hard rule under a bold caps heading" section — the classic
// Jake's-Resume-style section header used across the ATS-safe layouts.
export function ruledSection(title, body) {
  if (!body) return "";
  return `\\section*{${text(title)}}\n\\vspace{-6pt}\\hrule\\vspace{4pt}\n${body}`;
}

// A colored, non-ruled section header — used by the more visual layouts
// (legacy templates, DevOps/SRE tool blocks, etc).
export function accentSection(title, body) {
  if (!body) return "";
  return `\\section*{\\color{accent}${text(title)}}\n${body}`;
}

export function bulletList(bullets = []) {
  const items = (bullets || []).filter(Boolean);
  if (!items.length) return "";
  return `\\begin{itemize}\n${items.map((b) => `\\item ${text(b)}`).join("\n")}\n\\end{itemize}`;
}
