import { describe, it, expect } from "vitest";
import { generateLatex } from "../../services/latex/tex_generator.js";
import { compileToPDF } from "../../services/latex/tex_compiler.js";

const sampleContent = {
  personal: { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", phone: "555-1234", title: "Software Engineer" },
  summary: "Engineer with special chars: 50% & $100 #tag {test}",
  experience: [{ position: "SWE", company: "Analytical Engines Inc", startDate: "2022", current: true, bullets: ["Built stuff & shipped 100% on time"] }],
  education: [{ institution: "Cambridge", degree: "BSc CS", endDate: "2022" }],
  skills: [{ category: "Languages", items: ["Python", "C++"] }],
  projects: [{ name: "Analytical Engine Sim", technologies: ["C++"], description: "Simulated an engine" }],
  certifications: [{ name: "AWS SAA", issuer: "Amazon", date: "2023" }],
  languages: [{ language: "English", proficiency: "Native" }],
  skillsMatrix: [{ category: "AppSec", items: ["SAST"], proficiency: "Expert" }],
  ctfToolingProjects: [{ name: "CTF Series", platform: "HTB", rank: "Top 5%", tools: ["Burp"] }],
  infraStack: [{ category: "Orchestration", tools: ["Kubernetes"] }],
  metrics: [{ label: "Deploy frequency", value: "12x/day", context: "up from weekly" }],
  hardwareLanguages: [{ language: "C", hardware: ["ARM Cortex-M4"] }],
  patents: [{ title: "Sensor fusion method", number: "US-2024-1234", status: "Filed", date: "2024" }],
  benchmarks: [{ metric: "Latency", value: "1.2us", comparison: "-40%" }],
  publications: [{ title: "Video SSL", venue: "CVPR", year: "2024", authors: ["A. Lovelace"], citationCount: 42 }],
  researchExperience: [{ lab: "Vision Lab", institution: "Stanford", advisor: "Prof. X", startDate: "2021", current: true, bullets: ["Led a team"] }],
};

const LAYOUTS = ["jakes", "infosec", "devops-sre", "systems-lowlevel", "cv-hybrid"];
const LEGACY_LAYOUTS = ["modern", "classic", "executive", "creative", "minimal", "tech"];

describe("LaTeX template registry", () => {
  it.each(LAYOUTS)("generates valid LaTeX for the '%s' layout", (templateId) => {
    const tex = generateLatex({ templateId, domain: "swe", content: sampleContent }, { isPro: true });
    expect(tex).toContain("\\documentclass");
    expect(tex).toContain("\\begin{document}");
    expect(tex).toContain("\\end{document}");
    expect(tex).toContain("Ada");
    expect(tex).toContain("Lovelace");
  });

  it.each(LEGACY_LAYOUTS)("still renders the legacy '%s' layout for backward compatibility", (templateId) => {
    const tex = generateLatex({ templateId, domain: "swe", content: sampleContent }, { isPro: true });
    expect(tex).toContain("\\documentclass");
    expect(tex).toContain("Ada");
  });

  it("falls back to jakes for an unimplemented/unknown templateId instead of throwing", () => {
    const tex = generateLatex({ templateId: "totally-not-a-real-template", domain: "swe", content: sampleContent }, { isPro: true });
    expect(tex).toContain("\\documentclass");
  });

  it("escapes LaTeX special characters so they don't break compilation", () => {
    const tex = generateLatex({ templateId: "jakes", domain: "swe", content: sampleContent }, { isPro: true });
    // Raw unescaped '&', '$', '#' outside of intentional LaTeX commands would
    // break compilation — confirm the escaped forms are present.
    expect(tex).toContain("\\&");
    expect(tex).toContain("\\$");
    expect(tex).toContain("\\#");
  });

  it("adds the free-tier watermark line when isPro is false", () => {
    const tex = generateLatex({ templateId: "jakes", domain: "swe", content: sampleContent }, { isPro: false });
    expect(tex).toContain("ResumeCraft Free");
  });

  it("handles near-empty content without throwing, for every layout", () => {
    const minimal = { personal: { firstName: "Sam" } };
    for (const templateId of [...LAYOUTS, ...LEGACY_LAYOUTS]) {
      expect(() => generateLatex({ templateId, domain: "swe", content: minimal }, { isPro: false })).not.toThrow();
    }
  });
});

// These actually shell out to pdflatex — slower, but they're the only way
// to catch a template that generates syntactically-plausible-but-broken
// LaTeX (e.g. mismatched braces) that string assertions above can't catch.
describe("LaTeX template registry (real pdflatex compilation)", () => {
  it.each(LAYOUTS)("compiles the '%s' layout to a real PDF", async (templateId) => {
    const tex = generateLatex({ templateId, domain: "swe", content: sampleContent }, { isPro: true });
    const pdf = await compileToPDF(tex);
    expect(pdf.length).toBeGreaterThan(1000);
    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  });
});
