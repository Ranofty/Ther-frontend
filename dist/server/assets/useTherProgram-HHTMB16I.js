import { o as createLucideIcon, j as SystemProgram, T as TransactionInstruction, I as useWallet, F as toast, r as getProgram, h as PublicKey, t as getRevenueSharePDA, q as getPlatformConfigPDA, B as BN, u as getVaultPDA, v as getVaultTokenPDA, S as SYSVAR_RENT_PUBKEY, d as ComputeBudgetProgram, m as connection, P as PROGRAM_ID } from "./router-B3y7OxSE.js";
import { U as reactExports } from "./server-CNVNdsAu.js";
import { T as TOKEN_PROGRAM_ID, A as ASSOCIATED_TOKEN_PROGRAM_ID, k as useAnchorWallet, a as getAssociatedTokenAddress, j as uploadToIPFS, i as saveVaultMetadata, g as getAccount } from "./useVaults-DNOt5NPY.js";
const __iconNode = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode);
function createAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, programId = TOKEN_PROGRAM_ID, associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID) {
  return buildAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, Buffer.alloc(0), programId, associatedTokenProgramId);
}
function buildAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, instructionData, programId = TOKEN_PROGRAM_ID, associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID) {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false }
  ];
  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: instructionData
  });
}
async function fetchRevenueShareAccounts(vaultPubkey) {
  const discriminator = Buffer.from([55, 40, 228, 7, 139, 52, 180, 110]);
  const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
    filters: [
      { memcmp: { offset: 0, bytes: discriminator.toString("base64"), encoding: "base64" } },
      // vault pubkey is at offset 8 (after discriminator)
      { memcmp: { offset: 8, bytes: vaultPubkey.toBase58() } }
    ]
  });
  return accounts;
}
function useSwap() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = reactExports.useState(false);
  async function swap(args) {
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
      const [platformConfig] = getPlatformConfigPDA();
      const [vaultTokenIn] = getVaultTokenPDA(vaultPubkey, tokenInMint);
      const [vaultTokenOut] = getVaultTokenPDA(vaultPubkey, tokenOutMint);
      const userTokenInAta = await getAssociatedTokenAddress(tokenInMint, publicKey);
      const userTokenOutAta = await getAssociatedTokenAddress(tokenOutMint, publicKey);
      const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      const preInstructions = [
        ComputeBudgetProgram.setComputeUnitLimit({ units: 3e5 }),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1e3 }),
        new TransactionInstruction({
          keys: [],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from("1:1 Swap", "utf-8")
        })
      ];
      try {
        await getAccount(connection, userTokenOutAta);
      } catch {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(publicKey, userTokenOutAta, publicKey, tokenOutMint)
        );
      }
      const revShareAccounts = await fetchRevenueShareAccounts(vaultPubkey);
      const remainingAccounts = revShareAccounts.map((acc) => ({
        pubkey: acc.pubkey,
        isWritable: true,
        isSigner: false
      }));
      let configAccount;
      try {
        configAccount = await program.account.platformConfig.fetch(platformConfig);
      } catch (fetchErr) {
        const msg = fetchErr?.message || "";
        if (msg.includes("Account does not exist") || msg.includes("no data")) {
          throw new Error(
            "Platform is not initialized on-chain yet. The admin must call 'initialize_platform' first before swaps can execute."
          );
        }
        throw fetchErr;
      }
      const platformWallet = configAccount.platformWallet;
      const tx = await program.methods.swap(amount).accounts({
        platformConfig,
        vault: vaultPubkey,
        tokenInMint,
        tokenOutMint,
        userTokenInAccount: userTokenInAta,
        userTokenOutAccount: userTokenOutAta,
        vaultTokenInAccount: vaultTokenIn,
        vaultTokenOutAccount: vaultTokenOut,
        platformWallet,
        user: publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      }).remainingAccounts(remainingAccounts).preInstructions(preInstructions).rpc();
      toast.success(
        `Swapped ${args.amount.toLocaleString()} tokens! TX: ${tx.slice(0, 8)}...`
      );
      return tx;
    } catch (e) {
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
function useCreateVault() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = reactExports.useState(false);
  async function createVault(payload) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return null;
    }
    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vaultName = payload.name;
      const [platformConfig] = getPlatformConfigPDA();
      const [vaultPDA] = getVaultPDA(publicKey, vaultName);
      const tokenMints = payload.tokens.map((t) => new PublicKey(t.mint));
      const depositAmounts = payload.tokens.map((t) => {
        const decimals = t.decimals;
        const multiplier = Math.pow(10, decimals);
        return new BN(Math.round(t.deposit * multiplier));
      });
      const lockType = payload.lockType === "permanent" ? { permanent: {} } : { timed: {} };
      const lockDurationSeconds = payload.lockType === "timed" ? new BN(Number(payload.duration) * 86400) : new BN(0);
      const remainingAccounts = [];
      for (const t of payload.tokens) {
        const mint = new PublicKey(t.mint);
        const [vaultTokenPDA] = getVaultTokenPDA(vaultPDA, mint);
        const creatorAta = await getAssociatedTokenAddress(mint, publicKey);
        remainingAccounts.push(
          { pubkey: mint, isWritable: false, isSigner: false },
          { pubkey: vaultTokenPDA, isWritable: true, isSigner: false },
          { pubkey: creatorAta, isWritable: true, isSigner: false }
        );
      }
      let configAccount;
      try {
        configAccount = await program.account.platformConfig.fetch(platformConfig);
      } catch (fetchErr) {
        const msg = fetchErr?.message || "";
        if (msg.includes("Account does not exist") || msg.includes("no data")) {
          throw new Error(
            "Platform is not initialized on-chain yet. The admin must call 'initialize_platform' first before vaults can be created."
          );
        }
        throw fetchErr;
      }
      const platformWallet = configAccount.platformWallet;
      const [creatorRevSharePDA] = getRevenueSharePDA(vaultPDA, publicKey);
      const tx = await program.methods.createVault(
        vaultName,
        lockType,
        lockDurationSeconds,
        tokenMints,
        depositAmounts
      ).accounts({
        platformConfig,
        vault: vaultPDA,
        creatorRevenueShare: creatorRevSharePDA,
        creator: publicKey,
        platformWallet,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY
      }).remainingAccounts(remainingAccounts).rpc();
      toast.success(`Vault "${vaultName}" created! TX: ${tx.slice(0, 8)}...`);
      let ipfsImageUrl = payload.image || "";
      let ipfsUri = "";
      const ipfsToast = toast.loading("Uploading metadata and cover image to IPFS...");
      try {
        let fileBlob;
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
          imageBlob: fileBlob
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
            initial_deposit: t.deposit
          }))
        });
      } catch (err) {
        console.error("Failed to save vault metadata off-chain:", err);
      }
      return { id: vaultPDA.toBase58() };
    } catch (e) {
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
function useRevenueShare() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = reactExports.useState(false);
  async function claim(vaultPubkey) {
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
          data: Buffer.from("fee claim", "utf-8")
        })
      ];
      const tx = await program.methods.claimRevenue().accounts({
        vault,
        revenueShare: revenueSharePDA,
        recipient: publicKey,
        systemProgram: SystemProgram.programId
      }).preInstructions(preInstructions).rpc();
      toast.success(`Revenue claimed! TX: ${tx.slice(0, 8)}...`);
      return true;
    } catch (e) {
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
function useAddRevenueShare() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = reactExports.useState(false);
  async function addRevenueShare(vaultPubkey, recipientAddress, shareBps) {
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
      const tx = await program.methods.addRevenueShare(shareBps).accounts({
        vault,
        revenueShare: revenueSharePDA,
        creatorRevenueShare: creatorRevenueSharePDA,
        creator: publicKey,
        recipient,
        systemProgram: SystemProgram.programId
      }).rpc();
      toast.success(`Added revenue share for ${recipientAddress.slice(0, 6)}... TX: ${tx.slice(0, 8)}...`);
      return true;
    } catch (e) {
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
function useDepositTokens() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = reactExports.useState(false);
  async function deposit(args) {
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
      const [vaultTokenAccount] = getVaultTokenPDA(vaultPubkey, tokenMint);
      const userTokenAccount = await getAssociatedTokenAddress(tokenMint, publicKey);
      const tx = await program.methods.depositTokens(amount).accounts({
        vault: vaultPubkey,
        tokenMint,
        userTokenAccount,
        vaultTokenAccount,
        user: publicKey,
        tokenProgram: TOKEN_PROGRAM_ID
      }).rpc();
      toast.success(`Successfully deposited ${args.amount} tokens!`);
      return tx;
    } catch (e) {
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
function useExtendLock() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = reactExports.useState(false);
  async function extendLock(vaultPubkey, additionalSeconds) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }
    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vault = new PublicKey(vaultPubkey);
      const additionalSecsBN = new BN(additionalSeconds);
      const tx = await program.methods.extendLock(additionalSecsBN).accounts({
        vault,
        creator: publicKey
      }).rpc();
      toast.success("Lock duration successfully extended!");
      return tx;
    } catch (e) {
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
function useRenounceVault() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = reactExports.useState(false);
  async function renounceVault(vaultPubkey) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }
    setLoading(true);
    try {
      const program = getProgram(wallet);
      const vault = new PublicKey(vaultPubkey);
      const tx = await program.methods.renounceVault().accounts({
        vault,
        creator: publicKey
      }).rpc();
      toast.success("Vault permanently renounced!");
      return tx;
    } catch (e) {
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
function useUpdatePlatformConfig() {
  const wallet = useAnchorWallet();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = reactExports.useState(false);
  async function updateConfig(args) {
    if (!connected || !publicKey || !wallet) {
      toast.error("Connect wallet first");
      return false;
    }
    setLoading(true);
    try {
      const program = getProgram(wallet);
      const [platformConfig] = getPlatformConfigPDA();
      const platformWalletPubkey = new PublicKey(args.platformWallet);
      const creationFeeBny = new BN(Math.round(args.creationFee * 1e9));
      const swapFeeBny = new BN(Math.round(args.swapFee * 1e9));
      const platformFeeBny = new BN(Math.round(args.platformFee * 1e9));
      const creatorFeeBny = new BN(Math.round(args.creatorFee * 1e9));
      const tx = await program.methods.updatePlatform(
        platformWalletPubkey,
        creationFeeBny,
        swapFeeBny,
        platformFeeBny,
        creatorFeeBny,
        args.minimumDepositBps
      ).accounts({
        platformConfig,
        authority: publicKey
      }).rpc();
      toast.success("Platform configuration updated successfully!");
      return tx;
    } catch (e) {
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
export {
  Wallet as W,
  useCreateVault as a,
  useDepositTokens as b,
  useExtendLock as c,
  useRenounceVault as d,
  useRevenueShare as e,
  useSwap as f,
  useUpdatePlatformConfig as g,
  useAddRevenueShare as u
};
