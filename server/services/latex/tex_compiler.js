import { execFile } from "child_process";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { promisify } from "util";
import { logger } from "../logging/logger.js";

const execFileAsync = promisify(execFile);

const MAX_CONCURRENT_COMPILES = Number(process.env.LATEX_MAX_CONCURRENCY) || 4;
const MAX_QUEUE_LENGTH = Number(process.env.LATEX_MAX_QUEUE) || 30;
const COMPILE_TIMEOUT_MS = Number(process.env.LATEX_COMPILE_TIMEOUT_MS) || 15000;

// ── Core compile logic (backend-agnostic) ───────────────────────
// Just does the actual pdflatex work — no concurrency/queue policy
// here. Both the in-process queue below and the Redis-backed worker
// (bullmq_queue.js) call this exact function, so the compile behavior
// (timeout, error classification, cleanup) is identical either way.
export async function runPdflatex(latexString) {
  const jobId = randomUUID();
  const dir = join(tmpdir(), jobId);
  const texFile = join(dir, "resume.tex");
  const pdfFile = join(dir, "resume.pdf");

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(texFile, latexString, "utf8");

    try {
      await execFileAsync("pdflatex", [
        "-interaction=nonstopmode",
        "-halt-on-error",
        "-output-directory",
        dir,
        texFile,
      ], {
        maxBuffer: 10 * 1024 * 1024,
        timeout: COMPILE_TIMEOUT_MS,
      });

      return await readFile(pdfFile);
    } catch (err) {
      if (err.killed || err.signal === "SIGTERM") {
        const timeoutErr = new Error("PDF generation took too long and was stopped. Please try again.");
        timeoutErr.status = 504;
        throw timeoutErr;
      }
      const compileErr = new Error(`LaTeX compilation failed: ${err.stderr || err.stdout || err.message}`);
      compileErr.status = 422;
      throw compileErr;
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// ── Mode A: in-process concurrency cap + bounded queue ──────────
// Default when REDIS_URL isn't set. Works great for a single server
// instance with no extra infra. Limitation: concurrency is only
// coordinated within this one process — running multiple server
// instances means each gets its own independent cap (see Mode B).
let activeCompiles = 0;
const waitQueue = [];

function acquireSlot() {
  if (activeCompiles < MAX_CONCURRENT_COMPILES) {
    activeCompiles++;
    return Promise.resolve();
  }
  if (waitQueue.length >= MAX_QUEUE_LENGTH) {
    const err = new Error("PDF generation is busy right now. Please try again in a moment.");
    err.status = 503;
    return Promise.reject(err);
  }
  return new Promise((resolve) => waitQueue.push(resolve));
}

function releaseSlot() {
  const next = waitQueue.shift();
  if (next) next();
  else activeCompiles--;
}

async function compileInProcess(latexString) {
  await acquireSlot();
  try {
    return await runPdflatex(latexString);
  } finally {
    releaseSlot();
  }
}

// ── Mode B: Redis-backed queue (BullMQ) ─────────────────────────
// Used when REDIS_URL is set. Concurrency and the wait queue are
// coordinated through Redis instead of in-process memory, so this
// works correctly across multiple server instances — any instance's
// worker can pick up any queued job, and the queue depth (and 503
// behavior) is shared and accurate cluster-wide, not per-instance.
let redisModePromise = null; // cache the in-flight promise, not just the resolved value

async function getRedisMode() {
  if (!process.env.REDIS_URL) return false;

  // Promise memoization: if several compileToPDF calls race in before
  // initialization finishes, they must all await the SAME init, not
  // each kick off their own Queue/Worker/QueueEvents — otherwise every
  // concurrent caller gets its own independent concurrency cap, which
  // defeats the entire point of coordinating through Redis. Assigning
  // the promise here (before any await) closes that race: this
  // assignment runs synchronously, so a second concurrent call sees
  // it's already set before it has a chance to start its own.
  if (!redisModePromise) {
    redisModePromise = import("./bullmq_queue.js").then((mod) => {
      logger.info("LaTeX compiler using Redis-backed queue (BullMQ)", {
        redisUrl: process.env.REDIS_URL.replace(/:[^:@]*@/, ":***@"),
      });
      return mod.initBullMQCompiler({
        maxConcurrency: MAX_CONCURRENT_COMPILES,
        maxQueue: MAX_QUEUE_LENGTH,
      });
    });
  }
  return redisModePromise;
}

// ── Public API (unchanged signature regardless of backend) ──────
export async function compileToPDF(latexString) {
  const redis = await getRedisMode();
  if (redis) return redis.compile(latexString);
  return compileInProcess(latexString);
}
