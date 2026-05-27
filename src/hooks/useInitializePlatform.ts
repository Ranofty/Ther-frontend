import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
  getProgram,
  getPlatformConfigPDA,
} from "@/lib/solana";

/**
 * Admin-only hook for initializing the platform config.
 * Should only be called once by the deployer wallet.
 */
export function useInitializePlatform() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function initializePlatform() {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const [platformConfig] = getPlatformConfigPDA();

      const tx = await program.methods
        .initializePlatform()
        .accounts({
          platformConfig,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast.success(`Platform initialized! TX: ${tx.slice(0, 8)}...`);
      return true;
    } catch (e: any) {
      console.error("Initialize platform error:", e);
      const msg = e?.message || "Failed to initialize platform";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function updatePlatform(args?: {
    platformWallet?: string;
    creationFee?: number;
    swapFee?: number;
    platformFee?: number;
    creatorFee?: number;
    minimumDepositBps?: number;
  }) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const [platformConfig] = getPlatformConfigPDA();

      const tx = await program.methods
        .updatePlatform(
          new PublicKey(args?.platformWallet || "Fee8FnSg5K9mWBRfAQ1XiTNdJLUFZ3KSEkt1tPwB7jx"),
          new BN(args?.creationFee ?? 50_000_000),
          new BN(args?.swapFee ?? 7_000_000),
          new BN(args?.platformFee ?? 5_000_000),
          new BN(args?.creatorFee ?? 2_000_000),
          args?.minimumDepositBps ?? 100,
        )
        .accounts({
          platformConfig,
          authority: publicKey,
        })
        .rpc();

      toast.success(`Platform updated! TX: ${tx.slice(0, 8)}...`);
      return true;
    } catch (e: any) {
      console.error("Update platform error:", e);
      const msg = e?.message || "Failed to update platform";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { initializePlatform, updatePlatform, loading };
}
