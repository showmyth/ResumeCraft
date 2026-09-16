// Curated, fictional example resume content — one per domain, using
// realistic bullets and the domain-specific fields its recommended
// layout actually renders (skills matrix for cybersecurity, infra stack
// for devops, publications for computer vision, etc). Company/person
// names are invented; any resemblance to real people or companies is
// coincidental.
export const EXAMPLE_RESUMES = {
  "swe": {
    personal: { firstName: "Maya", lastName: "Chen", email: "maya.chen@example.com", phone: "(555) 012-3456", location: "Austin, TX", title: "Software Engineer" },
    summary: "Final-year CS student who has shipped production features at a Series B startup and built three full-stack side projects with 500+ combined users.",
    experience: [{ id: "e1", position: "Software Engineering Intern", company: "TechFlow Inc.", location: "Remote", startDate: "May 2025", endDate: "Aug 2025", bullets: [
      "Built a notifications service handling 50K+ events/day using Node.js and Redis pub/sub",
      "Reduced page load time by 35% by lazy-loading and code-splitting the React dashboard",
      "Wrote integration tests raising backend coverage from 40% to 78%",
    ]}],
    education: [{ id: "ed1", institution: "University of Texas at Austin", degree: "B.S. Computer Science", endDate: "May 2026", gpa: "3.7" }],
    skills: [{ id: "s1", category: "Languages", items: ["JavaScript", "Python", "Java", "SQL"] }, { id: "s2", category: "Frameworks", items: ["React", "Node.js", "Express", "Django"] }],
    projects: [{ id: "p1", name: "SplitEasy", technologies: ["React", "Node.js", "PostgreSQL"], description: "Bill-splitting app with 200+ active users; implemented OAuth login and Stripe payouts." }],
    certifications: [], languages: [{ id: "l1", language: "English", proficiency: "Native" }, { id: "l2", language: "Mandarin", proficiency: "Fluent" }],
  },
  "data-eng": {
    personal: { firstName: "Priya", lastName: "Patel", email: "priya.patel@example.com", phone: "(555) 234-5678", location: "Chicago, IL", title: "Data Engineer" },
    summary: "CS student specializing in data infrastructure, with internship experience building batch pipelines processing 2TB+ daily and coursework in distributed systems.",
    experience: [{ id: "e1", position: "Data Engineering Intern", company: "StreamWorks Analytics", location: "Chicago, IL", startDate: "Jun 2025", endDate: "Aug 2025", bullets: [
      "Built an Airflow DAG ingesting 2TB of clickstream data daily into a Snowflake warehouse",
      "Cut pipeline runtime 45% by repartitioning Spark jobs and tuning shuffle configs",
      "Wrote dbt models powering 6 internal analytics dashboards used by the growth team",
    ]}],
    education: [{ id: "ed1", institution: "University of Illinois Chicago", degree: "B.S. Computer Science", endDate: "May 2026" }],
    skills: [{ id: "s1", category: "Data Tools", items: ["Airflow", "Spark", "dbt", "Kafka"] }, { id: "s2", category: "Languages", items: ["Python", "SQL", "Scala"] }],
    projects: [{ id: "p1", name: "Real-Time Trip Analytics", technologies: ["Kafka", "Flink", "PostgreSQL"], description: "Streaming pipeline aggregating ride-share trip events with sub-second latency." }],
    certifications: [{ id: "c1", name: "Databricks Lakehouse Fundamentals", issuer: "Databricks", date: "2025" }], languages: [],
  },
  "ai-ml": {
    personal: { firstName: "Daniel", lastName: "Okafor", email: "daniel.okafor@example.com", phone: "(555) 345-6789", location: "Pittsburgh, PA", title: "Machine Learning Engineer" },
    summary: "CS student focused on applied ML and LLM fine-tuning, with a published workshop paper and an internship deploying models to production.",
    experience: [{ id: "e1", position: "ML Engineering Intern", company: "Nimbus AI", location: "Remote", startDate: "May 2025", endDate: "Aug 2025", bullets: [
      "Fine-tuned an open-source LLM on domain-specific support tickets, improving resolution accuracy 22%",
      "Built an evaluation harness comparing 4 model variants across 12 metrics",
      "Deployed the model behind a FastAPI service handling 10K requests/day with <200ms p95 latency",
    ]}],
    education: [{ id: "ed1", institution: "Carnegie Mellon University", degree: "B.S. Computer Science", endDate: "May 2026", gpa: "3.8" }],
    skills: [{ id: "s1", category: "ML", items: ["PyTorch", "HuggingFace Transformers", "scikit-learn"] }, { id: "s2", category: "Infra", items: ["Docker", "FastAPI", "AWS SageMaker"] }],
    projects: [{ id: "p1", name: "Lecture Summarizer", technologies: ["PyTorch", "Whisper", "LangChain"], description: "Fine-tuned summarization model for lecture transcripts; 4.6/5 avg rating from 80 beta users." }],
    certifications: [], languages: [],
  },
  "devops": {
    personal: { firstName: "Jordan", lastName: "Reyes", email: "jordan.reyes@example.com", phone: "(555) 456-7890", location: "Denver, CO", title: "Site Reliability Engineer" },
    summary: "CS student with hands-on SRE internship experience cutting deploy times and improving on-call reliability across a Kubernetes-based platform.",
    experience: [{ id: "e1", position: "SRE Intern", company: "CloudBridge Systems", location: "Denver, CO", startDate: "Jun 2025", endDate: "Aug 2025", bullets: [
      "Migrated 15 services to GitOps with ArgoCD, cutting deploy time from 40 to 6 minutes",
      "Built Prometheus/Grafana dashboards that cut mean-time-to-detect for incidents by 50%",
      "Authored runbooks reducing on-call escalations by 30% over one quarter",
    ]}],
    education: [{ id: "ed1", institution: "Colorado School of Mines", degree: "B.S. Computer Science", endDate: "May 2026" }],
    metrics: [{ id: "m1", label: "Deploy time reduction", value: "85%", context: "40min to 6min" }, { id: "m2", label: "MTTD improvement", value: "50%", context: "" }],
    infraStack: [{ id: "i1", category: "Orchestration", tools: ["Kubernetes", "ArgoCD", "Helm"] }, { id: "i2", category: "Observability", tools: ["Prometheus", "Grafana", "Loki"] }, { id: "i3", category: "IaC", tools: ["Terraform"] }],
    projects: [{ id: "p1", name: "Self-Healing Deploy Pipeline", technologies: ["Kubernetes", "ArgoCD"], description: "Automated rollback pipeline triggered by health-check failures, cutting incident duration 60%." }],
    certifications: [{ id: "c1", name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", date: "2025" }],
    skills: [], languages: [],
  },
  "cybersecurity": {
    personal: { firstName: "Sofia", lastName: "Martinez", email: "sofia.martinez@example.com", phone: "(555) 567-8901", location: "College Station, TX", title: "Application Security Engineer" },
    summary: "CS student specializing in appsec and cloud security, with CTF placements and an internship performing vulnerability assessments on production services.",
    certifications: [{ id: "c1", name: "CompTIA Security+", issuer: "CompTIA", date: "2025" }, { id: "c2", name: "AWS Certified Security – Specialty", issuer: "AWS", date: "2025" }],
    skillsMatrix: [{ id: "sm1", category: "AppSec", items: ["Burp Suite", "OWASP ZAP", "SAST/DAST"], proficiency: "Advanced" }, { id: "sm2", category: "Cloud Security", items: ["AWS IAM", "GuardDuty"], proficiency: "Proficient" }],
    experience: [{ id: "e1", position: "Security Intern", company: "Ironclad Security", location: "Remote", startDate: "Jun 2025", endDate: "Aug 2025", bullets: [
      "Performed vulnerability assessments across 12 internal services, identifying 3 critical findings",
      "Built automated SAST scanning into CI, catching issues before code review 40% more often",
      "Ran tabletop incident-response exercises for the engineering team",
    ]}],
    ctfToolingProjects: [{ id: "ctf1", name: "Web Exploitation Track", platform: "HackTheBox", rank: "Top 8%", tools: ["Burp Suite", "sqlmap"] }],
    education: [{ id: "ed1", institution: "Texas A&M University", degree: "B.S. Computer Science", endDate: "May 2026" }],
    projects: [{ id: "p1", name: "Internal Threat Detection Rules", technologies: ["Python", "Sigma"], description: "Wrote detection rules for lateral movement, reducing false positives 35%." }],
    skills: [], languages: [],
  },
  "embedded-systems": {
    personal: { firstName: "Lucas", lastName: "Weber", email: "lucas.weber@example.com", phone: "(555) 678-9012", location: "Ann Arbor, MI", title: "Embedded Systems Engineer" },
    summary: "CS/CE student building real-time firmware for ARM Cortex-M platforms, with internship experience optimizing interrupt latency and power draw.",
    hardwareLanguages: [{ id: "hw1", language: "C", hardware: ["ARM Cortex-M4", "AVR"] }, { id: "hw2", language: "Rust", hardware: ["RISC-V"] }],
    benchmarks: [{ id: "b1", metric: "Interrupt latency", value: "0.9us", comparison: "-35% vs prior firmware" }, { id: "b2", metric: "Idle power draw", value: "2.8mW", comparison: "" }],
    experience: [{ id: "e1", position: "Firmware Engineering Intern", company: "SensorLoop", location: "Ann Arbor, MI", startDate: "May 2025", endDate: "Aug 2025", bullets: [
      "Rewrote the ISR handling path, cutting interrupt latency by 35%",
      "Ported the bootloader to a new RISC-V target, saving 3 weeks on the next product cycle",
      "Reduced idle power draw 20% through peripheral clock gating",
    ]}],
    education: [{ id: "ed1", institution: "University of Michigan", degree: "B.S. Computer Engineering", endDate: "May 2026" }],
    projects: [{ id: "p1", name: "Real-Time Motor Controller", technologies: ["C", "FreeRTOS"], description: "Closed-loop PID controller running at 10kHz on a Cortex-M4." }],
    certifications: [], skills: [], languages: [],
  },
  "networking": {
    personal: { firstName: "Amara", lastName: "Johnson", email: "amara.johnson@example.com", phone: "(555) 789-0123", location: "Atlanta, GA", title: "Network Engineer" },
    summary: "CS student focused on networking and distributed infrastructure, with internship experience optimizing routing and reducing latency across a multi-region service mesh.",
    hardwareLanguages: [{ id: "hw1", language: "Go", hardware: [] }, { id: "hw2", language: "Python", hardware: [] }],
    benchmarks: [{ id: "b1", metric: "Cross-region latency", value: "18ms", comparison: "-40% after BGP retuning" }],
    experience: [{ id: "e1", position: "Network Engineering Intern", company: "MeshPoint Networks", location: "Atlanta, GA", startDate: "Jun 2025", endDate: "Aug 2025", bullets: [
      "Re-tuned BGP route preferences across 3 regions, cutting cross-region latency 40%",
      "Diagnosed and fixed a packet-loss issue caused by MTU mismatch in the service mesh",
      "Automated network health checks with Python, catching outages 10 minutes faster",
    ]}],
    education: [{ id: "ed1", institution: "Georgia Institute of Technology", degree: "B.S. Computer Science", endDate: "May 2026" }],
    projects: [{ id: "p1", name: "Mini SDN Controller", technologies: ["Python", "OpenFlow"], description: "Built a simplified SDN controller for a networking coursework project, supporting dynamic path rerouting." }],
    certifications: [{ id: "c1", name: "Cisco CCNA", issuer: "Cisco", date: "2024" }], skills: [], languages: [],
  },
  "cloud-distributed": {
    personal: { firstName: "Ethan", lastName: "Kim", email: "ethan.kim@example.com", phone: "(555) 890-1234", location: "Seattle, WA", title: "Cloud/Distributed Systems Engineer" },
    summary: "CS student who has worked on microservice architecture and auto-scaling infrastructure serving millions of requests/day during an internship.",
    experience: [{ id: "e1", position: "Software Engineering Intern", company: "Horizon Cloud", location: "Seattle, WA", startDate: "Jun 2025", endDate: "Aug 2025", bullets: [
      "Decomposed a monolith into 5 microservices, each independently auto-scaled",
      "Implemented a circuit breaker pattern that cut cascading failures by 90% during traffic spikes",
      "Load-tested the system to 3x baseline traffic ahead of a product launch",
    ]}],
    education: [{ id: "ed1", institution: "University of Washington", degree: "B.S. Computer Science", endDate: "May 2026", gpa: "3.75" }],
    skills: [{ id: "s1", category: "Cloud", items: ["AWS", "Kubernetes", "Docker"] }, { id: "s2", category: "Languages", items: ["Go", "Java", "Python"] }],
    projects: [{ id: "p1", name: "Distributed Rate Limiter", technologies: ["Go", "Redis"], description: "Token-bucket rate limiter shared across service replicas using Redis; sub-ms overhead per request." }],
    certifications: [{ id: "c1", name: "AWS Certified Solutions Architect – Associate", issuer: "AWS", date: "2025" }], languages: [],
  },
  "db-storage": {
    personal: { firstName: "Grace", lastName: "Nguyen", email: "grace.nguyen@example.com", phone: "(555) 901-2345", location: "Madison, WI", title: "Database Engineer" },
    summary: "CS student specializing in database internals and query performance, with internship experience diagnosing and fixing slow queries at scale.",
    experience: [{ id: "e1", position: "Database Engineering Intern", company: "LedgerBase", location: "Madison, WI", startDate: "May 2025", endDate: "Aug 2025", bullets: [
      "Diagnosed a full-table scan affecting a core query path, cutting p99 latency from 800ms to 60ms with a composite index",
      "Designed a sharding strategy for a growing multi-tenant table, avoiding a costly re-architecture",
      "Automated backup verification, catching a silent corruption issue before it reached production",
    ]}],
    education: [{ id: "ed1", institution: "University of Wisconsin–Madison", degree: "B.S. Computer Science", endDate: "May 2026" }],
    skills: [{ id: "s1", category: "Databases", items: ["PostgreSQL", "MongoDB", "Redis"] }, { id: "s2", category: "Languages", items: ["SQL", "Python", "Go"] }],
    projects: [{ id: "p1", name: "Mini LSM-Tree Storage Engine", technologies: ["Rust"], description: "Built a simplified LSM-tree key-value store for a databases course, supporting compaction and WAL recovery." }],
    certifications: [], languages: [],
  },
  "computer-vision": {
    personal: { firstName: "Wei", lastName: "Zhang", email: "wei.zhang@example.com", phone: "(555) 012-9876", location: "Palo Alto, CA", title: "Computer Vision Researcher" },
    summary: "CS PhD student researching self-supervised video representation learning, with a CVPR workshop paper and an applied CV internship.",
    publications: [{ id: "pub1", title: "Self-Supervised Video Representations via Temporal Contrast", venue: "CVPR Workshop", year: "2025", authors: ["W. Zhang", "R. Alvarez"], citationCount: 6 }],
    researchExperience: [{ id: "r1", lab: "Vision & Learning Lab", institution: "Stanford University", advisor: "Prof. R. Alvarez", fundingSource: "University Fellowship", startDate: "2023", current: true, bullets: [
      "Led development of a self-supervised pretraining pipeline used by 3 other lab projects",
      "Open-sourced the training codebase, reaching 400+ GitHub stars",
    ]}],
    experience: [{ id: "e1", position: "Computer Vision Intern", company: "PixelSense", location: "Palo Alto, CA", startDate: "Jun 2025", endDate: "Sep 2025", bullets: [
      "Built a lightweight object-detection model for on-device inference, hitting 30fps on mobile hardware",
      "Curated and cleaned a 50K-image dataset, improving downstream model accuracy 8%",
    ]}],
    education: [{ id: "ed1", institution: "Stanford University", degree: "Ph.D. Computer Science", startDate: "2023", current: true }],
    skills: [{ id: "s1", category: "ML Frameworks", items: ["PyTorch", "OpenCV"] }],
    projects: [], certifications: [], languages: [],
  },
};
