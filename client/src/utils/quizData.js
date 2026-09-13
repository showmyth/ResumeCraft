// Deterministic "which domain fits me?" quiz. No AI call needed — this
// runs entirely client-side so it's free, instant, and usable before
// signup. Each domain gets exactly 4 scoring opportunities across the
// 8 questions, so no domain is structurally favored by question count.
export const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "Which project would you be most excited to work on?",
    options: [
      { text: "A social app people use every day", domain: "swe" },
      { text: "A pipeline processing terabytes of data nightly", domain: "data-eng" },
      { text: "A chatbot that gets smarter with feedback", domain: "ai-ml" },
      { text: "A dashboard that catches incidents before they escalate", domain: "devops" },
      { text: "A tool that simulates real attacks to test defenses", domain: "cybersecurity" },
    ],
  },
  {
    id: "q2",
    question: "Which class did you secretly enjoy the most?",
    options: [
      { text: "Computer Networks", domain: "networking" },
      { text: "Operating Systems", domain: "embedded-systems" },
      { text: "Database Systems", domain: "db-storage" },
      { text: "Distributed Systems", domain: "cloud-distributed" },
      { text: "Computer Vision / Image Processing", domain: "computer-vision" },
    ],
  },
  {
    id: "q3",
    question: "Pick your dream internship team:",
    options: [
      { text: "Frontend/backend product team", domain: "swe" },
      { text: "Data platform team building the warehouse", domain: "data-eng" },
      { text: "ML research team fine-tuning models", domain: "ai-ml" },
      { text: "SRE team keeping the site up", domain: "devops" },
      { text: "Red team / security operations", domain: "cybersecurity" },
    ],
  },
  {
    id: "q4",
    question: "Which of these would bother you most to get wrong in production?",
    options: [
      { text: "A router misrouting traffic across regions", domain: "networking" },
      { text: "A firmware update bricking devices at scale", domain: "embedded-systems" },
      { text: "A database losing committed transactions", domain: "db-storage" },
      { text: "A rolling deploy causing split-brain across regions", domain: "cloud-distributed" },
      { text: "A vision model failing on real-world edge cases", domain: "computer-vision" },
    ],
  },
  {
    id: "q5",
    question: "Which of these would you rather spend a day debugging?",
    options: [
      { text: "A race condition in a distributed lock", domain: "cloud-distributed" },
      { text: "A query scanning the whole table instead of using an index", domain: "db-storage" },
      { text: "A packet getting dropped somewhere between two services", domain: "networking" },
      { text: "A sensor giving garbage readings on real hardware", domain: "embedded-systems" },
      { text: "A model misclassifying images it should get right", domain: "computer-vision" },
    ],
  },
  {
    id: "q6",
    question: "Pick a toolset you'd want to master:",
    options: [
      { text: "React / Node / SQL", domain: "swe" },
      { text: "Airflow / Spark / dbt", domain: "data-eng" },
      { text: "PyTorch / HuggingFace / vector DBs", domain: "ai-ml" },
      { text: "Kubernetes / Terraform / Prometheus", domain: "devops" },
      { text: "Burp Suite / Wireshark / MITRE ATT&CK", domain: "cybersecurity" },
    ],
  },
  {
    id: "q7",
    question: "Which of these systems fascinates you more?",
    options: [
      { text: "How the internet routes a packet across the world", domain: "networking" },
      { text: "How an OS schedules tasks on limited battery", domain: "embedded-systems" },
      { text: "How a database keeps guarantees under concurrent writes", domain: "db-storage" },
      { text: "How thousands of servers stay in sync during a deploy", domain: "cloud-distributed" },
      { text: "How a self-driving car recognizes a stop sign", domain: "computer-vision" },
    ],
  },
  {
    id: "q8",
    question: "If you had to give a 5-minute talk, which topic would you pick?",
    options: [
      { text: "Building a full-stack app fast", domain: "swe" },
      { text: "Designing a data pipeline that scales", domain: "data-eng" },
      { text: "Fine-tuning an open-source LLM", domain: "ai-ml" },
      { text: "Zero-downtime deployments", domain: "devops" },
      { text: "How a real-world exploit works", domain: "cybersecurity" },
    ],
  },
];

/**
 * answers: { [questionId]: domain }
 * Returns domains ranked by score, highest first: [{ domain, score }, ...]
 */
export function scoreQuiz(answers) {
  const scores = {};
  for (const domain of Object.values(answers)) {
    scores[domain] = (scores[domain] || 0) + 1;
  }
  return Object.entries(scores)
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => b.score - a.score);
}
