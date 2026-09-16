import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import request from "supertest";
import Stripe from "stripe";
import { connectTestDB, disconnectTestDB, clearTestDB } from "./setup.js";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-do-not-use-in-prod";
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_fake_key_for_signature_testing_only";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret_for_signing";

// Real Stripe SDK instance used ONLY to generate valid test signatures —
// this is pure local HMAC computation (stripe.webhooks.generateTestHeaderString),
// no network call, so it works with a fake API key.
const stripeForSigning = new Stripe(process.env.STRIPE_SECRET_KEY);

function signedPayload(eventObject) {
  const payload = JSON.stringify(eventObject);
  const header = stripeForSigning.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET,
  });
  return { payload, header };
}

// Mock the `subscriptions.retrieve` API call the webhook handler makes
// for checkout.session.completed / invoice.payment_succeeded — these
// genuinely need a live Stripe API call in production, which we can't
// (and shouldn't) make in a test. Signature verification itself
// (`webhooks.constructEvent`) is NOT mocked — it's real HMAC
// verification, which is the actual security-critical part being audited.
vi.mock("stripe", async () => {
  const actual = await vi.importActual("stripe");
  return {
    default: class MockStripe extends actual.default {
      constructor(key) {
        super(key);
        this.subscriptions = {
          retrieve: vi.fn(async (id) => ({
            id,
            current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            items: { data: [{ price: { id: "price_test_pro_monthly" } }] },
          })),
        };
      }
    },
  };
});

let app;
let User;

