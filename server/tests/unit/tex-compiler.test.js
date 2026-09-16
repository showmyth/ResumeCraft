import { describe, it, expect, vi } from "vitest";

// Each test that needs custom env vars uses vi.resetModules() + a fresh
// dynamic import, since tex_compiler.js reads its concurrency/timeout
// config from process.env at module-load time — static imports are
// hoisted in ESM, so env vars must be set before the module first loads.
async function freshCompiler(env = {}) {
  vi.resetModules();
  const original = { ...process.env };
  Object.assign(process.env, env);
  const mod = await import("../../services/latex/tex_compiler.js");
  process.env = original;
  return mod;
}

const MINIMAL_TEX = `\\documentclass{article}\\begin{document}Hello\\end{document}`;

describe("tex_compiler hardening", () => {
  it("compiles a simple document successfully (regression baseline)", async () => {
    const { compileToPDF } = await freshCompiler();
    const pdf = await compileToPDF(MINIMAL_TEX);
    expect(pdf.length).toBeGreaterThan(0);
    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  });

  it("caps concurrency and rejects with 503 once the bounded queue is full", async () => {
    const { compileToPDF } = await freshCompiler({
      LATEX_MAX_CONCURRENCY: "2",
      LATEX_MAX_QUEUE: "2",
    });

    // 6 simultaneous compiles, cap=2 concurrent + queue room=2 => 4 should
    // succeed (2 running + 2 queued), the other 2 should be rejected
    // immediately with a 503 rather than piling up unboundedly.
    const results = await Promise.allSettled(
      Array.from({ length: 6 }, () => compileToPDF(MINIMAL_TEX))
    );

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(4);
    expect(rejected.length).toBe(2);
    rejected.forEach((r) => expect(r.reason.status).toBe(503));
  });

  it("kills a compile that exceeds the configured timeout and returns a 504", async () => {
    const { compileToPDF } = await freshCompiler({ LATEX_COMPILE_TIMEOUT_MS: "1" });
    await expect(compileToPDF(MINIMAL_TEX)).rejects.toMatchObject({ status: 504 });
  });

  it("returns a 422 for genuinely broken LaTeX rather than crashing the process", async () => {
    const { compileToPDF } = await freshCompiler();
    const broken = `\\documentclass{article}\\begin{document}\\undefinedcommandthatdoesnotexist{}\\end{document}`;
    await expect(compileToPDF(broken)).rejects.toMatchObject({ status: 422 });
  });
});
