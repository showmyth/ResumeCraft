// Client mirror of server/config/domains.js. Keep the ids and default-layout
// mapping in sync with that file — this copy adds display labels/descriptions
// the UI needs that the server has no reason to know about.

export const DOMAINS = [
  { id: "swe", label: "Software Engineering", desc: "Backend, frontend, fullstack" },
  { id: "data-eng", label: "Data Engineering", desc: "Pipelines, warehousing, ETL" },
  { id: "ai-ml", label: "AI / ML", desc: "Modeling, deployment, LLM work" },
  { id: "devops", label: "DevOps / Platform Engineering", desc: "Infra, CI/CD, SRE" },
  { id: "cybersecurity", label: "Cybersecurity", desc: "AppSec, cloud security, threat detection" },
  { id: "embedded-systems", label: "Embedded & Systems", desc: "Firmware, OS, low-level" },
  { id: "networking", label: "Networking", desc: "Protocols, SDN, distributed infra" },
  { id: "cloud-distributed", label: "Cloud & Distributed Systems", desc: "Cloud-native, microservices, scalability" },
  { id: "db-storage", label: "Database & Storage Engineering", desc: "Storage engines, query optimization" },
  { id: "computer-vision", label: "Computer Vision", desc: "Vision models, research-leaning" },
];

export const DEFAULT_DOMAIN = "swe";

// The 5 real layout families — must match server/templates/latex/index.js.
export const LAYOUTS = [
  {
    id: "jakes",
    name: "Jake's Resume",
    isPro: false,
    tag: "ATS Best",
    desc: "Clean single-column, bullet-heavy, ATS-safe",
  },
  {
    id: "infosec",
    name: "Infosec",
    isPro: true,
    tag: null,
    desc: "Certifications up top, skills matrix, CTF/tooling section",
  },
  {
    id: "devops-sre",
    name: "DevOps / SRE",
    isPro: true,
    tag: null,
    desc: "Tools & stack heavy, metrics-driven bullets, infra projects",
  },
  {
    id: "systems-lowlevel",
    name: "Systems / Low-Level",
    isPro: true,
    tag: null,
    desc: "Languages & hardware upfront, patents, performance benchmarks",
  },
  {
    id: "cv-hybrid",
    name: "CV-Hybrid",
    isPro: true,
    tag: "Research",
    desc: "Publications block, research experience, academic lineage",
  },
];

export const DEFAULT_LAYOUT = "jakes";

// Recommended layout per domain — pre-selects a layout when a student
// picks a domain. They can still override it in the template step.
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

export function getDomainLabel(id) {
  return DOMAINS.find((d) => d.id === id)?.label || id;
}

export function getLayoutMeta(id) {
  return LAYOUTS.find((l) => l.id === id);
}
