import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Check, AtSign, Send } from "lucide-react";
import { useReferralLink } from "@/hooks/useReferral";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";

interface ShareButtonProps {
  vault: {
    id: string;
    vault_name: string;
  };
}

export function ShareButton({ vault }: ShareButtonProps) {
  const { connected } = useWallet();
  const referralLink = useReferralLink(vault.id);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    const linkToCopy = referralLink || `${window.location.origin}/vault/${vault.id}`;
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    toast.success(connected ? "Referral link copied!" : "Vault link copied!");
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    const link = referralLink || `${window.location.origin}/vault/${vault.id}`;
    const text = encodeURIComponent(
      `Check out the "${vault.vault_name}" token vault on @TherProtocol! Swap tokens 1:1 with yield splits. 🚀`
    );
    const url = encodeURIComponent(link);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    setIsOpen(false);
  };

  const handleTelegramShare = () => {
    const link = referralLink || `${window.location.origin}/vault/${vault.id}`;
    const text = encodeURIComponent(
      `Check out the "${vault.vault_name}" token vault on Ther Protocol!`
    );
    const url = encodeURIComponent(link);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--text)]/5 hover:bg-[var(--text)]/10 text-xs font-display font-semibold text-[var(--text)] border border-[var(--text)]/10 transition duration-200"
        aria-label="Share options"
      >
        <Share2 size={12} /> Share
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg)]/95 backdrop-blur-2xl border border-[var(--text)]/10 rounded-xl shadow-xl z-50 origin-top-right overflow-hidden">
          <div className="py-1">
            <button
              onClick={handleCopy}
              className="flex items-center w-full px-4 py-2 text-xs font-mono text-[var(--text)] hover:bg-[var(--text)]/5 transition duration-200"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-500 mr-2 shrink-0" /> Copied
                </>
              ) : (
                <>
                  <Copy size={12} className="text-[var(--text-muted)] mr-2 shrink-0" /> Copy Link
                </>
              )}
            </button>
            <button
              onClick={handleTwitterShare}
              className="flex items-center w-full px-4 py-2 text-xs font-mono text-[var(--text)] hover:bg-[var(--text)]/5 transition duration-200"
            >
              <AtSign size={12} className="text-[#1DA1F2] mr-2 shrink-0" /> Share on X
            </button>
            <button
              onClick={handleTelegramShare}
              className="flex items-center w-full px-4 py-2 text-xs font-mono text-[var(--text)] hover:bg-[var(--text)]/5 transition duration-200"
            >
              <Send size={12} className="text-[#0088cc] mr-2 shrink-0" /> Telegram
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
