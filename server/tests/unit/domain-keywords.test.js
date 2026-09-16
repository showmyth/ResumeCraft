import { describe, it, expect } from "vitest";
import { domainPromptContext, DOMAIN_KEYWORDS, DOMAIN_PERSONAS } from "../../config/domain-keywords.js";
import { DOMAINS, LAYOUTS, DOMAIN_DEFAULT_LAYOUT } from "../../config/domains.js";

describe("domainPromptContext", () => {
  it("returns a non-empty, grammatically sane context for a known domain", () => {
    const ctx = domainPromptContext("cybersecurity");
    expect(ctx).toContain("cybersecurity resume writer");
    expect(ctx).not.toMatch(/\ba a\b/); // regression guard for the double-article bug found earlier
    expect(ctx).toContain("threat modeling");
  });

  it("returns an empty string for an unknown domain (backward compatibility)", () => {
    expect(domainPromptContext("not-a-real-domain")).toBe("");
  });

  it("returns an empty string for an undefined domain (older clients without domain field)", () => {
    expect(domainPromptContext(undefined)).toBe("");
  });

  it("has a matching keyword bank for every persona and vice versa", () => {
    expect(Object.keys(DOMAIN_PERSONAS).sort()).toEqual(Object.keys(DOMAIN_KEYWORDS).sort());
  });
});

describe("domain/layout config consistency", () => {
  it("every domain has a keyword bank entry", () => {
    for (const domainId of DOMAINS) {
      expect(DOMAIN_KEYWORDS[domainId], `missing keywords for domain ${domainId}`).toBeDefined();
    }
  });

  it("every DOMAIN_DEFAULT_LAYOUT value points to a real implemented layout", () => {
    const layoutIds = new Set(LAYOUTS);
    for (const [domain, layout] of Object.entries(DOMAIN_DEFAULT_LAYOUT)) {
      expect(layoutIds.has(layout), `domain ${domain} maps to unknown layout ${layout}`).toBe(true);
    }
  });

  it("every domain has a recommended default layout", () => {
    for (const domainId of DOMAINS) {
      expect(DOMAIN_DEFAULT_LAYOUT[domainId], `domain ${domainId} has no default layout`).toBeDefined();
    }
  });
});
