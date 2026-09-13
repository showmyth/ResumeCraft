import { text, contactLine, ruledSection } from "./sections/shared.js";
import {
  summaryBlock,
  experienceBlock,
  educationBlock,
  skillsBlock,
  projectsBlock,
  certificationsBlock,
  languagesBlock,
} from "./sections/blocks.js";

// Faithful to the classic "Jake's Resume" LaTeX template: single column,
// near-monochrome (one subtle accent line only), bold section headers
// under a hard rule, right-aligned dates, tight vertical rhythm.
// This is deliberately the most ATS-parser-friendly layout in the
// registry — no tables, no multi-column, no icons.
export function jakesResume(content = {}, { isPro = true } = {}) {
  const personal = content.personal || {};

  const sections = [
    ruledSection("Summary", summaryBlock(content.summary)),
    ruledSection("Experience", experienceBlock(content.experience)),
    ruledSection("Projects", projectsBlock(content.projects)),
    ruledSection("Education", educationBlock(content.education)),
    ruledSection("Skills", skillsBlock(content.skills)),
    ruledSection("Certifications", certificationsBlock(content.certifications)),
    ruledSection("Languages", languagesBlock(content.languages)),
  ].filter(Boolean).join("\n\\vspace{6pt}\n");

  return `\\documentclass[10.5pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=1.1em, nosep, topsep=1pt}
\\pagestyle{empty}
\\begin{document}
\\begin{center}
{\\Huge\\bfseries ${text(personal.firstName || "Your")} ${text(personal.lastName || "Name")}}\\\\[2pt]
${personal.title ? `{\\normalsize ${text(personal.title)}}\\\\[2pt]` : ""}
{\\small ${contactLine(personal)}}
\\end{center}
\\vspace{2pt}
${sections}
${!isPro ? "\\vfill\\begin{center}\\color{gray}\\scriptsize ResumeCraft Free\\end{center}" : ""}
\\end{document}
`;
}
