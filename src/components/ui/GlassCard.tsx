import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  blur?: "xl" | "2xl" | "3xl";
}

export function GlassCard({
  children,
  className,
  blur = "2xl",
  ...rest
}: GlassCardProps) {
  const blurClass =
    blur === "3xl" ? "backdrop-blur-3xl" : blur === "xl" ? "backdrop-blur-xl" : "backdrop-blur-2xl";
  return (
    <div
      className={cn(
        "bg-[var(--bg)]/30 rounded-3xl p-5 sm:p-6 shadow-[0_8px_48px_rgba(0,0,0,0.08)]",
        blurClass,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
