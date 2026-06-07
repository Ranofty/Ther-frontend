import { useState } from "react";
import { Share2, Copy, Check, AtSign, Send, Users, Coins } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useReferralLink, useReferralStats } from "@/hooks/useReferral";
import { useWallet } from "@solana/wallet-adapter-react";

interface ReferralCardProps {
  vault: {
    id: string;
    vault_name: string;
  };
}

export function ReferralCard({ vault }: ReferralCardProps) {
  const { connected } = useWallet();
  const referralLink = useReferralLink(vault.id);
  const { referredUsers, totalSwaps } = useReferralStats();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `Check out the "${vault.vault_name}" token vault on Ther Protocol! Swap tokens 1:1 and earn yields. 🚀\n\nTrade here:`
    );
    const url = encodeURIComponent(referralLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(
      `Check out the "${vault.vault_name}" token vault on Ther Protocol!`
    );
    const url = encodeURIComponent(referralLink);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };

  // Estimated earnings: 0.0005 SOL (L1 share) per swap
  const estimatedEarnings = (referredUsers.reduce((sum, user) => sum + user.totalSwaps, 0) * 0.0005).toFixed(4);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Share2 size={16} className="text-[var(--accent)] animate-pulse" />
          <h3 className="font-display font-semibold text-[var(--text)]">Share & Earn</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
          On-Chain
        </span>
      </div>

      <p className="text-xs text-[var(--text-muted)] mb-4">
        Share this vault. Earn <span className="text-[var(--text)] font-semibold font-mono">0.0005 SOL</span> per direct swap, plus up to 3 levels of secondary rewards!
      </p>

      {connected ? (
        <div className="space-y-4">
          {/* Referral Link Copy Area */}
          <div className="flex items-center gap-2 p-2 bg-[var(--text)]/5 rounded-lg border border-[var(--text)]/10">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="bg-transparent border-none text-xs font-mono text-[var(--text)] w-full focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-[var(--text)]/10 rounded transition duration-200 text-[var(--text-muted)] hover:text-[var(--text)]"
              title="Copy Link"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTwitterShare}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-lg text-xs font-semibold text-[#1DA1F2] transition duration-200"
            >
              <AtSign size={14} /> Share on X
            </button>
            <button
              onClick={handleTelegramShare}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 rounded-lg text-xs font-semibold text-[#0088cc] transition duration-200"
            >
              <Send size={14} /> Telegram
            </button>
          </div>

          {/* Mini Stats Display */}
          <div className="pt-4 border-t border-[var(--text)]/5 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
                <Users size={16} />
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  Referrals
                </div>
                <div className="text-sm font-semibold text-[var(--text)] font-mono">
                  {referredUsers.length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Coins size={16} />
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  Earnings (Est.)
                </div>
                <div className="text-sm font-semibold text-emerald-500 font-mono">
                  {estimatedEarnings} SOL
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center bg-[var(--text)]/5 rounded-xl border border-[var(--text)]/10">
          <Share2 size={24} className="text-[var(--text-muted)]/40 mb-2" />
          <p className="text-xs text-[var(--text-muted)] px-4">
            Connect your wallet to generate your referral link and track your earnings.
          </p>
        </div>
      )}
    </GlassCard>
  );
}
