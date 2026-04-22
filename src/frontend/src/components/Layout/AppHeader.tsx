import { Activity, Zap } from "lucide-react";

export function AppHeader() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/50"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.14 0.04 268) 0%, oklch(0.18 0.055 275) 100%)",
      }}
      data-ocid="app.header"
    >
      <div className="flex h-[3.75rem] items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          {/* Logo badge */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.22 275) 0%, oklch(0.62 0.18 295) 100%)",
              boxShadow: "0 3px 12px oklch(0.50 0.22 275 / 0.45)",
            }}
          >
            <Activity className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>

          {/* Title group */}
          <div className="flex flex-col justify-center">
            <h1
              className="text-[0.95rem] font-bold leading-none tracking-tight text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              HCP Interaction Logger
            </h1>
            <p
              className="text-[0.7rem] leading-none mt-1 font-light"
              style={{ color: "oklch(0.75 0.04 268)" }}
            >
              Life Science CRM &nbsp;&middot;&nbsp;{" "}
              <span
                className="font-semibold"
                style={{ color: "oklch(0.82 0.14 85)" }}
              >
                Tanvi Sakhale
              </span>
            </p>
          </div>
        </div>

        {/* Right — AI badge */}
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-semibold tracking-wide ai-badge">
            <Zap className="h-3 w-3" />
            AI-Powered
          </span>
        </div>
      </div>
    </header>
  );
}
