import { useMemo, useState } from "react";
import { Flame, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import { VaultCard } from "@/components/vault/VaultCard";
import { useVaults } from "@/hooks/useVaults";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "newest", label: "Newest", icon: Sparkles },
  { id: "trusted", label: "Most Trusted", icon: ShieldCheck },
  { id: "biggest", label: "Biggest", icon: TrendingUp },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function VaultGrid() {
  const { vaults } = useVaults();
  const [tab, setTab] = useState<TabId>("trending");

  const sorted = useMemo(() => {
    const arr = [...vaults];
    switch (tab) {
      case "newest":
        return arr.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      case "trusted":
        return arr.sort((a, b) => Number(b.is_renounced) - Number(a.is_renounced));
      case "biggest":
        return arr.sort((a, b) => b.total_volume_sol - a.total_volume_sol);
      default:
        return arr.sort((a, b) => b.total_swaps - a.total_swaps);
    }
  }, [vaults, tab]);

  return (
    <section id="vaults" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-bold text-[var(--text)] mb-6">Discover Vaults</h2>

      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] backdrop-blur-xl mb-8">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-medium transition-all duration-300",
                active
                  ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]",
              )}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[260px] gap-4 [&>*:first-child]:md:col-span-2 [&>*:first-child]:md:row-span-2">
        {sorted.map((v, i) => (
          <VaultCard key={v.id} vault={v} trending={i === 0 && tab === "trending"} />
        ))}
      </div>
    </section>
  );
}
