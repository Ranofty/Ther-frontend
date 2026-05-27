import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { VaultGrid } from "@/components/home/VaultGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ther — Discover Token Vaults on Solana" },
      {
        name: "description",
        content:
          "Browse community-built token vaults. Fixed 1:1 swaps across every launchpad on Solana.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <HeroSection />
      <StatsBar />
      <VaultGrid />
    </main>
  );
}
