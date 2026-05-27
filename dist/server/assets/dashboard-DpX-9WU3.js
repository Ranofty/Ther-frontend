import { L as jsxRuntimeExports, U as reactExports } from "./server-CNVNdsAu.js";
import { o as createLucideIcon, C as ClientOnly, I as useWallet, W as WalletMultiButton, w as gradientFromAddress, f as Link, G as truncateAddress, L as Layers, p as formatNumber, l as cn, g as Plus, F as toast } from "./router-B3y7OxSE.js";
import { G as GlassCard } from "./GlassCard-CvLPIS28.js";
import { W as Wallet, e as useRevenueShare, g as useUpdatePlatformConfig } from "./useTherProgram-HHTMB16I.js";
import { p as useVaults, m as usePlatformConfig } from "./useVaults-DNOt5NPY.js";
import { u as useUserProfile, S as Settings } from "./UserLink-Blq0afCi.js";
import { C as Coins } from "./coins-Dl6FejNz.js";
import { T as TrendingUp } from "./trending-up-5Z1p9d9_.js";
import { C as ChartPie } from "./chart-pie-DWryeVBh.js";
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
const __iconNode$1 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$1);
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
const LAMPORTS = 1e9;
function DashboardPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClientOnly, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardInner, {}) }) });
}
function DashboardInner() {
  const {
    connected,
    publicKey
  } = useWallet();
  const [tab, setTab] = reactExports.useState("vaults");
  if (!connected || !publicKey) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh] text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 36, className: "text-[var(--accent)] mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold mb-2", children: "Connect your wallet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)] mb-6", children: "Manage your vaults and claim revenue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WalletMultiButton, {})
    ] });
  }
  const wallet = publicKey.toBase58();
  const profile = useUserProfile(wallet);
  const username = profile?.username;
  const avatarUrl = profile?.avatar_url;
  const {
    vaults: allVaults
  } = useVaults();
  const myVaults = allVaults.filter((v) => v.creator.toLowerCase() === wallet.toLowerCase());
  const totalEarned = myVaults.reduce((acc, v) => acc + v.revenue_shares.reduce((a, r) => a + r.total_claimed_lamports + r.accumulated_lamports, 0), 0);
  const totalUnclaimed = myVaults.reduce((acc, v) => acc + v.revenue_shares.reduce((a, r) => a + r.accumulated_lamports, 0), 0);
  const totalSwaps = myVaults.reduce((acc, v) => acc + v.total_swaps, 0);
  const TABS = [{
    id: "vaults",
    label: "My Vaults",
    icon: Layers
  }, {
    id: "analytics",
    label: "Analytics",
    icon: ChartColumn
  }, {
    id: "revenue",
    label: "Revenue",
    icon: Coins
  }, {
    id: "settings",
    label: "Settings",
    icon: Settings
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 flex-wrap", children: [
      avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: avatarUrl, alt: username || "Avatar", className: "w-16 h-16 rounded-full flex-shrink-0 object-cover border border-[var(--text)]/10 shadow-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full flex-shrink-0", style: {
        background: gradientFromAddress(wallet)
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-[var(--text)]", children: username || "Anonymous User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/profile/$wallet", params: {
            wallet
          }, className: "text-xs text-[var(--accent)] hover:underline flex items-center gap-1 font-mono", children: [
            "View Profile ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 10 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-[var(--text-muted)] truncate mt-1", children: truncateAddress(wallet, 6) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 mt-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 14 }), value: `${(totalEarned / LAMPORTS).toFixed(2)} SOL`, label: "Earned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 14 }), value: `${myVaults.length}`, label: "Vaults" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }), value: formatNumber(totalSwaps), label: "Swaps" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] backdrop-blur-xl mb-6", children: TABS.map((t) => {
      const Icon = t.icon;
      const active = tab === t.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTab(t.id), className: cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-medium transition-all", active ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14 }),
        " ",
        t.label
      ] }, t.id);
    }) }),
    tab === "vaults" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: myVaults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { className: "text-center py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 36, className: "text-[var(--accent)] mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-2", children: "No vaults yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/create", className: "inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-2xl bg-[var(--accent)] text-black font-bold font-display", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
        " Create your first vault"
      ] })
    ] }) : myVaults.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.image_url, alt: v.name, className: "w-16 h-16 rounded-2xl object-cover flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold text-[var(--text)]", children: v.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 text-xs font-mono text-[var(--text-muted)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 12, className: "text-[var(--green)]" }),
          "+",
          formatNumber(v.total_swaps),
          " 24h swaps"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono font-bold text-[var(--accent)]", children: [
          (v.revenue_shares.reduce((a, r) => a + r.accumulated_lamports, 0) / LAMPORTS).toFixed(3),
          " SOL"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: "unclaimed" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vault/$id", params: {
          id: v.id
        }, className: "p-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vault/$id", params: {
          id: v.id
        }, className: "p-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 14 }) })
      ] })
    ] }) }, v.id)) }),
    tab === "revenue" && /* @__PURE__ */ jsxRuntimeExports.jsx(RevenueTab, { vaults: myVaults, totalUnclaimed }),
    tab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { className: "text-center py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 36, className: "text-[var(--accent)] mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-xl mb-1", children: "Analytics coming soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)]", children: "Detailed swap charts, volume breakdowns, and depth history." })
    ] }),
    tab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformSettingsSection, { wallet })
  ] });
}
function RevenueTab({
  vaults,
  totalUnclaimed
}) {
  const {
    claim,
    loading
  } = useRevenueShare();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-4xl font-display font-bold text-[var(--accent)]", children: [
          (totalUnclaimed / LAMPORTS).toFixed(3),
          " SOL"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider", children: "Unclaimed across all vaults" })
      ] }),
      totalUnclaimed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => vaults.forEach((v) => claim(v.pubkey)), disabled: loading, className: "flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--green)] text-black font-bold font-display shadow-[0_4px_20px_rgba(0,212,170,0.3)] disabled:opacity-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 16 }),
        " Claim All"
      ] })
    ] }) }),
    vaults.map((v) => {
      const unclaimed = v.revenue_shares.reduce((a, r) => a + r.accumulated_lamports, 0);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.image_url, alt: v.name, className: "w-12 h-12 rounded-xl object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold truncate", children: v.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono text-[var(--text-muted)]", children: [
            (unclaimed / LAMPORTS).toFixed(4),
            " SOL accumulated"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => claim(v.pubkey), disabled: loading || unclaimed === 0, className: `px-4 py-2 rounded-xl text-sm font-mono font-bold bg-[var(--green)]/15 text-[var(--green)] disabled:opacity-40 ${unclaimed > 0 ? "animate-pulse-dot shadow-[0_0_12px_var(--green)]" : ""}`, children: "Claim" })
      ] }) }, v.id);
    })
  ] });
}
function Stat({
  icon,
  value,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent)]", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-sm text-[var(--text)]", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider", children: label })
    ] })
  ] });
}
function PlatformSettingsSection({
  wallet
}) {
  const {
    config,
    loading: configLoading
  } = usePlatformConfig();
  const {
    updateConfig,
    loading: updating
  } = useUpdatePlatformConfig();
  const [platformWallet, setPlatformWallet] = reactExports.useState("");
  const [creationFee, setCreationFee] = reactExports.useState("");
  const [platformFee, setPlatformFee] = reactExports.useState("");
  const [creatorFee, setCreatorFee] = reactExports.useState("");
  const [minDepositBps, setMinDepositBps] = reactExports.useState("");
  const [loaded, setLoaded] = reactExports.useState(false);
  if (config && !loaded) {
    setPlatformWallet(config.platformWallet);
    setCreationFee(config.creationFee.toString());
    setPlatformFee(config.platformFee.toString());
    setCreatorFee(config.creatorFee.toString());
    setMinDepositBps(config.minimumDepositBps.toString());
    setLoaded(true);
  }
  const isAuthority = config?.authority === wallet;
  const totalSwapFee = (Number(platformFee) || 0) + (Number(creatorFee) || 0);
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isAuthority) {
      toast.error("Only the platform authority can modify settings.");
      return;
    }
    try {
      const success = await updateConfig({
        platformWallet,
        creationFee: Number(creationFee),
        swapFee: totalSwapFee,
        platformFee: Number(platformFee),
        creatorFee: Number(creatorFee),
        minimumDepositBps: Number(minDepositBps)
      });
      if (success) {
        toast.success("Platform settings updated on-chain!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update platform configuration.");
    }
  };
  if (configLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { className: "py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full border-2 border-t-transparent border-[var(--accent)] animate-spin mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)]", children: "Fetching on-chain configuration..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 max-w-xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-[var(--text)]", children: "Platform Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[var(--text-muted)]", children: "On-chain configuration for fees, routing, and parameters" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdate, className: "flex flex-col gap-4 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-display font-semibold text-[var(--text-muted)]", children: "Platform Wallet Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, disabled: !isAuthority, value: platformWallet, onChange: (e) => setPlatformWallet(e.target.value), className: "w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-display font-semibold text-[var(--text-muted)]", children: "Vault Creation Fee (SOL)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.001", required: true, disabled: !isAuthority, value: creationFee, onChange: (e) => setCreationFee(e.target.value), className: "w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-display font-semibold text-[var(--text-muted)]", children: "Min Deposit Basis Points (BPS)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, disabled: !isAuthority, value: minDepositBps, onChange: (e) => setMinDepositBps(e.target.value), className: "w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60", placeholder: "100 = 1%" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-[var(--text)]/10 my-2 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-display font-semibold mb-3 text-[var(--text)]", children: "Swap Fee Distribution" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-display font-semibold text-[var(--text-muted)]", children: "Platform Portion (SOL)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.0001", required: true, disabled: !isAuthority, value: platformFee, onChange: (e) => setPlatformFee(e.target.value), className: "w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-display font-semibold text-[var(--text-muted)]", children: "Creator Portion (SOL)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.0001", required: true, disabled: !isAuthority, value: creatorFee, onChange: (e) => setCreatorFee(e.target.value), className: "w-full bg-[var(--surface)] border border-[var(--text)]/10 rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] disabled:opacity-60" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--text)]/5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-display font-medium text-[var(--text-muted)]", children: "Total Swap Fee Charged to Users:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono font-bold text-[var(--accent)]", children: [
              totalSwapFee.toFixed(4),
              " SOL"
            ] })
          ] })
        ] }),
        isAuthority ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: updating, className: "w-full mt-4 py-3 px-6 rounded-xl bg-[var(--accent)] text-black font-display font-bold text-sm shadow-[0_4px_20px_rgba(var(--accent-rgb),0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50", children: updating ? "Updating On-Chain..." : "Update Platform Settings" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs font-mono text-amber-400", children: "⚠️ Connected wallet is not the platform authority. Settings are read-only." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { className: "p-4 bg-[var(--surface)] text-center text-[10px] font-mono text-[var(--text-muted)] border border-[var(--text)]/5", children: [
      "Platform Authority: ",
      config?.authority
    ] })
  ] });
}
export {
  DashboardPage as component
};
