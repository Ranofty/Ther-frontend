import { create } from "zustand";
import type { Vault, PlatformStats } from "@/types";
import { MOCK_STATS } from "@/lib/mockData";

interface VaultStore {
  vaults: Vault[];
  setVaults: (v: Vault[]) => void;
  stats: PlatformStats;
  setStats: (s: PlatformStats) => void;
}

export const useVaultStore = create<VaultStore>((set) => ({
  vaults: [],
  setVaults: (vaults) => set({ vaults }),
  stats: MOCK_STATS,
  setStats: (stats) => set({ stats }),
}));
