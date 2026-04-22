import { Send, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useProcessAiChat } from "../../hooks/useBackend";
import { useChatStore } from "../../stores/useChatStore";
import { useFormStore } from "../../stores/useFormStore";
import type { ExtractedData } from "../../types";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { FollowUpSuggestions } from "./FollowUpSuggestions";

function SummaryCard({ summary }: { summary: string }) {
  return (
    <div
      className="mx-2 mb-3 rounded-xl overflow-hidden border border-border/60 animate-slide-up"
      style={{ boxShadow: "0 3px 12px -2px oklch(0.50 0.22 275 / 0.10)" }}
    >
      <div
        className="px-3.5 py-2 flex items-center gap-2"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.10) 0%, oklch(0.56 0.19 285 / 0.08) 100%)",
          borderBottom: "1px solid oklch(0.50 0.22 275 / 0.12)",
        }}
      >
        <Sparkles
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: "oklch(0.50 0.22 275)" }}
        />
        <p
          className="text-[0.65rem] font-bold uppercase tracking-widest"
          style={{ color: "oklch(0.50 0.22 275)" }}
        >
          AI Summary
        </p>
      </div>
      <div className="px-3.5 py-3 bg-card">
        <p className="text-sm text-foreground leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.12) 0%, oklch(0.56 0.19 285 / 0.08) 100%)",
          border: "1px solid oklch(0.50 0.22 275 / 0.18)",
          boxShadow: "0 4px 16px oklch(0.50 0.22 275 / 0.10)",
        }}
      >
        <Sparkles
          className="w-7 h-7"
          style={{ color: "oklch(0.50 0.22 275)" }}
        />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-2 tracking-tight">
        Ask your AI Assistant
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
        Try:{" "}
        <span
          className="italic"
          style={{ color: "oklch(0.50 0.22 275 / 0.85)" }}
        >
          "Met Dr. Smith today, discussed Product X, she was very interested.
          Gave 3 samples."
        </span>
      </p>
      <div
        className="mt-5 px-4 py-2.5 rounded-full text-xs font-medium"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.08), oklch(0.56 0.19 285 / 0.06))",
          border: "1px dashed oklch(0.50 0.22 275 / 0.25)",
          color: "oklch(0.50 0.22 275 / 0.8)",
        }}
      >
        Powered by Groq + LangGraph
      </div>
    </div>
  );
}

interface AiMessageEntry {
  tool: string;
  structuredData: string;
  messageIndex: number;
}

