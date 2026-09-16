import { text, contactLine, accentSection } from "./sections/shared.js";
import {
  summaryBlock,
  experienceBlock,
  educationBlock,
  skillsBlock,
  projectsBlock,
  certificationsBlock,
} from "./sections/blocks.js";
import { hardwareLanguagesBlock, benchmarksBlock, patentsBlock } from "./sections/domain-blocks.js";

// Embedded & Systems / Networking layout. Distinguishing features vs
// Jake's Resume:
//   - Languages & target hardware promoted right under the header —
//     firmware/OS/networking hiring managers scan for "C, embedded ARM"
//     before anything else
//   - A benchmarks call-out band (latency, throughput, footprint —
//     the numbers systems roles are judged on), same visual treatment
//     as the DevOps metrics band but keyed to performance, not ops
//   - A dedicated Patents section, since systems/research-adjacent
//     roles often carry filed or granted patents that don't fit
//     anywhere else on a resume
export function systemsLowLevelResume(content = {}, { isPro = true } = {}) {
  const personal = content.personal || {};
  const hwLangs = hardwareLanguagesBlock(content.hardwareLanguages);
  const benchmarks = benchmarksBlock(content.benchmarks);

  const sections = [
    accentSection("Languages & Hardware", hwLangs || skillsBlock(content.skills)),
    accentSection("Summary", summaryBlock(content.summary)),
    accentSection("Experience", experienceBlock(content.experience)),
    accentSection("Projects", projectsBlock(content.projects)),
    accentSection("Patents", patentsBlock(content.patents)),
    accentSection("Education", educationBlock(content.education)),
    accentSection("Certifications", certificationsBlock(content.certifications)),
  ].filter(Boolean).join("\n\\vspace{6pt}\n");

  return `\\documentclass[10.5pt,a4paper]{article}
\\usepackage[margin=0.7in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\definecolor{accent}{HTML}{3F3F46}
\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=1.1em, nosep, topsep=1pt}
\\pagestyle{empty}
\\begin{document}
\\begin{center}
{\\Huge\\bfseries ${text(personal.firstName || "Your")} ${text(personal.lastName || "Name")}}\\\\[2pt]
${personal.title ? `{\\normalsize ${text(personal.title)}}\\\\[2pt]` : ""}
{\\small ${contactLine(personal)}}
\\end{center}
\\vspace{4pt}
\\hrule height 1.2pt
${benchmarks ? `\\vspace{6pt}\\begin{center}{\\small ${benchmarks}}\\end{center}\\vspace{2pt}\\hrule` : ""}
\\vspace{6pt}
${sections}
${!isPro ? "\\vfill\\begin{center}\\color{gray}\\scriptsize ResumeCraft Free\\end{center}" : ""}
\\end{document}
`;
}
