// One-off migration: backfill `domain` on resumes created before the
// domain field existed. Safe to run multiple times (idempotent — only
// touches documents missing the field). Does NOT touch templateId:
// legacy layout ids (modern/classic/executive/creative/minimal/tech)
// stay valid and keep rendering through the legacy template path.
//
// Usage:
//   node server/scripts/migrate-add-domain.js
//
// Optional: pass --dry-run to see how many documents would be affected
// without writing anything.

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Resume from "../models/Resume_Schema.js";
import { DEFAULT_DOMAIN } from "../config/domains.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DRY_RUN = process.argv.includes("--dry-run");

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");

  const filter = { domain: { $exists: false } };
  const affected = await Resume.countDocuments(filter);
  console.log(`Found ${affected} resume(s) missing a domain.`);

  if (affected === 0) {
    console.log("Nothing to migrate.");
  } else if (DRY_RUN) {
    console.log(`Dry run — would set domain: "${DEFAULT_DOMAIN}" on ${affected} document(s). No writes made.`);
  } else {
    const result = await Resume.updateMany(filter, { $set: { domain: DEFAULT_DOMAIN } });
    console.log(`✅ Migrated ${result.modifiedCount} resume(s) to domain: "${DEFAULT_DOMAIN}".`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
