import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeTagProps {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "default" | "accent" | "accent-2" | "green" | "red";
  className?: string;
}

export function BadgeTag({ children, icon, variant = "default", className }: BadgeTagProps) {
  const variants = {
    default: "bg-white/5 border-white/5 text-[var(--text-muted)]",
    accent: "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30",
    "accent-2": "bg-[var(--accent-2)]/15 text-[var(--accent-2)] border-[var(--accent-2)]/30",
    green: "bg-[var(--green)]/15 text-[var(--green)] border-[var(--green)]/30",
    red: "bg-[var(--red)]/15 text-[var(--red)] border-[var(--red)]/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border rounded px-1.5 py-0.5 text-[9px] font-mono",
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
