import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Layers, BarChart3, Coins, Settings, TrendingUp, TrendingDown, ExternalLink, Plus,
  PieChart as PieIcon, Wallet,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ClientOnly } from "@/components/layout/ClientOnly";
import { useRevenueShare, useUpdatePlatformConfig } from "@/hooks/useTherProgram";
import { useVaults, usePlatformConfig } from "@/hooks/useVaults";
import type { Vault } from "@/types";
import { formatNumber, gradientFromAddress, truncateAddress } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/components/ui/UserLink";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ther" },
      { name: "description", content: "Manage your vaults and revenue claims." },
    ],
  }),
  component: DashboardPage,
});

const LAMPORTS = 1_000_000_000;

type ProfileData = {
  username?: string;
  avatar_url?: string;
};

function DashboardPage() {
  return (
    <main className="min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-8">
      <ClientOnly fallback={<div className="h-64" />}>
        <DashboardInner />
      </ClientOnly>
    </main>
  );
}

function DashboardInner() {
  const { connected, publicKey } = useWallet();
  const [tab, setTab] = useState<"vaults" | "analytics" | "revenue" | "settings">("vaults");

  if (!connected || !publicKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Wallet size={36} className="text-[var(--accent)] mb-4" />
        <h1 className="text-2xl font-display font-bold mb-2">Connect your wallet</h1>
        <p className="text-sm font-mono text-[var(--text-muted)] mb-6">
          Manage your vaults and claim revenue
        </p>
        <WalletMultiButton />
      </div>
    );
  }

  const wallet = publicKey.toBase58();
  const profile = useUserProfile(wallet);
  const username = profile?.username;
  const avatarUrl = profile?.avatar_url;
  const { vaults: allVaults } = useVaults();
  const myVaults = allVaults.filter((v) => v.creator.toLowerCase() === wallet.toLowerCase());
  
  const totalEarned = myVaults.reduce(
    (acc, v) =>
      acc +
      v.revenue_shares.reduce(
        (a, r) => a + r.total_claimed_lamports + r.accumulated_lamports,
        0,
      ),
    0,
  );
  const totalUnclaimed = myVaults.reduce(
    (acc, v) => acc + v.revenue_shares.reduce((a, r) => a + r.accumulated_lamports, 0),
    0,
  );
  const totalSwaps = myVaults.reduce((acc, v) => acc + v.total_swaps, 0);

  const TABS = [
    { id: "vaults", label: "My Vaults", icon: Layers },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "revenue", label: "Revenue", icon: Coins },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <>
      <GlassCard className="mb-6">
        <div className="flex items-center gap-6 flex-wrap">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username || "Avatar"}
              className="w-16 h-16 rounded-full flex-shrink-0 object-cover border border-[var(--text)]/10 shadow-md"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex-shrink-0"
              style={{ background: gradientFromAddress(wallet) }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-display font-bold text-[var(--text)]">
                {username || "Anonymous User"}
              </h2>
              <Link
                to="/profile/$wallet"
                params={{ wallet }}
                className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 font-mono"
              >
                View Profile <ExternalLink size={10} />
              </Link>
            </div>
            <div className="font-mono text-xs text-[var(--text-muted)] truncate mt-1">
              {truncateAddress(wallet, 6)}
            </div>
            <div className="flex gap-6 mt-2 flex-wrap">
              <Stat icon={<Coins size={14} />} value={`${(totalEarned / LAMPORTS).toFixed(2)} SOL`} label="Earned" />
              <Stat icon={<Layers size={14} />} value={`${myVaults.length}`} label="Vaults" />
              <Stat icon={<TrendingUp size={14} />} value={formatNumber(totalSwaps)} label="Swaps" />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] backdrop-blur-xl mb-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-medium transition-all",
                active
                  ? "bg-[var(--text)] text-[var(--bg)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]",
              )}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "vaults" && (
        <div className="flex flex-col gap-4">
          {myVaults.length === 0 ? (
            <GlassCard className="text-center py-16">
              <Layers size={36} className="text-[var(--accent)] mx-auto mb-3" />
              <h2 className="font-display font-bold text-xl mb-2">No vaults yet</h2>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-2xl bg-[var(--accent)] text-black font-bold font-display"
              >
                <Plus size={16} /> Create your first vault
              </Link>
            </GlassCard>
          ) : (
            myVaults.map((v) => (
              <GlassCard key={v.id}>
                <div className="flex items-center gap-4 flex-wrap">
                  <img src={v.image_url} alt={v.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-[var(--text)]">{v.name}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono text-[var(--text-muted)]">
                      <TrendingUp size={12} className="text-[var(--green)]" />
                      +{formatNumber(v.total_swaps)} 24h swaps
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-[var(--accent)]">
                      {(v.revenue_shares.reduce((a, r) => a + r.accumulated_lamports, 0) / LAMPORTS).toFixed(3)} SOL
                    </div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">unclaimed</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to="/vault/$id"
                      params={{ id: v.id }}
                      className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <Link
                      to="/vault/$id"
                      params={{ id: v.id }}
                      className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <PieIcon size={14} />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {tab === "revenue" && <RevenueTab vaults={myVaults} totalUnclaimed={totalUnclaimed} />}

      {tab === "analytics" && (
        <GlassCard className="text-center py-16">
          <BarChart3 size={36} className="text-[var(--accent)] mx-auto mb-3" />
          <div className="font-display font-bold text-xl mb-1">Analytics coming soon</div>
          <p className="text-sm font-mono text-[var(--text-muted)]">
            Detailed swap charts, volume breakdowns, and depth history.
          </p>
        </GlassCard>
      )}

      {tab === "settings" && <PlatformSettingsSection wallet={wallet} />}
    </>
  );
}

function RevenueTab({
  vaults, totalUnclaimed,
}: { vaults: Vault[]; totalUnclaimed: number }) {
  const { claim, loading } = useRevenueShare();
  return (
    <div className="flex flex-col gap-4">
      <GlassCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-4xl font-display font-bold text-[var(--accent)]">
              {(totalUnclaimed / LAMPORTS).toFixed(3)} SOL
            </div>
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Unclaimed across all vaults
            </div>
          </div>
          {totalUnclaimed > 0 && (
            <button
              type="button"
              onClick={() => vaults.forEach((v) => claim(v.pubkey))}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--green)] text-black font-bold font-display shadow-[0_4px_20px_rgba(0,212,170,0.3)] disabled:opacity-50"
            >
              <Coins size={16} /> Claim All
            </button>
          )}
        </div>
      </GlassCard>

      {vaults.map((v) => {
        const unclaimed = v.revenue_shares.reduce((a, r) => a + r.accumulated_lamports, 0);
        return (
          <GlassCard key={v.id}>
            <div className="flex items-center gap-4 flex-wrap">
              <img src={v.image_url} alt={v.name} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold truncate">{v.name}</div>
                <div className="text-xs font-mono text-[var(--text-muted)]">
                  {(unclaimed / LAMPORTS).toFixed(4)} SOL accumulated
                </div>
              </div>
              <button
                type="button"
                onClick={() => claim(v.pubkey)}
                disabled={loading || unclaimed === 0}
                className={`px-4 py-2 rounded-xl text-sm font-mono font-bold bg-[var(--green)]/15 text-[var(--green)] disabled:opacity-40 ${
                  unclaimed > 0 ? "animate-pulse-dot shadow-[0_0_12px_var(--green)]" : ""
                }`}
              >
                Claim
              </button>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--accent)]">{icon}</span>
      <div>
        <div className="font-mono font-bold text-sm text-[var(--text)]">{value}</div>
        <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

function PlatformSettingsSection({ wallet }: { wallet: string }) {
  const { config, loading: configLoading } = usePlatformConfig();
  const { updateConfig, loading: updating } = useUpdatePlatformConfig();

  const [platformWallet, setPlatformWallet] = useState("");
  const [creationFee, setCreationFee] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [creatorFee, setCreatorFee] = useState("");
  const [minDepositBps, setMinDepositBps] = useState("");

  const [loaded, setLoaded] = useState(false);

  // Sync state with loaded on-chain platform config
  if (config && !loaded) {
    setPlatformWallet(config.platformWallet);
    setCreationFee(config.creationFee.toString());
    setPlatformFee(config.platformFee.toString());
    setCreatorFee(config.creatorFee.toString());
    setMinDepositBps(config.minimumDepositBps.toString());
    setLoaded(true);
  }

  const isAuthority = config?.authority === wallet;

  // Total Swap Fee is dynamically recalculated
  const totalSwapFee = (Number(platformFee) || 0) + (Number(creatorFee) || 0);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthority) {
      toast.error("Only the platform authority can modify settings.");
      return;
    }

    try {
      const success = await updateConfig({
        platformWallet,
        creationFee: Number(creationFee),
        swapFee: totalSwapFee,
        platformFee: Number(platformFee),
        creatorFee: Number(creatorFee),
        minimumDepositBps: Number(minDepositBps),
      });

      if (success) {
        toast.success("Platform settings updated on-chain!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update platform configuration.");
    }
  };

  if (configLoading) {
    return (
      <GlassCard className="py-16 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[var(--accent)] animate-spin mx-auto mb-3" />
        <p className="text-sm font-mono text-[var(--text-muted)]">Fetching on-chain configuration...</p>
      </GlassCard>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--text)]">Platform Settings</h3>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              On-chain configuration for fees, routing, and parameters
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display font-semibold text-[var(--text-muted)]">
              Platform Wallet Address
            </label>
            <input
              type="text"
              required
              disabled={!isAuthority}
              value={platformWallet}
              onChange={(e) => setPlatformWallet(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display font-semibold text-[var(--text-muted)]">
                Vault Creation Fee (SOL)
              </label>
              <input
                type="number"
                step="0.001"
                required
                disabled={!isAuthority}
                value={creationFee}
                onChange={(e) => setCreationFee(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-display font-semibold text-[var(--text-muted)]">
                Min Deposit Basis Points (BPS)
              </label>
              <input
                type="number"
                required
                disabled={!isAuthority}
                value={minDepositBps}
                onChange={(e) => setMinDepositBps(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
                placeholder="100 = 1%"
              />
            </div>
          </div>

          <div className="border-t border-[var(--text)]/10 my-2 pt-4">
            <h4 className="text-sm font-display font-semibold mb-3 text-[var(--text)]">Swap Fee Distribution</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display font-semibold text-[var(--text-muted)]">
                  Platform Portion (SOL)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  disabled={!isAuthority}
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display font-semibold text-[var(--text-muted)]">
                  Creator Portion (SOL)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  disabled={!isAuthority}
                  value={creatorFee}
                  onChange={(e) => setCreatorFee(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60"
                />
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--text)]/5 flex items-center justify-between">
              <span className="text-xs font-display font-medium text-[var(--text-muted)]">
                Total Swap Fee Charged to Users:
              </span>
              <span className="text-sm font-mono font-bold text-[var(--accent)]">
                {totalSwapFee.toFixed(4)} SOL
              </span>
            </div>
          </div>

          {isAuthority ? (
            <button
              type="submit"
              disabled={updating}
              className="w-full mt-4 py-3 px-6 rounded-xl bg-[var(--accent)] text-black font-display font-bold text-sm shadow-[0_4px_20px_rgba(var(--accent-rgb),0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {updating ? "Updating On-Chain..." : "Update Platform Settings"}
            </button>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs font-mono text-amber-400">
              ⚠️ Connected wallet is not the platform authority. Settings are read-only.
            </div>
          )}
        </form>
      </GlassCard>

      <GlassCard className="p-4 bg-[var(--surface)] text-center text-[10px] font-mono text-[var(--text-muted)] border border-[var(--text)]/5">
        Platform Authority: {config?.authority}
      </GlassCard>
    </div>
  );
}

