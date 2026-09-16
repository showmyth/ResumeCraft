import { useState } from "react";
import api from "../../utils/api";
import {
  User, Briefcase, GraduationCap, Wrench, FolderOpen,
  Award, Languages, FileText, ChevronDown, ChevronUp,
  PlusCircle, Trash2, Sparkles, Loader2,
  Grid3x3, Flag, Server, BarChart3, Cpu, FileBadge, Gauge, BookOpen, FlaskConical
} from "lucide-react";
import { cn, generateId } from "../../utils/helpers";
import toast from "react-hot-toast";

const SECTIONS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Languages },
];

// Domain-specific sections, shown only for the layout(s) that render
// them (see server/templates/latex/*.js for which layout uses which
// block). Kept out of the base SECTIONS list so Jake's Resume users
// (SWE/Data Eng/AI-ML/Cloud/DB — most students) aren't shown fields
// their template ignores.
const TEMPLATE_SECTIONS = {
  infosec: [
    { id: "skillsMatrix", label: "Skills Matrix", icon: Grid3x3 },
    { id: "ctfToolingProjects", label: "CTF & Tooling", icon: Flag },
  ],
  "devops-sre": [
    { id: "infraStack", label: "Infra & Tools Stack", icon: Server },
    { id: "metrics", label: "Key Metrics", icon: BarChart3 },
  ],
  "systems-lowlevel": [
    { id: "hardwareLanguages", label: "Languages & Hardware", icon: Cpu },
    { id: "patents", label: "Patents", icon: FileBadge },
    { id: "benchmarks", label: "Benchmarks", icon: Gauge },
  ],
  "cv-hybrid": [
    { id: "publications", label: "Publications", icon: BookOpen },
    { id: "researchExperience", label: "Research Experience", icon: FlaskConical },
  ],
};

// Layout accent colors — mirrors the accent colors used in the actual
// LaTeX output (server/templates/latex/*.js) so the editor visually
// ties back to what the exported PDF will look like.
const LAYOUT_ACCENTS = {
  infosec: "#1F3B4D",
  "devops-sre": "#0F766E",
  "systems-lowlevel": "#3F3F46",
  "cv-hybrid": "#5B21B6",
};

// Which content field each section's item count is read from — powers
// the "(3)" count badge in the accordion header. Sections not listed
// here (personal, summary) don't have a natural count.
const SECTION_COUNT_FIELD = {
  experience: "experience", education: "education", skills: "skills",
  projects: "projects", certifications: "certifications", languages: "languages",
  skillsMatrix: "skillsMatrix", ctfToolingProjects: "ctfToolingProjects",
  infraStack: "infraStack", metrics: "metrics", hardwareLanguages: "hardwareLanguages",
  patents: "patents", benchmarks: "benchmarks", publications: "publications",
  researchExperience: "researchExperience",
};
// shared by every domain-specific section below instead of each one
// reimplementing the same three closures.
function listOps(fieldName, onChange) {
  return {
    add: (defaults = {}) => onChange(p => ({
      ...p,
      [fieldName]: [...(p[fieldName] || []), { id: generateId(), ...defaults }],
    })),
    update: (id, field, value) => onChange(p => ({
      ...p,
      [fieldName]: (p[fieldName] || []).map(x => x.id === id ? { ...x, [field]: value } : x),
    })),
    remove: (id) => onChange(p => ({
      ...p,
      [fieldName]: (p[fieldName] || []).filter(x => x.id !== id),
    })),
  };
}

