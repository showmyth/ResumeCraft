import { text } from "./shared.js";

// ── Infosec ─────────────────────────────────────────────────────

// Skills matrix: category | items | proficiency, rendered as a compact
// table rather than the plain comma list used by skillsBlock — this is
// what distinguishes Infosec's "skills matrix" from Jake's plain skills.
export function skillsMatrixBlock(items = []) {
  const rows = (items || []).filter((i) => i.category);
  if (!rows.length) return "";
  const body = rows
    .map(
      (item) =>
        `\\textbf{${text(item.category)}} & ${text((item.items || []).join(", "))} & {\\small\\itshape ${text(item.proficiency || "")}} \\\\`
    )
    .join("\n");
  return `\\begin{tabular}{@{}p{0.22\\textwidth}p{0.58\\textwidth}p{0.15\\textwidth}@{}}
${body}
\\end{tabular}`;
}

// CTF placements / security tooling projects.
export function ctfToolingBlock(items = []) {
  return (items || [])
    .map((item) => {
      const rankLine = [item.platform, item.rank].filter(Boolean).map(text).join(" -- ");
      const tools = item.tools?.length ? `{\\small Tools: ${text(item.tools.join(", "))}}` : "";
      return `\\textbf{${text(item.name)}}${rankLine ? ` \\hfill {\\small ${rankLine}}` : ""} \\\\
${tools}`;
    })
    .join("\n\\vspace{4pt}\n");
}

// ── DevOps / SRE ────────────────────────────────────────────────

// Tools & infra stack grouped by category — the "tools & stack heavy"
// section that anchors the DevOps/SRE layout.
export function infraStackBlock(items = []) {
  return (items || [])
    .filter((i) => i.category)
    .map((item) => `\\textbf{${text(item.category)}}: ${text((item.tools || []).join(", "))}`)
    .join(" \\\\\n");
}

// Structured metrics rendered as standout stat call-outs, e.g.
// "12x/day  Deploy frequency (up from weekly releases)"
export function metricsBlock(items = []) {
  const rows = (items || []).filter((i) => i.value);
  if (!rows.length) return "";
  return rows
    .map(
      (item) =>
        `\\textbf{${text(item.value)}} ${text(item.label || "")}${item.context ? ` {\\small\\itshape (${text(item.context)})}` : ""}`
    )
    .join(" \\quad $\\bullet$ \\quad ");
}

// ── Systems / Low-Level ─────────────────────────────────────────

// Languages paired with target hardware/platforms — promoted above the
// fold on the Systems layout since firmware/OS roles scan for this first.
export function hardwareLanguagesBlock(items = []) {
  return (items || [])
    .filter((i) => i.language)
    .map((item) => `\\textbf{${text(item.language)}}${item.hardware?.length ? `: ${text(item.hardware.join(", "))}` : ""}`)
    .join(" \\\\\n");
}

// Performance benchmark call-outs, same visual treatment as metricsBlock
// but keyed by metric/value/comparison rather than label/value/context.
export function benchmarksBlock(items = []) {
  const rows = (items || []).filter((i) => i.value);
  if (!rows.length) return "";
  return rows
    .map(
      (item) =>
        `\\textbf{${text(item.value)}} ${text(item.metric || "")}${item.comparison ? ` {\\small\\itshape (${text(item.comparison)})}` : ""}`
    )
    .join(" \\quad $\\bullet$ \\quad ");
}

// Patents filed/granted.
export function patentsBlock(items = []) {
  return (items || [])
    .map((item) => `${text(item.title)}${item.number ? ` (${text(item.number)})` : ""}${item.status ? ` -- ${text(item.status)}` : ""}${item.date ? `, ${text(item.date)}` : ""}`)
    .join(" \\\\\n");
}

// ── CV-Hybrid / Research ────────────────────────────────────────

// Publications with academic citation fields — authors, venue, year,
// and an optional citation count. Rendered with a hanging indent like
// a standard bibliography entry.
export function publicationsBlock(items = []) {
  const rows = (items || []).filter((i) => i.title);
  if (!rows.length) return "";
  return `\\begin{list}{}{\\setlength{\\leftmargin}{1.2em}\\setlength{\\itemindent}{-1.2em}\\setlength{\\itemsep}{4pt}}
${rows
  .map((item) => {
    const authors = item.authors?.length ? `${text(item.authors.join(", "))}. ` : "";
    const venueYear = [item.venue, item.year].filter(Boolean).map(text).join(", ");
    const cites = item.citationCount ? ` {\\small (${text(String(item.citationCount))} citations)}` : "";
    return `\\item ${authors}\\textit{${text(item.title)}}.${venueYear ? ` ${venueYear}.` : ""}${cites}`;
  })
  .join("\n")}
\\end{list}`;
}

// Research experience — distinct from industry `experience`: carries
// advisor/lab/funding fields to keep academic lineage visible.
export function researchExperienceBlock(items = []) {
  return (items || [])
    .map((item) => {
      const dates = [item.startDate, item.endDate || (item.current ? "Present" : "")].filter(Boolean).map(text).join(" -- ");
      const lineage = [item.advisor && `Advisor: ${text(item.advisor)}`, item.fundingSource && `Funding: ${text(item.fundingSource)}`]
        .filter(Boolean)
        .join(" \\quad ");
      const bullets = (item.bullets || []).filter(Boolean);
      return `\\textbf{${text(item.lab)}}${item.institution ? `, ${text(item.institution)}` : ""} \\hfill {\\small ${dates}} \\\\
${lineage ? `{\\small\\itshape ${lineage}} \\\\[2pt]` : ""}
${bullets.length ? `\\begin{itemize}\n${bullets.map((b) => `\\item ${text(b)}`).join("\n")}\n\\end{itemize}` : ""}`;
    })
    .join("\n\\vspace{6pt}\n");
}
