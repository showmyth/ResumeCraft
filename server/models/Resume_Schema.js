import mongoose from "mongoose";
import { DOMAINS, DEFAULT_DOMAIN, LAYOUTS, LEGACY_LAYOUTS, DEFAULT_LAYOUT } from "../config/domains.js";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Resume",
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    // Content lens: drives section emphasis, AI prompt tuning, and ATS
    // keyword bank. Independent from templateId (the visual layout).
    domain: {
      type: String,
      enum: DOMAINS,
      default: DEFAULT_DOMAIN,
    },
    // Visual layout family. LEGACY_LAYOUTS are kept valid so resumes
    // created under the old 6-color system keep rendering — do not
    // remove them without a data migration first.
    templateId: {
      type: String,
      enum: [...LAYOUTS, ...LEGACY_LAYOUTS],
      default: DEFAULT_LAYOUT,
    },
    content: {
      personal: {
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        title: { type: String, default: "" },
      },
      summary: { type: String, default: "" },
      experience: [
        {
          id: String,
          company: String,
          position: String,
          location: String,
          startDate: String,
          endDate: String,
          current: { type: Boolean, default: false },
          description: String,
          bullets: [String],
        },
      ],
      education: [
        {
          id: String,
          institution: String,
          degree: String,
          field: String,
          location: String,
          startDate: String,
          endDate: String,
          current: { type: Boolean, default: false },
          gpa: String,
          honors: String,
        },
      ],
      skills: [
        {
          id: String,
          category: String,
          items: [String],
        },
      ],
      projects: [
        {
          id: String,
          name: String,
          description: String,
          technologies: [String],
          url: String,
          github: String,
          startDate: String,
          endDate: String,
        },
      ],
      certifications: [
        {
          id: String,
          name: String,
          issuer: String,
          date: String,
          url: String,
        },
      ],
      languages: [
        {
          id: String,
          language: String,
          proficiency: {
            type: String,
            enum: ["Native", "Fluent", "Advanced", "Intermediate", "Basic"],
          },
        },
      ],

      // ── Domain-specific blocks (all optional; a given layout renders
      // only the ones it cares about, e.g. Jake's Resume ignores all of
      // these, Infosec renders skillsMatrix + ctfToolingProjects) ──────

      // Infosec: skills grid with per-skill proficiency, distinct from
      // the free-text `skills` category list above.
      skillsMatrix: [
        {
          id: String,
          category: String,
          items: [String],
          proficiency: {
            type: String,
            enum: ["Familiar", "Proficient", "Advanced", "Expert"],
          },
        },
      ],
      // Infosec: CTF placements / security tooling projects.
      ctfToolingProjects: [
        {
          id: String,
          name: String,
          platform: String, // e.g. "HackTheBox", "picoCTF"
          rank: String,
          writeupUrl: String,
          tools: [String],
        },
      ],
      // DevOps/SRE: tools & infra stack grouped by category
      // (e.g. { category: "Orchestration", tools: ["Kubernetes","Nomad"] }).
      infraStack: [
        {
          id: String,
          category: String,
          tools: [String],
        },
      ],
      // DevOps/SRE + Systems: structured metrics for bullet callouts,
      // rendered as standout stat blocks instead of buried in prose.
      metrics: [
        {
          id: String,
          label: String,   // e.g. "Deploy frequency"
          value: String,   // e.g. "12x/day"
          context: String, // e.g. "up from weekly releases"
        },
      ],
      // Systems/Low-Level: languages paired with target hardware/platforms.
      hardwareLanguages: [
        {
          id: String,
          language: String,
          hardware: [String], // e.g. ["ARM Cortex-M4", "RISC-V"]
        },
      ],
      // Systems/Low-Level: patents filed/granted.
      patents: [
        {
          id: String,
          title: String,
          number: String,
          status: {
            type: String,
            enum: ["Filed", "Pending", "Granted"],
          },
          date: String,
        },
      ],
      // Systems/Low-Level: performance benchmark call-outs.
      benchmarks: [
        {
          id: String,
          metric: String,     // e.g. "P99 latency"
          value: String,      // e.g. "1.2ms"
          comparison: String, // e.g. "-40% vs baseline"
        },
      ],
      // CV-Hybrid: publications with academic citation fields.
      publications: [
        {
          id: String,
          title: String,
          venue: String,
          year: String,
          authors: [String],
          url: String,
          citationCount: Number,
        },
      ],
      // CV-Hybrid: research experience, distinct from industry `experience`
      // — carries advisor/lab/funding fields that don't belong on a job.
      researchExperience: [
        {
          id: String,
          lab: String,
          advisor: String,
          institution: String,
          fundingSource: String,
          startDate: String,
          endDate: String,
          current: { type: Boolean, default: false },
          bullets: [String],
        },
      ],
    },
    atsScore: { type: Number, default: 0, min: 0, max: 100 },
    downloads: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    lastExportedAt: Date,
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ user: 1, updatedAt: -1 });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
