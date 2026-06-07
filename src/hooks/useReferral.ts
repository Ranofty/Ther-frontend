import { useState, useEffect, useCallback } from "react";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram, getReadOnlyProgram, getReferralPDA } from "@/lib/solana";
import { toast } from "sonner";

/**
 * Capture referral code (?ref=WALLET) from URL and store in sessionStorage.
 */
export function useReferralCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      try {
        // Validate it's a valid Solana PublicKey
        new PublicKey(ref);
        sessionStorage.setItem("ther_referrer", ref);
        console.log("Ther: Captured referrer", ref);
      } catch (err) {
        console.warn("Ther: Invalid referral wallet in URL", ref);
      }
    }
  }, []);

  const getReferrer = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("ther_referrer");
  }, []);

  return { getReferrer };
}

/**
 * Generate personal referral link for a vault.
 */
export function useReferralLink(vaultId?: string) {
  const { publicKey } = useWallet();
  const [link, setLink] = useState("");

  useEffect(() => {
    if (publicKey) {
      const origin = window.location.origin;
      const path = vaultId ? `/vault/${vaultId}` : "";
      setLink(`${origin}${path}?ref=${publicKey.toBase58()}`);
    } else {
      setLink("");
    }
  }, [publicKey, vaultId]);

  return link;
}

/**
 * Hook to check if user has a referral account, and register one if they have a captured referrer.
 */
export function useRegisterReferral() {
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const { getReferrer } = useReferralCapture();

  const checkAndRegister = useCallback(async () => {
    if (!publicKey || !wallet) return;

    const referrerStr = getReferrer();
    if (!referrerStr) return;

    let referrerPubkey: PublicKey;
    try {
      referrerPubkey = new PublicKey(referrerStr);
    } catch {
      return;
    }

    if (referrerPubkey.equals(publicKey)) {
      // User cannot refer themselves
      return;
    }

    const program = getProgram(wallet);
    const [referralPDA] = getReferralPDA(publicKey);

    setLoading(true);
    try {
      // Check if account already exists
      const acc = await program.account.referralAccount.fetchNullable(referralPDA);
      if (acc) {
        // Already registered on-chain
        sessionStorage.removeItem("ther_referrer"); // Clear session since it's registered
        return;
      }

      // We need to derive the referrer's own referral PDA to look up L2/L3 on-chain
      const [referrerReferralPDA] = getReferralPDA(referrerPubkey);

      toast.info("Registering referral code on-chain...");

      const tx = await program.methods
        .registerReferral()
        .accounts({
          referralAccount: referralPDA,
          user: publicKey,
          referrer: referrerPubkey,
          referrerReferralAccount: referrerReferralPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Ther: Referral registered on-chain. TX:", tx);
      toast.success("Referral code registered successfully!");
      sessionStorage.removeItem("ther_referrer"); // Clean up session
    } catch (err: any) {
      console.error("Ther: Failed to register referral on-chain:", err);
      // Suppress toast if it's already initialized or failed silently
      if (!err.message?.includes("already in use")) {
        toast.error("Referral registration failed: " + (err.message || err));
      }
    } finally {
      setLoading(false);
    }
  }, [publicKey, wallet, getReferrer]);

  return { checkAndRegister, loading };
}

export interface ReferredUser {
  wallet: string;
  totalSwaps: number;
  createdAt: number;
}

/**
 * Fetch referral statistics and list of referred users for the connected user.
 */
export function useReferralStats() {
  const { publicKey } = useWallet();
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [totalSwaps, setTotalSwaps] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!publicKey) {
      setReferredUsers([]);
      setTotalSwaps(0);
      return;
    }

    setLoading(true);
    try {
      const program = getReadOnlyProgram();
      
      // Query all referral accounts where referrer_l1 == user
      const accounts = await program.account.referralAccount.all([
        {
          memcmp: {
            offset: 40, // referrer_l1 is at offset 8 (discriminator) + 32 (user) = 40
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      const formatted: ReferredUser[] = accounts.map((acc: any) => ({
        wallet: acc.account.user.toBase58(),
        totalSwaps: acc.account.totalSwaps.toNumber(),
        createdAt: acc.account.createdAt.toNumber() * 1000,
      }));

      // Sort by creation date descending
      formatted.sort((a, b) => b.createdAt - a.createdAt);

      setReferredUsers(formatted);
      
      // Calculate total swaps referred
      const swapsSum = formatted.reduce((acc, user) => acc + user.totalSwaps, 0);
      setTotalSwaps(swapsSum);
    } catch (err) {
      console.error("Ther: Failed to fetch referral stats:", err);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { referredUsers, totalSwaps, loading, refresh: fetchStats };
}
