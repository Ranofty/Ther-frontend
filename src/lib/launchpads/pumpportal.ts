import { Keypair, VersionedTransaction } from "@solana/web3.js";
import bs58Import from "bs58";
import { LaunchpadAdapter, LaunchConfig, LaunchResult, TokenMetadata } from "./types";
import { submitJitoBundle } from "./jito";
import { connection, PUMPPORTAL_TRADE_API, PUMPFUN_IPFS_API } from "../solana";

const bs58 = (bs58Import as any).default ?? bs58Import;

export async function uploadMetadataToIPFS(metadata: TokenMetadata): Promise<{ metadataUri: string; name: string; symbol: string }> {
  const formData = new FormData();
  formData.append("file", metadata.imageFile);
  formData.append("name", metadata.name);
  formData.append("symbol", metadata.symbol);
  formData.append("description", metadata.description);
  
  if (metadata.twitter) formData.append("twitter", metadata.twitter);
  if (metadata.telegram) formData.append("telegram", metadata.telegram);
  if (metadata.website) formData.append("website", metadata.website);
  
  formData.append("showName", "true");

  const response = await fetch(PUMPFUN_IPFS_API, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload metadata to IPFS: ${response.statusText}`);
  }

  const result = await response.json() as any;
  if (!result.metadataUri) {
    throw new Error("Metadata URI not found in IPFS upload response");
  }

  return {
    metadataUri: result.metadataUri,
    name: metadata.name,
    symbol: metadata.symbol,
  };
}

export function createPumpPortalAdapter(
  pool: "pump" | "bonk",
  name: string,
  description: string,
  logo: string
): LaunchpadAdapter {
  return {
    id: pool === "pump" ? "pumpfun" : "bonkfun",
    name,
    description,
    logo,
    mainnetOnly: false,
    fields: [
      { key: "name", label: "Token Name", type: "text", required: true },
      { key: "symbol", label: "Symbol", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "devBuySOL", label: "Dev Buy (SOL)", type: "number", required: false },
    ],
    async launch(config, walletPublicKey, signAllTransactions) {
      // 1. Upload metadata to IPFS (skip if pre-provided)
      const metadataUri = config.metadataUri ?? (await uploadMetadataToIPFS(config.metadata)).metadataUri;

      // 2. Generate mint keypair
      const mintKeypair = Keypair.generate();

      // 3. Build action args
      const txArgs: any[] = [];
      
      // Create action
      txArgs.push({
        publicKey: walletPublicKey,
        action: "create",
        tokenMetadata: {
          name: config.metadata.name,
          symbol: config.metadata.symbol,
          uri: metadataUri,
        },
        mint: mintKeypair.publicKey.toBase58(),
        denominatedInSol: "true",
        amount: 0,
        slippage: config.slippage,
        priorityFee: config.priorityFee,
        pool: pool,
      });

      // Buy action if amount > 0
      const hasBuy = config.devBuySOL > 0;
      if (hasBuy) {
        txArgs.push({
          publicKey: walletPublicKey,
          action: "buy",
          mint: mintKeypair.publicKey.toBase58(),
          denominatedInSol: "true",
          amount: config.devBuySOL,
          slippage: config.slippage,
          priorityFee: config.priorityFee,
          pool: pool,
        });
      }

      // 4. Request transactions from PumpPortal
      const response = await fetch(PUMPPORTAL_TRADE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(txArgs),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PumpPortal API error: ${errorText}`);
      }

      const txStrings = (await response.json()) as string[];
      if (!txStrings || txStrings.length === 0) {
        throw new Error("PumpPortal returned no transactions");
      }

      // 5. Deserialize transactions
      const transactions = txStrings.map((txStr) => {
        return VersionedTransaction.deserialize(new Uint8Array(bs58.decode(txStr)));
      });

      // 6. Partial sign the create transaction (which is first) with mint keypair
      transactions[0].sign([mintKeypair]);

      // 7. Sign all transactions with user's wallet
      const signedTransactions = await signAllTransactions(transactions);

      // 8. Submit transactions
      let txSignatures: string[] = [];
      if (hasBuy) {
        txSignatures = await submitJitoBundle(signedTransactions);
      } else {
        const createTx = signedTransactions[0];
        const signature = await connection.sendRawTransaction(createTx.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });
        
        // Wait for confirmation
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        }, "confirmed");

        txSignatures = [signature];
      }

      return {
        mintAddress: mintKeypair.publicKey.toBase58(),
        txSignatures,
        metadataUri,
      };
    },
  };
}

export const pumpfunAdapter = createPumpPortalAdapter(
  "pump",
  "Pump.fun",
  "Launch tokens on the original Solana memecoin launchpad",
  "/launchpads/pumpfun.svg"
);

export const bonkfunAdapter = createPumpPortalAdapter(
  "bonk",
  "LetsBonk.fun",
  "Launch tokens on the BONK-powered launchpad",
  "/launchpads/bonkfun.svg"
);
