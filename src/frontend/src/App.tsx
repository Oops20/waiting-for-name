import { Toaster } from "sonner";
import { AiChatPanel } from "./components/Chat/AiChatPanel";
import { LogInteractionForm } from "./components/Form/LogInteractionForm";
import { InteractionHistory } from "./components/History/InteractionHistory";
import { AppHeader } from "./components/Layout/AppHeader";
import { SplitScreen } from "./components/Layout/SplitScreen";

function LeftPanel() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        <LogInteractionForm />
      </div>
      <InteractionHistory />
    </div>
  );
}

export default function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-body">
      <AppHeader />
      <main className="flex flex-1 overflow-hidden">
        <SplitScreen left={<LeftPanel />} right={<AiChatPanel />} />
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
