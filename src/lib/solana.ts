import { Buffer } from "buffer";
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Ther } from "./idl/ther";
import IDL from "./idl/ther.json";

export const RPC_ENDPOINT = "https://api.devnet.solana.com";
export const NETWORK = "devnet" as const;

export const connection = new Connection(RPC_ENDPOINT, "confirmed");

// Real deployed program ID
export const PROGRAM_ID = new PublicKey("THERzdqAyNwcnTD8AfKLYYeU8rMrhT6KB9PZgnXh3Ce");

/**
 * Get Anchor Program instance with the connected wallet
 */
export function getProgram(wallet: any): any {
  const provider = new AnchorProvider(
    connection,
    wallet,
    { preflightCommitment: "confirmed", commitment: "confirmed" }
  );
  return new Program<any>(IDL as any, provider);
}

/**
 * Get a read-only Anchor Program instance (works without a connected wallet)
 */
export function getReadOnlyProgram(): any {
  const dummyWallet = {
    publicKey: PublicKey.default,
    signTransaction: async (tx: any) => tx,
    signAllTransactions: async (txs: any[]) => txs,
  };
  const provider = new AnchorProvider(
    connection,
    dummyWallet as any,
    { preflightCommitment: "confirmed", commitment: "confirmed" }
  );
  return new Program<any>(IDL as any, provider);
}

/**
 * Derive Platform Config PDA
 */
export function getPlatformConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    PROGRAM_ID
  );
}

/**
 * Derive Vault PDA
 */
export function getVaultPDA(creator: PublicKey, vaultName: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), creator.toBuffer(), Buffer.from(vaultName)],
    PROGRAM_ID
  );
}

/**
 * Derive Vault Token Account PDA
 */
export function getVaultTokenPDA(vault: PublicKey, mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault_token"), vault.toBuffer(), mint.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Derive Revenue Share PDA
 */
export function getRevenueSharePDA(vault: PublicKey, recipient: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("revenue"), vault.toBuffer(), recipient.toBuffer()],
    PROGRAM_ID
  );
}
