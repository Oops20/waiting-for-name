import { cn } from "@/lib/utils";
import { type ReactNode, useState } from "react";

interface SplitScreenProps {
  left: ReactNode;
  right: ReactNode;
}

export function SplitScreen({ left, right }: SplitScreenProps) {
  const [activeTab, setActiveTab] = useState<"form" | "chat">("form");

  return (
    <>
      {/* Mobile Tab Bar */}
      <div
        className="flex md:hidden border-b border-border/60 bg-card sticky top-[3.75rem] z-40"
        style={{ boxShadow: "0 2px 8px -2px oklch(0.14 0.03 268 / 0.08)" }}
      >
        <button
          type="button"
          data-ocid="split.form.tab"
          onClick={() => setActiveTab("form")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-smooth relative",
            activeTab === "form"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Log Interaction
          {activeTab === "form" && (
            <span
              className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-t-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.50 0.22 275), oklch(0.56 0.19 285))",
              }}
            />
          )}
        </button>
        <button
          type="button"
          data-ocid="split.chat.tab"
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-smooth relative",
            activeTab === "chat"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          AI Assistant
          {activeTab === "chat" && (
            <span
              className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-t-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.50 0.22 275), oklch(0.56 0.19 285))",
              }}
            />
          )}
        </button>
      </div>

      {/* Desktop split / Mobile single panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — form side */}
        <div
          className={cn(
            "flex flex-col overflow-y-auto",
            "w-full md:w-1/2",
            "border-r border-border/60",
            activeTab !== "form" ? "hidden md:flex" : "flex",
          )}
          style={{ background: "oklch(var(--background))" }}
          data-ocid="split.left_panel"
        >
          {left}
        </div>

        {/* Right Panel — chat side */}
        <div
          className={cn(
            "flex flex-col overflow-hidden",
            "w-full md:w-1/2",
            activeTab !== "chat" ? "hidden md:flex" : "flex",
          )}
          style={{ background: "oklch(0.970 0.008 268)" }}
          data-ocid="split.right_panel"
        >
          {right}
        </div>
      </div>
    </>
  );
}
