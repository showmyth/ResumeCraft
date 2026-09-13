import * as Sentry from "@sentry/node";
import { logger } from "./logger.js";

// Actual Sentry.init() happens in instrument.mjs, loaded via `node
// --import` before this module (or any app code) is evaluated — see
// that file for why. This module only registers the Express error
// handler at the right point in the middleware chain, and exposes
// manual capture for use outside Express's error-handling flow.
const enabled = Boolean(process.env.SENTRY_DSN);

if (!enabled) {
  logger.info("Sentry not configured (SENTRY_DSN unset) — using local logging only.");
}

// Call once, AFTER all routes are mounted but BEFORE the final custom
// error handler — this is Express's required ordering for error
// middleware, and Sentry's own docs require the same placement.
export function registerSentryErrorHandler(app) {
  if (!enabled) return;
  Sentry.setupExpressErrorHandler(app);
}

// Manual capture for errors handled outside Express's error middleware
// (e.g. inside a catch block where you still want to continue).
export function captureException(err, context = {}) {
  logger.error(err.message, { stack: err.stack, ...context });
  if (enabled) Sentry.captureException(err, { extra: context });
}
