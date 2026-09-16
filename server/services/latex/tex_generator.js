import { getTemplate } from "../../templates/latex/index.js";

export function generateLatex(resumeDoc, options = {}) {
  const template = getTemplate(resumeDoc.templateId);
  // domain is threaded through so future layout builders (infosec,
  // devops-sre, systems-lowlevel, cv-hybrid) can tune section ordering
  // or keyword emphasis without changing this call site again.
  return template(resumeDoc.content, { ...options, domain: resumeDoc.domain });
}
