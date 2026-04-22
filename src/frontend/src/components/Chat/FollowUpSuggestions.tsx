import { ArrowRight } from "lucide-react";
import { useFormStore } from "../../stores/useFormStore";

interface FollowUpSuggestionsProps {
  suggestions: string[];
}

export function FollowUpSuggestions({ suggestions }: FollowUpSuggestionsProps) {
  const { followUp, setField } = useFormStore();

  if (!suggestions.length) return null;

  const handleClick = (suggestion: string) => {
    const current = followUp.trim();
    const updated = current ? `${current}\n${suggestion}` : suggestion;
    setField("followUp", updated);
  };

  return (
    <div
      className="mt-3 p-3.5 rounded-xl border border-border/60 animate-slide-up"
      style={{
        background:
          "linear-gradient(135deg, oklch(var(--card)) 0%, oklch(0.975 0.008 268) 100%)",
      }}
      data-ocid="chat.followup_suggestions"
    >
      <p
        className="text-[0.6rem] font-bold uppercase tracking-widest mb-2.5"
        style={{ color: "oklch(0.50 0.22 275 / 0.75)" }}
      >
        Suggested Follow-ups
      </p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion, i) => (
          <button
            key={suggestion}
            type="button"
            data-ocid={`chat.followup_suggestion.${i + 1}`}
            onClick={() => handleClick(suggestion)}
            className="inline-flex items-center gap-1.5 text-xs h-7 px-3 rounded-full transition-smooth cursor-pointer font-medium"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.08), oklch(0.56 0.19 285 / 0.06))",
              border: "1px solid oklch(0.50 0.22 275 / 0.22)",
              color: "oklch(0.50 0.22 275)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background =
                "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.14), oklch(0.56 0.19 285 / 0.10))";
              el.style.borderColor = "oklch(0.50 0.22 275 / 0.40)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background =
                "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.08), oklch(0.56 0.19 285 / 0.06))";
              el.style.borderColor = "oklch(0.50 0.22 275 / 0.22)";
            }}
          >
            <ArrowRight className="h-3 w-3" />
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
