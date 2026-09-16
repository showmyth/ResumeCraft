import { Link } from "react-router-dom";
import { Check, Lock, Sparkles } from "lucide-react";
import { cn, TEMPLATE_GRADIENTS } from "../../utils/helpers";
import { LAYOUTS, DOMAIN_DEFAULT_LAYOUT, getDomainLabel } from "../../utils/domains";

export default function TemplateSelector({ selected, onSelect, isPro, domain }) {
  const recommendedId = DOMAIN_DEFAULT_LAYOUT[domain];

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-zinc-800 mb-1">Choose Template</h3>
        <p className="text-xs text-zinc-500">
          {isPro
            ? "All 5 layouts unlocked ✓"
            : "1 free layout · Upgrade to Pro for all 5"}
        </p>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {LAYOUTS.map((t) => {
          const locked = t.isPro && !isPro;
          const isSelected = selected === t.id;
          const isRecommended = t.id === recommendedId;
          const gradient = TEMPLATE_GRADIENTS[t.id];

          return (
            <button
              key={t.id}
              onClick={() => !locked && onSelect(t.id)}
              disabled={locked}
              title={locked ? "Upgrade to Pro to unlock this template" : `Use ${t.name} template`}
              className={cn(
                "relative rounded-xl overflow-hidden border-2 text-left transition-all duration-200 group",
                isSelected
                  ? "border-brand-500 shadow-md shadow-brand-100"
                  : locked
                  ? "border-zinc-100 opacity-60 cursor-not-allowed"
                  : "border-zinc-200 hover:border-brand-300 hover:shadow-sm cursor-pointer"
              )}
            >
              {/* Preview area */}
              <div className={cn("h-24 bg-gradient-to-br relative overflow-hidden", gradient)}>
                {/* Mock resume lines */}
                <div className="absolute inset-3 space-y-1">
                  <div className="h-2 w-14 bg-white/50 rounded" />
                  <div className="h-1 w-9 bg-white/30 rounded" />
                  <div className="mt-1.5 space-y-1">
                    {[70, 90, 55, 75].map((w, i) => (
                      <div key={i} className="h-1 bg-white/20 rounded" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>

                {/* Lock overlay on hover */}
                {locked && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Lock className="w-4 h-4 text-white mb-1" />
                    <span className="text-white text-[10px] font-semibold">Pro Only</span>
                  </div>
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Check className="w-3 h-3 text-brand-600" />
                  </div>
                )}

                {/* Pro badge */}
                {t.isPro && (
                  <div className="absolute top-1.5 left-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/30 text-white backdrop-blur-sm">
                      PRO
                    </span>
                  </div>
                )}

                {/* Recommended badge takes priority over the static tag */}
                {isRecommended ? (
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/90 text-brand-700">
                      <Sparkles className="w-2.5 h-2.5" /> Recommended
                    </span>
                  </div>
                ) : t.tag && !t.isPro ? (
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 text-zinc-700">
                      {t.tag}
                    </span>
                  </div>
                ) : null}

                {/* Active glow effect */}
                {isSelected && (
                  <div className="absolute inset-0 ring-2 ring-inset ring-brand-400/50 rounded-lg" />
                )}
              </div>

              {/* Info below preview */}
              <div className={cn("p-2.5 transition-colors", isSelected ? "bg-brand-50" : "bg-white")}>
                <p className={cn("text-xs font-bold leading-none mb-0.5", isSelected ? "text-brand-700" : "text-zinc-800")}>
                  {t.name}
                </p>
                <p className="text-[10px] text-zinc-400 leading-tight">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Currently selected indicator */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 mb-4">
        <div className={cn("w-3 h-3 rounded-full bg-gradient-to-br flex-shrink-0", TEMPLATE_GRADIENTS[selected])} />
        <p className="text-xs text-zinc-600">
          Using:{" "}
          <span className="font-semibold text-zinc-800">
            {LAYOUTS.find((t) => t.id === selected)?.name || selected}
          </span>
          {domain && (
            <span className="text-zinc-400"> · recommended for {getDomainLabel(domain)}: {LAYOUTS.find(l => l.id === recommendedId)?.name}</span>
          )}
        </p>
      </div>

      {/* Pro upgrade banner (only shown to free users) */}
      {!isPro && (
        <div className="rounded-xl overflow-hidden border border-brand-100">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-3">
            <p className="text-xs font-bold text-white mb-0.5">
              Unlock all 5 templates
            </p>
            <p className="text-[11px] text-white/80">
              Infosec, DevOps/SRE, Systems, and CV-Hybrid are Pro-only.
            </p>
          </div>
          <div className="bg-brand-50 p-3">
            <ul className="space-y-1 mb-3">
              {[
                "Infosec — certs & skills matrix upfront",
                "DevOps/SRE — infra stack & metrics band",
                "Systems — hardware, patents, benchmarks",
                "CV-Hybrid — publications & research experience",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-[11px] text-brand-700">
                  <Check className="w-3 h-3 text-brand-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/pricing"
              className="block text-center py-2 px-4 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              Upgrade to Pro — $9.99/mo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
