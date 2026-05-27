import { useState } from "react";
import { Settings, Clock, PieChart, Plus, Wallet, ShieldCheck, X } from "lucide-react";
import type { Vault } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAddRevenueShare, useExtendLock, useRenounceVault } from "@/hooks/useTherProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function CreatorPanel({
  vault,
  onRefresh,
}: {
  vault: Vault;
  onRefresh?: () => void;
}) {
  const { publicKey } = useWallet();
  const isCreator =
    publicKey && publicKey.toBase58().toLowerCase() === vault.creator.toLowerCase();

  const [showRevShareModal, setShowRevShareModal] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [shareBps, setShareBps] = useState("");

  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showRenounceModal, setShowRenounceModal] = useState(false);
  const [extendDays, setExtendDays] = useState("");

  const { addRevenueShare, loading: addingShare } = useAddRevenueShare();
  const { extendLock, loading: extendingLock } = useExtendLock();
  const { renounceVault, loading: renouncingVault } = useRenounceVault();

  if (!isCreator) return null;

  const lockDaysRemaining =
    vault.lock_type === "timed" && !vault.is_renounced
      ? Math.max(0, Math.floor((vault.lock_expiry * 1000 - Date.now()) / 86400000))
      : null;

  async function handleAddRevShare() {
    if (!recipientAddress || !shareBps) {
      toast.error("Please fill in both fields");
      return;
    }

    const bps = Math.round(Number(shareBps) * 100); // Convert percentage to bps
    if (bps <= 0 || bps > vault.unallocated_bps) {
      toast.error(
        `Invalid percentage. Max available: ${(vault.unallocated_bps / 100).toFixed(0)}%`
      );
      return;
    }

    const ok = await addRevenueShare(vault.pubkey, recipientAddress, bps);
    if (ok) {
      setRecipientAddress("");
      setShareBps("");
      setShowRevShareModal(false);
      onRefresh?.();
    }
  }

  async function handleExtendLock() {
    if (!extendDays) {
      toast.error("Please enter the number of days");
      return;
    }

    const days = Math.round(Number(extendDays));
    if (days < 1) {
      toast.error("Minimum extension is 1 day");
      return;
    }

    const seconds = days * 86400;
    const tx = await extendLock(vault.pubkey, seconds);
    if (tx) {
      setExtendDays("");
      setShowExtendModal(false);
      onRefresh?.();
    }
  }

  async function handleRenounce() {
    const tx = await renounceVault(vault.pubkey);
    if (tx) {
      setShowRenounceModal(false);
      onRefresh?.();
    }
  }

  return (
    <>
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-[var(--accent)]" />
          <h3 className="font-display font-semibold text-[var(--text)]">
            Creator Controls
          </h3>
        </div>

        {/* Lock Status Info */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--text)]/5">
          <div className="flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]">
            <Clock size={14} />
            Lock Time
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-[var(--text)]">
              {vault.is_renounced
                ? "Permanent"
                : lockDaysRemaining !== null
                  ? `${lockDaysRemaining} days remaining`
                  : "Unlocked"}
            </span>
            {vault.lock_type === "timed" && !vault.is_renounced && (
              <button
                type="button"
                onClick={() => setShowExtendModal(true)}
                className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all"
              >
                Extend
              </button>
            )}
          </div>
        </div>

        {/* Renounce Status */}
        <div className="flex items-center justify-between py-3 border-b border-[var(--text)]/5">
          <div className="flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]">
            <ShieldCheck size={14} />
            Renounce Status
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-mono font-bold ${vault.is_renounced ? "text-[var(--green)]" : "text-[var(--text)]"}`}
            >
              {vault.is_renounced ? "Permanently Renounced" : "Not Renounced"}
            </span>
            {!vault.is_renounced && (
              <button
                type="button"
                onClick={() => setShowRenounceModal(true)}
                className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
              >
                Renounce
              </button>
            )}
          </div>
        </div>

        {/* Revenue Share Management */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]">
            <PieChart size={14} />
            Revenue Shares
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--accent)]">
              {(vault.unallocated_bps / 100).toFixed(0)}% available
            </span>
            {vault.unallocated_bps > 0 && (
              <button
                type="button"
                onClick={() => setShowRevShareModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all"
              >
                <Plus size={12} />
                Add
              </button>
            )}
          </div>
        </div>

        {/* Existing revenue share recipients */}
        {vault.revenue_shares.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {vault.revenue_shares.map((rs) => (
              <div
                key={rs.recipient}
                className="flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--surface-2)] text-xs font-mono"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Wallet size={10} className="text-[var(--text-muted)] flex-shrink-0" />
                  <span className="text-[var(--text)] truncate">
                    {rs.recipient.slice(0, 6)}...{rs.recipient.slice(-4)}
                  </span>
                </div>
                <span className="text-[var(--accent)] font-bold flex-shrink-0">
                  {(rs.share_bps / 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Add Revenue Share Modal */}
      <AnimatePresence>
        {showRevShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRevShareModal(false)}
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
                    Add Revenue Share
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    {(vault.unallocated_bps / 100).toFixed(0)}% unallocated remaining
                  </p>
                </div>
                <button
                  onClick={() => setShowRevShareModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Recipient Wallet Address
                  </label>
                  <input
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkh..."
                    className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Share Percentage (max {(vault.unallocated_bps / 100).toFixed(0)}%)
                  </label>
                  <input
                    type="number"
                    value={shareBps}
                    onChange={(e) => setShareBps(e.target.value)}
                    placeholder="e.g. 10"
                    min="1"
                    max={vault.unallocated_bps / 100}
                    className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  />
                </div>

                <button
                  onClick={handleAddRevShare}
                  disabled={addingShare}
                  className="w-full mt-2 py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-display font-bold text-sm hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {addingShare ? "Adding..." : "Add Revenue Share"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Extend Lock Modal */}
      <AnimatePresence>
        {showExtendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExtendModal(false)}
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
                    Extend Lock Duration
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    Timed locks can only be extended, not shortened.
                  </p>
                </div>
                <button
                  onClick={() => setShowExtendModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Additional Days to Lock
                  </label>
                  <input
                    type="number"
                    value={extendDays}
                    onChange={(e) => setExtendDays(e.target.value)}
                    placeholder="e.g. 30"
                    min="1"
                    className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  />
                </div>

                <button
                  onClick={handleExtendLock}
                  disabled={extendingLock}
                  className="w-full mt-2 py-3 rounded-xl bg-[var(--accent)] text-white font-display font-bold text-sm hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {extendingLock ? "Extending..." : "Extend Lock Time"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Renounce Vault Modal */}
      <AnimatePresence>
        {showRenounceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRenounceModal(false)}
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
                  <h3 className="text-lg font-display font-bold text-red-500">
                    Renounce Vault?
                  </h3>
                  <p className="text-xs font-mono text-red-400">
                    WARNING: This action is permanent and irreversible.
                  </p>
                </div>
                <button
                  onClick={() => setShowRenounceModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-mono">
                  Renouncing this vault will permanently lock all tokens inside forever. You will no longer be able to withdraw them, extend lock times, or manage vault options. Ensure this is exactly what you intend.
                </p>

                <button
                  onClick={handleRenounce}
                  disabled={renouncingVault}
                  className="w-full mt-2 py-3 rounded-xl bg-red-500 text-white font-display font-bold text-sm hover:bg-red-600 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {renouncingVault ? "Renouncing..." : "I Understand, Renounce Permanently"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

