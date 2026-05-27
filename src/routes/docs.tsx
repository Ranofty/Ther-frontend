import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Coins, Lock, ArrowLeftRight, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — Ther Protocol" },
      { name: "description", content: "How the Ther cross-launchpad token vault protocol works." },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  return (
    <main className="min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pt-12">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={28} className="text-[var(--accent)]" />
        <h1 className="text-3xl font-display font-bold">Docs</h1>
      </div>

      <Section icon={<Coins size={18} />} title="What is Ther?">
        Ther is not a launchpad. It is a protocol that sits on top of every launchpad. Token creators
        group multiple SPL tokens from different launchpads into shared immutable vaults.
      </Section>
      <Section icon={<ArrowLeftRight size={18} />} title="Fixed 1:1 swaps">
        Put in 1,000,000 Token A — get out exactly 1,000,000 Token B. Always. Market cap, price, and
        dollar value are irrelevant. Every swap generates real on-chain volume for every token in
        the vault simultaneously.
      </Section>
      <Section icon={<Lock size={18} />} title="Immutable lock types">
        Vaults are either timed-locked (withdrawals open after expiry) or permanently renounced
        (locked forever). Either choice is irreversible.
      </Section>
      <Section icon={<ShieldCheck size={18} />} title="Safety primitives">
        Every token added to a vault must have mint authority and freeze authority revoked. Vault
        depth is observable on-chain. Revenue shares are immutable once set.
      </Section>
    </main>
  );
}

function Section({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <GlassCard className="mb-4">
      <div className="flex items-center gap-2 mb-3 text-[var(--accent)]">
        {icon}
        <h2 className="font-display font-bold text-lg text-[var(--text)]">{title}</h2>
      </div>
      <p className="text-sm font-mono text-[var(--text-muted)] leading-relaxed">{children}</p>
    </GlassCard>
  );
}
