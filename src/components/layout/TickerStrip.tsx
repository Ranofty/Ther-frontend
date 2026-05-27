import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import type { SwapEvent } from "@/types";
import { MOCK_INITIAL_SWAPS, makeMockSwap } from "@/lib/mockData";
import { formatNumber, timeAgo, truncateAddress } from "@/lib/utils";

export function TickerStrip() {
  const [swaps, setSwaps] = useState<SwapEvent[]>(MOCK_INITIAL_SWAPS);

  useEffect(() => {
    const t = setInterval(() => {
      setSwaps((prev) => [makeMockSwap(prev.length), ...prev].slice(0, 20));
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // duplicate for seamless loop
  const items = [...swaps, ...swaps];

  return (
    <div className="fixed bottom-[80px] sm:bottom-[96px] left-0 right-0 z-40 bg-[var(--bg)]/40 backdrop-blur-xl px-4 py-2 overflow-hidden">
      <div className="flex items-center gap-6 animate-scroll-ticker whitespace-nowrap" style={{ width: "max-content" }}>
        {items.map((s, i) => (
          <div
            key={`${s.id}-${i}`}
            className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]"
          >
            <span className="text-[var(--accent)] font-medium">{s.vault_name}</span>
            <span>·</span>
            <span>{truncateAddress(s.user_wallet, 3)}</span>
            <ArrowLeftRight size={10} className="text-[var(--text-muted)]" />
            <span className="text-[var(--text)]">
              {s.token_in_symbol} → {s.token_out_symbol}
            </span>
            <span>{formatNumber(s.amount)}</span>
            <span className="text-[var(--text-muted)]/70">{timeAgo(s.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
