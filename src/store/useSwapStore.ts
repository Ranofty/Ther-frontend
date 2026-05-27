import { create } from "zustand";
import type { VaultToken } from "@/types";

interface SwapStore {
  tokenIn: VaultToken | null;
  tokenOut: VaultToken | null;
  amount: string;
  setTokenIn: (t: VaultToken | null) => void;
  setTokenOut: (t: VaultToken | null) => void;
  setAmount: (a: string) => void;
  flipTokens: () => void;
  reset: () => void;
}

export const useSwapStore = create<SwapStore>((set) => ({
  tokenIn: null,
  tokenOut: null,
  amount: "",
  setTokenIn: (tokenIn) => set({ tokenIn }),
  setTokenOut: (tokenOut) => set({ tokenOut }),
  setAmount: (amount) => set({ amount }),
  flipTokens: () =>
    set((s) => ({ tokenIn: s.tokenOut, tokenOut: s.tokenIn })),
  reset: () => set({ tokenIn: null, tokenOut: null, amount: "" }),
}));
