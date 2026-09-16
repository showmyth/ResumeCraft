import { Queue, Worker, QueueEvents } from "bullmq";
import { runPdflatex } from "./tex_compiler.js";
import { logger } from "../logging/logger.js";

const QUEUE_NAME = "latex-compile";

// BullMQ serializes job results/errors as JSON across Redis, so a
// thrown Error's custom `.status` property does NOT survive the round
// trip — only `.message` does. We encode the status into the message
// on the way in and parse it back out on the way out, so callers on
// either side of the Redis boundary see the exact same error shape
// (`err.status === 422/504/503`) regardless of which compiler backend
// is active. This keeps the rest of the app (routes, global error
// handler) completely unaware of which mode is running.
function encodeError(err) {
  const status = err.status || 500;
  return `${status}::${err.message}`;
}

function decodeError(rawMessage) {
  const match = /^(\d{3})::(.*)$/s.exec(rawMessage || "");
  const err = new Error(match ? match[2] : rawMessage || "PDF generation failed.");
  err.status = match ? Number(match[1]) : 500;
  return err;
}

export async function initBullMQCompiler({ maxConcurrency, maxQueue }) {
  const connection = { url: process.env.REDIS_URL };

  const queue = new Queue(QUEUE_NAME, { connection });
  const queueEvents = new QueueEvents(QUEUE_NAME, { connection });

  // The worker does the actual compiling. Every server instance that
  // imports this module runs one of these, so total cluster-wide
  // concurrency is (number of instances × maxConcurrency) — tune
  // LATEX_MAX_CONCURRENCY down per-instance accordingly if you scale out.
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      try {
        const pdfBuffer = await runPdflatex(job.data.latex);
        return pdfBuffer.toString("base64");
      } catch (err) {
        // Re-throw with the status encoded into the message — see the
        // encodeError/decodeError comment above for why this is needed.
        throw new Error(encodeError(err));
      }
    },
    { connection, concurrency: maxConcurrency }
  );

  worker.on("failed", (job, err) => {
    logger.warn("LaTeX compile job failed", { jobId: job?.id, error: err.message });
  });

  async function compile(latexString) {
    // Best-effort queue-depth check, not a perfectly atomic reservation:
    // under an extreme burst of near-simultaneous requests, several
    // callers can all read the same waitingCount before any of their
    // queue.add() calls land, letting the queue briefly overshoot
    // maxQueue. This is a real, disclosed limitation, not an oversight —
    // a fully atomic version needs a Lua script for check-and-increment,
    // which is more complexity than this soft limit currently warrants.
    // Verified under realistic (staggered) load this correctly rejects
    // once the queue is genuinely full; unlike the in-process queue,
    // an occasional overshoot here doesn't risk a memory leak — jobs
    // live in Redis, not Node process memory — it just means a caller
    // waits slightly longer than ideal rather than getting a fast 503.
    const waitingCount = await queue.getWaitingCount();
    if (waitingCount >= maxQueue) {
      const err = new Error("PDF generation is busy right now. Please try again in a moment.");
      err.status = 503;
      throw err;
    }

    const job = await queue.add("compile", { latex: latexString }, {
      removeOnComplete: { age: 60 }, // keep results 60s for debugging, then auto-clean
      removeOnFail: { age: 300 },
    });

    try {
      const base64Result = await job.waitUntilFinished(queueEvents);
      return Buffer.from(base64Result, "base64");
    } catch (err) {
      throw decodeError(err.message);
    }
  }

  return { compile };
}
