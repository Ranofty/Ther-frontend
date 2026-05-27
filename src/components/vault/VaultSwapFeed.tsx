import { Wallet, ArrowLeftRight } from "lucide-react";
import type { SwapEvent } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseIndicator } from "@/components/ui/PulseIndicator";
import { formatNumber, timeAgo, truncateAddress } from "@/lib/utils";
import { UserLink } from "@/components/ui/UserLink";

export function VaultSwapFeed({ swaps }: { swaps: SwapEvent[] }) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PulseIndicator />
          <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
            Live Swaps
          </span>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
          {swaps.length} recent
        </span>
      </div>
      <div className="max-h-[320px] overflow-y-auto flex flex-col gap-2 pr-1">
        {swaps.length === 0 && (
          <div className="text-center py-8 text-xs font-mono text-[var(--text-muted)]">
            Waiting for swaps...
          </div>
        )}
        {swaps.map((s) => (
          <div
            key={s.id}
            className="trade-entry flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--surface-2)] text-xs font-mono"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Wallet size={12} className="text-[var(--text-muted)] flex-shrink-0" />
              <UserLink walletAddress={s.user_wallet} truncateLen={3} className="text-[var(--text-muted)] truncate" />
            </div>
            <div className="flex items-center gap-1.5">
              <span>{s.token_in_symbol}</span>
              <ArrowLeftRight size={10} className="text-[var(--text-muted)]" />
              <span>{s.token_out_symbol}</span>
            </div>
            <div className="font-bold text-[var(--text)]">{formatNumber(s.amount)}</div>
            <div className="text-[var(--text-muted)] text-[10px]">{timeAgo(s.timestamp)}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
