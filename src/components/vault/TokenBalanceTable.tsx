import { Coins, CheckCircle2, XCircle } from "lucide-react";
import type { VaultToken } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { SparkProgress } from "@/components/ui/SparkProgress";
import { BadgeTag } from "@/components/ui/BadgeTag";
import { formatNumber } from "@/lib/utils";

export function TokenBalanceTable({ tokens }: { tokens: VaultToken[] }) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <Coins size={16} className="text-[var(--accent)]" />
        <h2 className="font-display font-semibold text-[var(--text)]">Token Balances</h2>
      </div>
      <div className="flex flex-col">
        {tokens.map((t) => {
          const depth = (t.vault_balance / t.initial_deposit) * 100;
          return (
            <div key={t.mint} className="py-4 border-b border-[var(--text)]/5 last:border-0">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-xs font-mono font-bold text-black flex-shrink-0">
                  {t.symbol.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-medium text-[var(--text)]">{t.name}</span>
                    <span className="font-mono text-[var(--accent)] text-sm">{t.symbol}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)]">
                      {t.launchpad}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <BadgeTag icon={t.mint_revoked ? <CheckCircle2 size={9} className="text-[var(--green)]" /> : <XCircle size={9} className="text-[var(--red)]" />}>
                      Mint
                    </BadgeTag>
                    <BadgeTag icon={t.freeze_revoked ? <CheckCircle2 size={9} className="text-[var(--green)]" /> : <XCircle size={9} className="text-[var(--red)]" />}>
                      Freeze
                    </BadgeTag>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono font-bold text-[var(--text)] text-lg">
                    {formatNumber(t.vault_balance)}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">
                    of {formatNumber(t.initial_deposit)}
                  </div>
                </div>
              </div>
              <SparkProgress percentage={depth} />
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
