import { Link } from "@tanstack/react-router";
import { Plus, Compass } from "lucide-react";
import { LiveTerminal } from "./LiveTerminal";

export function HeroSection() {
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-16 sm:py-24">
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(0, 229, 255, 0.06) 0%, transparent 70%)",
        }}
      />
      <div className="lg:col-span-7">
        <h1 className="text-4xl sm:text-6xl font-display font-bold text-[var(--text)] leading-[1.05] tracking-tight mb-6">
          The protocol that{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent italic">
            connects every token
          </span>
        </h1>
        <p className="text-sm sm:text-base font-mono text-[var(--text-muted)] mb-8 max-w-md leading-relaxed">
          Group SPL tokens from any launchpad into immutable vaults. One swap, real on-chain volume
          for every token in the vault. Fixed 1:1 quantity, always.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            to="/create"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-black font-bold font-display shadow-[0_4px_24px_rgba(0,229,255,0.25)] hover:shadow-[0_8px_32px_rgba(0,229,255,0.35)] transition-all duration-300"
          >
            <Plus size={18} />
            Create Vault
          </Link>
          <Link
            to="/"
            hash="vaults"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--bg)]/30 backdrop-blur-xl font-display font-bold text-[var(--text)] hover:bg-[var(--surface-2)] transition-all duration-300"
          >
            <Compass size={18} />
            Explore Vaults
          </Link>
        </div>
      </div>
      <div className="lg:col-span-5">
        <LiveTerminal />
      </div>
    </section>
  );
}
