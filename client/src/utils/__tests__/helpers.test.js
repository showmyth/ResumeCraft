import { describe, it, expect } from "vitest";
import { calculateATSScore, DEFAULT_CONTENT } from "../helpers";

describe("calculateATSScore", () => {
  it("returns 0 for completely empty content", () => {
    expect(calculateATSScore({})).toBe(0);
    expect(calculateATSScore(DEFAULT_CONTENT)).toBe(0);
  });

  it("never exceeds 100 even with everything maxed out", () => {
    const maxed = {
      personal: { firstName: "A", lastName: "B", email: "a@b.com", phone: "555", location: "X", title: "Y" },
      summary: "x".repeat(60),
      experience: [{ id: 1 }, { id: 2 }, { id: 3 }],
      education: [{ id: 1 }],
      skills: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    };
    expect(calculateATSScore(maxed)).toBe(100);
  });

  it("awards personal info points independently", () => {
    expect(calculateATSScore({ personal: { firstName: "A", lastName: "B" } })).toBe(10);
    expect(calculateATSScore({ personal: { firstName: "A", lastName: "B", email: "a@b.com" } })).toBe(20);
  });

  it("requires both firstName AND lastName for the name points", () => {
    expect(calculateATSScore({ personal: { firstName: "A" } })).toBe(0);
    expect(calculateATSScore({ personal: { lastName: "B" } })).toBe(0);
  });

  it("only awards the summary bonus once it reaches 50 characters", () => {
    expect(calculateATSScore({ summary: "short" })).toBe(0);
    expect(calculateATSScore({ summary: "x".repeat(49) })).toBe(0);
    expect(calculateATSScore({ summary: "x".repeat(50) })).toBe(15);
  });

  it("awards a bonus for a 2nd+ experience entry beyond the first", () => {
    expect(calculateATSScore({ experience: [{ id: 1 }] })).toBe(20);
    expect(calculateATSScore({ experience: [{ id: 1 }, { id: 2 }] })).toBe(25);
  });

  it("awards a bonus for 3+ skill categories beyond the first", () => {
    expect(calculateATSScore({ skills: [{ id: 1 }] })).toBe(10);
    expect(calculateATSScore({ skills: [{ id: 1 }, { id: 2 }, { id: 3 }] })).toBe(15);
  });

  it("handles missing/undefined nested fields gracefully without throwing", () => {
    expect(() => calculateATSScore(undefined)).not.toThrow();
    expect(() => calculateATSScore(null)).not.toThrow();
    expect(calculateATSScore(undefined)).toBe(0);
  });
});
