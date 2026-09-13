import { text, contactLine, accentSection } from "./sections/shared.js";
import {
  summaryBlock,
  experienceBlock,
  educationBlock,
  skillsBlock,
  projectsBlock,
  languagesBlock,
} from "./sections/blocks.js";
import { skillsMatrixBlock, ctfToolingBlock } from "./sections/domain-blocks.js";

// Infosec / Cybersecurity layout. Distinguishing features vs Jake's Resume:
//   - Certifications promoted to right under the header (hiring managers
//     and ATS scans for security roles weight certs heavily — OSCP,
//     Security+, CISSP, etc. should be unmissable)
//   - A skills matrix table (category / tools / proficiency) instead of
//     a plain comma-separated skills list
//   - A dedicated CTF & Security Tooling section for platforms like
//     HackTheBox / picoCTF placements and the tooling used
export function infosecResume(content = {}, { isPro = true } = {}) {
  const personal = content.personal || {};

  const certs = content.certifications?.length
    ? `\\textbf{Certifications:} ${(content.certifications || [])
        .map((c) => `${text(c.name)}${c.issuer ? ` (${text(c.issuer)})` : ""}${c.date ? `, ${text(c.date)}` : ""}`)
        .join(" \\quad $|$ \\quad ")}`
    : "";

  const sections = [
    accentSection("Summary", summaryBlock(content.summary)),
    accentSection("Skills Matrix", skillsMatrixBlock(content.skillsMatrix)),
    // Fall back to the plain skills list if no matrix was filled in yet.
    !content.skillsMatrix?.length ? accentSection("Skills", skillsBlock(content.skills)) : "",
    accentSection("Experience", experienceBlock(content.experience)),
    accentSection("CTF & Security Tooling", ctfToolingBlock(content.ctfToolingProjects)),
    accentSection("Projects", projectsBlock(content.projects)),
    accentSection("Education", educationBlock(content.education)),
    accentSection("Languages", languagesBlock(content.languages)),
  ].filter(Boolean).join("\n\\vspace{6pt}\n");

  return `\\documentclass[10.5pt,a4paper]{article}
\\usepackage[margin=0.7in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\definecolor{accent}{HTML}{1F3B4D}
\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=1.1em, nosep, topsep=1pt}
\\pagestyle{empty}
\\begin{document}
\\begin{center}
{\\Huge\\bfseries\\color{accent} ${text(personal.firstName || "Your")} ${text(personal.lastName || "Name")}}\\\\[2pt]
${personal.title ? `{\\normalsize ${text(personal.title)}}\\\\[2pt]` : ""}
{\\small ${contactLine(personal)}}
\\end{center}
\\vspace{4pt}
\\hrule height 1.2pt
\\vspace{6pt}
${certs ? `{\\small ${certs}}\\\\[6pt]\\hrule\\vspace{4pt}` : ""}
${sections}
${!isPro ? "\\vfill\\begin{center}\\color{gray}\\scriptsize ResumeCraft Free\\end{center}" : ""}
\\end{document}
`;
}
