import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction, ComputeBudgetProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAccount } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import {
  getProgram,
  getPlatformConfigPDA,
  getVaultPDA,
  getVaultTokenPDA,
  getRevenueSharePDA,
  getReferralPDA,
  PROGRAM_ID,
  connection,
} from "@/lib/solana";
import { saveVaultMetadata, uploadToIPFS } from "@/lib/supabase";
import { useNotificationStore } from "@/store/useNotificationStore";

/**
 * Fetch all RevenueShare PDAs that belong to a given vault.
 * Used by swap to pass as remaining accounts.
 */
async function fetchRevenueShareAccounts(vaultPubkey: PublicKey) {
  // RevenueShare discriminator from IDL: [55, 40, 228, 7, 139, 52, 180, 110]
  const discriminator = Buffer.from([55, 40, 228, 7, 139, 52, 180, 110]);

  const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
    filters: [
      { memcmp: { offset: 0, bytes: discriminator.toString("base64"), encoding: "base64" as any } },
      // vault pubkey is at offset 8 (after discriminator)
      { memcmp: { offset: 8, bytes: vaultPubkey.toBase58() } },
    ],
  });

  return accounts;
}

/**
 * Hook for swapping tokens 1:1 in a vault.
 * Builds real on-chain swap instruction via Anchor.
 */
