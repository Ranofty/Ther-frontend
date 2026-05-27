import type { Vault, SwapEvent, PlatformStats } from "@/types";

export const MOCK_VAULTS: Vault[] = [];

export const MOCK_STATS: PlatformStats = {
  total_vaults: 0,
  total_swaps: 0,
  total_sol_fees: 0,
  unique_wallets: 0,
};

export const MOCK_INITIAL_SWAPS: SwapEvent[] = [];

export function makeMockSwap(idx: number): SwapEvent {
  return {
    id: idx.toString(),
    vault_pubkey: "",
    vault_name: "",
    token_in_mint: "",
    token_in_symbol: "",
    token_out_mint: "",
    token_out_symbol: "",
    amount: 0,
    fee_sol: 0,
    user_wallet: "",
    timestamp: new Date().toISOString(),
  };
}
