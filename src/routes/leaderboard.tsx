import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useVaults } from "@/hooks/useVaults";
import { GlassCard } from "@/components/ui/GlassCard";
import { Trophy, Flame, Coins, ShieldCheck, ArrowRight, Layers, Users } from "lucide-react";
import { formatNumber, truncateAddress } from "@/lib/utils";
import { ClientOnly } from "@/components/layout/ClientOnly";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Vault Leaderboard — Ther" },
      { name: "description", content: "Explore top-performing token vaults on Solana." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  return (
    <main className="min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent flex items-center justify-center gap-2.5">
          <Trophy className="text-[var(--accent)]" size={32} /> Vault Leaderboard
        </h1>
        <p className="text-sm font-mono text-[var(--text-muted)] mt-2">
          Real-time on-chain stats of the top-performing token vaults on Ther Protocol.
        </p>
      </div>

      <ClientOnly fallback={<div className="h-96 w-full bg-[var(--surface)] animate-pulse rounded-3xl" />}>
        <LeaderboardInner />
      </ClientOnly>
    </main>
  );
}

function LeaderboardInner() {
  const { vaults } = useVaults();
  const [metric, setMetric] = useState<"swaps" | "volume" | "value">("swaps");
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "all">("all");

  const rankedVaults = useMemo(() => {
    const arr = [...vaults];
    switch (metric) {
      case "volume":
        return arr.sort((a, b) => b.total_volume_sol - a.total_volume_sol);
      case "value":
        // Sort by locked count / trusted status
        return arr.sort((a, b) => Number(b.is_renounced) - Number(a.is_renounced) || (b.tokens?.[0]?.balance || 0) - (a.tokens?.[0]?.balance || 0));
      default:
        // sort by swaps
        return arr.sort((a, b) => b.total_swaps - a.total_swaps);
    }
  }, [vaults, metric]);

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="text-2xl" title="First Place">🥇</span>;
    if (index === 1) return <span className="text-2xl" title="Second Place">🥈</span>;
    if (index === 2) return <span className="text-2xl" title="Third Place">🥉</span>;
    return <span className="font-mono text-xs font-semibold text-[var(--text-muted)]">#{index + 1}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Filters & Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Metric Selector */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] backdrop-blur-xl border border-[var(--text)]/5">
          {(
            [
              { id: "swaps", label: "Swaps", icon: Flame },
              { id: "volume", label: "Volume", icon: Coins },
              { id: "value", label: "Lock Value", icon: ShieldCheck },
            ] as const
          ).map((m) => {
            const Icon = m.icon;
            const active = metric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMetric(m.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-medium transition-all duration-300 ${
                  active
                    ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <Icon size={12} /> {m.label}
              </button>
            );
          })}
        </div>

        {/* Timeframe Selector */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] border border-[var(--text)]/5">
          {(["24h", "7d", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-mono tracking-wider transition duration-200 ${
                timeframe === t
                  ? "bg-[var(--text)]/10 text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {t === "all" ? "All-Time" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard list */}
      <GlassCard className="overflow-hidden">
        {rankedVaults.length === 0 ? (
          <div className="text-center py-16">
            <Layers size={36} className="text-[var(--accent)] mx-auto mb-3" />
            <h2 className="font-display font-bold text-xl mb-1">No vaults on-chain</h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">Deploy a new vault to claim rank #1!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--text)]/10 text-[10px] uppercase tracking-wider font-mono text-[var(--text-muted)]">
                  <th className="pb-4 pl-4 font-semibold w-16 text-center">Rank</th>
                  <th className="pb-4 font-semibold">Vault</th>
                  <th className="pb-4 font-semibold text-center">Lock Status</th>
                  <th className="pb-4 font-semibold text-center">Swaps</th>
                  <th className="pb-4 font-semibold text-right">Volume</th>
                  <th className="pb-4 font-semibold text-right pr-4">Creator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--text)]/5">
                {rankedVaults.map((v, i) => (
                  <tr
                    key={v.id}
                    className={`hover:bg-[var(--text)]/[0.02] transition duration-200 ${
                      i < 3 ? "bg-[var(--accent)]/[0.01]" : ""
                    }`}
                  >
                    <td className="py-4 pl-4 text-center">{getRankBadge(i)}</td>
                    <td className="py-4 font-semibold">
                      <Link
                        to="/vault/$id"
                        params={{ id: v.id }}
                        className="flex items-center gap-3 hover:opacity-80 group transition"
                      >
                        <img
                          src={v.image_url}
                          alt={v.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[var(--text)]/10 shadow-sm"
                        />
                        <div>
                          <div className="text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition duration-200">
                            {v.name}
                          </div>
                          <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                            {v.tokens.map((t) => t.symbol).join(" / ")}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono border ${
                          v.is_renounced
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {v.is_renounced ? "🔒 Permanent" : "⏳ Timed"}
                      </span>
                    </td>
                    <td className="py-4 text-center font-mono font-bold text-sm text-[var(--text)]">
                      {formatNumber(v.total_swaps)}
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-sm text-[var(--accent)]">
                      {v.total_volume_sol.toFixed(2)} SOL
                    </td>
                    <td className="py-4 text-right pr-4 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
                      <Link to={`/profile/${v.creator}`} className="hover:underline flex items-center justify-end gap-1.5">
                        {truncateAddress(v.creator, 4)} <ArrowRight size={10} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
