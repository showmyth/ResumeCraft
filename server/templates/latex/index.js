import { getLegacyTemplate } from "./legacy.js";
import { jakesResume } from "./jakes.js";
import { infosecResume } from "./infosec.js";
import { devopsSreResume } from "./devops-sre.js";
import { systemsLowLevelResume } from "./systems-lowlevel.js";
import { cvHybridResume } from "./cv-hybrid.js";
import { LEGACY_LAYOUTS, DEFAULT_LAYOUT } from "../../config/domains.js";

// Registry of the 5 real layout families. Each entry is a function with
// signature (content, { isPro }) => latexString. All 5 layout families
// from the domain rollout are now implemented — legacy ids are the only
// remaining fallback path (see legacy.js).
const LAYOUTS = {
  jakes: jakesResume,
  infosec: infosecResume,
  "devops-sre": devopsSreResume,
  "systems-lowlevel": systemsLowLevelResume,
  "cv-hybrid": cvHybridResume,
};

export function getTemplate(templateId = DEFAULT_LAYOUT) {
  if (LEGACY_LAYOUTS.includes(templateId)) {
    return getLegacyTemplate(templateId);
  }
  return LAYOUTS[templateId] || LAYOUTS[DEFAULT_LAYOUT];
}
