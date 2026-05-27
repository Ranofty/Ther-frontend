import { cn } from "@/lib/utils";

interface SparkProgressProps {
  percentage: number;
  className?: string;
}

export function SparkProgress({ percentage, className }: SparkProgressProps) {
  const pct = Math.max(0, Math.min(100, percentage));
  return (
    <div className={cn("relative w-full h-1.5 rounded-full bg-[var(--surface-2)]", className)}>
      <div
        className="relative h-full rounded-full bg-[var(--accent)] transition-all duration-700"
        style={{ width: `${pct}%`, boxShadow: pct > 5 ? "0 0 8px var(--accent)" : undefined }}
      >
        {pct > 20 &&
          Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="spark"
              style={
                {
                  right: -2,
                  top: 0,
                  animationDelay: `${i * 0.1}s`,
                  "--tx": `${(Math.random() * 12 + 4).toFixed(1)}px`,
                  "--ty": `${(Math.random() * 12 - 6).toFixed(1)}px`,
                } as React.CSSProperties
              }
            />
          ))}
      </div>
    </div>
  );
}
