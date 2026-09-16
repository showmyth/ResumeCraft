import { text, dateRange, bulletList } from "./shared.js";

export function summaryBlock(summary) {
  return summary ? text(summary) : "";
}

export function experienceBlock(items = []) {
  return (items || [])
    .map((item) => `\\textbf{${text(item.position)}} \\hfill {\\small ${dateRange(item)}} \\\\
\\textit{${text(item.company)}${item.location ? `, ${text(item.location)}` : ""}} \\\\[2pt]
${bulletList(item.bullets)}`)
    .join("\n\\vspace{6pt}\n");
}

export function educationBlock(items = []) {
  return (items || [])
    .map((item) => `\\textbf{${text(item.institution)}} \\hfill {\\small ${text(item.endDate || item.startDate)}} \\\\
${text(item.degree)}${item.field ? `, ${text(item.field)}` : ""}${item.gpa ? ` \\quad GPA: ${text(item.gpa)}` : ""}${item.honors ? ` \\quad ${text(item.honors)}` : ""}`)
    .join("\n\\vspace{4pt}\n");
}

export function skillsBlock(items = []) {
  return (items || [])
    .map((item) => `\\textbf{${text(item.category)}}${item.category ? ": " : ""}${text((item.items || []).join(", "))}`)
    .join(" \\\\\n");
}

export function projectsBlock(items = []) {
  return (items || [])
    .map((item) => `\\textbf{${text(item.name)}}${item.technologies?.length ? ` \\quad {\\small ${text(item.technologies.join(" | "))}}` : ""} \\\\
${text(item.description)}`)
    .join("\n\\vspace{6pt}\n");
}

export function certificationsBlock(items = []) {
  return (items || [])
    .map((item) => `${text(item.name)}${item.issuer ? ` -- ${text(item.issuer)}` : ""}${item.date ? ` (${text(item.date)})` : ""}`)
    .join(" \\\\\n");
}

export function languagesBlock(items = []) {
  return (items || [])
    .map((item) => `${text(item.language)}${item.proficiency ? ` -- ${text(item.proficiency)}` : ""}`)
    .join(" \\\\\n");
}
