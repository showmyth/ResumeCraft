// Single source of truth for domain (content lens) and template layout family IDs.
// Keep this in sync with client/src/utils/domains.js when the frontend picker ships.

export const DOMAINS = [
  "swe",               // Software Engineering (backend/frontend/fullstack)
  "data-eng",          // Data Engineering (pipelines, warehousing, ETL)
  "ai-ml",             // AI / ML (modeling, deployment, LLM work)
  "devops",            // DevOps / Platform Engineering (infra, CI/CD, SRE)
  "cybersecurity",     // Cybersecurity (appsec, cloud security, threat detection)
  "embedded-systems",  // Embedded & Systems (firmware, OS, low-level)
  "networking",        // Networking (protocols, SDN, distributed infra)
  "cloud-distributed", // Cloud & Distributed Systems (cloud-native, microservices)
  "db-storage",        // Database & Storage Engineering
  "computer-vision",   // Computer Vision
];

export const DEFAULT_DOMAIN = "swe";

// The 5 real layout families. Distinct LaTeX structures, not color variants.
export const LAYOUTS = [
  "jakes",             // Clean single-column, bullet-heavy, ATS-safe
  "infosec",           // Certifications block prominent, skills matrix, CTF/tooling
  "devops-sre",        // Tools & stack heavy, metrics-driven bullets, infra projects
  "systems-lowlevel",  // Languages & hardware upfront, research/patent blocks, benchmarks
  "cv-hybrid",         // Publications block, research experience, academic lineage
];

export const DEFAULT_LAYOUT = "jakes";

// Legacy layout ids from the original single-template-6-colors system.
// Kept valid so existing resumes in the DB keep rendering; new resumes
// should never be created with these going forward.
export const LEGACY_LAYOUTS = ["modern", "classic", "executive", "creative", "minimal", "tech"];

// Recommended default layout per domain — used by the frontend to
// pre-select a layout when a student picks a domain, and by seed/migration
// scripts. Students can still override the layout explicitly.
export const DOMAIN_DEFAULT_LAYOUT = {
  "swe": "jakes",
  "data-eng": "jakes",
  "ai-ml": "jakes",
  "cloud-distributed": "jakes",
  "db-storage": "jakes",
  "cybersecurity": "infosec",
  "devops": "devops-sre",
  "embedded-systems": "systems-lowlevel",
  "networking": "systems-lowlevel",
  "computer-vision": "cv-hybrid",
};

export function isValidDomain(domain) {
  return DOMAINS.includes(domain);
}

export function isValidLayout(templateId) {
  return LAYOUTS.includes(templateId) || LEGACY_LAYOUTS.includes(templateId);
}
