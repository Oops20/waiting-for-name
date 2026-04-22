import { Minus, ThumbsDown, ThumbsUp } from "lucide-react";

type Sentiment = "Positive" | "Neutral" | "Negative" | "";

interface SentimentSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface SentimentOption {
  label: Sentiment;
  icon: React.ReactNode;
  activeClass: string;
  inactiveClass: string;
}

const sentimentOptions: SentimentOption[] = [
  {
    label: "Positive",
    icon: <ThumbsUp className="h-3.5 w-3.5" />,
    activeClass: "sentiment-positive-active border-transparent font-semibold",
    inactiveClass:
      "bg-background/70 text-muted-foreground border border-border/80 hover:border-emerald-400/50 hover:text-emerald-600 hover:bg-emerald-50/70",
  },
  {
    label: "Neutral",
    icon: <Minus className="h-3.5 w-3.5" />,
    activeClass: "sentiment-neutral-active border-transparent font-semibold",
    inactiveClass:
      "bg-background/70 text-muted-foreground border border-border/80 hover:border-amber-400/50 hover:text-amber-600 hover:bg-amber-50/70",
  },
  {
    label: "Negative",
    icon: <ThumbsDown className="h-3.5 w-3.5" />,
    activeClass: "sentiment-negative-active border-transparent font-semibold",
    inactiveClass:
      "bg-background/70 text-muted-foreground border border-border/80 hover:border-rose-400/50 hover:text-rose-600 hover:bg-rose-50/70",
  },
];

export function SentimentSelector({ value, onChange }: SentimentSelectorProps) {
  return (
    <fieldset
      className="flex gap-2 border-none p-0 m-0"
      aria-label="Sentiment selection"
    >
      <legend className="sr-only">Select HCP sentiment</legend>
      {sentimentOptions.map((opt) => {
        const isActive = value === opt.label;
        return (
          <button
            key={opt.label}
            type="button"
            data-ocid={`sentiment.toggle.${opt.label.toLowerCase()}`}
            onClick={() => onChange(opt.label)}
            aria-pressed={isActive}
            className={`
              flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5
              text-sm transition-smooth cursor-pointer select-none
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              ${isActive ? opt.activeClass : opt.inactiveClass}
            `}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </fieldset>
  );
}
