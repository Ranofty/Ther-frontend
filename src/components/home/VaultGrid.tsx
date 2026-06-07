import { useMemo, useState } from "react";
import { Flame, Sparkles, ShieldCheck, TrendingUp, Search, X, Filter } from "lucide-react";
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
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [lockFilter, setLockFilter] = useState<"all" | "timed" | "permanent">("all");
  const [tokenCountFilter, setTokenCountFilter] = useState<"all" | "2" | "3plus">("all");
  const [activityFilter, setActivityFilter] = useState<"all" | "active" | "dormant">("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSorted = useMemo(() => {
    // 1. Filter
    let arr = vaults.filter((v) => {
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesCreator = v.creator.toLowerCase().includes(query);
        const matchesTokens = v.tokens.some(
          (t) => t.symbol.toLowerCase().includes(query) || t.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesCreator && !matchesTokens) {
          return false;
        }
      }

      // Lock filter
      if (lockFilter === "timed") {
        if (v.lock_type !== "timed" || v.is_renounced) return false;
      } else if (lockFilter === "permanent") {
        if (!v.is_renounced) return false;
      }

      // Token count filter
      if (tokenCountFilter === "2") {
        if (v.tokens.length !== 2) return false;
      } else if (tokenCountFilter === "3plus") {
        if (v.tokens.length < 3) return false;
      }

      // Activity filter
      if (activityFilter === "active") {
        if (v.total_swaps === 0) return false;
      } else if (activityFilter === "dormant") {
        if (v.total_swaps > 0) return false;
      }

      return true;
    });

    // 2. Sort
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
  }, [vaults, tab, searchQuery, lockFilter, tokenCountFilter, activityFilter]);

  const hasActiveFilters = searchQuery !== "" || lockFilter !== "all" || tokenCountFilter !== "all" || activityFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setLockFilter("all");
    setTokenCountFilter("all");
    setActivityFilter("all");
  };

  return (
    <section id="vaults" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-display font-bold text-[var(--text)]">Discover Vaults</h2>
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search vaults, tokens, or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--text)]/10 focus:border-[var(--accent)] rounded-full pl-10 pr-4 py-2.5 text-xs font-mono text-[var(--text)] focus:outline-none transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Sorting Tabs & Filters Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] backdrop-blur-xl">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-medium transition-all duration-300",
                  active
                    ? "bg-[var(--text)] text-[var(--bg)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]",
                )}
              >
                <Icon size={12} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[var(--text)]/5 transition duration-200"
            >
              Clear Filters <X size={12} />
            </button>
          )}
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-semibold border border-[var(--text)]/10 hover:bg-[var(--text)]/5 transition duration-200",
              showFilters ? "bg-[var(--text)]/10 border-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-muted)]"
            )}
          >
            <Filter size={12} /> Filters
          </button>
        </div>
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="p-4 bg-[var(--surface)]/50 border border-[var(--text)]/5 rounded-2xl mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeIn">
          {/* Lock Filter */}
          <div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              Lock Type
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "timed", "permanent"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLockFilter(filter)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono transition duration-200 border border-transparent",
                    lockFilter === filter
                      ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)] font-semibold"
                      : "bg-[var(--text)]/5 hover:bg-[var(--text)]/10 text-[var(--text-muted)] hover:text-[var(--text)]"
                  )}
                >
                  {filter === "all" ? "All" : filter === "timed" ? "Timed" : "Permanent"}
                </button>
              ))}
            </div>
          </div>

          {/* Token Count Filter */}
          <div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              Token Count
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "2", "3plus"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTokenCountFilter(filter)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono transition duration-200 border border-transparent",
                    tokenCountFilter === filter
                      ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)] font-semibold"
                      : "bg-[var(--text)]/5 hover:bg-[var(--text)]/10 text-[var(--text-muted)] hover:text-[var(--text)]"
                  )}
                >
                  {filter === "all" ? "All" : filter === "2" ? "2 Tokens" : "3+ Tokens"}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Filter */}
          <div>
            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              Swap Activity
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "active", "dormant"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActivityFilter(filter)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono transition duration-200 border border-transparent",
                    activityFilter === filter
                      ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)] font-semibold"
                      : "bg-[var(--text)]/5 hover:bg-[var(--text)]/10 text-[var(--text-muted)] hover:text-[var(--text)]"
                  )}
                >
                  {filter === "all" ? "All" : filter === "active" ? "Active" : "Dormant"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results grid */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[260px] gap-4 [&>*:first-child]:md:col-span-2 [&>*:first-child]:md:row-span-2">
          {filteredAndSorted.map((v, i) => (
            <VaultCard key={v.id} vault={v} trending={i === 0 && tab === "trending" && searchQuery === ""} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--surface)]/35 border border-[var(--text)]/5 rounded-3xl backdrop-blur-md">
          <Search size={32} className="text-[var(--text-muted)]/30 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg mb-1">No vaults found</h3>
          <p className="text-xs font-mono text-[var(--text-muted)] mb-6 px-4">
            Try adjusting your search query or filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-black font-semibold font-display text-xs hover:-translate-y-0.5 transition duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}
