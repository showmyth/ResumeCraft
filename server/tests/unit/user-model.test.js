import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";

// These exercise the model's real bcrypt-based comparePassword method
// directly (bypassing mongoose's save()/connection lifecycle, which
// needs a live DB) — this is testing the exact same code path
// login.js/reset-password use, just without requiring a live Mongo
// connection to construct the document.
describe("User model — comparePassword", () => {
  it("returns true for the correct password against its hash", async () => {
    const hash = await bcrypt.hash("correct-horse-battery-staple", 12);
    const user = new User({ name: "Test", email: "t@example.com", password: hash });
    // Mark password as NOT modified so the pre-save hook (which would
    // re-hash an already-hashed value) doesn't fire — we're testing
    // comparePassword() in isolation, not the save lifecycle.
    user.$__.saved = true;
    await expect(user.comparePassword("correct-horse-battery-staple")).resolves.toBe(true);
  });

  it("returns false for an incorrect password", async () => {
    const hash = await bcrypt.hash("correct-horse-battery-staple", 12);
    const user = new User({ name: "Test", email: "t@example.com", password: hash });
    await expect(user.comparePassword("wrong-password")).resolves.toBe(false);
  });
});

describe("User model — isPro virtual", () => {
  it("is false for a free-plan user", () => {
    const user = new User({ name: "T", email: "t@example.com", password: "hashedvalue123", subscription: { plan: "free" } });
    expect(user.isPro).toBe(false);
  });

  it("is true for a pro-plan user", () => {
    const user = new User({ name: "T", email: "t@example.com", password: "hashedvalue123", subscription: { plan: "pro" } });
    expect(user.isPro).toBe(true);
  });

  it("is true for an enterprise-plan user", () => {
    const user = new User({ name: "T", email: "t@example.com", password: "hashedvalue123", subscription: { plan: "enterprise" } });
    expect(user.isPro).toBe(true);
  });
});

describe("User model — hasActiveSubscription", () => {
  it("is always true for free plan", () => {
    const user = new User({ name: "T", email: "t@example.com", password: "hashedvalue123", subscription: { plan: "free" } });
    expect(user.hasActiveSubscription()).toBe(true);
  });

  it("is true when admin-granted regardless of dates", () => {
    const user = new User({
      name: "T", email: "t@example.com", password: "hashedvalue123",
      subscription: { plan: "pro", grantedByAdmin: true },
    });
    expect(user.hasActiveSubscription()).toBe(true);
  });

  it("is false for pro plan with no currentPeriodEnd set", () => {
    const user = new User({ name: "T", email: "t@example.com", password: "hashedvalue123", subscription: { plan: "pro" } });
    expect(user.hasActiveSubscription()).toBe(false);
  });

  it("is true for pro plan with a future currentPeriodEnd", () => {
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const user = new User({
      name: "T", email: "t@example.com", password: "hashedvalue123",
      subscription: { plan: "pro", currentPeriodEnd: future },
    });
    expect(user.hasActiveSubscription()).toBe(true);
  });

  it("is false for pro plan with a past currentPeriodEnd", () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const user = new User({
      name: "T", email: "t@example.com", password: "hashedvalue123",
      subscription: { plan: "pro", currentPeriodEnd: past },
    });
    expect(user.hasActiveSubscription()).toBe(false);
  });
});
