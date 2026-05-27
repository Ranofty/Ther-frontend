import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { formatNumber } from "@/lib/utils";

interface StatNumberProps {
  value: number;
  label: string;
  icon?: ReactNode;
  format?: "compact" | "full";
  suffix?: string;
}

export function StatNumber({ value, label, icon, format = "compact", suffix }: StatNumberProps) {
  const [display, setDisplay] = useState(value);
  const [flip, setFlip] = useState(0);
  useEffect(() => {
    if (display !== value) {
      setDisplay(value);
      setFlip((f) => f + 1);
    }
  }, [value, display]);

  const text =
    format === "compact"
      ? formatNumber(display)
      : display.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col items-center gap-1">
      {icon && <div className="text-[var(--accent)] mb-1">{icon}</div>}
      <span
        key={flip}
        className="text-2xl sm:text-3xl font-display font-bold text-[var(--text)] digit-flip inline-block"
      >
        {text}
        {suffix}
      </span>
      <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest text-center">
        {label}
      </span>
    </div>
  );
}