export default function EditorPanel({ content, onChange, isPro, resumeId, domain, templateId }) {
  const [open, setOpen] = useState("personal");
  const [aiLoading, setAiLoading] = useState(null);

  const extraSections = TEMPLATE_SECTIONS[templateId] || [];

  async function callAI(action, text, field, context) {
    if (!isPro) { toast.error("AI features require Pro. Upgrade to unlock!"); return null; }
    setAiLoading(field);
    try {
      const { data } = await api.post("/ai/generate", {
        action, content: text,
        jobTitle: content?.personal?.title,
        domain,
        context,
      });
      toast.success(`${data.creditsUsed}/${data.creditsLimit} AI credits used`);
      return data.result;
    } catch (err) {
      toast.error(err.response?.data?.error || "AI failed");
      return null;
    } finally {
      setAiLoading(null);
    }
  }

  const set = (path, value) => onChange(prev => {
    const parts = path.split(".");
    const next = { ...prev };
    let cur = next;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = { ...cur[parts[i]] };
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    return next;
  });

  return (
    <div className="pb-8">
      {[...SECTIONS, ...extraSections].map(sec => {
        const isDomainSection = Boolean(TEMPLATE_SECTIONS[templateId]?.some(s => s.id === sec.id));
        const accent = isDomainSection ? LAYOUT_ACCENTS[templateId] : null;
        const countField = SECTION_COUNT_FIELD[sec.id];
        const count = countField ? (content[countField] || []).length : null;

        return (
        <div key={sec.id} className="border-b border-zinc-100 last:border-0">
          <button onClick={() => setOpen(open === sec.id ? "" : sec.id)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center",
                open === sec.id && !accent ? "bg-brand-100 text-brand-600" : !accent && "bg-zinc-100 text-zinc-500")}
                style={accent ? { backgroundColor: open === sec.id ? accent : `${accent}1A`, color: open === sec.id ? "#fff" : accent } : undefined}>
                <sec.icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-zinc-700">{sec.label}</span>
              {count > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500">{count}</span>
              )}
            </div>
            {open === sec.id ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {open === sec.id && (
            <div className="px-5 pb-5">
              {sec.id === "personal" && <PersonalSection content={content} set={set} />}
              {sec.id === "summary" && <SummarySection content={content} onChange={onChange} callAI={callAI} aiLoading={aiLoading} isPro={isPro} />}
              {sec.id === "experience" && <ExperienceSection content={content} onChange={onChange} callAI={callAI} aiLoading={aiLoading} isPro={isPro} />}
              {sec.id === "education" && <EducationSection content={content} onChange={onChange} />}
              {sec.id === "skills" && <SkillsSection content={content} onChange={onChange} />}
              {sec.id === "projects" && <ProjectsSection content={content} onChange={onChange} />}
              {sec.id === "certifications" && <CertsSection content={content} onChange={onChange} />}
              {sec.id === "languages" && <LanguagesSection content={content} onChange={onChange} />}
              {sec.id === "skillsMatrix" && <SkillsMatrixSection content={content} onChange={onChange} />}
              {sec.id === "ctfToolingProjects" && <CtfToolingSection content={content} onChange={onChange} />}
              {sec.id === "infraStack" && <InfraStackSection content={content} onChange={onChange} />}
              {sec.id === "metrics" && <MetricsSection content={content} onChange={onChange} />}
              {sec.id === "hardwareLanguages" && <HardwareLanguagesSection content={content} onChange={onChange} />}
              {sec.id === "patents" && <PatentsSection content={content} onChange={onChange} />}
              {sec.id === "benchmarks" && <BenchmarksSection content={content} onChange={onChange} />}
              {sec.id === "publications" && <PublicationsSection content={content} onChange={onChange} />}
              {sec.id === "researchExperience" && <ResearchExperienceSection content={content} onChange={onChange} />}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
// Shown instead of a bare "Add" button when a domain-specific section has
// no entries yet — gives context on why the section matters and what
// good input looks like, rather than an unexplained empty list.
function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 mb-3 rounded-xl bg-zinc-50 border border-dashed border-zinc-200">
      <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-3">
        <Icon className="w-4.5 h-4.5 text-zinc-400" />
      </div>
      <p className="text-sm font-semibold text-zinc-600 mb-1">{title}</p>
      <p className="text-xs text-zinc-400 max-w-xs">{description}</p>
    </div>
  );
}

// ── Shared field components ───────────────────────────────────────────────────
function F({ label, children }) {
  return <div className="mb-3"><label className="block text-xs font-medium text-zinc-500 mb-1">{label}</label>{children}</div>;
}
function I({ value, onChange, placeholder, type = "text" }) {
  return <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input" />;
}
function T({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="input resize-none" />;
}
function AIBtn({ onClick, loading, isPro, label = "AI Improve" }) {
  return (
    <button onClick={onClick} disabled={loading}
      className={cn("flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
        !isPro ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-brand-50 text-brand-600 hover:bg-brand-100")}>
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
      {!isPro ? "AI (Pro)" : label}
    </button>
  );
}
function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-zinc-200 text-sm font-medium text-zinc-400 hover:text-brand-600 hover:border-brand-400 hover:bg-brand-50/30 transition-all">
      <PlusCircle className="w-4 h-4" /> {label}
    </button>
  );
}
function RemoveBtn({ onClick }) {
  return (
    <button onClick={onClick} className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Personal ──────────────────────────────────────────────────────────────────
function PersonalSection({ content, set }) {
  const p = content.personal || {};
  const s = (field) => (v) => set(`personal.${field}`, v);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <F label="First Name"><I value={p.firstName} onChange={s("firstName")} placeholder="John" /></F>
        <F label="Last Name"><I value={p.lastName} onChange={s("lastName")} placeholder="Doe" /></F>
      </div>
      <F label="Professional Title"><I value={p.title} onChange={s("title")} placeholder="Senior Software Engineer" /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="Email"><I value={p.email} onChange={s("email")} placeholder="john@email.com" type="email" /></F>
        <F label="Phone"><I value={p.phone} onChange={s("phone")} placeholder="+1 555 000 0000" /></F>
      </div>
      <F label="Location"><I value={p.location} onChange={s("location")} placeholder="San Francisco, CA" /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="LinkedIn"><I value={p.linkedin} onChange={s("linkedin")} placeholder="linkedin.com/in/..." /></F>
        <F label="GitHub"><I value={p.github} onChange={s("github")} placeholder="github.com/..." /></F>
      </div>
      <F label="Website"><I value={p.website} onChange={s("website")} placeholder="yourwebsite.com" /></F>
    </div>
  );
}

// ── Summary ───────────────────────────────────────────────────────────────────
function SummarySection({ content, onChange, callAI, aiLoading, isPro }) {
  async function improve() {
    const result = await callAI("improve_summary", content.summary, "summary");
    if (result) onChange(p => ({ ...p, summary: result }));
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-zinc-500">Professional Summary</label>
        <AIBtn onClick={improve} loading={aiLoading === "summary"} isPro={isPro} />
      </div>
      <T value={content.summary} onChange={v => onChange(p => ({ ...p, summary: v }))} placeholder="A results-driven professional…" rows={5} />
      <p className="text-[11px] text-zinc-400 mt-1">{(content.summary || "").length}/600 chars</p>
    </div>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────
function ExperienceSection({ content, onChange, callAI, aiLoading, isPro }) {
  function add() {
    onChange(p => ({ ...p, experience: [...(p.experience || []), { id: generateId(), company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "", bullets: [] }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, experience: p.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }));
  }
  async function improveBullets(exp) {
    const result = await callAI("improve_bullets", exp.bullets.join("\n") || exp.description, `exp_${exp.id}`);
    if (result) {
      const bullets = result.split("\n").map(b => b.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
      update(exp.id, "bullets", bullets);
    }
  }
  return (
    <div>
      {(content.experience || []).map((exp, idx) => (
        <div key={exp.id} className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Position {idx + 1}</span>
            <div className="flex items-center gap-2">
              <AIBtn onClick={() => improveBullets(exp)} loading={aiLoading === `exp_${exp.id}`} isPro={isPro} label="Improve Bullets" />
              <RemoveBtn onClick={() => remove(exp.id)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Company"><I value={exp.company} onChange={v => update(exp.id, "company", v)} placeholder="Google" /></F>
            <F label="Position"><I value={exp.position} onChange={v => update(exp.id, "position", v)} placeholder="Software Engineer" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Start Date"><I value={exp.startDate} onChange={v => update(exp.id, "startDate", v)} placeholder="Jan 2022" /></F>
            <F label="End Date"><I value={exp.current ? "Present" : exp.endDate} onChange={v => update(exp.id, "endDate", v)} placeholder="Dec 2024" /></F>
          </div>
          <F label="Location"><I value={exp.location} onChange={v => update(exp.id, "location", v)} placeholder="San Francisco, CA" /></F>
          <F label="Bullet Points (one per line)">
            <T value={(exp.bullets || []).join("\n")} onChange={v => update(exp.id, "bullets", v.split("\n").filter(Boolean))} placeholder="Led team of engineers…&#10;Reduced load time by 40%…" rows={4} />
          </F>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Experience" />
    </div>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────
function EducationSection({ content, onChange }) {
  function add() {
    onChange(p => ({ ...p, education: [...(p.education || []), { id: generateId(), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", gpa: "", honors: "" }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, education: p.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));
  }
  return (
    <div>
      {(content.education || []).map((edu, idx) => (
        <div key={edu.id} className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Education {idx + 1}</span>
            <RemoveBtn onClick={() => remove(edu.id)} />
          </div>
          <F label="Institution"><I value={edu.institution} onChange={v => update(edu.id, "institution", v)} placeholder="MIT" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Degree"><I value={edu.degree} onChange={v => update(edu.id, "degree", v)} placeholder="Bachelor of Science" /></F>
            <F label="Field"><I value={edu.field} onChange={v => update(edu.id, "field", v)} placeholder="Computer Science" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Start Year"><I value={edu.startDate} onChange={v => update(edu.id, "startDate", v)} placeholder="2018" /></F>
            <F label="End Year"><I value={edu.endDate} onChange={v => update(edu.id, "endDate", v)} placeholder="2022" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="GPA"><I value={edu.gpa} onChange={v => update(edu.id, "gpa", v)} placeholder="3.8/4.0" /></F>
            <F label="Honors"><I value={edu.honors} onChange={v => update(edu.id, "honors", v)} placeholder="Cum Laude" /></F>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Education" />
    </div>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function SkillsSection({ content, onChange }) {
  function add() {
    onChange(p => ({ ...p, skills: [...(p.skills || []), { id: generateId(), category: "", items: [] }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, skills: p.skills.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, skills: p.skills.filter(s => s.id !== id) }));
  }
  return (
    <div>
      {(content.skills || []).map((cat, idx) => (
        <div key={cat.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Category {idx + 1}</span>
            <RemoveBtn onClick={() => remove(cat.id)} />
          </div>
          <F label="Category Name"><I value={cat.category} onChange={v => update(cat.id, "category", v)} placeholder="Programming Languages" /></F>
          <F label="Skills (comma-separated)">
            <I value={(cat.items || []).join(", ")} onChange={v => update(cat.id, "items", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="JavaScript, Python, Go" />
          </F>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Skill Category" />
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function ProjectsSection({ content, onChange }) {
  function add() {
    onChange(p => ({ ...p, projects: [...(p.projects || []), { id: generateId(), name: "", description: "", technologies: [], url: "", github: "" }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, projects: p.projects.map(x => x.id === id ? { ...x, [field]: value } : x) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, projects: p.projects.filter(x => x.id !== id) }));
  }
  return (
    <div>
      {(content.projects || []).map((proj, idx) => (
        <div key={proj.id} className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-zinc-400">Project {idx + 1}</span>
            <RemoveBtn onClick={() => remove(proj.id)} />
          </div>
          <F label="Project Name"><I value={proj.name} onChange={v => update(proj.id, "name", v)} placeholder="E-Commerce Platform" /></F>
          <F label="Description"><T value={proj.description} onChange={v => update(proj.id, "description", v)} placeholder="Built a full-stack platform…" rows={2} /></F>
          <F label="Technologies (comma-separated)">
            <I value={(proj.technologies || []).join(", ")} onChange={v => update(proj.id, "technologies", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="React, Node.js, MongoDB" />
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Live URL"><I value={proj.url} onChange={v => update(proj.id, "url", v)} placeholder="https://..." /></F>
            <F label="GitHub"><I value={proj.github} onChange={v => update(proj.id, "github", v)} placeholder="github.com/..." /></F>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Project" />
    </div>
  );
}

// ── Certifications ────────────────────────────────────────────────────────────
function CertsSection({ content, onChange }) {
  function add() {
    onChange(p => ({ ...p, certifications: [...(p.certifications || []), { id: generateId(), name: "", issuer: "", date: "" }] }));
  }
  function update(id, field, value) {
    onChange(p => ({ ...p, certifications: p.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) }));
  }
  function remove(id) {
    onChange(p => ({ ...p, certifications: p.certifications.filter(c => c.id !== id) }));
  }
  return (
    <div>
      {(content.certifications || []).map(cert => (
        <div key={cert.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex justify-end mb-2"><RemoveBtn onClick={() => remove(cert.id)} /></div>
          <F label="Certification Name"><I value={cert.name} onChange={v => update(cert.id, "name", v)} placeholder="AWS Solutions Architect" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Issuer"><I value={cert.issuer} onChange={v => update(cert.id, "issuer", v)} placeholder="Amazon Web Services" /></F>
            <F label="Date"><I value={cert.date} onChange={v => update(cert.id, "date", v)} placeholder="May 2024" /></F>
          </div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Certification" />
    </div>
  );
}

// ── Languages ─────────────────────────────────────────────────────────────────
function LanguagesSection({ content, onChange }) {
  const levels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];
  function add() {
    onChange(p => ({ ...p, languages: [...(p.languages || []), { id: generateId(), language: "", proficiency: "Fluent" }] }));
  }
  return (
    <div>
      {(content.languages || []).map(lang => (
        <div key={lang.id} className="flex gap-3 mb-3">
          <div className="flex-1">
            <I value={lang.language} onChange={v => onChange(p => ({ ...p, languages: p.languages.map(l => l.id === lang.id ? { ...l, language: v } : l) }))} placeholder="Spanish" />
          </div>
          <select value={lang.proficiency}
            onChange={e => onChange(p => ({ ...p, languages: p.languages.map(l => l.id === lang.id ? { ...l, proficiency: e.target.value } : l) }))}
            className="input w-36">
            {levels.map(lv => <option key={lv} value={lv}>{lv}</option>)}
          </select>
          <RemoveBtn onClick={() => onChange(p => ({ ...p, languages: p.languages.filter(l => l.id !== lang.id) }))} />
        </div>
      ))}
      <AddBtn onClick={add} label="Add Language" />
    </div>
  );
}

// ── Skills Matrix (Infosec) ───────────────────────────────────────────────────
function SkillsMatrixSection({ content, onChange }) {
  const { add, update, remove } = listOps("skillsMatrix", onChange);
  const levels = ["Familiar", "Proficient", "Advanced", "Expert"];
  const items = content.skillsMatrix || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Shown as a table on the Infosec layout — falls back to the plain Skills section if left empty.</p>
      {items.length === 0 && (
        <EmptyState icon={Grid3x3} title="No skills matrix yet"
          description="Group your security skills by category (e.g. AppSec, Cloud Security) with a proficiency level — shown as a table, more scannable than a plain list." />
      )}
      {items.map((row, idx) => (
        <div key={row.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Row {idx + 1}</span>
            <RemoveBtn onClick={() => remove(row.id)} />
          </div>
          <F label="Category"><I value={row.category} onChange={v => update(row.id, "category", v)} placeholder="AppSec" /></F>
          <F label="Tools/Items (comma-separated)">
            <I value={(row.items || []).join(", ")} onChange={v => update(row.id, "items", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="SAST, DAST, Burp Suite" />
          </F>
          <F label="Proficiency">
            <select value={row.proficiency || ""} onChange={e => update(row.id, "proficiency", e.target.value)} className="input">
              <option value="">Select...</option>
              {levels.map(lv => <option key={lv} value={lv}>{lv}</option>)}
            </select>
          </F>
        </div>
      ))}
      <AddBtn onClick={() => add({ category: "", items: [], proficiency: "" })} label="Add Skills Matrix Row" />
    </div>
  );
}

// ── CTF & Tooling (Infosec) ───────────────────────────────────────────────────
function CtfToolingSection({ content, onChange }) {
  const { add, update, remove } = listOps("ctfToolingProjects", onChange);
  const items = content.ctfToolingProjects || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">A dedicated section on the Infosec layout — placements and tooling recruiters actually look for.</p>
      {items.length === 0 && (
        <EmptyState icon={Flag} title="No CTF or tooling entries yet"
          description="HackTheBox/picoCTF placements, security tools you've built or used — this signals hands-on skill beyond coursework." />
      )}
      {items.map((c, idx) => (
        <div key={c.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Entry {idx + 1}</span>
            <RemoveBtn onClick={() => remove(c.id)} />
          </div>
          <F label="Name"><I value={c.name} onChange={v => update(c.id, "name", v)} placeholder="Web Exploitation Series" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Platform"><I value={c.platform} onChange={v => update(c.id, "platform", v)} placeholder="HackTheBox" /></F>
            <F label="Rank/Result"><I value={c.rank} onChange={v => update(c.id, "rank", v)} placeholder="Top 5%" /></F>
          </div>
          <F label="Write-up URL"><I value={c.writeupUrl} onChange={v => update(c.id, "writeupUrl", v)} placeholder="https://..." /></F>
          <F label="Tools (comma-separated)">
            <I value={(c.tools || []).join(", ")} onChange={v => update(c.id, "tools", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Burp Suite, sqlmap, ffuf" />
          </F>
        </div>
      ))}
      <AddBtn onClick={() => add({ name: "", platform: "", rank: "", writeupUrl: "", tools: [] })} label="Add CTF / Tooling Entry" />
    </div>
  );
}

// ── Infra & Tools Stack (DevOps/SRE) ──────────────────────────────────────────
function InfraStackSection({ content, onChange }) {
  const { add, update, remove } = listOps("infraStack", onChange);
  const items = content.infraStack || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Shown above Experience on the DevOps/SRE layout — falls back to the plain Skills section if left empty.</p>
      {items.length === 0 && (
        <EmptyState icon={Server} title="No infra stack yet"
          description="Group tools by category — Orchestration, IaC, Observability — this is usually the first thing an infra hiring manager scans for." />
      )}
      {items.map((row, idx) => (
        <div key={row.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Category {idx + 1}</span>
            <RemoveBtn onClick={() => remove(row.id)} />
          </div>
          <F label="Category"><I value={row.category} onChange={v => update(row.id, "category", v)} placeholder="Orchestration" /></F>
          <F label="Tools (comma-separated)">
            <I value={(row.tools || []).join(", ")} onChange={v => update(row.id, "tools", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Kubernetes, Helm" />
          </F>
        </div>
      ))}
      <AddBtn onClick={() => add({ category: "", tools: [] })} label="Add Infra Category" />
    </div>
  );
}

// ── Key Metrics (DevOps/SRE) ──────────────────────────────────────────────────
function MetricsSection({ content, onChange }) {
  const { add, update, remove } = listOps("metrics", onChange);
  const items = content.metrics || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Rendered as a stat band under your name (e.g. "12x/day — Deploy frequency").</p>
      {items.length === 0 && (
        <EmptyState icon={BarChart3} title="No metrics yet"
          description="Deploy frequency, MTTR, uptime — the numbers SRE/DevOps roles get judged on. 2-3 strong ones is plenty." />
      )}
      {items.map((m, idx) => (
        <div key={m.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Metric {idx + 1}</span>
            <RemoveBtn onClick={() => remove(m.id)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Value"><I value={m.value} onChange={v => update(m.id, "value", v)} placeholder="12x/day" /></F>
            <F label="Label"><I value={m.label} onChange={v => update(m.id, "label", v)} placeholder="Deploy frequency" /></F>
          </div>
          <F label="Context (optional)"><I value={m.context} onChange={v => update(m.id, "context", v)} placeholder="up from weekly releases" /></F>
        </div>
      ))}
      <AddBtn onClick={() => add({ label: "", value: "", context: "" })} label="Add Metric" />
    </div>
  );
}

// ── Languages & Hardware (Systems/Low-Level) ──────────────────────────────────
function HardwareLanguagesSection({ content, onChange }) {
  const { add, update, remove } = listOps("hardwareLanguages", onChange);
  const items = content.hardwareLanguages || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Shown first on the Systems layout — falls back to the plain Skills section if left empty.</p>
      {items.length === 0 && (
        <EmptyState icon={Cpu} title="No languages/hardware yet"
          description="Pair each language with the hardware you've targeted — e.g. C on ARM Cortex-M4 — firmware roles scan for this before anything else." />
      )}
      {items.map((row, idx) => (
        <div key={row.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Row {idx + 1}</span>
            <RemoveBtn onClick={() => remove(row.id)} />
          </div>
          <F label="Language"><I value={row.language} onChange={v => update(row.id, "language", v)} placeholder="C" /></F>
          <F label="Target Hardware (comma-separated)">
            <I value={(row.hardware || []).join(", ")} onChange={v => update(row.id, "hardware", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="ARM Cortex-M4, AVR" />
          </F>
        </div>
      ))}
      <AddBtn onClick={() => add({ language: "", hardware: [] })} label="Add Language/Hardware Row" />
    </div>
  );
}

// ── Patents (Systems/Low-Level) ───────────────────────────────────────────────
function PatentsSection({ content, onChange }) {
  const { add, update, remove } = listOps("patents", onChange);
  const statuses = ["Filed", "Pending", "Granted"];
  const items = content.patents || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Filed, pending, or granted — most resumes have nowhere to put this. Optional if you don't have any.</p>
      {items.length === 0 && (
        <EmptyState icon={FileBadge} title="No patents yet"
          description="If you've filed or been granted a patent — even student/university-assigned — it's a strong differentiator for systems roles." />
      )}
      {items.map((pt, idx) => (
        <div key={pt.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Patent {idx + 1}</span>
            <RemoveBtn onClick={() => remove(pt.id)} />
          </div>
          <F label="Title"><I value={pt.title} onChange={v => update(pt.id, "title", v)} placeholder="Low-power sensor fusion method" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Number"><I value={pt.number} onChange={v => update(pt.id, "number", v)} placeholder="US-2024-1234" /></F>
            <F label="Date"><I value={pt.date} onChange={v => update(pt.id, "date", v)} placeholder="2024" /></F>
          </div>
          <F label="Status">
            <select value={pt.status || ""} onChange={e => update(pt.id, "status", e.target.value)} className="input">
              <option value="">Select...</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </F>
        </div>
      ))}
      <AddBtn onClick={() => add({ title: "", number: "", status: "", date: "" })} label="Add Patent" />
    </div>
  );
}

// ── Benchmarks (Systems/Low-Level) ────────────────────────────────────────────
function BenchmarksSection({ content, onChange }) {
  const { add, update, remove } = listOps("benchmarks", onChange);
  const items = content.benchmarks || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Rendered as a stat band under your name (e.g. "1.2us — Interrupt latency").</p>
      {items.length === 0 && (
        <EmptyState icon={Gauge} title="No benchmarks yet"
          description="Latency, throughput, power draw — the performance numbers systems roles are judged on. 2-3 strong ones is plenty." />
      )}
      {items.map((b, idx) => (
        <div key={b.id} className="mb-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Benchmark {idx + 1}</span>
            <RemoveBtn onClick={() => remove(b.id)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Value"><I value={b.value} onChange={v => update(b.id, "value", v)} placeholder="1.2us" /></F>
            <F label="Metric"><I value={b.metric} onChange={v => update(b.id, "metric", v)} placeholder="Interrupt latency" /></F>
          </div>
          <F label="Comparison (optional)"><I value={b.comparison} onChange={v => update(b.id, "comparison", v)} placeholder="-40% vs prior firmware" /></F>
        </div>
      ))}
      <AddBtn onClick={() => add({ metric: "", value: "", comparison: "" })} label="Add Benchmark" />
    </div>
  );
}

// ── Publications (CV-Hybrid) ──────────────────────────────────────────────────
function PublicationsSection({ content, onChange }) {
  const { add, update, remove } = listOps("publications", onChange);
  const items = content.publications || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Rendered as a real bibliography entry — this is usually the first thing a research-facing reviewer looks for.</p>
      {items.length === 0 && (
        <EmptyState icon={BookOpen} title="No publications yet"
          description="Workshop papers count too, not just top-tier venues — include authors in the exact order they appear on the paper." />
      )}
      {items.map((pub, idx) => (
        <div key={pub.id} className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Publication {idx + 1}</span>
            <RemoveBtn onClick={() => remove(pub.id)} />
          </div>
          <F label="Title"><I value={pub.title} onChange={v => update(pub.id, "title", v)} placeholder="Self-Supervised Video Representations..." /></F>
          <F label="Authors (comma-separated, in order)">
            <I value={(pub.authors || []).join(", ")} onChange={v => update(pub.id, "authors", v.split(",").map(s => s.trim()).filter(Boolean))} placeholder="W. Chen, A. Kumar, S. Lee" />
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Venue"><I value={pub.venue} onChange={v => update(pub.id, "venue", v)} placeholder="CVPR" /></F>
            <F label="Year"><I value={pub.year} onChange={v => update(pub.id, "year", v)} placeholder="2024" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="URL"><I value={pub.url} onChange={v => update(pub.id, "url", v)} placeholder="https://..." /></F>
            <F label="Citation Count"><I value={pub.citationCount} onChange={v => update(pub.id, "citationCount", v)} placeholder="42" type="number" /></F>
          </div>
        </div>
      ))}
      <AddBtn onClick={() => add({ title: "", authors: [], venue: "", year: "", url: "", citationCount: "" })} label="Add Publication" />
    </div>
  );
}

// ── Research Experience (CV-Hybrid) ───────────────────────────────────────────
function ResearchExperienceSection({ content, onChange }) {
  const { add, update, remove } = listOps("researchExperience", onChange);
  const items = content.researchExperience || [];
  return (
    <div>
      <p className="text-[11px] text-zinc-400 mb-3">Kept separate from Industry Experience so advisor/lab/funding lineage stays visible.</p>
      {items.length === 0 && (
        <EmptyState icon={FlaskConical} title="No research experience yet"
          description="Lab, advisor, and funding source — this is what keeps your academic lineage visible alongside industry experience." />
      )}
      {items.map((r, idx) => (
        <div key={r.id} className="mb-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Entry {idx + 1}</span>
            <RemoveBtn onClick={() => remove(r.id)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Lab"><I value={r.lab} onChange={v => update(r.id, "lab", v)} placeholder="Vision & Learning Lab" /></F>
            <F label="Institution"><I value={r.institution} onChange={v => update(r.id, "institution", v)} placeholder="Stanford" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Advisor"><I value={r.advisor} onChange={v => update(r.id, "advisor", v)} placeholder="Prof. A. Kumar" /></F>
            <F label="Funding Source"><I value={r.fundingSource} onChange={v => update(r.id, "fundingSource", v)} placeholder="NSF Graduate Fellowship" /></F>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Start Date"><I value={r.startDate} onChange={v => update(r.id, "startDate", v)} placeholder="2021" /></F>
            <F label="End Date"><I value={r.current ? "Present" : r.endDate} onChange={v => update(r.id, "endDate", v)} placeholder="2023" /></F>
          </div>
          <label className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
            <input type="checkbox" checked={!!r.current} onChange={e => update(r.id, "current", e.target.checked)} />
            Currently active
          </label>
          <F label="Bullet Points (one per line)">
            <T value={(r.bullets || []).join("\n")} onChange={v => update(r.id, "bullets", v.split("\n").filter(Boolean))} placeholder="Led a 3-person team on video SSL pretraining…" rows={3} />
          </F>
        </div>
      ))}
      <AddBtn onClick={() => add({ lab: "", institution: "", advisor: "", fundingSource: "", startDate: "", endDate: "", current: false, bullets: [] })} label="Add Research Experience" />
    </div>
  );
}
