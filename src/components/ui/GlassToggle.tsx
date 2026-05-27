import { cn } from "@/lib/utils";

interface GlassToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}

export function GlassToggle({ checked, onChange, className }: GlassToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex items-center w-10 h-6 rounded-full transition-colors duration-300 flex-shrink-0",
        checked ? "bg-[var(--accent)]" : "bg-[var(--surface-2)]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300",
          checked ? "translate-x-[18px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
