import { createFileRoute, Link } from "@tanstack/react-router";
import { useVaultDetail } from "@/hooks/useVaults";
import { VaultHeader } from "@/components/vault/VaultHeader";
import { TokenBalanceTable } from "@/components/vault/TokenBalanceTable";
import { VaultSwapFeed } from "@/components/vault/VaultSwapFeed";
import { SwapPanel } from "@/components/vault/SwapPanel";
import { LockStatusCard } from "@/components/vault/LockStatusCard";
import { RevenueShareCard } from "@/components/vault/RevenueShareCard";
import { CreatorPanel } from "@/components/vault/CreatorPanel";
import { DepositSection } from "@/components/vault/DepositSection";
import { CommentsSection } from "@/components/vault/CommentsSection";

export const Route = createFileRoute("/vault/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Ther Vault` },
      { name: "description", content: `Inspect the ${params.id} token vault on Ther.` },
    ],
  }),
  component: VaultDetailPage,
});

function VaultDetailPage() {
  const { id } = Route.useParams();
  const { vault, swaps, refetch, addLocalSwap } = useVaultDetail(id);

  if (!vault) {
    return (
      <main className="min-h-screen pb-40 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-3">Vault not found</h1>
          <Link to="/" className="text-[var(--accent)] font-mono text-sm hover:underline">
            ← Back to discovery
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Full-width header */}
        <div className="xl:col-span-12">
          <VaultHeader vault={vault} />
        </div>

        {/* Left column: token table, deposit, comments, swap feed */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <TokenBalanceTable tokens={vault.tokens} />
          <DepositSection vault={vault} onDepositSuccess={refetch} />
          <CommentsSection vaultId={vault.id} />
          <VaultSwapFeed swaps={swaps} />
        </div>

        {/* Right column: swap, creator controls, lock status, revenue shares */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <SwapPanel vault={vault} onSwapSuccess={(amount, tokenIn, tokenOut) => {
            addLocalSwap(amount, tokenIn, tokenOut);
            refetch();
          }} />
          <CreatorPanel vault={vault} onRefresh={refetch} />
          <LockStatusCard vault={vault} />
          <RevenueShareCard vault={vault} onRefresh={refetch} />
        </div>
      </div>
    </main>
  );
}

