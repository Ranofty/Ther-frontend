export interface Vault {
  id: string;
  pubkey: string;
  name: string;
  description: string;
  image_url: string;
  twitter?: string;
  website?: string;
  telegram?: string;
  creator: string;
  lock_type: "permanent" | "timed";
  lock_expiry: number;
  is_renounced: boolean;
  token_mints: string[];
  unallocated_bps: number;
  total_swaps: number;
  total_volume_sol: number;
  unique_wallets: number;
  created_at: string;
  tokens: VaultToken[];
  revenue_shares: RevenueShare[];
}

export interface VaultToken {
  mint: string;
  name: string;
  symbol: string;
  logo?: string;
  launchpad: string;
  vault_balance: number;
  initial_deposit: number;
  mint_revoked: boolean;
  freeze_revoked: boolean;
  decimals: number;
}

export interface RevenueShare {
  recipient: string;
  share_bps: number;
  accumulated_lamports: number;
  total_claimed_lamports: number;
  added_at: string;
}

export interface SwapEvent {
  id: string;
  vault_pubkey: string;
  vault_name: string;
  user_wallet: string;
  token_in_mint: string;
  token_in_symbol: string;
  token_out_mint: string;
  token_out_symbol: string;
  amount: number;
  fee_sol: number;
  timestamp: string;
}

export interface PlatformStats {
  total_vaults: number;
  total_swaps: number;
  total_sol_fees: number;
  unique_wallets: number;
}

export interface VaultComment {
  id: string;
  vault_id: string;
  user_wallet: string;
  username?: string;
  avatar_url?: string;
  content: string;
  created_at: string;
}
