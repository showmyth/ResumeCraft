import { Check } from "lucide-react";
import { cn } from "../../utils/helpers";
import { DOMAINS } from "../../utils/domains";

export default function DomainSelector({ selected, onSelect }) {
  return (
    <div className="p-5 border-b border-zinc-200">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-zinc-800 mb-1">Choose Your Domain</h3>
        <p className="text-xs text-zinc-500">
          Tunes the recommended template, AI writing help, and keyword suggestions for your field.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {DOMAINS.map((d) => {
          const isSelected = selected === d.id;
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              title={d.desc}
              className={cn(
                "text-left rounded-xl border-2 p-2.5 transition-all duration-150",
                isSelected
                  ? "border-brand-500 bg-brand-50"
                  : "border-zinc-200 hover:border-brand-300 hover:bg-zinc-50"
              )}
            >
              <div className="flex items-start justify-between gap-1">
                <p className={cn("text-xs font-bold leading-tight", isSelected ? "text-brand-700" : "text-zinc-800")}>
                  {d.label}
                </p>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />}
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">{d.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