export function AiChatPanel() {
  const { messages, isLoading, addMessage, clearMessages, setLoading } =
    useChatStore();
  const { setFromExtracted } = useFormStore();
  const processChat = useProcessAiChat();

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [aiMetadata, setAiMetadata] = useState<AiMessageEntry[]>([]);

  const messagesCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesCount]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText("");

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: text,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setLoading(true);

    try {
      const response = await processChat.mutateAsync({ userMessage: text });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: "ai" as const,
        content: response.message,
        timestamp: Date.now(),
      };
      addMessage(aiMsg);

      const nextMessages = useChatStore.getState().messages;
      setAiMetadata((prev) => [
        ...prev,
        {
          tool: response.tool,
          structuredData: response.structuredData,
          messageIndex: nextMessages.length - 1,
        },
      ]);

      if (
        response.tool === "extractEntities" &&
        response.structuredData?.trim()
      ) {
        try {
          const extracted = JSON.parse(
            response.structuredData,
          ) as ExtractedData;
          if (Object.keys(extracted).length > 0) {
            setFromExtracted(extracted);
            toast.success("Form fields updated from AI", {
              description: "Extracted data has been applied to the form.",
              duration: 4000,
            });
          }
        } catch {
          // Structured data wasn't valid JSON — ignore silently
        }
      }
    } catch (_err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: "ai" as const,
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      };
      addMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleClear = () => {
    clearMessages();
    setAiMetadata([]);
  };

  const getMetaForMessage = (idx: number) =>
    aiMetadata.find((m) => m.messageIndex === idx);

  const parseFollowUps = (structuredData: string): string[] => {
    try {
      const parsed: unknown = JSON.parse(structuredData);
      if (Array.isArray(parsed)) return parsed as string[];
      if (parsed && typeof parsed === "object" && "followUps" in parsed) {
        const fu = (parsed as { followUps: unknown }).followUps;
        if (Array.isArray(fu)) return fu as string[];
      }
    } catch {
      // not parseable
    }
    return [];
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(0.970 0.008 268)" }}
    >
      {/* Chat header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border/60 shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.045 270) 0%, oklch(0.21 0.050 278) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.22 275) 0%, oklch(0.62 0.18 295) 100%)",
              boxShadow: "0 3px 10px oklch(0.50 0.22 275 / 0.40)",
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white leading-tight tracking-tight">
              AI Assistant
            </h2>
            <p
              className="text-[0.65rem] leading-tight font-light"
              style={{ color: "oklch(0.72 0.06 268)" }}
            >
              Powered by Groq
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-smooth hover:bg-white/10"
          style={{ color: "oklch(0.65 0.04 268)" }}
          onClick={handleClear}
          aria-label="Clear chat"
          data-ocid="chat.clear_button"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 min-h-0"
        data-ocid="chat.messages_list"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg, idx) => {
              const meta =
                msg.role === "ai" ? getMetaForMessage(idx) : undefined;
              const showSummary =
                meta?.tool === "summarize" && meta.structuredData?.trim();
              const showFollowUps =
                meta?.tool === "suggestFollowUps" &&
                meta.structuredData?.trim();
              const followUps = showFollowUps
                ? parseFollowUps(meta.structuredData)
                : [];

              return (
                <div key={msg.id} data-ocid={`chat.item.${idx + 1}`}>
                  <ChatMessage message={msg} />
                  {showSummary && <SummaryCard summary={meta.structuredData} />}
                  {showFollowUps && followUps.length > 0 && (
                    <div className="px-2 mb-2">
                      <FollowUpSuggestions suggestions={followUps} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div
                className="flex items-start gap-2.5 mb-3 animate-fade-in"
                data-ocid="chat.loading_state"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.15), oklch(0.56 0.19 285 / 0.12))",
                    border: "1px solid oklch(0.50 0.22 275 / 0.20)",
                  }}
                >
                  <Sparkles
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.50 0.22 275)" }}
                  />
                </div>
                <div className="space-y-2 pt-1.5">
                  <Skeleton className="h-3 w-36 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="px-3 py-3 border-t border-border/60 shrink-0"
        style={{ background: "oklch(var(--card))" }}
      >
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your HCP interaction..."
            rows={1}
            disabled={isLoading}
            data-ocid="chat.message_input"
            className="resize-none h-10 min-h-[40px] max-h-[100px] text-sm py-2.5 px-3.5 rounded-xl border-input bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-smooth overflow-hidden"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "40px";
              el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
            }}
          />
          <button
            type="button"
            disabled={!inputText.trim() || isLoading}
            onClick={() => void handleSend()}
            data-ocid="chat.send_button"
            aria-label="Send message"
            className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
            style={
              inputText.trim() && !isLoading
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.50 0.22 275) 0%, oklch(0.56 0.19 285) 100%)",
                    boxShadow: "0 3px 10px oklch(0.50 0.22 275 / 0.35)",
                  }
                : { background: "oklch(var(--muted))" }
            }
          >
            <Send
              className="w-4 h-4"
              style={{
                color:
                  inputText.trim() && !isLoading
                    ? "oklch(0.995 0 0)"
                    : "oklch(var(--muted-foreground))",
              }}
            />
          </button>
        </div>
        <p className="text-[0.65rem] text-muted-foreground mt-1.5 px-0.5">
          Press Enter to send &middot; Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
