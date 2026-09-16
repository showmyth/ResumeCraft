import { describe, it, expect } from "vitest";
import { shouldResetCredits } from "../../services/subscription/credits.js";

describe("shouldResetCredits", () => {
  it("does not reset within the same calendar month", () => {
    const lastReset = new Date("2026-03-05T10:00:00Z");
    const now = new Date("2026-03-28T10:00:00Z");
    expect(shouldResetCredits(lastReset, now)).toBe(false);
  });

  it("resets when the calendar month changes", () => {
    const lastReset = new Date("2026-03-28T10:00:00Z");
    const now = new Date("2026-04-01T00:00:01Z");
    expect(shouldResetCredits(lastReset, now)).toBe(true);
  });

  it("resets when the calendar year changes even if month number repeats", () => {
    const lastReset = new Date("2025-03-15T00:00:00Z");
    const now = new Date("2026-03-15T00:00:00Z");
    expect(shouldResetCredits(lastReset, now)).toBe(true);
  });

  it("does not reset on the exact same date/time", () => {
    const now = new Date("2026-03-15T12:00:00Z");
    expect(shouldResetCredits(now, now)).toBe(false);
  });

  // The edge case this function exists to make explicit and testable —
  // see the comment in credits.js for why a naive NaN-comparison
  // approach happens to produce the same (correct) answer, but only
  // by an accident of JS semantics rather than intentional design.
  it("treats an undefined lastResetDate as needing a reset", () => {
    expect(shouldResetCredits(undefined)).toBe(true);
  });

  it("treats a null lastResetDate as needing a reset", () => {
    expect(shouldResetCredits(null)).toBe(true);
  });

  it("treats an unparseable lastResetDate string as needing a reset", () => {
    expect(shouldResetCredits("not-a-real-date")).toBe(true);
  });
});
