import { Globe, BadgeCheck, Activity, Users, Calendar, Lock, ShieldCheck, Clock, AtSign, Send } from "lucide-react";
import type { Vault } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { BadgeTag } from "@/components/ui/BadgeTag";
import { formatNumber, timeAgo } from "@/lib/utils";
import { UserLink } from "@/components/ui/UserLink";
import { ShareButton } from "./ShareButton";

export function VaultHeader({ vault }: { vault: Vault }) {
  return (
    <GlassCard className="xl:col-span-12">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <img
          src={vault.image_url}
          alt={vault.name}
          className="w-24 h-24 rounded-2xl shadow-2xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-display font-bold text-[var(--text)]">{vault.name}</h1>
            {vault.twitter && (
              <a
                href={`https://x.com/${vault.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 hover:-translate-y-0.5 transition-all"
              >
                <AtSign size={18} />
              </a>
            )}
            {vault.telegram && (
              <a
                href={vault.telegram.startsWith("http") ? vault.telegram : `https://t.me/${vault.telegram}`}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 hover:-translate-y-0.5 transition-all"
              >
                <Send size={18} />
              </a>
            )}
            {vault.website && (
              <a
                href={vault.website}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 hover:-translate-y-0.5 transition-all"
              >
                <Globe size={18} />
              </a>
            )}
            <ShareButton vault={{ id: vault.id, vault_name: vault.name }} />
          </div>
          <p className="text-sm font-mono text-[var(--text-muted)] mt-2 max-w-2xl">
            {vault.description}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--text-muted)] font-mono">
            <span>Creator:</span>
            <UserLink walletAddress={vault.creator} truncateLen={6} className="text-[var(--accent)] font-semibold" />
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {vault.is_renounced ? (
              <BadgeTag variant="green" icon={<ShieldCheck size={9} />}>Permanent</BadgeTag>
            ) : (
              <BadgeTag variant="accent-2" icon={<Clock size={9} />}>
                {Math.max(0, Math.floor((vault.lock_expiry * 1000 - Date.now()) / 86400000))}d lock
              </BadgeTag>
            )}
            <BadgeTag>{vault.tokens.length} tokens</BadgeTag>
            <BadgeTag variant="accent" icon={<BadgeCheck size={9} />}>Verified</BadgeTag>
          </div>
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            <Stat icon={<Activity size={14} />} label="Total Swaps" value={formatNumber(vault.total_swaps)} />
            <Stat icon={<Lock size={14} />} label="Volume" value={`${vault.total_volume_sol.toFixed(1)} SOL`} />
            <Stat icon={<Users size={14} />} label="Wallets" value={formatNumber(vault.unique_wallets)} />
            <Stat icon={<Calendar size={14} />} label="Created" value={timeAgo(vault.created_at)} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--accent)]">{icon}</span>
      <div className="flex flex-col">
        <span className="text-sm font-mono text-[var(--text)] font-bold">{value}</span>
        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
}
