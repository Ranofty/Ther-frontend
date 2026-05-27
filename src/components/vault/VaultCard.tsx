import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star, ShieldCheck, Clock, Flame, Coins, ArrowLeftRight,
  CheckCircle2, XCircle, Lock, Activity, Users, Calendar, Layers,
} from "lucide-react";
import type { Vault } from "@/types";
import { SparkProgress } from "@/components/ui/SparkProgress";
import { BadgeTag } from "@/components/ui/BadgeTag";
import { formatNumber, timeAgo } from "@/lib/utils";

interface VaultCardProps {
  vault: Vault;
  trending?: boolean;
}

export function VaultCard({ vault, trending }: VaultCardProps) {
  const [fav, setFav] = useState(false);

  // Avg depth = avg(vault_balance / initial_deposit) * 100
  const avgDepth =
    (vault.tokens.reduce((acc, t) => acc + t.vault_balance / t.initial_deposit, 0) /
      vault.tokens.length) *
    100;

  const launchpads = Array.from(new Set(vault.tokens.map((t) => t.launchpad)));
  const allMintRevoked = vault.tokens.every((t) => t.mint_revoked);
  const allFreezeRevoked = vault.tokens.every((t) => t.freeze_revoked);

  const lockLabel = vault.is_renounced
    ? "Permanent"
    : vault.lock_type === "timed"
      ? `${Math.max(0, Math.floor((vault.lock_expiry * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))}d lock`
      : "Unlocked";

  return (
    <Link
      to="/vault/$id"
      params={{ id: vault.id }}
      className="group relative overflow-hidden rounded-3xl cursor-pointer min-h-[220px] flex flex-col justify-end transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--accent)]/20 block"
    >
      {/* Cover */}
      <img
        src={vault.image_url}
        alt={vault.name}
        className="absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />

      {/* Top-left fav */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setFav((f) => !f);
        }}
        className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xl transition-all duration-300 ${
          fav
            ? "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent)]"
            : "bg-[var(--bg)]/30 text-[var(--text)]"
        }`}
        aria-label="Favorite"
      >
        <Star size={14} fill={fav ? "currentColor" : "none"} />
      </button>

      {/* Top-right status badges */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
        {vault.is_renounced && (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--green)]/20 border border-[var(--green)]/50 text-[var(--green)]"
            title="Permanently renounced"
          >
            <ShieldCheck size={14} />
          </div>
        )}
        {!vault.is_renounced && vault.lock_type === "timed" && (
          <BadgeTag variant="accent-2" icon={<Clock size={9} />}>
            {lockLabel}
          </BadgeTag>
        )}
        {trending && (
          <BadgeTag variant="accent-2" icon={<Flame size={9} />} className="font-bold">
            HOT
          </BadgeTag>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex items-end justify-between mb-3">
          <div className="min-w-0">
            <h3 className="text-xl font-display font-bold text-[var(--text)] truncate">{vault.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-[var(--accent)]">
                {vault.tokens.length} Tokens
              </span>
              {launchpads.map((lp) => (
                <span
                  key={lp}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)]"
                >
                  {lp}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-mono text-[var(--text)]">
              {formatNumber(vault.total_swaps)}
            </div>
            <div className="text-[10px] font-mono text-[var(--text-muted)]">24h Swaps</div>
          </div>
        </div>

        <div className="bg-[var(--bg)]/20 backdrop-blur-2xl rounded-2xl p-3 shadow-lg mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
              <Coins size={11} />
              Vault Depth
            </div>
            <span className="text-xs font-mono font-bold text-[var(--accent)] drop-shadow-[0_0_8px_var(--accent)]">
              {avgDepth.toFixed(0)}%
            </span>
          </div>
          <SparkProgress percentage={avgDepth} />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {allMintRevoked && (
            <BadgeTag icon={<CheckCircle2 size={9} className="text-[var(--green)]" />}>
              Mint Revoked
            </BadgeTag>
          )}
          {allFreezeRevoked ? (
            <BadgeTag icon={<CheckCircle2 size={9} className="text-[var(--green)]" />}>
              Freeze Revoked
            </BadgeTag>
          ) : (
            <BadgeTag icon={<XCircle size={9} className="text-[var(--red)]" />}>
              Freeze Active
            </BadgeTag>
          )}
          <BadgeTag icon={<Lock size={9} />}>{lockLabel}</BadgeTag>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Activity size={10} />
            {vault.total_volume_sol.toFixed(1)} SOL
          </span>
          <span className="flex items-center gap-1">
            <Users size={10} />
            {formatNumber(vault.unique_wallets)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {timeAgo(vault.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
