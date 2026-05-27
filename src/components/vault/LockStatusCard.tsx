import { Lock, ShieldCheck, ArrowDownToLine, Repeat, ArrowUpFromLine, CheckCircle2, XCircle } from "lucide-react";
import type { Vault } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { BadgeTag } from "@/components/ui/BadgeTag";

export function LockStatusCard({ vault }: { vault: Vault }) {
  const expired =
    vault.lock_type === "timed" && !vault.is_renounced && vault.lock_expiry * 1000 < Date.now();
  const expiryDate =
    vault.lock_expiry > 0 ? new Date(vault.lock_expiry * 1000).toLocaleDateString() : "";

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-5">
        <Lock size={16} className="text-[var(--accent)]" />
        <h3 className="font-display font-semibold text-[var(--text)]">Lock Status</h3>
      </div>

      {vault.is_renounced ? (
        <div className="flex flex-col items-center text-center mb-5">
          <ShieldCheck size={48} className="text-[var(--green)] mb-3" />
          <div className="font-display font-bold text-xl text-[var(--text)]">
            Permanently Renounced
          </div>
          <div className="font-mono text-xs text-[var(--text-muted)] mt-1">
            Renounced on {new Date(vault.created_at).toLocaleDateString()}
          </div>
        </div>
      ) : vault.lock_type === "timed" ? (
        <div className="mb-5">
          <CountdownTimer expiry={vault.lock_expiry} />
          <div className="font-mono text-xs text-[var(--text-muted)] text-center mt-2">
            Unlocks {expiryDate}
          </div>
        </div>
      ) : null}

      <Row
        icon={<ArrowDownToLine size={14} />}
        label="Deposits"
        badge={<BadgeTag variant="green" icon={<CheckCircle2 size={9} />}>Open to Everyone</BadgeTag>}
      />
      <Row
        icon={<Repeat size={14} />}
        label="Swaps"
        badge={<BadgeTag variant="green" icon={<CheckCircle2 size={9} />}>Always Open</BadgeTag>}
      />
      <Row
        icon={<ArrowUpFromLine size={14} />}
        label="Withdrawals"
        badge={
          vault.is_renounced ? (
            <BadgeTag variant="red" icon={<XCircle size={9} />}>Locked Forever</BadgeTag>
          ) : expired ? (
            <BadgeTag variant="green" icon={<CheckCircle2 size={9} />}>Unlocked</BadgeTag>
          ) : (
            <BadgeTag variant="red" icon={<XCircle size={9} />}>
              Locked Until {expiryDate}
            </BadgeTag>
          )
        }
      />
    </GlassCard>
  );
}

function Row({
  icon, label, badge,
}: { icon: React.ReactNode; label: string; badge: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--text)]/5 last:border-0">
      <div className="flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]">
        {icon}
        {label}
      </div>
      {badge}
    </div>
  );
}
