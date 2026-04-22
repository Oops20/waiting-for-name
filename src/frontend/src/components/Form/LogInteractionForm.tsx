import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Phone, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useGetHcpNames,
  useMutateEditInteraction,
  useMutateLogInteraction,
} from "../../hooks/useBackend";
import { useFormStore } from "../../stores/useFormStore";
import { useInteractionStore } from "../../stores/useInteractionStore";
import { SamplesCounter } from "./SamplesCounter";
import { SentimentSelector } from "./SentimentSelector";

const INTERACTION_TYPES = [
  { value: "Meeting", label: "Meeting", icon: Users },
  { value: "Call", label: "Call", icon: Phone },
  { value: "Visit", label: "Visit", icon: MapPin },
];

export function LogInteractionForm() {
  const fields = useFormStore();
  const { setField, resetForm } = useFormStore();
  const { selectedId, setSelectedId, interactions } = useInteractionStore();

  const logMutation = useMutateLogInteraction();
  const editMutation = useMutateEditInteraction();
  const { data: hcpNames = [] } = useGetHcpNames();

  const [showErrors, setShowErrors] = useState(false);
  const [hcpQuery, setHcpQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const hcpRef = useRef<HTMLDivElement>(null);

  const isEditing = selectedId !== null;
  const isPending = logMutation.isPending || editMutation.isPending;

  useEffect(() => {
    if (selectedId !== null) {
      const record = interactions.find((r) => r.id === selectedId);
      if (record) {
        setField("hcpName", record.hcpName);
        setField("interactionType", record.interactionType);
        setField("datetime", record.datetime);
        setField("topics", record.topics);
        setField("materialsShared", record.materialsShared);
        setField("samples", String(record.samples));
        setField("sentiment", record.sentiment);
        setField("outcomes", record.outcomes);
        setField("followUp", record.followUp);
        setHcpQuery(record.hcpName);
      }
    }
  }, [selectedId, interactions, setField]);

  const hcpNameFromStore = fields.hcpName;
  useEffect(() => {
    setHcpQuery((prev) => {
      if (hcpNameFromStore && hcpNameFromStore !== prev)
        return hcpNameFromStore;
      return prev;
    });
  }, [hcpNameFromStore]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (hcpRef.current && !hcpRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredNames = hcpNames.filter((n) =>
    n.toLowerCase().includes(hcpQuery.toLowerCase()),
  );

  function handleHcpInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setHcpQuery(val);
    setField("hcpName", val);
    setShowSuggestions(true);
  }

  function selectHcp(name: string) {
    setHcpQuery(name);
    setField("hcpName", name);
    setShowSuggestions(false);
  }

  function handleClear() {
    resetForm();
    setShowErrors(false);
    setHcpQuery("");
    if (isEditing) setSelectedId(null);
  }

  async function handleSave() {
    if (!fields.hcpName.trim() || !fields.interactionType) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);

    try {
      if (isEditing && selectedId !== null) {
        const result = await editMutation.mutateAsync({
          id: selectedId,
          req: {
            hcpName: fields.hcpName,
            interactionType: fields.interactionType,
            datetime: fields.datetime,
            topics: fields.topics,
            materialsShared: fields.materialsShared,
            samples: BigInt(Number.parseInt(fields.samples, 10) || 0),
            sentiment: fields.sentiment,
            outcomes: fields.outcomes,
            followUp: fields.followUp,
          },
        });
        if ("__kind__" in result && result.__kind__ === "err") {
          toast.error(`Failed to update: ${result.err}`);
        } else {
          toast.success("Interaction updated successfully!");
          resetForm();
          setHcpQuery("");
          setSelectedId(null);
        }
      } else {
        await logMutation.mutateAsync({
          hcpName: fields.hcpName,
          interactionType: fields.interactionType,
          datetime: fields.datetime,
          topics: fields.topics,
          materialsShared: fields.materialsShared,
          samples: BigInt(Number.parseInt(fields.samples, 10) || 0),
          sentiment: fields.sentiment,
          outcomes: fields.outcomes,
          followUp: fields.followUp,
        });
        toast.success("Interaction logged successfully!");
        resetForm();
        setHcpQuery("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const saveDisabled =
    isPending || !fields.hcpName.trim() || !fields.interactionType;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Form header */}
      <div
        className="px-5 pt-4 pb-3.5 border-b border-border/60 sticky top-0 z-10"
        style={{
          background: "oklch(var(--card))",
          boxShadow: "0 2px 8px -2px oklch(0.14 0.03 268 / 0.06)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[0.95rem] font-semibold text-foreground tracking-tight">
              {isEditing ? "Edit Interaction" : "Log Interaction"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {isEditing
                ? "Update the interaction details below"
                : "Record a new HCP interaction"}
            </p>
          </div>
          {isEditing && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.12), oklch(0.56 0.19 285 / 0.12))",
                color: "oklch(0.50 0.22 275)",
                border: "1px solid oklch(0.50 0.22 275 / 0.25)",
              }}
            >
              Editing
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 pb-6">
        {/* Section 1: HCP Info */}
        <section
          className="form-section space-y-4 animate-slide-up"
          aria-label="HCP Information"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2.5 tracking-tight">
            <span className="step-badge">1</span>
            HCP Information
          </h3>

          {/* HCP Name Combobox */}
          <div className="space-y-1.5" ref={hcpRef}>
            <Label
              htmlFor="hcp-name"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              HCP Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="hcp-name"
                data-ocid="form.hcp_name.input"
                placeholder="Search or enter HCP name..."
                value={hcpQuery}
                onChange={handleHcpInput}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
                className="h-10 text-sm rounded-lg border-input bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth"
              />
              {showSuggestions && filteredNames.length > 0 && (
                <div
                  className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-popover border border-border rounded-xl overflow-hidden animate-slide-up"
                  style={{
                    boxShadow:
                      "0 8px 24px -4px oklch(0.14 0.03 268 / 0.14), 0 4px 8px -2px oklch(0.14 0.03 268 / 0.08)",
                  }}
                >
                  <ul className="max-h-44 overflow-y-auto py-1">
                    {filteredNames.map((name) => (
                      <li key={name}>
                        <button
                          type="button"
                          onClick={() => selectHcp(name)}
                          className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-primary/8 hover:text-primary transition-smooth cursor-pointer"
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {showErrors && !fields.hcpName.trim() && (
              <p
                data-ocid="form.hcp_name.field_error"
                className="text-xs text-destructive mt-1 flex items-center gap-1"
              >
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                HCP Name is required
              </p>
            )}
          </div>

          {/* Interaction Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Interaction Type <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2" aria-label="Interaction type">
              {INTERACTION_TYPES.map(({ value, label, icon: Icon }) => {
                const isActive = fields.interactionType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isActive}
                    data-ocid={`form.interaction_type.${value.toLowerCase()}`}
                    onClick={() => setField("interactionType", value)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm
                      transition-smooth cursor-pointer select-none
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                      ${
                        isActive
                          ? "text-white font-semibold border border-transparent"
                          : "bg-background/70 text-muted-foreground border border-border/80 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                      }
                    `}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.50 0.22 275) 0%, oklch(0.56 0.19 285) 100%)",
                            boxShadow: "0 3px 10px oklch(0.50 0.22 275 / 0.30)",
                          }
                        : {}
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            {showErrors && !fields.interactionType && (
              <p
                data-ocid="form.interaction_type.field_error"
                className="text-xs text-destructive mt-1 flex items-center gap-1"
              >
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                Interaction Type is required
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="space-y-1.5">
            <Label
              htmlFor="datetime"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Date &amp; Time
            </Label>
            <Input
              id="datetime"
              type="datetime-local"
              data-ocid="form.datetime.input"
              value={fields.datetime}
              onChange={(e) => setField("datetime", e.target.value)}
              className="h-10 text-sm rounded-lg border-input bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth"
            />
          </div>
        </section>

        {/* Section 2: Discussion */}
        <section
          className="form-section space-y-4 animate-slide-up"
          style={{ animationDelay: "0.05s" }}
          aria-label="Discussion Details"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2.5 tracking-tight">
            <span className="step-badge">2</span>
            Discussion Details
          </h3>

          <div className="space-y-1.5">
            <Label
              htmlFor="topics"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Topics Discussed
            </Label>
            <Textarea
              id="topics"
              data-ocid="form.topics.textarea"
              placeholder="E.g. Product efficacy, new clinical data, patient adherence..."
              value={fields.topics}
              onChange={(e) => setField("topics", e.target.value)}
              rows={3}
              className="text-sm resize-none rounded-lg border-input bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="materials"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Materials Shared
            </Label>
            <Textarea
              id="materials"
              data-ocid="form.materials.textarea"
              placeholder="E.g. Brochures, clinical study PDFs, slides..."
              value={fields.materialsShared}
              onChange={(e) => setField("materialsShared", e.target.value)}
              rows={2}
              className="text-sm resize-none rounded-lg border-input bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Samples Distributed
            </Label>
            <SamplesCounter
              value={fields.samples}
              onChange={(v) => setField("samples", v)}
            />
          </div>
        </section>

        {/* Section 3: Assessment */}
        <section
          className="form-section space-y-4 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
          aria-label="HCP Assessment"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2.5 tracking-tight">
            <span className="step-badge">3</span>
            Assessment
          </h3>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              HCP Sentiment
            </Label>
            <SentimentSelector
              value={fields.sentiment}
              onChange={(v) => setField("sentiment", v)}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="outcomes"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Outcomes
            </Label>
            <Textarea
              id="outcomes"
              data-ocid="form.outcomes.textarea"
              placeholder="E.g. HCP expressed interest in prescribing Product X..."
              value={fields.outcomes}
              onChange={(e) => setField("outcomes", e.target.value)}
              rows={3}
              className="text-sm resize-none rounded-lg border-input bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth leading-relaxed"
            />
          </div>
        </section>

        {/* Section 4: Next Steps */}
        <section
          className="form-section space-y-4 animate-slide-up"
          style={{ animationDelay: "0.15s" }}
          aria-label="Next Steps"
        >
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2.5 tracking-tight">
            <span className="step-badge">4</span>
            Next Steps
          </h3>

          <div className="space-y-1.5">
            <Label
              htmlFor="followup"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Follow-up Actions
            </Label>
            <Textarea
              id="followup"
              data-ocid="form.followup.textarea"
              placeholder="E.g. Schedule next meeting, send additional materials..."
              value={fields.followUp}
              onChange={(e) => setField("followUp", e.target.value)}
              rows={3}
              className="text-sm resize-none rounded-lg border-input bg-background/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth leading-relaxed"
            />
          </div>
        </section>
      </div>

      {/* Sticky footer */}
      <div
        className="sticky bottom-0 z-10 border-t border-border/60 px-5 py-4"
        style={{
          background: "oklch(var(--card))",
          boxShadow: "0 -2px 8px -2px oklch(0.14 0.03 268 / 0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <Button
            type="button"
            data-ocid="form.save_button"
            disabled={saveDisabled}
            onClick={handleSave}
            className="flex-1 h-10 font-semibold text-white rounded-lg border-none transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: saveDisabled
                ? undefined
                : "linear-gradient(135deg, oklch(0.50 0.22 275) 0%, oklch(0.56 0.19 285) 100%)",
              boxShadow: saveDisabled
                ? undefined
                : "0 3px 12px oklch(0.50 0.22 275 / 0.30)",
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>{isEditing ? "Update Interaction" : "Save Interaction"}</>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            data-ocid="form.clear_button"
            onClick={handleClear}
            disabled={isPending}
            className="h-10 px-5 font-medium rounded-lg border-border/80 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50 transition-smooth"
          >
            {isEditing ? "Cancel" : "Clear"}
          </Button>
        </div>

        {showErrors && (!fields.hcpName.trim() || !fields.interactionType) && (
          <p
            data-ocid="form.validation.error_state"
            className="text-xs text-destructive text-center mt-2.5 flex items-center justify-center gap-1.5"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
            Please fill in all required fields before saving.
          </p>
        )}
      </div>
    </div>
  );
}
