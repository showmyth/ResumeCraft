import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { FileText, Sparkles, ArrowRight, RotateCcw, Loader2, Lightbulb } from "lucide-react";
import { QUIZ_QUESTIONS, scoreQuiz } from "../utils/quizData";
import { getDomainLabel, getLayoutMeta, DOMAIN_DEFAULT_LAYOUT, DOMAINS } from "../utils/domains";
import toast from "react-hot-toast";

export default function QuizPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("quiz"); // "quiz" | "background"

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          ResumeCraft
        </Link>
        {user ? (
          <Link to="/dashboard" className="btn-secondary text-sm">Dashboard</Link>
        ) : (
          <Link to="/register" className="btn-primary text-sm">Get Started Free</Link>
        )}
      </nav>

      <main className="max-w-2xl mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 mb-4">
            Domain Finder
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">Not sure which domain fits you?</h1>
          <p className="text-zinc-500">Answer 8 quick questions, or describe your background and let AI suggest a fit.</p>
        </div>

        <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl mb-8 max-w-sm mx-auto">
          <button
            onClick={() => setMode("quiz")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "quiz" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500"}`}
          >
            Take the Quiz
          </button>
          <button
            onClick={() => setMode("background")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "background" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500"}`}
          >
            Describe My Background
          </button>
        </div>

        {mode === "quiz" ? <QuizMode /> : <BackgroundMode user={user} navigate={navigate} />}
      </main>
    </div>
  );
}

// ── Deterministic quiz mode (feature 1) ─────────────────────────
function QuizMode() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const question = QUIZ_QUESTIONS[step];
  const progress = Math.round((step / QUIZ_QUESTIONS.length) * 100);

  function selectOption(domain) {
    const nextAnswers = { ...answers, [question.id]: domain };
    setAnswers(nextAnswers);

    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setResults(scoreQuiz(nextAnswers).slice(0, 2));
    }
  }

  function retake() {
    setStep(0);
    setAnswers({});
    setResults(null);
  }

  if (results) return <QuizResults results={results} onRetake={retake} />;

  return (
    <div>
      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-brand-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
        Question {step + 1} of {QUIZ_QUESTIONS.length}
      </p>
      <h2 className="text-xl font-bold text-zinc-900 mb-6">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map((opt) => (
          <button
            key={opt.domain}
            onClick={() => selectOption(opt.domain)}
            className="w-full text-left px-5 py-4 rounded-xl border-2 border-zinc-200 hover:border-brand-400 hover:bg-brand-50 transition-all text-sm font-medium text-zinc-700"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizResults({ results, onRetake }) {
  return (
    <div>
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 text-center">Your best-fit domains</p>
      <div className="space-y-4 mb-8">
        {results.map((r, idx) => {
          const layout = getLayoutMeta(DOMAIN_DEFAULT_LAYOUT[r.domain]);
          return (
            <div key={r.domain} className={`p-6 rounded-2xl border-2 ${idx === 0 ? "border-brand-500 bg-brand-50" : "border-zinc-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${idx === 0 ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                  {idx === 0 ? "Best Match" : "Also Consider"}
                </span>
                {typeof r.score === "number" && <span className="text-xs text-zinc-400">{r.score}/8 answers aligned</span>}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">{getDomainLabel(r.domain)}</h3>
              {r.reason && <p className="text-sm text-zinc-600 mb-2 italic">"{r.reason}"</p>}
              <p className="text-sm text-zinc-500 mb-4">Recommended layout: <span className="font-semibold text-zinc-700">{layout?.name}</span> — {layout?.desc}</p>
              <Link
                to={`/builder?domain=${r.domain}`}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${idx === 0 ? "bg-brand-600 text-white hover:bg-brand-700" : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"}`}
              >
                Start building <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to={`/examples?domain=${r.domain}`} className="inline-block ml-3 text-sm font-medium text-zinc-500 hover:text-zinc-700">
                See an example first
              </Link>
            </div>
          );
        })}
      </div>
      <button onClick={onRetake} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 py-2">
        <RotateCcw className="w-3.5 h-3.5" /> Start over
      </button>
    </div>
  );
}

// ── AI reverse mode (feature 2): paste background, get suggestions ──
function BackgroundMode({ user, navigate }) {
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  async function handleSubmit() {
    if (!user) {
      toast.error("Sign up first — this uses AI credits tied to your account.");
      navigate("/register");
      return;
    }
    if (background.trim().length < 20) {
      toast.error("Add a bit more detail — a sentence or two about projects, coursework, or internships.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/ai/suggest-domain", { background });
      setSuggestions(data.suggestions);
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't get a suggestion. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (suggestions) {
    return (
      <QuizResults
        results={suggestions.map((s) => ({ domain: s.domain, score: null, reason: s.reason }))}
        onRetake={() => setSuggestions(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 mb-4">
        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          Mention projects, coursework, internships, or what you enjoyed building — the more specific, the better the match.
        </p>
      </div>
      <textarea
        value={background}
        onChange={(e) => setBackground(e.target.value)}
        rows={6}
        placeholder="e.g. I built a full-stack app with React and Node for my capstone, interned on a data team writing Airflow DAGs, and I'm currently taking a distributed systems course..."
        className="input w-full mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</> : <><Sparkles className="w-4 h-4" /> Suggest my domain</>}
      </button>
      {!user && <p className="text-xs text-zinc-400 text-center mt-3">Requires a free account — <Link to="/register" className="text-brand-600 font-medium">sign up</Link> first.</p>}
    </div>
  );
}
