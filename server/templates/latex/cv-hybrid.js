import { text, contactLine, accentSection } from "./sections/shared.js";
import {
  summaryBlock,
  experienceBlock,
  educationBlock,
  skillsBlock,
  projectsBlock,
} from "./sections/blocks.js";
import { publicationsBlock, researchExperienceBlock } from "./sections/domain-blocks.js";

// Computer Vision (research-leaning) / CV-Hybrid layout. Distinguishing
// features vs Jake's Resume:
//   - Publications block near the top, formatted like a bibliography
//     entry (authors, italicized title, venue, year, citation count) —
//     this is the first thing a research-facing reviewer looks for
//   - Research Experience kept separate from industry Experience, since
//     it carries advisor/lab/funding fields that don't belong on a job
//     entry and matter for showing academic lineage
//   - Industry experience and projects still included below, since most
//     CV-track students are hybrid (research + internships), not
//     academia-only
export function cvHybridResume(content = {}, { isPro = true } = {}) {
  const personal = content.personal || {};
  const publications = publicationsBlock(content.publications);
  const research = researchExperienceBlock(content.researchExperience);

  const sections = [
    accentSection("Summary", summaryBlock(content.summary)),
    accentSection("Publications", publications),
    accentSection("Research Experience", research),
    accentSection("Industry Experience", experienceBlock(content.experience)),
    accentSection("Projects", projectsBlock(content.projects)),
    accentSection("Education", educationBlock(content.education)),
    accentSection("Skills", skillsBlock(content.skills)),
  ].filter(Boolean).join("\n\\vspace{6pt}\n");

  return `\\documentclass[10.5pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\definecolor{accent}{HTML}{5B21B6}
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
\\vspace{6pt}
${sections}
${!isPro ? "\\vfill\\begin{center}\\color{gray}\\scriptsize ResumeCraft Free\\end{center}" : ""}
\\end{document}
`;
}
