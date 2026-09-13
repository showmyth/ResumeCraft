import { describe, it, expect, vi, beforeAll } from "vitest";
import Redis from "ioredis";

const REDIS_URL = process.env.TEST_REDIS_URL || "redis://localhost:6379";
const MINIMAL_TEX = `\\documentclass{article}\\begin{document}Hello\\end{document}`;

let redisAvailable = false;

beforeAll(async () => {
  const client = new Redis(REDIS_URL, { lazyConnect: true, retryStrategy: () => null });
  try {
    await client.connect();
    await client.ping();
    redisAvailable = true;
  } catch {
    redisAvailable = false;
  } finally {
    client.disconnect();
  }
});

async function freshCompiler(env = {}) {
  vi.resetModules();
  const original = { ...process.env };
  Object.assign(process.env, { REDIS_URL, ...env });
  const mod = await import("../../services/latex/tex_compiler.js");
  process.env = original;
  return mod;
}

describe("tex_compiler — Redis-backed mode", () => {
  it("compiles a document successfully when REDIS_URL is set", async (ctx) => {
    if (!redisAvailable) return ctx.skip();
    const { compileToPDF } = await freshCompiler();
    const pdf = await compileToPDF(MINIMAL_TEX);
    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  });

  it("propagates a 422 status for broken LaTeX through the Redis serialization boundary", async (ctx) => {
    if (!redisAvailable) return ctx.skip();
    const { compileToPDF } = await freshCompiler();
    const broken = `\\documentclass{article}\\begin{document}\\undefinedcommandxyz{}\\end{document}`;
    await expect(compileToPDF(broken)).rejects.toMatchObject({ status: 422 });
  });

  it("propagates a 504 status when the compile exceeds the timeout", async (ctx) => {
    if (!redisAvailable) return ctx.skip();
    const { compileToPDF } = await freshCompiler({ LATEX_COMPILE_TIMEOUT_MS: "1" });
    await expect(compileToPDF(MINIMAL_TEX)).rejects.toMatchObject({ status: 504 });
  });

  it("rejects with 503 once the queue is genuinely full under realistic (staggered) load", async (ctx) => {
    if (!redisAvailable) return ctx.skip();
    const { compileToPDF } = await freshCompiler({ LATEX_MAX_CONCURRENCY: "1", LATEX_MAX_QUEUE: "1" });

    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push(compileToPDF(MINIMAL_TEX).then(() => "fulfilled").catch((e) => `rejected:${e.status}`));
      await new Promise((r) => setTimeout(r, 15));
    }
    const settled = await Promise.all(results);
    expect(settled.some((r) => r.startsWith("rejected:503"))).toBe(true);
  });

  it("falls back to in-process mode when REDIS_URL is not set (default, no infra required)", async () => {
    vi.resetModules();
    const original = { ...process.env };
    delete process.env.REDIS_URL;
    const { compileToPDF } = await import("../../services/latex/tex_compiler.js");
    process.env = original;

    const pdf = await compileToPDF(MINIMAL_TEX);
    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  });
});
