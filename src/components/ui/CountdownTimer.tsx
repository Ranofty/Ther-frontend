import { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiry: number; // unix seconds
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer({ expiry }: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!expiry) return null;
  const diff = Math.max(0, expiry * 1000 - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const units: Array<[string, string]> = [
    [pad(days), "DAYS"],
    [pad(hours), "HRS"],
    [pad(minutes), "MIN"],
    [pad(seconds), "SEC"],
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      {units.map(([val, label], i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span
              key={val}
              className="text-3xl sm:text-4xl font-mono font-bold text-[var(--text)] digit-flip inline-block"
            >
              {val}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mt-1">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-mono text-[var(--text-muted)] mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
