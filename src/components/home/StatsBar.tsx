import { Layers, ArrowLeftRight, Coins, Users } from "lucide-react";
import { StatNumber } from "@/components/ui/StatNumber";
import { usePlatformStats } from "@/hooks/useVaults";

export function StatsBar() {
  const stats = usePlatformStats();
  return (
    <div className="bg-[var(--bg)]/30 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto my-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        <StatNumber icon={<Layers size={20} />} value={stats.total_vaults} label="Vaults" />
        <StatNumber icon={<ArrowLeftRight size={20} />} value={stats.total_swaps} label="Swaps" />
        <StatNumber
          icon={<Coins size={20} />}
          value={stats.total_sol_fees}
          label="SOL Fees"
          format="compact"
        />
        <StatNumber icon={<Users size={20} />} value={stats.unique_wallets} label="Wallets" />
      </div>
    </div>
  );
}
