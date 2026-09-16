import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { FileText, ArrowRight, Loader2, Copy } from "lucide-react";
import { DOMAINS, DOMAIN_DEFAULT_LAYOUT, getLayoutMeta } from "../utils/domains";
import { EXAMPLE_RESUMES } from "../utils/exampleResumes";
import ResumePreview from "../components/editor/ResumePreview";
import toast from "react-hot-toast";

export default function ExamplesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeDomain, setActiveDomain] = useState(searchParams.get("domain") || "swe");
  const [creating, setCreating] = useState(false);

  const layoutId = DOMAIN_DEFAULT_LAYOUT[activeDomain];
  const layout = getLayoutMeta(layoutId);
  const exampleContent = EXAMPLE_RESUMES[activeDomain];

  async function useAsStartingPoint() {
    if (!user) {
      toast.error("Sign up to save and edit your own resume.");
      navigate("/register");
      return;
    }
    setCreating(true);
    try {
      const { data } = await api.post("/resumes", {
        title: `${DOMAINS.find((d) => d.id === activeDomain)?.label} Resume`,
        domain: activeDomain,
        templateId: layoutId,
        content: exampleContent,
      });
      toast.success("Created — now make it yours!");
      navigate(`/builder/${data.resume._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't create resume from this example.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          ResumeCraft
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/quiz" className="text-sm text-zinc-500 hover:text-zinc-800">Not sure which domain? Take the quiz</Link>
          {user ? <Link to="/dashboard" className="btn-secondary text-sm">Dashboard</Link> : <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-12 pb-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Example Resumes
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">See what a strong resume looks like, by domain</h1>
          <p className="text-zinc-500">Fictional but realistic examples — browse one, then use it as a starting point for your own.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDomain(d.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeDomain === d.id ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Live preview using the same renderer the builder uses */}
          <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 shadow-sm">
            <div className="max-h-[900px] overflow-y-auto">
              <ResumePreview content={exampleContent} templateId={layoutId} isPro={true} />
            </div>
          </div>

          <div>
            <div className="sticky top-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-1">{DOMAINS.find((d) => d.id === activeDomain)?.label}</h2>
              <p className="text-sm text-zinc-500 mb-4">{DOMAINS.find((d) => d.id === activeDomain)?.desc}</p>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 mb-6">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Layout used</p>
                <p className="text-sm font-bold text-zinc-800 mb-1">{layout?.name}</p>
                <p className="text-xs text-zinc-500">{layout?.desc}</p>
              </div>

              <button
                onClick={useAsStartingPoint}
                disabled={creating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 mb-3"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                {creating ? "Creating…" : "Use as starting point"}
              </button>
              <Link
                to={`/builder?domain=${activeDomain}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-300 text-zinc-700 text-sm font-semibold hover:bg-zinc-50 transition-colors"
              >
                Start from scratch instead <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
