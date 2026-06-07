import { VersionedTransaction } from "@solana/web3.js";
import bs58Import from "bs58";
import { JITO_ENDPOINTS } from "../solana";

const bs58 = (bs58Import as any).default ?? bs58Import;

export async function submitJitoBundle(
  signedTransactions: VersionedTransaction[]
): Promise<string[]> {
  const serializedTxs = signedTransactions.map((tx) => {
    const serialized = tx.serialize();
    return bs58.encode(serialized);
  });

  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "sendBundle",
    params: [serializedTxs],
  };

  let lastError: any = null;

  for (const endpoint of JITO_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}/api/v1/bundles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const result = (await response.json()) as any;
      if (result.error) {
        throw new Error(`Jito Error: ${JSON.stringify(result.error)}`);
      }

      // Return signatures of the transaction
      const signatures = signedTransactions.map((tx) => {
        return bs58.encode(tx.signatures[0]);
      });
      return signatures;
    } catch (error) {
      console.warn(`Jito submission failed for endpoint ${endpoint}:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error("All Jito endpoints failed");
}
