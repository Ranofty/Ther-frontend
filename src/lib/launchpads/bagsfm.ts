import { VersionedTransaction } from "@solana/web3.js";
import bs58Import from "bs58";
import { LaunchpadAdapter } from "./types";
import { connection, BAGS_FM_PROXY } from "../solana";

const bs58 = (bs58Import as any).default ?? bs58Import;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });
}

export const bagsfmAdapter: LaunchpadAdapter = {
  id: "bagsfm",
  name: "Bags.fm",
  logo: "/launchpads/bagsfm.svg",
  description: "Fee-sharing token platform",
  mainnetOnly: true,
  fields: [
    { key: "name", label: "Token Name", type: "text", required: true },
    { key: "symbol", label: "Symbol", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea", required: true },
    { key: "devBuySOL", label: "Dev Buy (SOL)", type: "number", required: false },
  ],
  async launch(config, walletPublicKey, signAllTransactions) {
    // Note: The Bags.fm proxy edge function is required but not yet fully implemented.
    // This calls the placeholder edge function endpoint /api/bags-launch.
    
    // 1. Convert image to base64
    const base64Image = await fileToBase64(config.metadata.imageFile);

    // 2. Call the bags proxy launch endpoint
    const response = await fetch(`${BAGS_FM_PROXY}/launch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metadata: {
          name: config.metadata.name,
          symbol: config.metadata.symbol,
          description: config.metadata.description,
          image: base64Image,
          twitter: config.metadata.twitter,
          telegram: config.metadata.telegram,
          website: config.metadata.website,
        },
        devBuySOL: config.devBuySOL,
        walletPublicKey,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bags.fm launch proxy error: ${errorText}`);
    }

    const result = await response.json() as any;
    if (!result.serializedTx) {
      throw new Error("Bags.fm proxy did not return a transaction");
    }

    // 3. Deserialize transaction
    const tx = VersionedTransaction.deserialize(new Uint8Array(bs58.decode(result.serializedTx)));

    // 4. Sign transaction
    const signedTxs = await signAllTransactions([tx]);
    const signedTx = signedTxs[0];

    // 5. Send transaction
    const signature = await connection.sendRawTransaction(signedTx.serialize(), {
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

    return {
      mintAddress: result.mintAddress,
      txSignatures: [signature],
      metadataUri: result.metadataUri || "",
    };
  },
};
