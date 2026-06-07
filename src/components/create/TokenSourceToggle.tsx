import { Link, Rocket } from "lucide-react";

interface TokenSourceToggleProps {
  mode: "existing" | "launch";
  onModeChange: (mode: "existing" | "launch") => void;
  disabled?: boolean;
}

export function TokenSourceToggle({ mode, onModeChange, disabled }: TokenSourceToggleProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onModeChange("existing")}
        className={`p-5 rounded-2xl text-left transition-all duration-300 bg-[var(--surface)] backdrop-blur-2xl border-2 flex items-start gap-4 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${
          mode === "existing"
            ? "border-[var(--accent)] shadow-[0_0_20px_rgba(0,229,255,0.1)]"
            : "border-transparent hover:border-[var(--text)]/10"
        }`}
      >
        <div className={`p-3 rounded-xl ${mode === "existing" ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-[var(--surface-2)] text-[var(--text-muted)]"}`}>
          <Link size={20} />
        </div>
        <div>
          <h3 className="font-mono text-sm font-bold text-[var(--text)] uppercase tracking-wider">Use Existing</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Paste an existing mint address</p>
        </div>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onModeChange("launch")}
        className={`p-5 rounded-2xl text-left transition-all duration-300 bg-[var(--surface)] backdrop-blur-2xl border-2 flex items-start gap-4 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${
          mode === "launch"
            ? "border-[var(--accent)] shadow-[0_0_20px_rgba(0,229,255,0.1)]"
            : "border-transparent hover:border-[var(--text)]/10"
        }`}
      >
        <div className={`p-3 rounded-xl ${mode === "launch" ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-[var(--surface-2)] text-[var(--text-muted)]"}`}>
          <Rocket size={20} />
        </div>
        <div>
          <h3 className="font-mono text-sm font-bold text-[var(--text)] uppercase tracking-wider">Launch New</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Create token on a launchpad</p>
        </div>
      </button>
    </div>
  );
}