export function useSwap() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function swap(args: {
    vaultPubkey: string;
    tokenInMint: string;
    tokenOutMint: string;
    amount: number;
    tokenInDecimals: number;
  }) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vaultPubkey = new PublicKey(args.vaultPubkey);
      const tokenInMint = new PublicKey(args.tokenInMint);
      const tokenOutMint = new PublicKey(args.tokenOutMint);
      
      const decimals = args.tokenInDecimals;
      const multiplier = Math.pow(10, decimals);
      const amount = new BN(Math.round(args.amount * multiplier));

      // Derive PDAs
      const [platformConfig] = getPlatformConfigPDA();
      const [vaultTokenIn] = getVaultTokenPDA(vaultPubkey, tokenInMint);
      const [vaultTokenOut] = getVaultTokenPDA(vaultPubkey, tokenOutMint);

      // Get or create user ATAs
      const userTokenInAta = await getAssociatedTokenAddress(tokenInMint, publicKey);
      const userTokenOutAta = await getAssociatedTokenAddress(tokenOutMint, publicKey);

      // Check if user_token_out ATA exists, create if not
      const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      const preInstructions = [
        ComputeBudgetProgram.setComputeUnitLimit({ units: 300000 }),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
        new TransactionInstruction({
          keys: [],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from("1:1 Swap", "utf-8"),
        }),
      ];
      try {
        await getAccount(connection, userTokenOutAta);
      } catch {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(publicKey, userTokenOutAta, publicKey, tokenOutMint)
        );
      }

      // Fetch all revenue share accounts for this vault (for remaining_accounts)
      const revShareAccounts = await fetchRevenueShareAccounts(vaultPubkey);
      const remainingAccounts = revShareAccounts.map((acc) => ({
        pubkey: acc.pubkey,
        isWritable: true,
        isSigner: false,
      }));

      // Get on-chain platform wallet address dynamically
      let configAccount;
      try {
        configAccount = await program.account.platformConfig.fetch(platformConfig);
      } catch (fetchErr: any) {
        const msg = fetchErr?.message || "";
        if (msg.includes("Account does not exist") || msg.includes("no data")) {
          throw new Error(
            "Platform is not initialized on-chain yet. " +
            "The admin must call 'initialize_platform' first before swaps can execute."
          );
        }
        throw fetchErr;
      }
      const platformWallet = configAccount.platformWallet;

      // Handle on-chain Referral System integration
      const [referralPDA] = getReferralPDA(publicKey);
      let referralAccount = null;
      try {
        referralAccount = await program.account.referralAccount.fetch(referralPDA);
      } catch {
        // Referral account does not exist yet on-chain for this user
      }

      const sessionStorageReferrer = typeof window !== "undefined" ? sessionStorage.getItem("ther_referrer") : null;

      if (!referralAccount && sessionStorageReferrer) {
        try {
          const referrerPubkey = new PublicKey(sessionStorageReferrer);
          if (!referrerPubkey.equals(publicKey)) {
            const [referrerReferralPDA] = getReferralPDA(referrerPubkey);
            
            // Fetch referrer's own referral chain to resolve L2 & L3 for our swap instruction remaining accounts
            let referrerAccountData = null;
            try {
              referrerAccountData = await program.account.referralAccount.fetch(referrerReferralPDA);
            } catch {
              // Referrer does not have a referral chain on-chain
            }

            const registerIx = await program.methods
              .registerReferral()
              .accounts({
                referralAccount: referralPDA,
                user: publicKey,
                referrer: referrerPubkey,
                referrerReferralAccount: referrerReferralPDA,
                systemProgram: SystemProgram.programId,
              })
              .instruction();

            preInstructions.push(registerIx);

            // Pass the derived referral accounts for the swap instruction
            remainingAccounts.push({
              pubkey: referralPDA,
              isWritable: true,
              isSigner: false,
            });
            remainingAccounts.push({
              pubkey: referrerPubkey,
              isWritable: true,
              isSigner: false,
            });

            if (referrerAccountData) {
              if (referrerAccountData.referrerL1 && !referrerAccountData.referrerL1.equals(PublicKey.default)) {
                remainingAccounts.push({
                  pubkey: referrerAccountData.referrerL1,
                  isWritable: true,
                  isSigner: false,
                });
              }
              if (referrerAccountData.referrerL2 && !referrerAccountData.referrerL2.equals(PublicKey.default)) {
                remainingAccounts.push({
                  pubkey: referrerAccountData.referrerL2,
                  isWritable: true,
                  isSigner: false,
                });
              }
            }

            // Successfully queued registration in the transaction
            sessionStorage.removeItem("ther_referrer");
          }
        } catch (err) {
          console.warn("Ther: Failed to prepare referral registration for swap", err);
        }
      } else if (referralAccount) {
        // User already has a registered referral chain, pass L1, L2, L3 keys
        remainingAccounts.push({
          pubkey: referralPDA,
          isWritable: true,
          isSigner: false,
        });
        if (referralAccount.referrerL1 && !referralAccount.referrerL1.equals(PublicKey.default)) {
          remainingAccounts.push({
            pubkey: referralAccount.referrerL1,
            isWritable: true,
            isSigner: false,
          });
        }
        if (referralAccount.referrerL2 && !referralAccount.referrerL2.equals(PublicKey.default)) {
          remainingAccounts.push({
            pubkey: referralAccount.referrerL2,
            isWritable: true,
            isSigner: false,
          });
        }
        if (referralAccount.referrerL3 && !referralAccount.referrerL3.equals(PublicKey.default)) {
          remainingAccounts.push({
            pubkey: referralAccount.referrerL3,
            isWritable: true,
            isSigner: false,
          });
        }
      }

      const tx = await program.methods
        .swap(amount)
        .accounts({
          platformConfig,
          vault: vaultPubkey,
          tokenInMint,
          tokenOutMint,
          userTokenInAccount: userTokenInAta,
          userTokenOutAccount: userTokenOutAta,
          vaultTokenInAccount: vaultTokenIn,
          vaultTokenOutAccount: vaultTokenOut,
          platformWallet: platformWallet,
          user: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts(remainingAccounts)
        .preInstructions(preInstructions)
        .rpc();

      toast.success(
        `Swapped ${args.amount.toLocaleString()} tokens! TX: ${tx.slice(0, 8)}...`,
      );
      useNotificationStore.getState().addNotification(
        "swap",
        "Tokens Swapped",
        `Successfully swapped ${args.amount.toLocaleString()} tokens.`,
        args.vaultPubkey,
        tx
      );
      return tx;
    } catch (e: any) {
      console.error("Swap error:", e);
      const msg = e?.message || "Swap failed";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { swap, loading };
}

/**
 * Hook for creating a new token vault on-chain.
 * Handles remaining accounts: [mint, vault_token_pda, creator_ata] × N tokens
 */
export function useCreateVault() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function createVault(payload: {
    name: string;
    description?: string;
    image?: string;
    twitter?: string;
    website?: string;
    telegram?: string;
    coverFile?: File | null;
    tokens: Array<{ mint: string; deposit: number; decimals: number; symbol?: string; name?: string }>;
    lockType: "timed" | "permanent";
    duration: string;
    shares?: Array<{ address: string; bps: number }>;
  }) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return null;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vaultName = payload.name;

      // Derive core PDAs
      const [platformConfig] = getPlatformConfigPDA();
      const [vaultPDA] = getVaultPDA(publicKey, vaultName);

      // Build token mints and deposit amounts (convert UI amount to raw token lamports)
      const tokenMints = payload.tokens.map((t) => new PublicKey(t.mint));
    const depositAmounts = payload.tokens.map((t) => {
      const decimals = t.decimals;
      const multiplier = Math.pow(10, decimals);
      return new BN(Math.round(t.deposit * multiplier));
    });

    // Lock type
    const lockType = payload.lockType === "permanent"
      ? { permanent: {} }
      : { timed: {} };
    const lockDurationSeconds = payload.lockType === "timed"
      ? new BN(Number(payload.duration) * 86400) // days to seconds
      : new BN(0);

    // Build remaining accounts: for each token, [mint, vault_token_pda, creator_ata]
    const remainingAccounts = [];
    for (const t of payload.tokens) {
      const mint = new PublicKey(t.mint);
        const [vaultTokenPDA] = getVaultTokenPDA(vaultPDA, mint);
        const creatorAta = await getAssociatedTokenAddress(mint, publicKey);

        remainingAccounts.push(
          { pubkey: mint, isWritable: false, isSigner: false },
          { pubkey: vaultTokenPDA, isWritable: true, isSigner: false },
          { pubkey: creatorAta, isWritable: true, isSigner: false },
        );
      }

      // Get on-chain platform wallet address dynamically
      let configAccount;
      try {
        configAccount = await program.account.platformConfig.fetch(platformConfig);
      } catch (fetchErr: any) {
        const msg = fetchErr?.message || "";
        if (msg.includes("Account does not exist") || msg.includes("no data")) {
          throw new Error(
            "Platform is not initialized on-chain yet. " +
            "The admin must call 'initialize_platform' first before vaults can be created."
          );
        }
        throw fetchErr;
      }
      const platformWallet = configAccount.platformWallet;

      // Derive the creator's revenue share PDA
      const [creatorRevSharePDA] = getRevenueSharePDA(vaultPDA, publicKey);

      const tx = await program.methods
        .createVault(
          vaultName,
          lockType as any,
          lockDurationSeconds,
          tokenMints,
          depositAmounts,
        )
        .accounts({
          platformConfig,
          vault: vaultPDA,
          creatorRevenueShare: creatorRevSharePDA,
          creator: publicKey,
          platformWallet: platformWallet,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .remainingAccounts(remainingAccounts)
        .rpc();

      toast.success(`Vault "${vaultName}" created! TX: ${tx.slice(0, 8)}...`);
      useNotificationStore.getState().addNotification(
        "vault_created",
        "Vault Created",
        `Created new vault "${vaultName}" successfully.`,
        vaultPDA.toBase58(),
        tx
      );

      // Upload metadata and cover image to IPFS using pump.fun API
      let ipfsImageUrl = payload.image || "";
      let ipfsUri = "";

      const ipfsToast = toast.loading("Uploading metadata and cover image to IPFS...");
      try {
        let fileBlob: Blob;
        if (payload.coverFile) {
          fileBlob = payload.coverFile;
        } else if (payload.image) {
          const res = await fetch(payload.image);
          fileBlob = await res.blob();
        } else {
          fileBlob = new Blob([""], { type: "image/png" });
        }

        const ipfsResult = await uploadToIPFS({
          name: vaultName,
          description: payload.description || "",
          twitter: payload.twitter || "",
          telegram: payload.telegram || "",
          website: payload.website || "",
          imageBlob: fileBlob,
        });

        if (ipfsResult) {
          ipfsUri = ipfsResult.metadataUri;
          ipfsImageUrl = ipfsResult.ipfsImageUrl || ipfsImageUrl;
          toast.success("Vault metadata successfully uploaded to IPFS!", { id: ipfsToast });
        } else {
          toast.dismiss(ipfsToast);
        }
      } catch (err) {
        console.error("IPFS upload failed:", err);
        toast.dismiss(ipfsToast);
      }

      // Save metadata to Supabase / LocalStorage
      try {
        await saveVaultMetadata({
          id: vaultPDA.toBase58(),
          name: vaultName,
          description: payload.description || "",
          image_url: ipfsImageUrl || payload.image || "",
          twitter: payload.twitter || "",
          website: payload.website || "",
          telegram: payload.telegram || "",
          creator: publicKey.toBase58(),
          tokens_data: payload.tokens.map((t) => ({
            mint: t.mint,
            symbol: t.symbol || t.mint.slice(0, 4).toUpperCase(),
            name: t.name || `Token (${t.mint.slice(0, 4)})`,
            decimals: t.decimals,
            initial_deposit: t.deposit,
          })),
        });
      } catch (err) {
        console.error("Failed to save vault metadata off-chain:", err);
      }

      // Return the vault PDA as the ID for navigation
      return { id: vaultPDA.toBase58() };
    } catch (e: any) {
      console.error("Create vault error:", e);
      const msg = e?.message || "Failed to create vault";
      toast.error(msg.length > 120 ? msg.slice(0, 120) + "…" : msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createVault, loading };
}

/**
 * Hook for claiming accumulated revenue from a vault.
 */
export function useRevenueShare() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function claim(vaultPubkey: string) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vault = new PublicKey(vaultPubkey);
      const [revenueSharePDA] = getRevenueSharePDA(vault, publicKey);

      const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      const preInstructions = [
        new TransactionInstruction({
          keys: [],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from("fee claim", "utf-8"),
        }),
      ];

      const tx = await program.methods
        .claimRevenue()
        .accounts({
          vault,
          revenueShare: revenueSharePDA,
          recipient: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .preInstructions(preInstructions)
        .rpc();

      toast.success(`Revenue claimed! TX: ${tx.slice(0, 8)}...`);
      useNotificationStore.getState().addNotification(
        "claim",
        "Revenue Claimed",
        `Successfully claimed accumulated revenue share.`,
        vaultPubkey,
        tx
      );
      return true;
    } catch (e: any) {
      console.error("Claim revenue error:", e);
      const msg = e?.message || "Failed to claim revenue";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { claim, loading };
}

/**
 * Hook for adding a revenue share recipient to a vault.
 */
export function useAddRevenueShare() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function addRevenueShare(vaultPubkey: string, recipientAddress: string, shareBps: number) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vault = new PublicKey(vaultPubkey);
      const recipient = new PublicKey(recipientAddress);
      const [revenueSharePDA] = getRevenueSharePDA(vault, recipient);
      const [creatorRevenueSharePDA] = getRevenueSharePDA(vault, publicKey);

      const tx = await program.methods
        .addRevenueShare(shareBps)
        .accounts({
          vault,
          revenueShare: revenueSharePDA,
          creatorRevenueShare: creatorRevenueSharePDA,
          creator: publicKey,
          recipient,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast.success(`Added revenue share for ${recipientAddress.slice(0, 6)}... TX: ${tx.slice(0, 8)}...`);
      return true;
    } catch (e: any) {
      console.error("Add revenue share error:", e);
      const msg = e?.message || "Failed to add revenue share";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { addRevenueShare, loading };
}

/**
 * Hook for depositing more tokens into an existing vault.
 */
export function useDepositTokens() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function deposit(args: {
    vaultPubkey: string;
    tokenMint: string;
    amount: number;
    decimals: number;
  }) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vaultPubkey = new PublicKey(args.vaultPubkey);
      const tokenMint = new PublicKey(args.tokenMint);

      const multiplier = Math.pow(10, args.decimals);
      const amount = new BN(Math.round(args.amount * multiplier));

      // Derive vault token PDA
      const [vaultTokenAccount] = getVaultTokenPDA(vaultPubkey, tokenMint);

      // Get user associated token account
      const userTokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);

      const tx = await program.methods
        .depositTokens(amount)
        .accounts({
          vault: vaultPubkey,
          tokenMint,
          userTokenAccount,
          vaultTokenAccount,
          user: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      toast.success(`Successfully deposited ${args.amount} tokens!`);
      useNotificationStore.getState().addNotification(
        "deposit",
        "Tokens Deposited",
        `Successfully deposited ${args.amount} tokens.`,
        args.vaultPubkey,
        tx
      );
      return tx;
    } catch (e: any) {
      console.error("Deposit tokens error:", e);
      const msg = e?.message || "Failed to deposit tokens";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { deposit, loading };
}

/**
 * Hook for extending the lock duration of a timed vault.
 */
export function useExtendLock() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function extendLock(vaultPubkey: string, additionalSeconds: number) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vault = new PublicKey(vaultPubkey);
      const additionalSecsBN = new BN(additionalSeconds);

      const tx = await program.methods
        .extendLock(additionalSecsBN)
        .accounts({
          vault,
          creator: publicKey,
        })
        .rpc();

      toast.success("Lock duration successfully extended!");
      return tx;
    } catch (e: any) {
      console.error("Extend lock error:", e);
      const msg = e?.message || "Failed to extend lock duration";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { extendLock, loading };
}

/**
 * Hook for permanently renouncing a vault.
 */
export function useRenounceVault() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function renounceVault(vaultPubkey: string) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vault = new PublicKey(vaultPubkey);

      const tx = await program.methods
        .renounceVault()
        .accounts({
          vault,
          creator: publicKey,
        })
        .rpc();

      toast.success("Vault permanently renounced!");
      return tx;
    } catch (e: any) {
      console.error("Renounce vault error:", e);
      const msg = e?.message || "Failed to renounce vault";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { renounceVault, loading };
}

/**
 * Hook for updating platform configuration. Admin only.
 */
export function useUpdatePlatformConfig() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  async function updateConfig(args: {
    platformWallet: string;
    creationFee: number; // in SOL
    swapFee: number; // in SOL
    platformFee: number; // in SOL
    creatorFee: number; // in SOL
    minimumDepositBps: number;
  }) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }

    setLoading(true);
    try {
      const program = getProgram(wallet);
      const [platformConfig] = getPlatformConfigPDA();
      const platformWalletPubkey = new PublicKey(args.platformWallet);

      const creationFeeBny = new BN(Math.round(args.creationFee * 1_000_000_000));
      const swapFeeBny = new BN(Math.round(args.swapFee * 1_000_000_000));
      const platformFeeBny = new BN(Math.round(args.platformFee * 1_000_000_000));
      const creatorFeeBny = new BN(Math.round(args.creatorFee * 1_000_000_000));

      const tx = await program.methods
        .updatePlatform(
          platformWalletPubkey,
          creationFeeBny,
          swapFeeBny,
          platformFeeBny,
          creatorFeeBny,
          args.minimumDepositBps,
        )
        .accounts({
          platformConfig,
          authority: publicKey,
        })
        .rpc();

      toast.success("Platform configuration updated successfully!");
      return tx;
    } catch (e: any) {
      console.error("Update platform config error:", e);
      const msg = e?.message || "Failed to update platform configuration";
      toast.error(msg.length > 100 ? msg.slice(0, 100) + "…" : msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { updateConfig, loading };
}




