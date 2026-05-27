import { useState, useEffect } from "react";
import { MessageSquare, Send, Wallet } from "lucide-react";
import type { VaultComment } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { useWallet } from "@solana/wallet-adapter-react";
import { getVaultComments, saveVaultComment, getUserProfile } from "@/lib/supabase";
import { timeAgo, truncateAddress, gradientFromAddress } from "@/lib/utils";
import { UserLink } from "@/components/ui/UserLink";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function CommentsSection({ vaultId }: { vaultId: string }) {
  const { publicKey, connected } = useWallet();
  const [comments, setComments] = useState<VaultComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getVaultComments(vaultId);
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [vaultId]);

  async function handleSubmit() {
    if (!connected || !publicKey) {
      toast.error("Connect wallet to comment");
      return;
    }
    if (!content.trim()) {
      toast.error("Enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const walletAddr = publicKey.toBase58();

      // Fetch profile for username/avatar
      let username: string | undefined;
      let avatarUrl: string | undefined;
      try {
        const profile = await getUserProfile(walletAddr);
        username = profile?.username || undefined;
        avatarUrl = profile?.avatar_url || undefined;
      } catch {
        // ignore
      }

      const comment: VaultComment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        vault_id: vaultId,
        user_wallet: walletAddr,
        username,
        avatar_url: avatarUrl,
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      const ok = await saveVaultComment(comment);
      if (ok) {
        setComments((prev) => [comment, ...prev]);
        setContent("");
        toast.success("Comment posted!");
      } else {
        toast.error("Failed to post comment");
      }
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={16} className="text-[var(--accent)]" />
        <h3 className="font-display font-semibold text-[var(--text)]">
          Comments
        </h3>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
          {comments.length}
        </span>
      </div>

      {/* Comment Input */}
      {connected ? (
        <div className="flex gap-2 mb-5">
          <div className="flex-1 relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts on this vault..."
              rows={2}
              maxLength={500}
              className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)] resize-none pr-12"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="absolute right-3 bottom-3 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 disabled:opacity-40 transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-3 mb-4 rounded-xl bg-[var(--surface-2)] text-xs font-mono text-[var(--text-muted)]">
          <Wallet size={14} className="inline mr-2" />
          Connect wallet to comment
        </div>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
        {loading && (
          <div className="text-center py-6 text-xs font-mono text-[var(--text-muted)]">
            Loading comments...
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-6 text-xs font-mono text-[var(--text-muted)]">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}

        <AnimatePresence>
          {comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3 py-3 border-b border-[var(--text)]/5 last:border-0"
            >
              {/* Avatar */}
              {c.avatar_url ? (
                <img
                  src={c.avatar_url}
                  alt={c.username || "User"}
                  className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-[var(--text)]/10"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{ background: gradientFromAddress(c.user_wallet) }}
                />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <UserLink
                    walletAddress={c.user_wallet}
                    truncateLen={4}
                    className="text-xs font-bold text-[var(--text)]"
                  />
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {timeAgo(c.created_at)}
                  </span>
                </div>
                <p className="text-xs font-mono text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap break-words">
                  {c.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
