import { useEffect, useState, useCallback } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import type { Vault, SwapEvent, PlatformStats, VaultToken, RevenueShare } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  getProgram,
  getReadOnlyProgram,
  getPlatformConfigPDA,
  getVaultTokenPDA,
  getRevenueSharePDA,
  PROGRAM_ID,
  connection,
} from "@/lib/solana";
import { PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";
import { getAllVaultsMetadata, getVaultMetadata, getVaultSwaps, getGlobalSwaps } from "@/lib/supabase";

/**
 * Fetch token accounts on-chain, scale balances by decimals, and merge with off-chain token metadata.
 */
async function fetchVaultTokens(
  vaultPubkey: PublicKey,
  tokenMints: PublicKey[],
  offChainTokens: any[]
): Promise<VaultToken[]> {
  const tokens: VaultToken[] = [];
  for (const mint of tokenMints) {
    const mintStr = mint.toBase58();
    const [vaultTokenPDA] = getVaultTokenPDA(vaultPubkey, mint);
    
    let decimals = 9;
    let uiBalance = 0;
    let mint_revoked = true;
    let freeze_revoked = true;

    // 1. Fetch balance and decimals from vault token PDA
    try {
      const tokenAccountInfo = await connection.getTokenAccountBalance(vaultTokenPDA);
      decimals = tokenAccountInfo.value.decimals;
      uiBalance = tokenAccountInfo.value.uiAmount ?? 0;
    } catch {
      // PDA might not exist or be empty yet
    }

    // 2. Fetch mint info from Solana on-chain to get decimals and authority revoked status
    try {
      const mintInfo = await getMint(connection, mint);
      decimals = mintInfo.decimals;
      mint_revoked = mintInfo.mintAuthority === null;
      freeze_revoked = mintInfo.freezeAuthority === null;
    } catch (err) {
      console.warn("Failed to fetch on-chain mint info for:", mintStr, err);
    }

    // 3. Find off-chain metadata (name, symbol, initial deposit)
    const offChainToken = offChainTokens.find((t: any) => t.mint === mintStr);
    const initialDeposit = offChainToken?.initial_deposit ?? uiBalance;

    tokens.push({
      mint: mintStr,
      name: offChainToken?.name || mintStr.slice(0, 6),
      symbol: offChainToken?.symbol || mintStr.slice(0, 4).toUpperCase(),
      launchpad: offChainToken?.launchpad || "unknown",
      vault_balance: uiBalance,
      initial_deposit: initialDeposit,
      mint_revoked,
      freeze_revoked,
      decimals,
    });
  }
  return tokens;
}

/**
 * Fetch all on-chain vaults and merge with mock metadata for display.
 * Falls back to MOCK_VAULTS if no on-chain vaults exist or if there's no wallet.
 */
export function useVaults() {
  const wallet = useAnchorWallet();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(false);
  const [onChainVaults, setOnChainVaults] = useState<Vault[]>([]);

  const fetchVaults = useCallback(async () => {
    setLoading(true);
    try {
      const program = getReadOnlyProgram();

      // Fetch all Vault accounts from the program
      const allVaults = await program.account.vault.all();

      // Fetch all off-chain metadata from Supabase / LocalStorage
      let offChainMetadata: any[] = [];
      try {
        offChainMetadata = await getAllVaultsMetadata();
      } catch (err) {
        console.error("Failed to fetch off-chain metadata:", err);
      }

      if (allVaults.length === 0) {
        setVaults([]);
        setOnChainVaults([]);
        return;
      }

      const chainVaults: Vault[] = [];

      for (const rawVault of allVaults) {
        const account = rawVault.account;
        const vaultPubkey = rawVault.publicKey;

        const metadata = offChainMetadata.find((m) => m.id === vaultPubkey.toBase58());
        const offChainTokens = metadata?.tokens_data || [];

        // Fetch token balances for each token in the vault dynamically on-chain
        const tokens = await fetchVaultTokens(vaultPubkey, account.tokenMints, offChainTokens);

        // Fetch revenue shares for this vault
        const revShares: RevenueShare[] = [];
        try {
          const discriminator = Buffer.from([55, 40, 228, 7, 139, 52, 180, 110]);
          const revAccounts = await connection.getProgramAccounts(PROGRAM_ID, {
            filters: [
              { memcmp: { offset: 0, bytes: discriminator.toString("base64"), encoding: "base64" as any } },
              { memcmp: { offset: 8, bytes: vaultPubkey.toBase58() } },
            ],
          });

          for (const revAcc of revAccounts) {
            const data = revAcc.account.data;
            try {
              let offset = 8;
              const vPubkey = new PublicKey(data.slice(offset, offset + 32));
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
        } catch (err) {
          console.warn("Failed to fetch revenue shares for vault:", vaultPubkey.toBase58(), err);
        }

        // Determine lock type
        const lockTypeValue = account.lockType;
        const lockType: "permanent" | "timed" =
          "permanent" in lockTypeValue ? "permanent" : "timed";

        chainVaults.push({
          id: vaultPubkey.toBase58(),
          pubkey: vaultPubkey.toBase58(),
          name: account.vaultName,
          description: metadata?.description || `On-chain vault: ${account.vaultName}`,
          image_url: metadata?.image_url || "",
          twitter: metadata?.twitter || "",
          website: metadata?.website || "",
          telegram: metadata?.telegram || "",
          creator: account.creator.toBase58(),
          lock_type: lockType,
          lock_expiry: Number(account.lockExpiry),
          is_renounced: account.isRenounced,
          token_mints: account.tokenMints.map((m: PublicKey) => m.toBase58()),
          unallocated_bps: account.unallocatedBps,
          total_swaps: 0,
          total_volume_sol: 0,
          unique_wallets: 0,
          created_at: metadata?.created_at || new Date().toISOString(),
          tokens,
          revenue_shares: revShares,
        });
      }

      setOnChainVaults(chainVaults);
      setVaults(chainVaults);
    } catch (e) {
      console.error("Failed to fetch on-chain vaults:", e);
      setVaults([]);
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    fetchVaults();
  }, [fetchVaults]);

  return { vaults, loading, onChainVaults, refetch: fetchVaults };
}

/**
 * Fetch a specific vault by ID (pubkey or mock slug).
 * Tries on-chain first, falls back to mock data.
 */
export function useVaultDetail(id: string) {
  const wallet = useAnchorWallet();
  const [vault, setVault] = useState<Vault | null>(null);
  const [loading, setLoading] = useState(true);
  const [swaps, setSwaps] = useState<SwapEvent[]>([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  const addLocalSwap = useCallback((amount: number, tokenInMint: string, tokenOutMint: string) => {
    if (!vault) return;
    const tokenIn = vault.tokens.find((t) => t.mint === tokenInMint);
    const tokenOut = vault.tokens.find((t) => t.mint === tokenOutMint);
    
    const newSwap: SwapEvent = {
      id: Math.random().toString(36).substring(2, 9),
      vault_pubkey: vault.pubkey,
      vault_name: vault.name,
      user_wallet: wallet?.publicKey?.toBase58() || "unknown",
      token_in_mint: tokenInMint,
      token_in_symbol: tokenIn?.symbol || "???",
      token_out_mint: tokenOutMint,
      token_out_symbol: tokenOut?.symbol || "???",
      amount: amount,
      fee_sol: 0.007,
      timestamp: new Date().toISOString(),
    };
    setSwaps((prev) => [newSwap, ...prev]);
  }, [vault, wallet]);

  useEffect(() => {
    let cancelled = false;

    async function fetchVault() {
      try {
        const vaultPubkey = new PublicKey(id);
        const program = getReadOnlyProgram();

        const account = await program.account.vault.fetch(vaultPubkey);
        // Fetch off-chain metadata
        let metadata: any = null;
        try {
          metadata = await getVaultMetadata(vaultPubkey.toBase58());
        } catch (err) {
          console.error("Failed to fetch off-chain metadata:", err);
        }
        const offChainTokens = metadata?.tokens_data || [];

        // Fetch token balances dynamically on-chain and scale decimals
        const tokens = await fetchVaultTokens(vaultPubkey, account.tokenMints, offChainTokens);

        // Fetch revenue shares
        const revShares: RevenueShare[] = [];
        try {
          const revAccounts = await program.account.revenueShare.all([
            { memcmp: { offset: 8, bytes: vaultPubkey.toBase58() } },
          ]);
          for (const revAcc of revAccounts) {
            const decoded = revAcc.account;
            const addedAtTs = Number(decoded.addedAt || 0);
            revShares.push({
              recipient: decoded.recipient.toBase58(),
              share_bps: decoded.shareBps,
              accumulated_lamports: Number(decoded.accumulatedLamports),
              total_claimed_lamports: Number(decoded.totalClaimedLamports),
              added_at: addedAtTs > 0 ? new Date(addedAtTs * 1000).toISOString() : new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn("Failed to fetch revenue shares for vault detail:", err);
        }

        const lockTypeValue = account.lockType;
        const lockType: "permanent" | "timed" =
          "permanent" in lockTypeValue ? "permanent" : "timed";

        const onChainVault: Vault = {
          id: vaultPubkey.toBase58(),
          pubkey: vaultPubkey.toBase58(),
          name: account.vaultName,
          description: metadata?.description || `On-chain vault: ${account.vaultName}`,
          image_url: metadata?.image_url || "",
          twitter: metadata?.twitter || "",
          website: metadata?.website || "",
          telegram: metadata?.telegram || "",
          creator: account.creator.toBase58(),
          lock_type: lockType,
          lock_expiry: Number(account.lockExpiry),
          is_renounced: account.isRenounced,
          token_mints: account.tokenMints.map((m: PublicKey) => m.toBase58()),
          unallocated_bps: account.unallocatedBps,
          total_swaps: 0,
          total_volume_sol: 0,
          unique_wallets: 0,
          created_at: metadata?.created_at || new Date().toISOString(),
          tokens,
          revenue_shares: revShares,
        };

        // Fetch swap history off-chain
        let databaseSwaps: SwapEvent[] = [];
        try {
          databaseSwaps = await getVaultSwaps(vaultPubkey.toBase58());
        } catch (err) {
          console.error("Failed to fetch swaps from off-chain database:", err);
        }

        if (!cancelled) {
          setVault(onChainVault);
          setSwaps(databaseSwaps);
        }
      } catch (e) {
        console.error("Failed to fetch vault:", e);
        if (!cancelled) setVault(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchVault();
    return () => {
      cancelled = true;
    };
  }, [id, wallet, refetchTrigger]);

  return { vault, swaps, loading, refetch, addLocalSwap };
}

/**
 * Hook to retrieve on-chain platform config dynamically
 */
export interface OnChainPlatformConfig {
  authority: string;
  platformWallet: string;
  creationFee: number; // in SOL
  swapFee: number; // in SOL
  platformFee: number; // in SOL
  creatorFee: number; // in SOL
  minimumDepositBps: number;
}

/** Default platform config values (matching smart contract defaults) */
const DEFAULT_PLATFORM_CONFIG: OnChainPlatformConfig = {
  authority: "",
  platformWallet: "",
  creationFee: 0.05,   // 50_000_000 lamports
  swapFee: 0.007,      // 7_000_000 lamports
  platformFee: 0.005,  // 5_000_000 lamports
  creatorFee: 0.002,   // 2_000_000 lamports
  minimumDepositBps: 100, // 1%
};

export function usePlatformConfig() {
  const [config, setConfig] = useState<OnChainPlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const program = getReadOnlyProgram();
        const [platformConfigPDA] = getPlatformConfigPDA();
        const rawConfig = await program.account.platformConfig.fetch(platformConfigPDA);

        setConfig({
          authority: rawConfig.authority.toBase58(),
          platformWallet: rawConfig.platformWallet.toBase58(),
          creationFee: Number(rawConfig.creationFee) / 1_000_000_000,
          swapFee: Number(rawConfig.swapFee) / 1_000_000_000,
          platformFee: Number(rawConfig.platformFee) / 1_000_000_000,
          creatorFee: Number(rawConfig.creatorFee) / 1_000_000_000,
          minimumDepositBps: rawConfig.minimumDepositBps,
        });
        setInitialized(true);
      } catch (e) {
        console.warn("Platform config not initialized on-chain yet. Using defaults.", e);
        setConfig(DEFAULT_PLATFORM_CONFIG);
        setInitialized(false);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  return { config, loading, initialized };
}

/**
 * Fetch platform stats. On-chain PlatformConfig + vault count + SOL fee balance.
 */
export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats>({
    total_vaults: 0,
    total_swaps: 0,
    total_sol_fees: 0,
    unique_wallets: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const program = getReadOnlyProgram();
        const [platformConfigPDA] = getPlatformConfigPDA();

        // 1. Try to fetch platform config for dynamic wallet
        let platformWallet: PublicKey | null = null;
        try {
          const configAccount = await program.account.platformConfig.fetch(platformConfigPDA);
          platformWallet = configAccount.platformWallet;
        } catch {
          console.warn("Platform config not initialized — skipping fee balance.");
        }

        // 2. Fetch all on-chain vaults
        const allVaults = await program.account.vault.all();

        // 3. Count unique creators
        const creators = new Set(allVaults.map((v: any) => v.account.creator.toBase58()));

        // 4. Fetch platform wallet balance to represent total SOL fees
        let platformWalletBalance = 0;
        if (platformWallet) {
          try {
            platformWalletBalance = await connection.getBalance(platformWallet);
          } catch {}
        }

        setStats({
          total_vaults: allVaults.length,
          total_swaps: 0,
          total_sol_fees: platformWalletBalance / 1_000_000_000,
          unique_wallets: creators.size,
        });
      } catch (e) {
        console.error("Failed to fetch on-chain platform stats:", e);
      }
    }

    fetchStats();
  }, []);

  return stats;
}

/**
 * Global swap feed.
 */
export function useGlobalSwapFeed(limit = 12) {
  const [swaps, setSwaps] = useState<SwapEvent[]>([]);

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const data = await getGlobalSwaps(limit);
        setSwaps(data);
      } catch (err) {
        console.error("Failed to fetch global swaps:", err);
      }
    }
    fetchSwaps();
  }, [limit]);

  return swaps;
}
