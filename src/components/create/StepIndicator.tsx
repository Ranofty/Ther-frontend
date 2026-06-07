import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Identity", "Tokens", "Lock", "Revenue", "Review"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-10">
      {STEPS.map((label, idx) => {
        const completed = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-all",
                  completed && "bg-[var(--green)] text-black",
                  active && "bg-[var(--accent)] text-black shadow-[0_0_12px_var(--accent)]",
                  !completed && !active && "bg-[var(--surface-2)] text-[var(--text-muted)]",
                )}
              >
                {completed ? <Check size={14} /> : idx + 1}
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wide mt-2 whitespace-nowrap">
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[1px] mx-2 transition-colors",
                  completed ? "bg-[var(--green)]" : "bg-[var(--text)]/10",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
