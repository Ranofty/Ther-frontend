import { useEffect } from "react";
import { Settings, Repeat, Info, Wallet } from "lucide-react";
import type { Vault } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { TokenSelector } from "@/components/ui/TokenSelector";
import { useSwapStore } from "@/store/useSwapStore";
import { useSwap } from "@/hooks/useTherProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatNumber } from "@/lib/utils";
import { saveSwapEvent } from "@/lib/supabase";

export function SwapPanel({
  vault,
  onSwapSuccess,
}: {
  vault: Vault;
  onSwapSuccess?: (amount: number, tokenInMint: string, tokenOutMint: string, tx: string) => void;
}) {
  const { tokenIn, tokenOut, amount, setTokenIn, setTokenOut, setAmount, flipTokens, reset } =
    useSwapStore();
  const { swap, loading } = useSwap();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    // Initialize on vault change
    reset();
    if (vault.tokens.length >= 2) {
      setTokenIn(vault.tokens[0]);
      setTokenOut(vault.tokens[1]);
    }
  }, [vault.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const insufficientVault = tokenOut && Number(amount) > tokenOut.vault_balance;
  const disabled =
    !connected || !tokenIn || !tokenOut || !amount || Number(amount) <= 0 || insufficientVault || loading;

  async function handleSwap() {
    if (!tokenIn || !tokenOut || !publicKey) return;
    const swapAmount = Number(amount);
    const tx = await swap({
      vaultPubkey: vault.pubkey,
      tokenInMint: tokenIn.mint,
      tokenOutMint: tokenOut.mint,
      amount: swapAmount,
      tokenInDecimals: tokenIn.decimals,
    });
    if (tx) {
      setAmount("");
      
      // Save swap event off-chain (resilient to both Supabase and localStorage sandbox)
      try {
        await saveSwapEvent({
          id: tx,
          vault_pubkey: vault.pubkey,
          vault_name: vault.name,
          user_wallet: publicKey.toBase58(),
          token_in_mint: tokenIn.mint,
          token_in_symbol: tokenIn.symbol,
          token_out_mint: tokenOut.mint,
          token_out_symbol: tokenOut.symbol,
          amount: swapAmount,
          fee_sol: 0.007,
        });
      } catch (err) {
        console.error("Failed to save swap event off-chain:", err);
      }

      if (onSwapSuccess) {
        onSwapSuccess(swapAmount, tokenIn.mint, tokenOut.mint, tx);
      }
    }
  }

  return (
    <GlassCard blur="3xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-lg text-[var(--text)]">SWAP</h3>
        <button
          type="button"
          className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          aria-label="Swap settings"
        >
          <Settings size={16} />
        </button>
      </div>

      <label className="text-xs font-mono text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
        You send
      </label>
      <TokenSelector tokens={vault.tokens} selected={tokenIn} onChange={setTokenIn} />
      <input
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
        className="w-full bg-[var(--bg)]/80 backdrop-blur-xl rounded-2xl py-4 px-4 mt-2 text-2xl font-mono font-bold outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all"
      />

      <div className="flex justify-center my-3">
        <button
          type="button"
          onClick={flipTokens}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface-2)] hover:bg-[var(--surface)] cursor-pointer transition-all duration-300 hover:rotate-180"
          aria-label="Flip tokens"
        >
          <Repeat size={16} />
        </button>
      </div>

      <label className="text-xs font-mono text-[var(--text-muted)] mb-2 block uppercase tracking-wider">
        You receive
      </label>
      <TokenSelector tokens={vault.tokens} selected={tokenOut} onChange={setTokenOut} />
      <div className="w-full bg-[var(--bg)]/80 backdrop-blur-xl rounded-2xl py-4 px-4 mt-2 text-2xl font-mono font-bold text-[var(--accent)]">
        {amount || "0"}
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-4">
        <Info size={12} />
        <span>0.007 SOL swap fee</span>
      </div>
      {tokenOut && (
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-1">
          <Wallet size={12} />
          <span>
            Available: {formatNumber(tokenOut.vault_balance)} {tokenOut.symbol}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleSwap}
        disabled={disabled}
        className="w-full mt-4 py-4 rounded-2xl font-display font-bold text-black bg-[var(--accent)] text-base shadow-[0_4px_20px_rgba(0,229,255,0.3)] hover:shadow-[0_8px_32px_rgba(0,229,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Swapping..."
          : !connected
            ? "Connect Wallet"
            : insufficientVault
              ? "Insufficient vault balance"
              : "Swap"}
      </button>
    </GlassCard>
  );
}
