// Per-domain keyword banks and resume-writer personas, used to tune the
// OpenRouter prompts in routes/ai.js so generated/improved content is
// relevant to the student's actual field instead of generic tech-resume
// boilerplate.
//
// Mirrors client/src/utils/domainKeywords.js (client uses its copy for
// the deterministic, non-AI "keyword coverage" ATS indicator) — keep
// the keyword lists in sync between the two.

export const DOMAIN_PERSONAS = {
  "swe": "a software engineering resume writer who understands backend, frontend, and fullstack roles",
  "data-eng": "a data engineering resume writer who understands pipelines, warehousing, and ETL systems",
  "ai-ml": "an AI/ML resume writer who understands modeling, deployment, and applied LLM work",
  "devops": "a DevOps/platform engineering resume writer who understands infra, CI/CD, and SRE practice",
  "cybersecurity": "a cybersecurity resume writer who understands appsec, cloud security, and threat detection",
  "embedded-systems": "an embedded systems resume writer who understands firmware, OS-level, and low-level work",
  "networking": "a networking resume writer who understands protocols, SDN, and distributed infrastructure",
  "cloud-distributed": "a cloud/distributed-systems resume writer who understands cloud-native and microservice architectures",
  "db-storage": "a database/storage engineering resume writer who understands storage engines and query performance",
  "computer-vision": "a computer vision resume writer who understands both applied CV roles and CV research",
};

export const DOMAIN_KEYWORDS = {
  "swe": ["REST API", "microservices", "unit testing", "CI/CD", "Git", "system design", "OOP", "SQL", "agile", "code review", "scalability", "debugging"],
  "data-eng": ["ETL", "data pipeline", "Airflow", "Spark", "data warehouse", "batch processing", "streaming", "Kafka", "dbt", "data modeling", "SQL", "partitioning"],
  "ai-ml": ["machine learning", "PyTorch", "TensorFlow", "model training", "fine-tuning", "LLM", "feature engineering", "deployment", "MLOps", "inference", "neural network", "evaluation metrics"],
  "devops": ["CI/CD", "Kubernetes", "Docker", "Terraform", "infrastructure as code", "observability", "incident response", "SRE", "GitOps", "monitoring", "uptime", "automation"],
  "cybersecurity": ["threat modeling", "penetration testing", "SIEM", "vulnerability assessment", "least privilege", "incident response", "OWASP", "IAM", "encryption", "MITRE ATT&CK", "zero trust", "compliance"],
  "embedded-systems": ["firmware", "RTOS", "embedded C", "microcontroller", "real-time", "interrupt handling", "hardware debugging", "low-power design", "bootloader", "signal processing", "ARM", "protocol"],
  "networking": ["TCP/IP", "routing", "BGP", "SDN", "network protocols", "load balancing", "latency", "packet analysis", "DNS", "firewall", "VPN", "distributed systems"],
  "cloud-distributed": ["microservices", "distributed systems", "load balancing", "auto-scaling", "cloud-native", "service mesh", "fault tolerance", "consistency", "AWS", "container orchestration", "high availability", "multi-region"],
  "db-storage": ["query optimization", "indexing", "replication", "sharding", "ACID", "schema design", "database migration", "storage engine", "caching", "consistency", "backup and recovery", "NoSQL"],
  "computer-vision": ["convolutional neural network", "object detection", "image segmentation", "OpenCV", "self-supervised learning", "vision transformer", "dataset curation", "annotation", "benchmark", "publication", "real-time inference", "augmentation"],
};

// Builds the domain-context fragment injected into every AI prompt.
// Returns "" for an unknown/missing domain so prompts still work fine
// without one (keeps the AI route backward-compatible with old clients
// that don't send a domain field yet).
export function domainPromptContext(domain) {
  const persona = DOMAIN_PERSONAS[domain];
  const keywords = DOMAIN_KEYWORDS[domain];
  if (!persona || !keywords) return "";
  return `\nYou are writing for ${persona}.\nWhere truthful and natural, favor domain-relevant terminology such as: ${keywords.join(", ")}.\nDo not force keywords that don't fit the person's actual experience.\n`;
}
