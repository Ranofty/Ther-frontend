export type LaunchpadId = "pumpfun" | "bonkfun" | "bagsfm";

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  imageFile: File;
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface LaunchField {
  key: string;
  label: string;
  type: "text" | "textarea" | "file" | "number";
  placeholder?: string;
  required: boolean;
}

export interface LaunchConfig {
  metadata: TokenMetadata;
  devBuySOL: number;
  slippage: number;
  priorityFee: number;
  /** Pre-uploaded metadata URI — if provided, adapters should skip IPFS upload */
  metadataUri?: string;
}

export interface LaunchResult {
  mintAddress: string;
  txSignatures: string[];
  metadataUri: string;
}

export interface LaunchpadAdapter {
  id: LaunchpadId;
  name: string;
  logo: string;
  description: string;
  fields: LaunchField[];
  mainnetOnly: boolean;
  launch(
    config: LaunchConfig,
    walletPublicKey: string,
    signAllTransactions: (txs: any[]) => Promise<any[]>,
  ): Promise<LaunchResult>;
}
