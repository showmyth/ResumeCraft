// Per-domain keyword/phrase banks for the "Domain Keyword Coverage" ATS
// indicator. This is deliberately kept SEPARATE from calculateATSScore's
// 100-point structural score in helpers.js rather than folded into it —
// the structural score checks things like "has an email field" that are
// true/false regardless of domain, while this checks content relevance,
// which is inherently fuzzier. Keeping them apart means adding this
// feature never changes the meaning of the existing 100-point score.
//
// Mirrors server/config/domain-keywords.js — keep both in sync.

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

// Case-insensitive coverage check across the free-text parts of a
// resume: summary, experience bullets/descriptions, and project
// descriptions. Returns matched + missing keyword lists.
export function calculateDomainKeywordCoverage(content = {}, domain = "swe") {
  const keywords = DOMAIN_KEYWORDS[domain] || DOMAIN_KEYWORDS.swe;

  const haystack = [
    content.summary,
    ...(content.experience || []).flatMap((e) => [e.description, ...(e.bullets || [])]),
    ...(content.projects || []).map((p) => p.description),
    ...(content.skills || []).flatMap((s) => s.items || []),
  ]
    .filter(Boolean)
    .join(" \n ")
    .toLowerCase();

  const matched = keywords.filter((kw) => haystack.includes(kw.toLowerCase()));
  const missing = keywords.filter((kw) => !matched.includes(kw));

  return {
    matched,
    missing,
    total: keywords.length,
    coveragePct: Math.round((matched.length / keywords.length) * 100),
  };
}
