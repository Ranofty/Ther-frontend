import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import {
  getProgram,
  getVaultTokenPDA,
} from "@/lib/solana";

/**
 * Hook for depositing tokens into a vault.
 * Anyone can call this — no creator restriction.
 */
export function useDepositTokens() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function depositTokens(args: {
    vaultPubkey: string;
    tokenMint: string;
    amount: number;
  }) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vault = new PublicKey(args.vaultPubkey);
      const tokenMint = new PublicKey(args.tokenMint);
      const amount = new BN(args.amount);

      const [vaultTokenAccount] = getVaultTokenPDA(vault, tokenMint);
      const userTokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);

      const tx = await program.methods
        .depositTokens(amount)
        .accounts({
          vault,
          tokenMint,
          userTokenAccount,
          vaultTokenAccount,
          user: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      toast.success(`Deposited ${args.amount.toLocaleString()} tokens! TX: ${tx.slice(0, 8)}...`);
      return true;
    } catch (e: any) {
      console.error("Deposit error:", e);
      const msg = e?.message || "Deposit failed";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { depositTokens, loading };
}
