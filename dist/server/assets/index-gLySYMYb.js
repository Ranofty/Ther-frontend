import { L as jsxRuntimeExports, U as reactExports } from "./server-CNVNdsAu.js";
import { o as createLucideIcon, G as truncateAddress, a as ArrowLeftRight, p as formatNumber, f as Link, g as Plus, c as Compass, L as Layers, l as cn } from "./router-B3y7OxSE.js";
import { P as PulseIndicator } from "./PulseIndicator-BMBzIDHG.js";
import { l as useGlobalSwapFeed, n as usePlatformStats, p as useVaults } from "./useVaults-DNOt5NPY.js";
import { C as Coins } from "./coins-Dl6FejNz.js";
import { U as Users } from "./BadgeTag-CjMQMAjM.js";
import { F as Flame, V as VaultCard } from "./VaultCard-CEc4lBhf.js";
import { S as ShieldCheck } from "./shield-check-DZJlMfEF.js";
import { T as TrendingUp } from "./trending-up-5Z1p9d9_.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "buffer";
import "util";
import "http";
import "https";
import "stream";
import "url";
import "zlib";
import "fs";
import "assert";
import "path";
import "./clock-YOZa94Gt.js";
import "./lock-skwwkfdN.js";
const __iconNode = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function LiveTerminal() {
  const swaps = useGlobalSwapFeed(8);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[var(--bg)]/30 backdrop-blur-3xl rounded-3xl p-5 sm:p-6 shadow-[0_8px_48px_rgba(0,0,0,0.08)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PulseIndicator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest", children: "Live Swaps" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 max-h-[320px] overflow-hidden", children: swaps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "trade-entry flex items-center justify-between py-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-[var(--accent)] truncate", children: s.vault_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: truncateAddress(s.user_wallet, 3) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-mono px-3 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.token_in_symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { size: 10, className: "text-[var(--text-muted)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.token_out_symbol })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[var(--text)]", children: formatNumber(s.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-[var(--accent)]/15 text-[var(--accent)] text-[9px] px-1.5 py-0.5 rounded font-mono", children: "SWAP" })
          ] })
        ]
      },
      s.id
    )) })
  ] });
}
function HeroSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-16 sm:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 -z-10 pointer-events-none",
        style: {
          background: "radial-gradient(circle at 30% 50%, rgba(0, 229, 255, 0.06) 0%, transparent 70%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl sm:text-6xl font-display font-bold text-[var(--text)] leading-[1.05] tracking-tight mb-6", children: [
        "The protocol that",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent italic", children: "connects every token" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base font-mono text-[var(--text-muted)] mb-8 max-w-md leading-relaxed", children: "Group SPL tokens from any launchpad into immutable vaults. One swap, real on-chain volume for every token in the vault. Fixed 1:1 quantity, always." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/create",
            className: "flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-black font-bold font-display shadow-[0_4px_24px_rgba(0,229,255,0.25)] hover:shadow-[0_8px_32px_rgba(0,229,255,0.35)] transition-all duration-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
              "Create Vault"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            hash: "vaults",
            className: "flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--bg)]/30 backdrop-blur-xl font-display font-bold text-[var(--text)] hover:bg-[var(--surface-2)] transition-all duration-300",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { size: 18 }),
              "Explore Vaults"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTerminal, {}) })
  ] });
}
function StatNumber({ value, label, icon, format = "compact", suffix }) {
  const [display, setDisplay] = reactExports.useState(value);
  const [flip, setFlip] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (display !== value) {
      setDisplay(value);
      setFlip((f) => f + 1);
    }
  }, [value, display]);
  const text = format === "compact" ? formatNumber(display) : display.toLocaleString(void 0, { maximumFractionDigits: 2 });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--accent)] mb-1", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "text-2xl sm:text-3xl font-display font-bold text-[var(--text)] digit-flip inline-block",
        children: [
          text,
          suffix
        ]
      },
      flip
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest text-center", children: label })
  ] });
}
function StatsBar() {
  const stats = usePlatformStats();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[var(--bg)]/30 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto my-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatNumber, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 20 }), value: stats.total_vaults, label: "Vaults" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatNumber, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { size: 20 }), value: stats.total_swaps, label: "Swaps" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StatNumber,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 20 }),
        value: stats.total_sol_fees,
        label: "SOL Fees",
        format: "compact"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatNumber, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 }), value: stats.unique_wallets, label: "Wallets" })
  ] }) });
}
const TABS = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "newest", label: "Newest", icon: Sparkles },
  { id: "trusted", label: "Most Trusted", icon: ShieldCheck },
  { id: "biggest", label: "Biggest", icon: TrendingUp }
];
function VaultGrid() {
  const { vaults } = useVaults();
  const [tab, setTab] = reactExports.useState("trending");
  const sorted = reactExports.useMemo(() => {
    const arr = [...vaults];
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
  }, [vaults, tab]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "vaults", className: "scroll-mt-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-[var(--text)] mb-6", children: "Discover Vaults" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] backdrop-blur-xl mb-8", children: TABS.map((t) => {
      const Icon = t.icon;
      const active = tab === t.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTab(t.id),
          className: cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-medium transition-all duration-300",
            active ? "bg-[var(--text)] text-[var(--bg)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14 }),
            t.label
          ]
        },
        t.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[260px] gap-4 [&>*:first-child]:md:col-span-2 [&>*:first-child]:md:row-span-2", children: sorted.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(VaultCard, { vault: v, trending: i === 0 && tab === "trending" }, v.id)) })
  ] });
}
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VaultGrid, {})
  ] });
}
export {
  Home as component
};
