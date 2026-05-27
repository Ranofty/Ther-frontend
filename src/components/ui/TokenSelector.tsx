import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { VaultToken } from "@/types";
import { formatNumber } from "@/lib/utils";

interface TokenSelectorProps {
  tokens: VaultToken[];
  selected: VaultToken | null;
  onChange: (token: VaultToken) => void;
  label?: string;
}

function TokenLogo({ symbol }: { symbol: string }) {
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-[10px] font-mono font-bold text-black flex-shrink-0">
      {symbol.slice(0, 3)}
    </div>
  );
}

export function TokenSelector({ tokens, selected, onChange }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-[var(--bg)]/80 backdrop-blur-xl rounded-2xl py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-2)] transition-colors"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <TokenLogo symbol={selected.symbol} />
            <span className="font-display font-medium">{selected.symbol}</span>
          </div>
        ) : (
          <span className="text-[var(--text-muted)] text-sm">Select token</span>
        )}
        <ChevronDown
          size={16}
          className={`text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-[var(--bg)]/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto"
          >
            {tokens.map((t) => (
              <button
                key={t.mint}
                type="button"
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-2)] cursor-pointer transition-colors text-left"
              >
                <TokenLogo symbol={t.symbol} />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm truncate">{t.name}</div>
                  <div className="font-mono text-[var(--accent)] text-xs">{t.symbol}</div>
                </div>
                <div className="font-mono text-xs text-[var(--text-muted)]">
                  {formatNumber(t.vault_balance)}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