beforeAll(async () => {
  await connectTestDB();
  app = (await import("../../index.js")).default;
  User = (await import("../../models/User.js")).default;
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

describe("Signature verification (no DB access needed to fail/succeed here)", () => {
  it("rejects a request with an invalid signature", async () => {
    const payload = JSON.stringify({ type: "customer.created", data: { object: {} } });
    const res = await request(app)
      .post("/api/stripe/webhook")
      .set("Content-Type", "application/json")
      .set("stripe-signature", "t=1,v1=not_a_real_signature")
      .send(payload);
    expect(res.status).toBe(400);
  });

  it("rejects a request with no signature header at all", async () => {
    const res = await request(app).post("/api/stripe/webhook").set("Content-Type", "application/json").send("{}");
    expect(res.status).toBe(400);
  });

  it("accepts a validly-signed event of a type the app doesn't handle (proves raw-body + signature parsing works end-to-end)", async () => {
    const { payload, header } = signedPayload({ id: "evt_1", type: "customer.created", data: { object: {} } });
    const res = await request(app)
      .post("/api/stripe/webhook")
      .set("Content-Type", "application/json")
      .set("stripe-signature", header)
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });
});

describe("checkout.session.completed", () => {
  it("upgrades the user to pro and sets Stripe subscription fields", async () => {
    const reg = await request(app).post("/api/auth/register").send({ name: "Buyer", email: "buyer@example.com", password: "password123" });
    const userId = reg.body.user._id;

    const { payload, header } = signedPayload({
      id: "evt_checkout",
      type: "checkout.session.completed",
      data: { object: { metadata: { userId }, subscription: "sub_test_123" } },
    });

    const res = await request(app)
      .post("/api/stripe/webhook")
      .set("Content-Type", "application/json")
      .set("stripe-signature", header)
      .send(payload);
    expect(res.status).toBe(200);

    const user = await User.findById(userId);
    expect(user.subscription.plan).toBe("pro");
    expect(user.subscription.status).toBe("active");
    expect(user.subscription.stripeSubscriptionId).toBe("sub_test_123");
    expect(user.usage.aiCreditsLimit).toBe(100);
  });

  it("does nothing (but still returns 200) when metadata.userId is missing", async () => {
    const { payload, header } = signedPayload({
      id: "evt_checkout_no_meta",
      type: "checkout.session.completed",
      data: { object: { subscription: "sub_test_456" } },
    });
    const res = await request(app).post("/api/stripe/webhook").set("Content-Type", "application/json").set("stripe-signature", header).send(payload);
    expect(res.status).toBe(200); // must not 500 just because metadata was missing
  });

  it("does nothing (but still returns 200) when the userId doesn't match any user", async () => {
    const { payload, header } = signedPayload({
      id: "evt_checkout_bad_user",
      type: "checkout.session.completed",
      data: { object: { metadata: { userId: "000000000000000000000000" }, subscription: "sub_test_789" } },
    });
    const res = await request(app).post("/api/stripe/webhook").set("Content-Type", "application/json").set("stripe-signature", header).send(payload);
    expect(res.status).toBe(200);
  });
});

describe("customer.subscription.updated", () => {
  it("downgrades the user to free when status becomes past_due", async () => {
    const reg = await request(app).post("/api/auth/register").send({ name: "Sub", email: "sub@example.com", password: "password123" });
    await User.findByIdAndUpdate(reg.body.user._id, {
      "subscription.plan": "pro",
      "subscription.stripeSubscriptionId": "sub_downgrade_test",
    });

    const { payload, header } = signedPayload({
      id: "evt_sub_updated",
      type: "customer.subscription.updated",
      data: { object: { id: "sub_downgrade_test", status: "past_due", current_period_end: Math.floor(Date.now() / 1000) + 86400 } },
    });
    const res = await request(app).post("/api/stripe/webhook").set("Content-Type", "application/json").set("stripe-signature", header).send(payload);
    expect(res.status).toBe(200);

    const user = await User.findOne({ email: "sub@example.com" });
    expect(user.subscription.plan).toBe("free");
    expect(user.subscription.status).toBe("past_due");
    expect(user.usage.aiCreditsLimit).toBe(5);
  });

  it("keeps the plan when status stays active", async () => {
    const reg = await request(app).post("/api/auth/register").send({ name: "Sub2", email: "sub2@example.com", password: "password123" });
    await User.findByIdAndUpdate(reg.body.user._id, {
      "subscription.plan": "pro",
      "subscription.stripeSubscriptionId": "sub_stay_active",
    });

    const { payload, header } = signedPayload({
      id: "evt_sub_updated_2",
      type: "customer.subscription.updated",
      data: { object: { id: "sub_stay_active", status: "active", current_period_end: Math.floor(Date.now() / 1000) + 86400 } },
    });
    await request(app).post("/api/stripe/webhook").set("Content-Type", "application/json").set("stripe-signature", header).send(payload);

    const user = await User.findOne({ email: "sub2@example.com" });
    expect(user.subscription.plan).toBe("pro");
  });
});

describe("customer.subscription.deleted", () => {
  it("downgrades the user to free and resets usage limits", async () => {
    const reg = await request(app).post("/api/auth/register").send({ name: "Canceler", email: "cancel@example.com", password: "password123" });
    await User.findByIdAndUpdate(reg.body.user._id, {
      "subscription.plan": "pro",
      "subscription.stripeSubscriptionId": "sub_cancel_test",
      "usage.aiCreditsLimit": 100,
    });

    const { payload, header } = signedPayload({
      id: "evt_sub_deleted",
      type: "customer.subscription.deleted",
      data: { object: { id: "sub_cancel_test" } },
    });
    const res = await request(app).post("/api/stripe/webhook").set("Content-Type", "application/json").set("stripe-signature", header).send(payload);
    expect(res.status).toBe(200);

    const user = await User.findOne({ email: "cancel@example.com" });
    expect(user.subscription.plan).toBe("free");
    expect(user.subscription.status).toBe("canceled");
    expect(user.usage.aiCreditsLimit).toBe(5);
  });
});

describe("invoice.payment_succeeded", () => {
  it("resets monthly AI credits and keeps status active", async () => {
    const reg = await request(app).post("/api/auth/register").send({ name: "Renewer", email: "renew@example.com", password: "password123" });
    await User.findByIdAndUpdate(reg.body.user._id, {
      "subscription.plan": "pro",
      "subscription.stripeSubscriptionId": "sub_renew_test",
      "usage.aiCreditsUsed": 87,
    });

    const { payload, header } = signedPayload({
      id: "evt_invoice_paid",
      type: "invoice.payment_succeeded",
      data: { object: { subscription: "sub_renew_test" } },
    });
    const res = await request(app).post("/api/stripe/webhook").set("Content-Type", "application/json").set("stripe-signature", header).send(payload);
    expect(res.status).toBe(200);

    const user = await User.findOne({ email: "renew@example.com" });
    expect(user.usage.aiCreditsUsed).toBe(0);
    expect(user.subscription.status).toBe("active");
  });
});
