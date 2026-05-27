import { ArrowLeftRight } from "lucide-react";
import { PulseIndicator } from "@/components/ui/PulseIndicator";
import { useGlobalSwapFeed } from "@/hooks/useVaults";
import { formatNumber, truncateAddress } from "@/lib/utils";

export function LiveTerminal() {
  const swaps = useGlobalSwapFeed(8);
  return (
    <div className="bg-[var(--bg)]/30 backdrop-blur-3xl rounded-3xl p-5 sm:p-6 shadow-[0_8px_48px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 mb-4">
        <PulseIndicator />
        <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
          Live Swaps
        </span>
      </div>
      <div className="flex flex-col gap-2 max-h-[320px] overflow-hidden">
        {swaps.map((s) => (
          <div
            key={s.id}
            className="trade-entry flex items-center justify-between py-2"
          >
            <div className="min-w-0 flex-1">
              <div className="text-xs font-mono text-[var(--accent)] truncate">{s.vault_name}</div>
              <div className="text-[10px] font-mono text-[var(--text-muted)]">
                {truncateAddress(s.user_wallet, 3)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono px-3 flex-shrink-0">
              <span>{s.token_in_symbol}</span>
              <ArrowLeftRight size={10} className="text-[var(--text-muted)]" />
              <span>{s.token_out_symbol}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-mono text-[var(--text)]">{formatNumber(s.amount)}</span>
              <span className="bg-[var(--accent)]/15 text-[var(--accent)] text-[9px] px-1.5 py-0.5 rounded font-mono">
                SWAP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
