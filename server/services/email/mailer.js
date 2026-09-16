import nodemailer from "nodemailer";
import { logger } from "../logging/logger.js";

// Generic SMTP transport — works with any provider (Gmail, SendGrid SMTP
// relay, AWS SES SMTP, Mailtrap for dev, Postmark, etc.) so we're not
// locked to one vendor's SDK. Configured entirely via env vars.
//
// If SMTP isn't configured (no SMTP_HOST), emails are logged instead of
// sent. This is a deliberate safe default: local dev and CI should never
// crash or silently fail just because no mail credentials are present,
// and a developer can still see exactly what would have been sent.
let transporter = null;
let smtpConfigured = false;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    smtpConfigured = false;
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  smtpConfigured = true;
  return transporter;
}

/**
 * Send an email. Falls back to logging the email contents if SMTP isn't
 * configured — never throws just because mail isn't set up. Callers that
 * need to know whether mail actually sent can check the returned
 * `{ sent }` flag (e.g. to decide what to tell the user in dev mode).
 */
export async function sendEmail({ to, subject, html, text }) {
  const client = getTransporter();

  if (!client) {
    logger.warn("Email not sent — SMTP not configured. Logging instead.", {
      to, subject, preview: (text || html || "").slice(0, 200),
    });
    return { sent: false, reason: "smtp_not_configured" };
  }

  try {
    await client.sendMail({
      from: process.env.SMTP_FROM || '"ResumeCraft" <no-reply@resumecraft.app>',
      to,
      subject,
      html,
      text,
    });
    logger.info("Email sent", { to, subject });
    return { sent: true };
  } catch (err) {
    logger.error("Email send failed", { to, subject, error: err.message });
    return { sent: false, reason: "send_failed", error: err.message };
  }
}

export function isEmailConfigured() {
  getTransporter();
  return smtpConfigured;
}
