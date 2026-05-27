import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Layers, Plus, BookOpen, Moon, Sun, User, Menu, X } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useThemeStore } from "@/store/useThemeStore";
import { ClientOnly } from "./ClientOnly";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", icon: Compass, label: "Discover" },
  { to: "/dashboard", icon: Layers, label: "Dashboard" },
  { to: "/create", icon: Plus, label: "Create" },
  { to: "/docs", icon: BookOpen, label: "Docs" },
] as const;

function NavButton({
  to,
  icon: Icon,
  active,
  label,
  onClick,
}: {
  to: string;
  icon: typeof Compass;
  active: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
        active
          ? "bg-[var(--text)]/10 text-[var(--accent)] shadow-inner"
          : "text-[var(--text)] hover:bg-[var(--text)]/5 hover:-translate-y-0.5",
      )}
    >
      <Icon size={18} />
    </Link>
  );
}

export function Header() {
  const location = useLocation();
  const { isDark, toggle } = useThemeStore();
  const wallet = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-[90vw] max-w-sm bg-[var(--bg)]/90 backdrop-blur-2xl shadow-xl rounded-2xl p-4 origin-bottom"
          >
            <div className="grid grid-cols-2 gap-2">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl font-display text-sm transition-colors",
                      active
                        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "hover:bg-[var(--surface-2)]",
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[var(--bg)]/70 backdrop-blur-2xl shadow-2xl rounded-full px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 transition-all duration-300">
        <Link
          to="/"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] shadow-[0_0_15px_var(--accent)] font-display font-bold text-black text-lg"
          aria-label="Ther home"
        >
          T
        </Link>

        <div className="w-[1px] h-6 bg-[var(--text)]/10 mx-1" />

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map((item) => (
            <NavButton
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 transition-all"
          aria-label="Open menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="w-[1px] h-6 bg-[var(--text)]/10 mx-1" />

        <ClientOnly>
          {wallet.connected && wallet.publicKey && (
            <Link
              to="/profile/$wallet"
              params={{ wallet: wallet.publicKey.toBase58() }}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 transition-all"
              aria-label="My profile"
            >
              <User size={18} />
            </Link>
          )}
        </ClientOnly>

        <button
          type="button"
          onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <ClientOnly fallback={<div className="h-10 w-[120px] rounded-full bg-[var(--surface-2)] animate-pulse" />}>
          <WalletMultiButton />
        </ClientOnly>
      </div>
    </header>
  );
}
