import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { connectTestDB, disconnectTestDB, clearTestDB } from "./setup.js";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-do-not-use-in-prod";

let app;
let authCookie;

beforeAll(async () => {
  await connectTestDB();
  app = (await import("../../index.js")).default;
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearTestDB();
  const res = await request(app).post("/api/auth/register").send({
    name: "Resume Tester", email: "resumes@example.com", password: "password123",
  });
  authCookie = res.headers["set-cookie"];
});

describe("POST /api/resumes", () => {
  it("creates a resume defaulting to domain=swe, templateId=jakes", async () => {
    const res = await request(app).post("/api/resumes").set("Cookie", authCookie).send({ title: "My Resume" });
    expect(res.status).toBe(201);
    expect(res.body.resume.domain).toBe("swe");
    expect(res.body.resume.templateId).toBe("jakes");
  });

  it("respects an explicit domain/templateId", async () => {
    const res = await request(app).post("/api/resumes").set("Cookie", authCookie).send({
      title: "Security Resume", domain: "cybersecurity", templateId: "infosec",
    });
    expect(res.body.resume.domain).toBe("cybersecurity");
    expect(res.body.resume.templateId).toBe("infosec");
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).post("/api/resumes").send({ title: "No Auth" });
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/resumes/:id", () => {
  it("updates domain and templateId independently", async () => {
    const create = await request(app).post("/api/resumes").set("Cookie", authCookie).send({ title: "Test" });
    const res = await request(app)
      .patch(`/api/resumes/${create.body.resume._id}`)
      .set("Cookie", authCookie)
      .send({ domain: "devops", templateId: "devops-sre" });
    expect(res.status).toBe(200);
    expect(res.body.resume.domain).toBe("devops");
    expect(res.body.resume.templateId).toBe("devops-sre");
  });

  it("does not allow updating another user's resume", async () => {
    const create = await request(app).post("/api/resumes").set("Cookie", authCookie).send({ title: "Mine" });

    const other = await request(app).post("/api/auth/register").send({ name: "Other", email: "other@example.com", password: "password123" });
    const otherCookie = other.headers["set-cookie"];

    const res = await request(app)
      .patch(`/api/resumes/${create.body.resume._id}`)
      .set("Cookie", otherCookie)
      .send({ title: "Hijacked" });
    expect(res.status).toBe(404);
  });
});

describe("POST /api/resumes/:id/duplicate", () => {
  it("carries over domain and templateId to the duplicate", async () => {
    const create = await request(app).post("/api/resumes").set("Cookie", authCookie).send({
      title: "Original", domain: "ai-ml", templateId: "jakes",
    });
    const dup = await request(app).post(`/api/resumes/${create.body.resume._id}/duplicate`).set("Cookie", authCookie);
    expect(dup.status).toBe(201);
    expect(dup.body.resume.domain).toBe("ai-ml");
    expect(dup.body.resume.title).toContain("Copy");
  });
});
