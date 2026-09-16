// Sentry v10 requires ESM instrumentation to be registered via Node's
// --import flag BEFORE any application code (including express) loads,
// so it can hook the module loader. Calling Sentry.init() from inside
// index.js works for manual error capture but produces incomplete
// instrumentation (missing auto request/HTTP breadcrumbs) — see
// https://docs.sentry.io/platforms/javascript/guides/express/install/esm/
//
// This file is a safe no-op if SENTRY_DSN isn't set, so it's always
// included in the start/dev scripts regardless of whether Sentry is
// configured for this environment.
import * as Sentry from "@sentry/node";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  });
}
