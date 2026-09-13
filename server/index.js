import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resumes.js";
import aiRoutes from "./routes/ai.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import adminRoutes from "./routes/admin.js";
import stripeRoutes from "./routes/stripe.js";
import { logger } from "./services/logging/logger.js";
import { registerSentryErrorHandler, captureException } from "./services/logging/sentry.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security middleware ────────────────────────────────────────
app.use(helmet());

// Allow any Vercel deployment + production domain + localhost
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow no origin (same-origin requests)
  
  // Production domain
  if (origin === "https://cv-generinator.vercel.app") return true;
  
  // Any Vercel preview deployment
  if (/^https:\/\/cv-generinator-[a-z0-9]+-vikram-kumar-sahus-projects\.vercel\.app$/.test(origin)) return true;
  
  // Localhost (development)
  if (origin === "http://localhost:5173" || origin === "http://localhost:3000") return true;
  
  return false;
};

app.use(
  cors({
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

// Stripe webhook must receive raw body — register BEFORE express.json()
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev", { stream: { write: (msg) => logger.http(msg.trim()) } }));

// ── Rate limiting ──────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "AI rate limit reached. Please wait a minute." },
});
app.use("/api/ai", aiLimiter);

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stripe", stripeRoutes);

// ── Health check ───────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Sentry's error handler must be registered after all routes but
// before the final custom error handler below, so it can capture the
// error before we turn it into a JSON response. No-ops if SENTRY_DSN
// isn't set.
registerSentryErrorHandler(app);

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  captureException(err, { path: req.path, method: req.method });
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ── Database + Start ───────────────────────────────────────────
// Skipped under NODE_ENV=test — tests import `app` directly and manage
// their own (in-memory) DB connection via mongodb-memory-server, so we
// don't want a real network connection or an open listening port as a
// side effect of just importing this module.
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      logger.info("MongoDB connected");
      app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      logger.error("MongoDB connection failed", { error: err.message });
      process.exit(1);
    });
}

export default app;
