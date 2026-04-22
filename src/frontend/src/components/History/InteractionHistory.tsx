import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGetInteractions } from "../../hooks/useBackend";
import { useInteractionStore } from "../../stores/useInteractionStore";
import type { InteractionRecord } from "../../types";
import { InteractionCard } from "./InteractionCard";

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2.5 shadow-subtle">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-24 rounded-md" />
      <Skeleton className="h-3 w-full rounded-md" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

export function InteractionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  const {
    interactions,
    selectedId,
    setInteractions,
    setSelectedId,
    setLoading,
    isLoading,
  } = useInteractionStore();

  const { data, isFetching, refetch } = useGetInteractions();

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  useEffect(() => {
    if (data) {
      const sorted = [...data].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt),
      );
      setInteractions(sorted);
    }
  }, [data, setInteractions]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return interactions;
    const q = searchQuery.toLowerCase();
    return interactions.filter(
      (i) =>
        i.hcpName.toLowerCase().includes(q) ||
        i.topics.toLowerCase().includes(q),
    );
  }, [interactions, searchQuery]);

  const handleDelete = (id: bigint) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget === null) return;
    const updated = interactions.filter((i) => i.id !== deleteTarget);
    setInteractions(updated);
    if (selectedId === deleteTarget) setSelectedId(null);
    setDeleteTarget(null);
  };

  return (
    <section
      data-ocid="history.section"
      className="flex flex-col border-t border-border/60"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Section header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border/60"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.975 0.008 268) 0%, oklch(0.968 0.010 272) 100%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.12), oklch(0.56 0.19 285 / 0.10))",
              border: "1px solid oklch(0.50 0.22 275 / 0.18)",
            }}
          >
            <ClipboardList
              className="h-3.5 w-3.5"
              style={{ color: "oklch(0.50 0.22 275)" }}
            />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Interaction History
          </span>
          {!isLoading && (
            <Badge
              variant="secondary"
              data-ocid="history.count_badge"
              className="text-xs px-1.5 py-0 h-4.5 font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.10), oklch(0.56 0.19 285 / 0.08))",
                color: "oklch(0.50 0.22 275)",
                border: "1px solid oklch(0.50 0.22 275 / 0.18)",
              }}
            >
              {interactions.length}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-ocid="history.refresh_button"
            className="h-7 w-7 text-muted-foreground hover:text-primary transition-smooth rounded-lg"
            aria-label="Refresh interactions"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-ocid="history.collapse_toggle"
            className="h-7 w-7 text-muted-foreground hover:text-foreground transition-smooth rounded-lg"
            aria-label={isCollapsed ? "Expand history" : "Collapse history"}
            onClick={() => setIsCollapsed((v) => !v)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Collapsible body */}
      {!isCollapsed && (
        <div className="flex flex-col" style={{ maxHeight: "320px" }}>
          {/* Search bar */}
          <div className="px-4 py-3 border-b border-border/60 bg-background">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                data-ocid="history.search_input"
                placeholder="Search by HCP name or topics…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm rounded-lg border-input bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth"
              />
            </div>
          </div>

          {/* List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2.5">
              {/* Loading skeletons */}
              {isLoading && (
                <div data-ocid="history.loading_state" className="space-y-2.5">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              )}

              {/* Empty state */}
              {!isLoading && filtered.length === 0 && (
                <div
                  data-ocid="history.empty_state"
                  className="flex flex-col items-center justify-center py-10 text-center space-y-3"
                >
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.08), oklch(0.56 0.19 285 / 0.06))",
                      border: "1px solid oklch(0.50 0.22 275 / 0.15)",
                    }}
                  >
                    <ClipboardList
                      className="h-5 w-5"
                      style={{ color: "oklch(0.50 0.22 275 / 0.6)" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground tracking-tight">
                      {searchQuery
                        ? "No matching interactions"
                        : "No interactions logged yet"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {searchQuery
                        ? "Try a different search term."
                        : "Use the form to log your first HCP interaction."}
                    </p>
                  </div>
                </div>
              )}

              {/* Interaction cards */}
              {!isLoading &&
                filtered.map((interaction: InteractionRecord, idx: number) => (
                  <InteractionCard
                    key={String(interaction.id)}
                    interaction={interaction}
                    isSelected={selectedId === interaction.id}
                    onSelect={() => setSelectedId(interaction.id)}
                    onDelete={() => handleDelete(interaction.id)}
                    index={idx + 1}
                  />
                ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent
          data-ocid="history.dialog"
          className="rounded-2xl border-border/60"
          style={{ boxShadow: "0 16px 48px -8px oklch(0.14 0.03 268 / 0.18)" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="tracking-tight">
              Delete Interaction
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground leading-relaxed">
              Are you sure you want to delete this interaction record? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="history.cancel_button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-lg border-border/80 text-muted-foreground hover:text-foreground transition-smooth"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="history.confirm_button"
              className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-smooth"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
