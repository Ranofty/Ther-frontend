import { Check } from "lucide-react";
import type { LaunchpadId } from "@/lib/launchpads/types";
import { LAUNCHPAD_LOGOS } from "./LaunchpadLogos";

interface LaunchpadSelectorProps {
  selected: Set<LaunchpadId>;
  onToggle: (id: LaunchpadId) => void;
  onSelectAll: () => void;
  disabled?: boolean;
}

const LAUNCHPADS_DATA: {
  id: LaunchpadId;
  name: string;
  description: string;
  color: string;
  mainnetOnly?: boolean;
}[] = [
  { id: "pumpfun", name: "Pump.fun", description: "Original memecoin launchpad", color: "#00e1a0" },
  { id: "bonkfun", name: "LetsBonk.fun", description: "BONK-powered launcher", color: "#f7931a" },
  { id: "bagsfm", name: "Bags.fm", description: "Fee-sharing token platform", color: "#02FF40", mainnetOnly: true },
];

export function LaunchpadSelector({ selected, onToggle, onSelectAll, disabled }: LaunchpadSelectorProps) {
  // Defensive: handle null/undefined from HMR stale state
  const safeSelected = selected instanceof Set ? selected : new Set<LaunchpadId>();
  const allSelected = safeSelected.size === LAUNCHPADS_DATA.length;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Select All toggle */}
      <button
        type="button"
        disabled={disabled}
        onClick={onSelectAll}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 border-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${
          allSelected
            ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)] shadow-[0_0_12px_rgba(0,229,255,0.1)]"
            : "bg-[var(--surface)] border-[var(--text)]/10 text-[var(--text-muted)] hover:border-[var(--accent)]/40 hover:text-[var(--text)]"
        }`}
      >
        {allSelected ? (
          <>
            <Check size={14} /> All Platforms Selected
          </>
        ) : (
          `Select All Platforms (${LAUNCHPADS_DATA.length})`
        )}
      </button>

      {/* Launchpad cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        {LAUNCHPADS_DATA.map((lp) => {
          const isSelected = safeSelected.has(lp.id);
          const LogoComponent = LAUNCHPAD_LOGOS[lp.id];

          return (
            <button
              key={lp.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(lp.id)}
              className={`relative flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 bg-[var(--surface)] backdrop-blur-2xl border-2 group ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${
                isSelected
                  ? "border-[var(--accent)] shadow-[0_0_24px_rgba(0,229,255,0.12)]"
                  : "border-transparent hover:border-[var(--text)]/10 hover:shadow-md"
              }`}
            >
              {/* Selection indicator */}
              <div
                className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? "bg-[var(--accent)] text-black scale-100"
                    : "bg-[var(--surface-2)] border border-[var(--text)]/15 text-transparent group-hover:border-[var(--text)]/30 scale-90"
                }`}
              >
                <Check size={11} strokeWidth={3} />
              </div>

              {/* Mainnet badge */}
              {lp.mainnetOnly && (
                <div className="absolute top-3 left-3">
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                    Mainnet
                  </span>
                </div>
              )}

              {/* Logo */}
              <div
                className={`mb-3 transition-transform duration-300 ${
                  isSelected ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                {LogoComponent ? (
                  <LogoComponent size={48} />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-black font-mono shadow-md"
                    style={{ backgroundColor: lp.color }}
                  >
                    {lp.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="font-mono text-sm font-bold text-[var(--text)] mb-0.5">
                {lp.name}
              </h3>

              {/* Description */}
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                {lp.description}
              </p>

              {/* Bottom glow accent bar */}
              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500 ${
                  isSelected ? "w-2/3 opacity-100" : "w-0 opacity-0"
                }`}
                style={{ backgroundColor: lp.color }}
              />
            </button>
          );
        })}
      </div>

      {/* Selection summary */}
      {safeSelected.size > 0 && (
        <div className="flex items-center justify-center gap-2 py-2 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          {safeSelected.size === 1
            ? "1 platform selected"
            : `${safeSelected.size} platforms selected — token will launch on all`}
        </div>
      )}
    </div>
  );
}
