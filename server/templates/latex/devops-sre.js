import { text, contactLine, accentSection } from "./sections/shared.js";
import {
  summaryBlock,
  experienceBlock,
  educationBlock,
  skillsBlock,
  projectsBlock,
  certificationsBlock,
} from "./sections/blocks.js";
import { infraStackBlock, metricsBlock } from "./sections/domain-blocks.js";

// DevOps / Platform Engineering / SRE layout. Distinguishing features vs
// Jake's Resume:
//   - Infra & Tools Stack is promoted to its own heavy section right
//     after the summary (orchestration, IaC, observability, CI/CD —
//     the first thing an infra hiring manager scans for)
//   - A "Key Metrics" call-out band for the quantified impact SRE/DevOps
//     roles are judged on (deploy frequency, MTTR, uptime, cost cut)
//   - Experience bullets stay prose (still ATS-parseable) but the
//     metrics band gives reviewers the numbers at a glance
export function devopsSreResume(content = {}, { isPro = true } = {}) {
  const personal = content.personal || {};
  const metrics = metricsBlock(content.metrics);

  const sections = [
    accentSection("Summary", summaryBlock(content.summary)),
    accentSection("Infra & Tools Stack", infraStackBlock(content.infraStack)),
    accentSection("Experience", experienceBlock(content.experience)),
    accentSection("Infra Projects", projectsBlock(content.projects)),
    accentSection("Education", educationBlock(content.education)),
    accentSection("Certifications", certificationsBlock(content.certifications)),
    // Fall back to plain skills if infraStack wasn't filled in yet.
    !content.infraStack?.length ? accentSection("Skills", skillsBlock(content.skills)) : "",
  ].filter(Boolean).join("\n\\vspace{6pt}\n");

  return `\\documentclass[10.5pt,a4paper]{article}
\\usepackage[margin=0.7in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\definecolor{accent}{HTML}{0F766E}
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
${metrics ? `\\vspace{6pt}\\begin{center}{\\small ${metrics}}\\end{center}\\vspace{2pt}\\hrule` : ""}
\\vspace{6pt}
${sections}
${!isPro ? "\\vfill\\begin{center}\\color{gray}\\scriptsize ResumeCraft Free\\end{center}" : ""}
\\end{document}
`;
}
