import winston from "winston";

// Structured logging that works out of the box with zero configuration —
// this is the baseline "error monitoring" every environment gets, even
// with no external service configured. JSON format in production (easy
// to ship to any log aggregator later — Datadog, CloudWatch, etc.),
// readable colorized format in development.
const isProd = process.env.NODE_ENV === "production";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  format: isProd
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} ${level}: ${message}${metaStr}`;
        })
      ),
  transports: [
    new winston.transports.Console(),
    // Persisted logs on disk regardless of environment — gives you
    // something to inspect even if you haven't wired up a log
    // aggregator or Sentry yet. Rotated by size to avoid unbounded growth.
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
});
