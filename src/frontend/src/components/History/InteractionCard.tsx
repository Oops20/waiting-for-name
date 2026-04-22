import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Trash2, User } from "lucide-react";
import type { InteractionRecord } from "../../types";

interface InteractionCardProps {
  interaction: InteractionRecord;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  index: number;
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const normalized = sentiment.toLowerCase();
  if (normalized === "positive") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border sentiment-positive">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        Positive
      </span>
    );
  }
  if (normalized === "negative") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border sentiment-negative">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        Negative
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border sentiment-neutral">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      Neutral
    </span>
  );
}

function formatDate(datetime: string): string {
  try {
    const d = new Date(datetime);
    if (Number.isNaN(d.getTime())) return datetime;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return datetime;
  }
}

function truncate(text: string, max: number): string {
  if (!text) return "";
  return `${text.length > max ? text.slice(0, max).trimEnd() : text}${text.length > max ? "…" : ""}`;
}

export function InteractionCard({
  interaction,
  isSelected,
  onSelect,
  onDelete,
  index,
}: InteractionCardProps) {
  return (
    <button
      type="button"
      data-ocid={`history.item.${index}`}
      onClick={onSelect}
      className="relative rounded-xl border cursor-pointer w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-smooth group hover-lift"
      style={
        isSelected
          ? {
              borderColor: "oklch(0.50 0.22 275 / 0.45)",
              background:
                "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.05) 0%, oklch(0.56 0.19 285 / 0.04) 100%)",
              boxShadow: "0 4px 14px -3px oklch(0.50 0.22 275 / 0.15)",
              padding: "1rem",
            }
          : {
              borderColor: "oklch(var(--border))",
              background: "oklch(var(--card))",
              padding: "1rem",
            }
      }
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "oklch(0.50 0.22 275 / 0.30)";
          e.currentTarget.style.boxShadow =
            "0 4px 14px -3px oklch(0.14 0.03 268 / 0.10)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "oklch(var(--border))";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      {/* Selected indicator strip */}
      {isSelected && (
        <span
          className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r-full"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.50 0.22 275) 0%, oklch(0.56 0.19 285) 100%)",
          }}
        />
      )}

      <div className="flex items-start justify-between gap-2 min-w-0">
        {/* Left content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* HCP name + type */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                style={{
                  background: "oklch(0.50 0.22 275 / 0.10)",
                }}
              >
                <User
                  className="h-3 w-3 shrink-0"
                  style={{ color: "oklch(0.50 0.22 275)" }}
                />
              </div>
              <span className="font-semibold text-sm text-foreground truncate tracking-tight">
                {interaction.hcpName}
              </span>
            </div>
            <Badge
              variant="secondary"
              className="text-xs shrink-0 font-medium rounded-full"
              style={{
                background: "oklch(0.50 0.22 275 / 0.08)",
                color: "oklch(0.50 0.22 275)",
                border: "1px solid oklch(0.50 0.22 275 / 0.15)",
              }}
            >
              {interaction.interactionType}
            </Badge>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{formatDate(interaction.datetime)}</span>
          </div>

          {/* Topics excerpt */}
          {interaction.topics && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {truncate(interaction.topics, 80)}
            </p>
          )}

          {/* Sentiment */}
          <div className="pt-0.5">
            <SentimentBadge sentiment={interaction.sentiment} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-smooth">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-ocid={`history.edit_button.${index}`}
            className="h-7 w-7 text-muted-foreground hover:text-primary rounded-lg transition-smooth"
            style={{}}
            aria-label="Edit interaction"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-ocid={`history.delete_button.${index}`}
            className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg transition-smooth"
            aria-label="Delete interaction"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </button>
  );
}
