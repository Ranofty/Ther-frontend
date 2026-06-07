import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, Trash2, Repeat, Coins, ArrowDown, Sparkles, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Link } from "@tanstack/react-router";

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll, dismissOne } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "swap":
        return <Repeat size={14} className="text-[var(--accent)]" />;
      case "claim":
        return <Coins size={14} className="text-emerald-500" />;
      case "deposit":
        return <ArrowDown size={14} className="text-blue-500" />;
      case "vault_created":
        return <Sparkles size={14} className="text-purple-500" />;
      case "referral":
        return <Gift size={14} className="text-amber-500" />;
      default:
        return <Bell size={14} className="text-[var(--text-muted)]" />;
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 transition-all relative text-[var(--text)]"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold font-mono text-white flex items-center justify-center shadow-lg border border-[var(--bg)]"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Upward Opening Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="absolute bottom-[calc(100%+16px)] right-0 w-[85vw] sm:w-[380px] bg-[var(--bg)]/90 backdrop-blur-3xl shadow-2xl border border-[var(--text)]/10 rounded-2xl overflow-hidden z-50 origin-bottom-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--text)]/5 bg-[var(--text)]/5">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-sm text-[var(--text)]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-[var(--accent)]/15 text-[var(--accent)] px-1.5 py-0.5 rounded font-mono font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllRead}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--text)]/5 rounded transition duration-200"
                      title="Mark all read"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={clearAll}
                      className="p-1 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded transition duration-200"
                      title="Clear all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-[var(--text)]/5 custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-3.5 hover:bg-[var(--text)]/5 transition duration-200 group relative ${
                      !n.read ? "bg-[var(--accent)]/5" : ""
                    }`}
                  >
                    <div className="p-2 bg-[var(--text)]/5 rounded-lg shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between mb-0.5 gap-2">
                        <span className="font-semibold text-xs text-[var(--text)] truncate">{n.title}</span>
                        <span className="text-[9px] text-[var(--text-muted)] font-mono shrink-0">
                          {getRelativeTime(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-1 break-words">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2">
                        {n.vaultId && (
                          <Link
                            to="/vault/$id"
                            params={{ id: n.vaultId }}
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] text-[var(--accent)] hover:underline font-mono"
                          >
                            View Vault
                          </Link>
                        )}
                        {n.txHash && (
                          <a
                            href={`https://solscan.io/tx/${n.txHash}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text)] hover:underline font-mono"
                          >
                            Solscan
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => dismissOne(n.id)}
                      className="absolute right-3 top-3.5 p-0.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--text)]/10 rounded transition duration-200 opacity-0 group-hover:opacity-100"
                      title="Dismiss"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Bell size={24} className="text-[var(--text-muted)]/20 mb-2" />
                  <p className="text-xs text-[var(--text-muted)] font-display">All caught up!</p>
                  <p className="text-[10px] text-[var(--text-muted)]/75 mt-0.5">
                    Your notifications will appear here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
