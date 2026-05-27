import { useState } from "react";
import { ArrowDownToLine, ChevronDown, ChevronUp } from "lucide-react";
import type { Vault } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { useDepositTokens } from "@/hooks/useTherProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatNumber } from "@/lib/utils";
import { toast } from "sonner";

export function DepositSection({
  vault,
  onDepositSuccess,
}: {
  vault: Vault;
  onDepositSuccess?: () => void;
}) {
  const { connected } = useWallet();
  const { deposit, loading } = useDepositTokens();
  const [expanded, setExpanded] = useState(false);
  const [selectedMint, setSelectedMint] = useState(vault.tokens[0]?.mint || "");
  const [amount, setAmount] = useState("");

  const selectedToken = vault.tokens.find((t) => t.mint === selectedMint);

  async function handleDeposit() {
    if (!selectedToken || !amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const tx = await deposit({
      vaultPubkey: vault.pubkey,
      tokenMint: selectedToken.mint,
      amount: Number(amount),
      decimals: selectedToken.decimals,
    });

    if (tx) {
      setAmount("");
      onDepositSuccess?.();
    }
  }

  return (
    <GlassCard>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <ArrowDownToLine size={16} className="text-[var(--accent)]" />
          <h3 className="font-display font-semibold text-[var(--text)]">
            Deposit Tokens
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Anyone can deposit
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-[var(--text-muted)]" />
          ) : (
            <ChevronDown size={16} className="text-[var(--text-muted)]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
          <p className="text-xs font-mono text-[var(--text-muted)]">
            Deposit tokens to increase the vault's liquidity depth. This helps support swap availability.
          </p>

          {/* Token Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Select Token
            </label>
            <select
              value={selectedMint}
              onChange={(e) => setSelectedMint(e.target.value)}
              className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-sm outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)] appearance-none cursor-pointer"
            >
              {vault.tokens.map((t) => (
                <option key={t.mint} value={t.mint}>
                  {t.symbol} — {formatNumber(t.vault_balance)} in vault
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Amount to Deposit
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-lg font-bold outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
            />
            {selectedToken && (
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Current vault balance: {formatNumber(selectedToken.vault_balance)} {selectedToken.symbol}
              </span>
            )}
          </div>

          {/* Deposit Button */}
          <button
            type="button"
            onClick={handleDeposit}
            disabled={!connected || loading || !amount || Number(amount) <= 0}
            className="w-full py-3 rounded-xl font-display font-bold text-sm bg-[var(--green)]/15 text-[var(--green)] border border-[var(--green)]/20 hover:bg-[var(--green)]/25 hover:shadow-[0_0_20px_rgba(0,212,170,0.15)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? "Depositing..."
              : !connected
                ? "Connect Wallet to Deposit"
                : `Deposit ${selectedToken?.symbol || "Tokens"}`}
          </button>
        </div>
      )}
    </GlassCard>
  );
}
