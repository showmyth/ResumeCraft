import { describe, it, expect } from "vitest";
import { calculateDomainKeywordCoverage, DOMAIN_KEYWORDS } from "../domainKeywords";

describe("calculateDomainKeywordCoverage", () => {
  it("finds keywords that appear in the summary, case-insensitively", () => {
    const result = calculateDomainKeywordCoverage({ summary: "I love Kubernetes and CI/CD" }, "devops");
    expect(result.matched).toContain("Kubernetes");
    expect(result.matched).toContain("CI/CD");
  });

  it("finds keywords inside experience bullets and project descriptions", () => {
    const content = {
      experience: [{ bullets: ["Built a REST API for internal tools"] }],
      projects: [{ description: "Used unit testing throughout" }],
    };
    const result = calculateDomainKeywordCoverage(content, "swe");
    expect(result.matched).toContain("REST API");
    expect(result.matched).toContain("unit testing");
  });

  it("finds keywords inside skills items", () => {
    const content = { skills: [{ items: ["Kubernetes", "Docker"] }] };
    const result = calculateDomainKeywordCoverage(content, "devops");
    expect(result.matched).toContain("Kubernetes");
  });

  it("reports missing keywords as the complement of matched", () => {
    const result = calculateDomainKeywordCoverage({ summary: "Kubernetes expert" }, "devops");
    expect(result.matched.length + result.missing.length).toBe(result.total);
    expect(result.missing).not.toContain("Kubernetes");
  });

  it("computes coveragePct correctly", () => {
    const result = calculateDomainKeywordCoverage({}, "swe");
    expect(result.coveragePct).toBe(0);
    expect(result.total).toBe(DOMAIN_KEYWORDS.swe.length);
  });

  it("falls back to swe's keyword bank for an unknown domain", () => {
    const result = calculateDomainKeywordCoverage({}, "not-a-real-domain");
    expect(result.total).toBe(DOMAIN_KEYWORDS.swe.length);
  });

  it("does not throw on empty/missing content", () => {
    expect(() => calculateDomainKeywordCoverage(undefined, "swe")).not.toThrow();
    expect(() => calculateDomainKeywordCoverage({}, "swe")).not.toThrow();
  });
});
