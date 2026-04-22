import { Minus, Plus } from "lucide-react";

interface SamplesCounterProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

export function SamplesCounter({
  value,
  onChange,
  min = 0,
  max = 999,
}: SamplesCounterProps) {
  const numVal = Math.max(min, Number.parseInt(value, 10) || 0);

  function decrement() {
    if (numVal > min) onChange(String(numVal - 1));
  }

  function increment() {
    if (numVal < max) onChange(String(numVal + 1));
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = Number.parseInt(e.target.value, 10);
    if (Number.isNaN(raw)) {
      onChange(String(min));
    } else {
      onChange(String(Math.max(min, Math.min(max, raw))));
    }
  }

  return (
    <div
      className="flex items-center rounded-lg border border-input overflow-hidden w-36 h-10"
      style={{ background: "oklch(var(--background) / 0.7)" }}
    >
      <button
        type="button"
        data-ocid="samples.decrement_button"
        onClick={decrement}
        disabled={numVal <= min}
        aria-label="Decrease samples"
        className="
          flex items-center justify-center w-10 h-full
          text-muted-foreground hover:bg-primary/8 hover:text-primary
          disabled:opacity-35 disabled:cursor-not-allowed
          transition-smooth border-r border-input
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring
        "
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <input
        type="number"
        data-ocid="samples.input"
        min={min}
        max={max}
        value={numVal}
        onChange={handleInput}
        aria-label="Number of samples"
        className="
          flex-1 text-center text-sm font-semibold text-foreground bg-transparent
          focus:outline-none border-none
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        "
      />

      <button
        type="button"
        data-ocid="samples.increment_button"
        onClick={increment}
        disabled={numVal >= max}
        aria-label="Increase samples"
        className="
          flex items-center justify-center w-10 h-full
          text-muted-foreground hover:bg-primary/8 hover:text-primary
          disabled:opacity-35 disabled:cursor-not-allowed
          transition-smooth border-l border-input
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring
        "
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
