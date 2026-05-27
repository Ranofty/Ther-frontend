import { useState, useEffect, useCallback } from "react";
import { PieChart as PieIcon, Wallet, Coins, Plus, X, Clock, AlertTriangle, Lock, Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Vault, RevenueShare } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRevenueShare, useAddRevenueShare } from "@/hooks/useTherProgram";
import { getReadOnlyProgram, connection, PROGRAM_ID } from "@/lib/solana";
import { PublicKey } from "@solana/web3.js";
import { UserLink } from "@/components/ui/UserLink";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Buffer } from "buffer";

const LAMPORTS = 1_000_000_000;

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "—";
  }
}

export function RevenueShareCard({
  vault: initialVault,
  onRefresh,
}: {
  vault: Vault;
  onRefresh?: () => void;
}) {
  const { publicKey } = useWallet();
  const connected = publicKey?.toBase58();

  // On-chain state
  const [onChainShares, setOnChainShares] = useState<RevenueShare[]>([]);
  const [onChainVault, setOnChainVault] = useState<any>(null);
  const [loadingOnChain, setLoadingOnChain] = useState(true);

  // Fetch from on-chain Solana blockchain
  const fetchOnChainData = useCallback(async () => {
    try {
      setLoadingOnChain(true);
      const program = getReadOnlyProgram();
      const vaultPubkey = new PublicKey(initialVault.pubkey);

      // 1. Fetch vault account
      const account = await program.account.vault.fetch(vaultPubkey);
      setOnChainVault(account);

      // 2. Fetch revenue share accounts belonging to this vault manually to handle legacy buffer sizes
      const discriminator = Buffer.from([55, 40, 228, 7, 139, 52, 180, 110]);
      const revAccounts = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [
          { memcmp: { offset: 0, bytes: discriminator.toString("base64"), encoding: "base64" as any } },
          { memcmp: { offset: 8, bytes: initialVault.pubkey } },
        ],
      });

      const revShares: RevenueShare[] = [];
      for (const revAcc of revAccounts) {
        const data = revAcc.account.data;
        try {
          let offset = 8;
          const vaultPubkey = new PublicKey(data.slice(offset, offset + 32));
          offset += 32;
          const recipientPubkey = new PublicKey(data.slice(offset, offset + 32));
          offset += 32;
          const shareBps = data.readUInt16LE(offset);
          offset += 2;
          const accumulatedLamports = Number(data.readBigUInt64LE(offset));
          offset += 8;
          
          let totalClaimedLamports = 0;
          if (data.length >= offset + 8) {
            totalClaimedLamports = Number(data.readBigUInt64LE(offset));
            offset += 8;
          }

          let addedAt = 0;
          if (data.length >= offset + 8) {
            addedAt = Number(data.readBigInt64LE(offset));
            offset += 8;
          }

          revShares.push({
            recipient: recipientPubkey.toBase58(),
            share_bps: shareBps,
            accumulated_lamports: accumulatedLamports,
            total_claimed_lamports: totalClaimedLamports,
            added_at: addedAt > 0 ? new Date(addedAt * 1000).toISOString() : new Date().toISOString(),
          });
        } catch (e) {
          console.error("Failed to decode legacy revenue share:", e);
        }
      }

      setOnChainShares(revShares);
    } catch (err) {
      console.error("Failed to fetch on-chain revenue share data:", err);
    } finally {
      setLoadingOnChain(false);
    }
  }, [initialVault.pubkey]);

  // Fetch on mount or when the initialVault prop changes
  useEffect(() => {
    fetchOnChainData();
  }, [initialVault, fetchOnChainData]);

  // Use on-chain live data if loaded, otherwise fallback to initialVault props
  const creator = onChainVault ? onChainVault.creator.toBase58() : initialVault.creator;
  const unallocatedBps = onChainVault ? onChainVault.unallocatedBps : initialVault.unallocated_bps;
  const revenueShares = onChainShares.length > 0 ? onChainShares : initialVault.revenue_shares;

  const isCreator = publicKey && publicKey.toBase58().toLowerCase() === creator.toLowerCase();

  const { claim, loading: claiming } = useRevenueShare();
  const { addRevenueShare, loading: addingShare } = useAddRevenueShare();

  const [showAddModal, setShowAddModal] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [percentage, setPercentage] = useState("");

  // Computed metrics
  const totalAllocatedBps = 10000 - unallocatedBps;
  const creatorImplicitBps = unallocatedBps;
  const totalClaimedAllTime = revenueShares.reduce(
    (acc, r) => acc + r.total_claimed_lamports,
    0,
  );
  const totalAccumulated = revenueShares.reduce(
    (acc, r) => acc + r.accumulated_lamports,
    0,
  );

  // Filtered shares
  const explicitShares = revenueShares.filter((rs) => rs.share_bps > 0);
  const creatorEntry = revenueShares.find(
    (rs) => rs.recipient.toLowerCase() === creator.toLowerCase()
  );
  const creatorExplicitBps = creatorEntry ? creatorEntry.share_bps : 0;
  const totalAvailableBps = unallocatedBps + creatorExplicitBps;

  // Warning calculations
  const allocationPercent = totalAllocatedBps / 100;
  const isApproachingFull = allocationPercent >= 80 && unallocatedBps > 0;
  const isFullyAllocated = unallocatedBps === 0;

  async function handleAddRecipient() {
    if (!recipient || !percentage) {
      toast.error("Please fill in both fields");
      return;
    }

    const pct = Number(percentage);
    const bps = Math.round(pct * 100);
    if (bps <= 0) {
      toast.error("Percentage must be greater than 0");
      return;
    }
    if (bps > totalAvailableBps) {
      toast.error(
        `Exceeds remaining allocation. Max: ${(totalAvailableBps / 100).toFixed(2)}%`
      );
      return;
    }

    const ok = await addRevenueShare(initialVault.pubkey, recipient, bps);
    if (ok) {
      setRecipient("");
      setPercentage("");
      setShowAddModal(false);
      fetchOnChainData();
      onRefresh?.();
    }
  }

  async function handleClaim() {
    const ok = await claim(initialVault.pubkey);
    if (ok) {
      fetchOnChainData();
      onRefresh?.();
    }
  }

  // Live remaining after typing new percentage
  const typedBps = Math.round((Number(percentage) || 0) * 100);
  const remainingAfterAdd = Math.max(0, totalAvailableBps - typedBps);

  return (
    <>
      <GlassCard>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center relative">
              <PieIcon size={16} className="text-[var(--accent)]" />
              {loadingOnChain && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-semibold text-[var(--text)] text-sm">Revenue Share</h3>
                {loadingOnChain && <Loader2 size={10} className="animate-spin text-[var(--text-muted)]" />}
              </div>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">
                0.002 SOL per swap distributed by BPS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isFullyAllocated ? (
              <span className="flex items-center gap-1 font-mono text-[10px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20">
                <Lock size={10} /> 100% Allocated
              </span>
            ) : (
              <span className="font-mono text-[10px] bg-[var(--accent)]/10 text-[var(--accent)] px-2.5 py-1 rounded-full">
                {(unallocatedBps / 100).toFixed(2)}% unallocated
              </span>
            )}
            
            {/* ADD BUTTON HERE */}
            {isCreator && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-display font-bold bg-[var(--accent)] text-black hover:shadow-[0_0_16px_var(--accent)] transition-all"
              >
                <Plus size={12} /> Add
              </button>
            )}
          </div>
        </div>

        {/* Creator Implicit Share */}
        {creatorImplicitBps > 0 && (
          <div className="flex flex-col gap-1.5 py-3 px-3 mb-3 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                  <Wallet size={10} className="text-[var(--accent)]" />
                </div>
                <UserLink
                  walletAddress={creator}
                  truncateLen={4}
                  className="text-xs truncate text-[var(--text)]"
                />
                <span className="text-[10px] font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                  Creator
                </span>
              </div>
              <span className="font-mono text-sm text-[var(--accent)] font-bold flex-shrink-0">
                {(creatorImplicitBps / 100).toFixed(2)}%
              </span>
            </div>
            <p className="text-[10px] font-mono text-[var(--text-muted)] ml-7">
              Implicit share — receives all unallocated swap fees by default
            </p>
            {/* Creator's claimable from their 0-bps entry */}
            {creatorEntry && (
              <div className="flex items-center justify-between ml-7 mt-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                  <Coins size={10} className="text-[var(--green)]" />
                  {(creatorEntry.accumulated_lamports / LAMPORTS).toFixed(6)} SOL claimable
                  <span className="text-[var(--text-muted)]/50 mx-1">·</span>
                  {(creatorEntry.total_claimed_lamports / LAMPORTS).toFixed(4)} SOL claimed
                </div>
                {connected === creator && creatorEntry.accumulated_lamports > 0 && (
                  <button
                    type="button"
                    onClick={handleClaim}
                    disabled={claiming}
                    className="px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-[var(--green)]/15 text-[var(--green)] shadow-[0_0_12px_var(--green)] animate-pulse-dot disabled:opacity-40 transition-all hover:bg-[var(--green)] hover:text-black"
                  >
                    Claim
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Explicit Revenue Share Entries */}
        {explicitShares.length === 0 && creatorImplicitBps === 10000 ? (
          <div className="text-center py-6 text-xs font-mono text-[var(--text-muted)]">
            No partners added yet — creator receives 100% of swap fees.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--text)]/5">
            {explicitShares.map((rs) => {
              const isMe = connected === rs.recipient;
              const solAccumulated = rs.accumulated_lamports / LAMPORTS;
              const solClaimed = rs.total_claimed_lamports / LAMPORTS;
              return (
                <div
                  key={rs.recipient}
                  className="flex flex-col gap-1.5 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0">
                        <Wallet size={10} className="text-[var(--text-muted)]" />
                      </div>
                      <UserLink
                        walletAddress={rs.recipient}
                        truncateLen={4}
                        className="text-xs truncate text-[var(--text)]"
                      />
                      {rs.recipient.toLowerCase() === creator.toLowerCase() && (
                        <span className="text-[10px] font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          Creator
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-sm text-[var(--accent)] font-bold flex-shrink-0">
                      {(rs.share_bps / 100).toFixed(2)}%
                    </span>
                  </div>

                  {/* Detail row: accumulated, claimed, date */}
                  <div className="flex items-center justify-between ml-7 text-[10px] font-mono text-[var(--text-muted)]">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Coins size={10} className="text-[var(--green)]" />
                        {solAccumulated.toFixed(6)} SOL
                      </span>
                      <span className="text-[var(--text-muted)]/40">·</span>
                      <span>{solClaimed.toFixed(4)} claimed</span>
                      <span className="text-[var(--text-muted)]/40">·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={9} />
                        {formatDate(rs.added_at)}
                      </span>
                    </div>
                    {isMe && rs.accumulated_lamports > 0 && (
                      <button
                        type="button"
                        onClick={handleClaim}
                        disabled={claiming}
                        className="px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-[var(--green)]/15 text-[var(--green)] shadow-[0_0_12px_var(--green)] animate-pulse-dot disabled:opacity-40 transition-all hover:bg-[var(--green)] hover:text-black"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--text)]/5 text-[10px] font-mono text-[var(--text-muted)]">
          <span>
            {totalAccumulated > 0
              ? `${(totalAccumulated / LAMPORTS).toFixed(6)} SOL unclaimed`
              : "No unclaimed revenue"}
          </span>
          <span>
            Total claimed: {(totalClaimedAllTime / LAMPORTS).toFixed(4)} SOL
          </span>
        </div>
      </GlassCard>

      {/* ─── Add Recipient Modal ─── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--bg)]/90 border border-[var(--text)]/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold text-[var(--text)]">
                    Add Revenue Recipient
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                    Permanent & immutable — cannot be edited or removed
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Wallet Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Recipient Wallet Address
                  </label>
                  <input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkh..."
                    className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  />
                </div>

                {/* Percentage Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Share Percentage
                  </label>
                  <input
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder={`Max ${(totalAvailableBps / 100).toFixed(2)}%`}
                    min="0.01"
                    step="0.01"
                    max={totalAvailableBps / 100}
                    className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  />
                </div>

                {/* Live BPS Breakdown */}
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--text)]/5">
                  <div className="flex justify-between text-[10px] font-mono mb-1.5">
                    <span className="text-[var(--text-muted)]">Currently allocated</span>
                    <span className="text-[var(--text)]">{(totalAllocatedBps / 100).toFixed(2)}%</span>
                  </div>
                  {typedBps > 0 && (
                    <div className="flex justify-between text-[10px] font-mono mb-1.5">
                      <span className="text-[var(--accent)]">+ New allocation</span>
                      <span className="text-[var(--accent)]">{(typedBps / 100).toFixed(2)}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] font-mono pt-1.5 border-t border-[var(--text)]/5">
                    <span className="text-[var(--text-muted)]">Creator keeps (unallocated)</span>
                    <span className={`font-bold ${remainingAfterAdd === 0 ? "text-red-400" : "text-[var(--green)]"}`}>
                      {(remainingAfterAdd / 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Warnings */}
                {typedBps > totalAvailableBps && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400">
                    <AlertTriangle size={14} />
                    Exceeds remaining allocation ({(totalAvailableBps / 100).toFixed(2)}% available)
                  </div>
                )}

                {remainingAfterAdd === 0 && typedBps > 0 && typedBps <= totalAvailableBps && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
                    <AlertTriangle size={14} />
                    This will allocate 100% — creator gets 0% of future swap fees. No more addresses can ever be added.
                  </div>
                )}

                {isApproachingFull && remainingAfterAdd > 0 && typedBps > 0 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
                    <AlertTriangle size={14} />
                    Approaching full allocation — only {(remainingAfterAdd / 100).toFixed(2)}% will remain for the creator.
                  </div>
                )}

                <button
                  onClick={handleAddRecipient}
                  disabled={addingShare || typedBps > totalAvailableBps || typedBps <= 0}
                  className="w-full mt-2 py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-display font-bold text-sm hover:opacity-95 active:scale-[0.98] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  {addingShare ? "Adding permanently..." : "Add Recipient (Permanent)"}
                </button>

                <p className="text-[9px] font-mono text-[var(--text-muted)] text-center leading-relaxed">
                  Once added, this allocation is locked forever by the smart contract.
                  No editing. No removing. The rent cost is ≈ 0.00157 SOL.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
