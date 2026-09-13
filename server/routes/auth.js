import express from "express";
import crypto from "crypto";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { protect, sendTokenResponse } from "../middleware/auth.js";
import { sendEmail } from "../services/email/mailer.js";
import { passwordResetEmail, welcomeEmail } from "../services/email/templates.js";
import { logger } from "../services/logging/logger.js";

const router = express.Router();

// Strict limiter on password-reset requests specifically — separate
// from the global API limiter — since this endpoint sends email and
// is a classic target for enumeration/spam abuse.
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many password reset requests. Please try again later." },
});

// ── Validation rules ───────────────────────────────────────────
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ── POST /api/auth/register ────────────────────────────────────
router.post("/register", registerValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // First user ever becomes admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const user = await User.create({ name, email, password, role });

    // Fire-and-forget — never block registration on email delivery.
    sendEmail({ to: user.email, ...welcomeEmail({ name: user.name }) })
      .catch((err) => logger.warn("Welcome email failed to send", { error: err.message }));

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ───────────────────────────────────────
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Your account has been deactivated. Contact support." });
    }

    // Update login stats
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/me ───────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// ── POST /api/auth/logout ──────────────────────────────────────
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.json({ success: true, message: "Logged out successfully." });
});

// ── PATCH /api/auth/profile ────────────────────────────────────
router.patch("/profile", protect, async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/auth/password ───────────────────────────────────
router.patch("/password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/forgot-password ─────────────────────────────
router.post(
  "/forgot-password",
  resetLimiter,
  [body("email").isEmail().normalizeEmail().withMessage("Valid email required")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email } = req.body;
      const user = await User.findOne({ email });

      // Always respond with the same generic message whether or not the
      // account exists — prevents this endpoint from being used to
      // enumerate registered emails.
      const genericResponse = { success: true, message: "If an account with that email exists, a reset link has been sent." };

      if (!user) return res.json(genericResponse);

      const rawToken = crypto.randomBytes(32).toString("hex");
      // Store only the hash — a leaked DB dump should never be enough to
      // reset someone's password, the same principle as password hashing.
      user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${rawToken}`;
      const emailResult = await sendEmail({ to: user.email, ...passwordResetEmail({ name: user.name, resetUrl }) });

      if (!emailResult.sent) {
        logger.warn("Password reset email not sent (SMTP unconfigured or failed)", { userId: user._id.toString() });
      }

      res.json(genericResponse);
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/auth/reset-password/:token ───────────────────────
router.post(
  "/reset-password/:token",
  resetLimiter,
  [body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ error: "This reset link is invalid or has expired. Please request a new one." });
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      sendTokenResponse(user, 200, res);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
