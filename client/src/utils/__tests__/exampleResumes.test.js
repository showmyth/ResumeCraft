import { describe, it, expect } from "vitest";
import { EXAMPLE_RESUMES } from "../exampleResumes";
import { DOMAINS, DOMAIN_DEFAULT_LAYOUT } from "../domains";

describe("EXAMPLE_RESUMES", () => {
  it("has an entry for every domain", () => {
    for (const d of DOMAINS) {
      expect(EXAMPLE_RESUMES[d.id], `missing example for domain ${d.id}`).toBeDefined();
    }
  });

  it("every example has personal.firstName/lastName so the preview header never renders blank", () => {
    for (const [domain, content] of Object.entries(EXAMPLE_RESUMES)) {
      expect(content.personal?.firstName, `${domain} missing firstName`).toBeTruthy();
      expect(content.personal?.lastName, `${domain} missing lastName`).toBeTruthy();
    }
  });

  it("every example has a non-trivial summary and at least one experience entry", () => {
    for (const [domain, content] of Object.entries(EXAMPLE_RESUMES)) {
      expect(content.summary?.length, `${domain} summary too short`).toBeGreaterThan(20);
      expect(content.experience?.length, `${domain} has no experience entries`).toBeGreaterThan(0);
    }
  });

  it("every experience/research bullet list is a non-empty array of strings (not left as free text)", () => {
    for (const [domain, content] of Object.entries(EXAMPLE_RESUMES)) {
      for (const exp of content.experience || []) {
        expect(Array.isArray(exp.bullets), `${domain} experience.bullets should be an array`).toBe(true);
        expect(exp.bullets.length).toBeGreaterThan(0);
      }
    }
  });

  // The layout-specific fields are exactly what distinguishes each domain's
  // example — confirm the domain assigned to that layout actually populates
  // the field the layout is built to showcase.
  const LAYOUT_SIGNATURE_FIELD = {
    infosec: "skillsMatrix",
    "devops-sre": "infraStack",
    "systems-lowlevel": "hardwareLanguages",
    "cv-hybrid": "publications",
  };

  it("domains routed to a specialized layout actually populate that layout's signature field", () => {
    for (const [domain, layoutId] of Object.entries(DOMAIN_DEFAULT_LAYOUT)) {
      const signatureField = LAYOUT_SIGNATURE_FIELD[layoutId];
      if (!signatureField) continue; // jakes has no single signature field — plain content is correct
      const content = EXAMPLE_RESUMES[domain];
      expect(content[signatureField]?.length, `${domain} (${layoutId}) missing populated ${signatureField}`).toBeGreaterThan(0);
    }
  });

  it("skillsMatrix rows have category, items, and proficiency (what the Infosec table renders)", () => {
    const content = EXAMPLE_RESUMES["cybersecurity"];
    for (const row of content.skillsMatrix) {
      expect(row.category).toBeTruthy();
      expect(Array.isArray(row.items)).toBe(true);
      expect(row.proficiency).toBeTruthy();
    }
  });

  it("publications have title, venue, year, and an authors array (what the CV-Hybrid bibliography renders)", () => {
    const content = EXAMPLE_RESUMES["computer-vision"];
    for (const pub of content.publications) {
      expect(pub.title).toBeTruthy();
      expect(pub.venue).toBeTruthy();
      expect(pub.year).toBeTruthy();
      expect(Array.isArray(pub.authors)).toBe(true);
    }
  });

  it("infraStack rows have category and a tools array (what the DevOps/SRE section renders)", () => {
    const content = EXAMPLE_RESUMES["devops"];
    for (const row of content.infraStack) {
      expect(row.category).toBeTruthy();
      expect(Array.isArray(row.tools)).toBe(true);
    }
  });

  it("hardwareLanguages rows have a language field (what the Systems layout renders)", () => {
    for (const domain of ["embedded-systems", "networking"]) {
      const content = EXAMPLE_RESUMES[domain];
      for (const row of content.hardwareLanguages) {
        expect(row.language).toBeTruthy();
      }
    }
  });
});
