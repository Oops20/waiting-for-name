import { Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3.5 animate-slide-up`}
      data-ocid={`chat.message.${isUser ? "user" : "ai"}`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-0.5 shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.50 0.22 275 / 0.14) 0%, oklch(0.56 0.19 285 / 0.10) 100%)",
            border: "1px solid oklch(0.50 0.22 275 / 0.20)",
          }}
        >
          <Sparkles
            className="w-3 h-3"
            style={{ color: "oklch(0.50 0.22 275)" }}
          />
        </div>
      )}

      <div
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[82%]`}
      >
        <div className={isUser ? "chat-message-user" : "chat-message-ai"}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span
          className="text-[0.6rem] mt-1 px-1"
          style={{ color: "oklch(var(--muted-foreground) / 0.7)" }}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>

      {isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center ml-2 mt-0.5 shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.50 0.22 275) 0%, oklch(0.56 0.19 285) 100%)",
            boxShadow: "0 2px 6px oklch(0.50 0.22 275 / 0.30)",
          }}
        >
          <span className="text-[0.6rem] text-white font-bold">Me</span>
        </div>
      )}
    </div>
  );
}
