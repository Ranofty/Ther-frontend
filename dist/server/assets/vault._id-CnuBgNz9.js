import { L as jsxRuntimeExports, U as reactExports } from "./server-CNVNdsAu.js";
import { o as createLucideIcon, p as formatNumber, D as timeAgo, a as ArrowLeftRight, A as AnimatePresence, x as motion, n as create, I as useWallet, s as getReadOnlyProgram, h as PublicKey, m as connection, P as PROGRAM_ID, g as Plus, X, F as toast, w as gradientFromAddress, R as Route, f as Link } from "./router-B3y7OxSE.js";
import { s as saveSwapEvent, e as getVaultComments, c as getUserProfile, h as saveVaultComment, o as useVaultDetail } from "./useVaults-DNOt5NPY.js";
import { G as GlassCard } from "./GlassCard-CvLPIS28.js";
import { B as BadgeTag, A as Activity, U as Users, C as Calendar, S as SparkProgress } from "./BadgeTag-CjMQMAjM.js";
import { U as UserLink, S as Settings } from "./UserLink-Blq0afCi.js";
import { A as AtSign, S as Send, G as Globe } from "./send-DvLw6O4a.js";
import { S as ShieldCheck } from "./shield-check-DZJlMfEF.js";
import { b as Clock, C as CircleCheck, a as CircleX } from "./clock-YOZa94Gt.js";
import { L as Lock } from "./lock-skwwkfdN.js";
import { C as Coins } from "./coins-Dl6FejNz.js";
import { P as PulseIndicator } from "./PulseIndicator-BMBzIDHG.js";
import { W as Wallet, f as useSwap, e as useRevenueShare, u as useAddRevenueShare, c as useExtendLock, d as useRenounceVault, b as useDepositTokens } from "./useTherProgram-HHTMB16I.js";
import { Buffer } from "buffer";
import { C as ChartPie } from "./chart-pie-DWryeVBh.js";
import { T as TriangleAlert } from "./triangle-alert-Fm_oI22Z.js";
import { M as MessageSquare } from "./message-square-DZkxSgK4.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "util";
import "http";
import "https";
import "stream";
import "url";
import "zlib";
import "fs";
import "assert";
import "path";
const __iconNode$7 = [
  ["path", { d: "M12 17V3", key: "1cwfxf" }],
  ["path", { d: "m6 11 6 6 6-6", key: "12ii2o" }],
  ["path", { d: "M19 21H5", key: "150jfl" }]
];
const ArrowDownToLine = createLucideIcon("arrow-down-to-line", __iconNode$7);
const __iconNode$6 = [
  ["path", { d: "m18 9-6-6-6 6", key: "kcunyi" }],
  ["path", { d: "M12 3v14", key: "7cf3v8" }],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const ArrowUpFromLine = createLucideIcon("arrow-up-from-line", __iconNode$6);
const __iconNode$5 = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const BadgeCheck = createLucideIcon("badge-check", __iconNode$5);
const __iconNode$4 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$4);
const __iconNode$3 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$3);
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$2);
const __iconNode$1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$1);
const __iconNode = [
  ["path", { d: "m17 2 4 4-4 4", key: "nntrym" }],
  ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14", key: "84bu3i" }],
  ["path", { d: "m7 22-4-4 4-4", key: "1wqhfi" }],
  ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3", key: "1rx37r" }]
];
const Repeat = createLucideIcon("repeat", __iconNode);
function VaultHeader({ vault }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { className: "xl:col-span-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: vault.image_url,
        alt: vault.name,
        className: "w-24 h-24 rounded-2xl shadow-2xl object-cover flex-shrink-0"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-[var(--text)]", children: vault.name }),
        vault.twitter && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://x.com/${vault.twitter}`,
            target: "_blank",
            rel: "noreferrer",
            className: "text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 hover:-translate-y-0.5 transition-all",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(AtSign, { size: 18 })
          }
        ),
        vault.telegram && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: vault.telegram.startsWith("http") ? vault.telegram : `https://t.me/${vault.telegram}`,
            target: "_blank",
            rel: "noreferrer",
            className: "text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 hover:-translate-y-0.5 transition-all",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 })
          }
        ),
        vault.website && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: vault.website,
            target: "_blank",
            rel: "noreferrer",
            className: "text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 hover:-translate-y-0.5 transition-all",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 18 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)] mt-2 max-w-2xl", children: vault.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2 text-xs text-[var(--text-muted)] font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Creator:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserLink, { walletAddress: vault.creator, truncateLen: 6, className: "text-[var(--accent)] font-semibold" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mt-3", children: [
        vault.is_renounced ? /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { variant: "green", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 9 }), children: "Permanent" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(BadgeTag, { variant: "accent-2", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 9 }), children: [
          Math.max(0, Math.floor((vault.lock_expiry * 1e3 - Date.now()) / 864e5)),
          "d lock"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(BadgeTag, { children: [
          vault.tokens.length,
          " tokens"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { variant: "accent", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 9 }), children: "Verified" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 mt-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }), label: "Total Swaps", value: formatNumber(vault.total_swaps) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14 }), label: "Volume", value: `${vault.total_volume_sol.toFixed(1)} SOL` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }), label: "Wallets", value: formatNumber(vault.unique_wallets) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }), label: "Created", value: timeAgo(vault.created_at) })
      ] })
    ] })
  ] }) });
}
function Stat({ icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent)]", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-[var(--text)] font-bold", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider", children: label })
    ] })
  ] });
}
function TokenBalanceTable({ tokens }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 16, className: "text-[var(--accent)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-[var(--text)]", children: "Token Balances" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col", children: tokens.map((t) => {
      const depth = t.vault_balance / t.initial_deposit * 100;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 border-b border-[var(--text)]/5 last:border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-xs font-mono font-bold text-black flex-shrink-0", children: t.symbol.slice(0, 3) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-medium text-[var(--text)]", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[var(--accent)] text-sm", children: t.symbol }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)]", children: t.launchpad })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { icon: t.mint_revoked ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 9, className: "text-[var(--green)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 9, className: "text-[var(--red)]" }), children: "Mint" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { icon: t.freeze_revoked ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 9, className: "text-[var(--green)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 9, className: "text-[var(--red)]" }), children: "Freeze" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-[var(--text)] text-lg", children: formatNumber(t.vault_balance) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: [
              "of ",
              formatNumber(t.initial_deposit)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SparkProgress, { percentage: depth })
      ] }, t.mint);
    }) })
  ] });
}
function VaultSwapFeed({ swaps }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PulseIndicator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest", children: "Live Swaps" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono px-2 py-1 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]", children: [
        swaps.length,
        " recent"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[320px] overflow-y-auto flex flex-col gap-2 pr-1", children: [
      swaps.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-xs font-mono text-[var(--text-muted)]", children: "Waiting for swaps..." }),
      swaps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "trade-entry flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--surface-2)] text-xs font-mono",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 12, className: "text-[var(--text-muted)] flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserLink, { walletAddress: s.user_wallet, truncateLen: 3, className: "text-[var(--text-muted)] truncate" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.token_in_symbol }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { size: 10, className: "text-[var(--text-muted)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.token_out_symbol })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[var(--text)]", children: formatNumber(s.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--text-muted)] text-[10px]", children: timeAgo(s.timestamp) })
          ]
        },
        s.id
      ))
    ] })
  ] });
}
function TokenLogo({ symbol }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-[10px] font-mono font-bold text-black flex-shrink-0", children: symbol.slice(0, 3) });
}
function TokenSelector({ tokens, selected, onChange }) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "w-full bg-[var(--bg)]/80 backdrop-blur-xl rounded-2xl py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-2)] transition-colors",
        children: [
          selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TokenLogo, { symbol: selected.symbol }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-medium", children: selected.symbol })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-muted)] text-sm", children: "Select token" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              size: 16,
              className: `text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.15 },
        className: "absolute top-full left-0 right-0 mt-2 z-50 bg-[var(--bg)]/95 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto",
        children: tokens.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              onChange(t);
              setOpen(false);
            },
            className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-2)] cursor-pointer transition-colors text-left",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TokenLogo, { symbol: t.symbol }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-sm truncate", children: t.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[var(--accent)] text-xs", children: t.symbol })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-[var(--text-muted)]", children: formatNumber(t.vault_balance) })
            ]
          },
          t.mint
        ))
      }
    ) })
  ] });
}
const useSwapStore = create((set) => ({
  tokenIn: null,
  tokenOut: null,
  amount: "",
  setTokenIn: (tokenIn) => set({ tokenIn }),
  setTokenOut: (tokenOut) => set({ tokenOut }),
  setAmount: (amount) => set({ amount }),
  flipTokens: () => set((s) => ({ tokenIn: s.tokenOut, tokenOut: s.tokenIn })),
  reset: () => set({ tokenIn: null, tokenOut: null, amount: "" })
}));
function SwapPanel({
  vault,
  onSwapSuccess
}) {
  const { tokenIn, tokenOut, amount, setTokenIn, setTokenOut, setAmount, flipTokens, reset } = useSwapStore();
  const { swap, loading } = useSwap();
  const { connected, publicKey } = useWallet();
  reactExports.useEffect(() => {
    reset();
    if (vault.tokens.length >= 2) {
      setTokenIn(vault.tokens[0]);
      setTokenOut(vault.tokens[1]);
    }
  }, [vault.id]);
  const insufficientVault = tokenOut && Number(amount) > tokenOut.vault_balance;
  const disabled = !connected || !tokenIn || !tokenOut || !amount || Number(amount) <= 0 || insufficientVault || loading;
  async function handleSwap() {
    if (!tokenIn || !tokenOut || !publicKey) return;
    const swapAmount = Number(amount);
    const tx = await swap({
      vaultPubkey: vault.pubkey,
      tokenInMint: tokenIn.mint,
      tokenOutMint: tokenOut.mint,
      amount: swapAmount,
      tokenInDecimals: tokenIn.decimals
    });
    if (tx) {
      setAmount("");
      try {
        await saveSwapEvent({
          id: tx,
          vault_pubkey: vault.pubkey,
          vault_name: vault.name,
          user_wallet: publicKey.toBase58(),
          token_in_mint: tokenIn.mint,
          token_in_symbol: tokenIn.symbol,
          token_out_mint: tokenOut.mint,
          token_out_symbol: tokenOut.symbol,
          amount: swapAmount,
          fee_sol: 7e-3
        });
      } catch (err) {
        console.error("Failed to save swap event off-chain:", err);
      }
      if (onSwapSuccess) {
        onSwapSuccess(swapAmount, tokenIn.mint, tokenOut.mint, tx);
      }
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { blur: "3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-[var(--text)]", children: "SWAP" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
          "aria-label": "Swap settings",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-[var(--text-muted)] mb-2 block uppercase tracking-wider", children: "You send" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TokenSelector, { tokens: vault.tokens, selected: tokenIn, onChange: setTokenIn }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "number",
        inputMode: "decimal",
        value: amount,
        onChange: (e) => setAmount(e.target.value),
        placeholder: "0",
        className: "w-full bg-[var(--bg)]/80 backdrop-blur-xl rounded-2xl py-4 px-4 mt-2 text-2xl font-mono font-bold outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center my-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: flipTokens,
        className: "w-10 h-10 rounded-full flex items-center justify-center bg-[var(--surface-2)] hover:bg-[var(--surface)] cursor-pointer transition-all duration-300 hover:rotate-180",
        "aria-label": "Flip tokens",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 16 })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-mono text-[var(--text-muted)] mb-2 block uppercase tracking-wider", children: "You receive" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TokenSelector, { tokens: vault.tokens, selected: tokenOut, onChange: setTokenOut }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-[var(--bg)]/80 backdrop-blur-xl rounded-2xl py-4 px-4 mt-2 text-2xl font-mono font-bold text-[var(--accent)]", children: amount || "0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 12 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0.007 SOL swap fee" })
    ] }),
    tokenOut && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 12 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Available: ",
        formatNumber(tokenOut.vault_balance),
        " ",
        tokenOut.symbol
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleSwap,
        disabled,
        className: "w-full mt-4 py-4 rounded-2xl font-display font-bold text-black bg-[var(--accent)] text-base shadow-[0_4px_20px_rgba(0,229,255,0.3)] hover:shadow-[0_8px_32px_rgba(0,229,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        children: loading ? "Swapping..." : !connected ? "Connect Wallet" : insufficientVault ? "Insufficient vault balance" : "Swap"
      }
    )
  ] });
}
function pad(n) {
  return n.toString().padStart(2, "0");
}
function CountdownTimer({ expiry }) {
  const [now, setNow] = reactExports.useState(() => Date.now());
  reactExports.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(t);
  }, []);
  if (!expiry) return null;
  const diff = Math.max(0, expiry * 1e3 - now);
  const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1e3 * 60 * 60) % 24);
  const minutes = Math.floor(diff / (1e3 * 60) % 60);
  const seconds = Math.floor(diff / 1e3 % 60);
  const units = [
    [pad(days), "DAYS"],
    [pad(hours), "HRS"],
    [pad(minutes), "MIN"],
    [pad(seconds), "SEC"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2", children: units.map(([val, label], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-3xl sm:text-4xl font-mono font-bold text-[var(--text)] digit-flip inline-block",
          children: val
        },
        val
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mt-1", children: label })
    ] }),
    i < units.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-mono text-[var(--text-muted)] mb-4", children: ":" })
  ] }, label)) });
}
function LockStatusCard({ vault }) {
  const expired = vault.lock_type === "timed" && !vault.is_renounced && vault.lock_expiry * 1e3 < Date.now();
  const expiryDate = vault.lock_expiry > 0 ? new Date(vault.lock_expiry * 1e3).toLocaleDateString() : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16, className: "text-[var(--accent)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-[var(--text)]", children: "Lock Status" })
    ] }),
    vault.is_renounced ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 48, className: "text-[var(--green)] mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-xl text-[var(--text)]", children: "Permanently Renounced" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-[var(--text-muted)] mt-1", children: [
        "Renounced on ",
        new Date(vault.created_at).toLocaleDateString()
      ] })
    ] }) : vault.lock_type === "timed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CountdownTimer, { expiry: vault.lock_expiry }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-[var(--text-muted)] text-center mt-2", children: [
        "Unlocks ",
        expiryDate
      ] })
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Row,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownToLine, { size: 14 }),
        label: "Deposits",
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { variant: "green", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 9 }), children: "Open to Everyone" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Row,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 14 }),
        label: "Swaps",
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { variant: "green", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 9 }), children: "Always Open" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Row,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpFromLine, { size: 14 }),
        label: "Withdrawals",
        badge: vault.is_renounced ? /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { variant: "red", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 9 }), children: "Locked Forever" }) : expired ? /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { variant: "green", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 9 }), children: "Unlocked" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(BadgeTag, { variant: "red", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 9 }), children: [
          "Locked Until ",
          expiryDate
        ] })
      }
    )
  ] });
}
function Row({
  icon,
  label,
  badge
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-[var(--text)]/5 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]", children: [
      icon,
      label
    ] }),
    badge
  ] });
}
const LAMPORTS = 1e9;
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "—";
  }
}
function RevenueShareCard({
  vault: initialVault,
  onRefresh
}) {
  const { publicKey } = useWallet();
  const connected = publicKey?.toBase58();
  const [onChainShares, setOnChainShares] = reactExports.useState([]);
  const [onChainVault, setOnChainVault] = reactExports.useState(null);
  const [loadingOnChain, setLoadingOnChain] = reactExports.useState(true);
  const fetchOnChainData = reactExports.useCallback(async () => {
    try {
      setLoadingOnChain(true);
      const program = getReadOnlyProgram();
      const vaultPubkey = new PublicKey(initialVault.pubkey);
      const account = await program.account.vault.fetch(vaultPubkey);
      setOnChainVault(account);
      const discriminator = Buffer.from([55, 40, 228, 7, 139, 52, 180, 110]);
      const revAccounts = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [
          { memcmp: { offset: 0, bytes: discriminator.toString("base64"), encoding: "base64" } },
          { memcmp: { offset: 8, bytes: initialVault.pubkey } }
        ]
      });
      const revShares = [];
      for (const revAcc of revAccounts) {
        const data = revAcc.account.data;
        try {
          let offset = 8;
          const vaultPubkey2 = new PublicKey(data.slice(offset, offset + 32));
          offset += 32;
          const recipientPubkey = new PublicKey(data.slice(offset, offset + 32));
          offset += 32;
          const shareBps = data.readUInt16LE(offset);
          offset += 2;
          const accumulatedLamports = Number(data.readBigUInt64LE(offset));
          offset += 8;
          let totalClaimedLamports = 0;
          if (data.length >= offset + 8) {
            totalClaimedLamports = Number(data.readBigUInt64LE(offset));
            offset += 8;
          }
          let addedAt = 0;
          if (data.length >= offset + 8) {
            addedAt = Number(data.readBigInt64LE(offset));
            offset += 8;
          }
          revShares.push({
            recipient: recipientPubkey.toBase58(),
            share_bps: shareBps,
            accumulated_lamports: accumulatedLamports,
            total_claimed_lamports: totalClaimedLamports,
            added_at: addedAt > 0 ? new Date(addedAt * 1e3).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
          });
        } catch (e) {
          console.error("Failed to decode legacy revenue share:", e);
        }
      }
      setOnChainShares(revShares);
    } catch (err) {
      console.error("Failed to fetch on-chain revenue share data:", err);
    } finally {
      setLoadingOnChain(false);
    }
  }, [initialVault.pubkey]);
  reactExports.useEffect(() => {
    fetchOnChainData();
  }, [initialVault, fetchOnChainData]);
  const creator = onChainVault ? onChainVault.creator.toBase58() : initialVault.creator;
  const unallocatedBps = onChainVault ? onChainVault.unallocatedBps : initialVault.unallocated_bps;
  const revenueShares = onChainShares.length > 0 ? onChainShares : initialVault.revenue_shares;
  const isCreator = publicKey && publicKey.toBase58().toLowerCase() === creator.toLowerCase();
  const { claim, loading: claiming } = useRevenueShare();
  const { addRevenueShare, loading: addingShare } = useAddRevenueShare();
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [recipient, setRecipient] = reactExports.useState("");
  const [percentage, setPercentage] = reactExports.useState("");
  const totalAllocatedBps = 1e4 - unallocatedBps;
  const creatorImplicitBps = unallocatedBps;
  const totalClaimedAllTime = revenueShares.reduce(
    (acc, r) => acc + r.total_claimed_lamports,
    0
  );
  const totalAccumulated = revenueShares.reduce(
    (acc, r) => acc + r.accumulated_lamports,
    0
  );
  const explicitShares = revenueShares.filter((rs) => rs.share_bps > 0);
  const creatorEntry = revenueShares.find(
    (rs) => rs.recipient.toLowerCase() === creator.toLowerCase()
  );
  const creatorExplicitBps = creatorEntry ? creatorEntry.share_bps : 0;
  const totalAvailableBps = unallocatedBps + creatorExplicitBps;
  const allocationPercent = totalAllocatedBps / 100;
  const isApproachingFull = allocationPercent >= 80 && unallocatedBps > 0;
  const isFullyAllocated = unallocatedBps === 0;
  async function handleAddRecipient() {
    if (!recipient || !percentage) {
      toast.error("Please fill in both fields");
      return;
    }
    const pct = Number(percentage);
    const bps = Math.round(pct * 100);
    if (bps <= 0) {
      toast.error("Percentage must be greater than 0");
      return;
    }
    if (bps > totalAvailableBps) {
      toast.error(
        `Exceeds remaining allocation. Max: ${(totalAvailableBps / 100).toFixed(2)}%`
      );
      return;
    }
    const ok = await addRevenueShare(initialVault.pubkey, recipient, bps);
    if (ok) {
      setRecipient("");
      setPercentage("");
      setShowAddModal(false);
      fetchOnChainData();
      onRefresh?.();
    }
  }
  async function handleClaim() {
    const ok = await claim(initialVault.pubkey);
    if (ok) {
      fetchOnChainData();
      onRefresh?.();
    }
  }
  const typedBps = Math.round((Number(percentage) || 0) * 100);
  const remainingAfterAdd = Math.max(0, totalAvailableBps - typedBps);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 16, className: "text-[var(--accent)]" }),
            loadingOnChain && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute -top-1 -right-1 flex h-2 w-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-[var(--text)] text-sm", children: "Revenue Share" }),
              loadingOnChain && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 10, className: "animate-spin text-[var(--text-muted)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: "0.002 SOL per swap distributed by BPS" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          isFullyAllocated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-mono text-[10px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 10 }),
            " 100% Allocated"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] bg-[var(--accent)]/10 text-[var(--accent)] px-2.5 py-1 rounded-full", children: [
            (unallocatedBps / 100).toFixed(2),
            "% unallocated"
          ] }),
          isCreator && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowAddModal(true),
              className: "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-display font-bold bg-[var(--accent)] text-black hover:shadow-[0_0_16px_var(--accent)] transition-all",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                " Add"
              ]
            }
          )
        ] })
      ] }),
      creatorImplicitBps > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 py-3 px-3 mb-3 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 10, className: "text-[var(--accent)]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              UserLink,
              {
                walletAddress: creator,
                truncateLen: 4,
                className: "text-xs truncate text-[var(--text)]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded-full flex-shrink-0", children: "Creator" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm text-[var(--accent)] font-bold flex-shrink-0", children: [
            (creatorImplicitBps / 100).toFixed(2),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[var(--text-muted)] ml-7", children: "Implicit share — receives all unallocated swap fees by default" }),
        creatorEntry && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between ml-7 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 10, className: "text-[var(--green)]" }),
            (creatorEntry.accumulated_lamports / LAMPORTS).toFixed(6),
            " SOL claimable",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-muted)]/50 mx-1", children: "·" }),
            (creatorEntry.total_claimed_lamports / LAMPORTS).toFixed(4),
            " SOL claimed"
          ] }),
          connected === creator && creatorEntry.accumulated_lamports > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleClaim,
              disabled: claiming,
              className: "px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-[var(--green)]/15 text-[var(--green)] shadow-[0_0_12px_var(--green)] animate-pulse-dot disabled:opacity-40 transition-all hover:bg-[var(--green)] hover:text-black",
              children: "Claim"
            }
          )
        ] })
      ] }),
      explicitShares.length === 0 && creatorImplicitBps === 1e4 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-xs font-mono text-[var(--text-muted)]", children: "No partners added yet — creator receives 100% of swap fees." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col divide-y divide-[var(--text)]/5", children: explicitShares.map((rs) => {
        const isMe = connected === rs.recipient;
        const solAccumulated = rs.accumulated_lamports / LAMPORTS;
        const solClaimed = rs.total_claimed_lamports / LAMPORTS;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col gap-1.5 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-[var(--surface-2)] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 10, className: "text-[var(--text-muted)]" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    UserLink,
                    {
                      walletAddress: rs.recipient,
                      truncateLen: 4,
                      className: "text-xs truncate text-[var(--text)]"
                    }
                  ),
                  rs.recipient.toLowerCase() === creator.toLowerCase() && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded-full flex-shrink-0", children: "Creator" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm text-[var(--accent)] font-bold flex-shrink-0", children: [
                  (rs.share_bps / 100).toFixed(2),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between ml-7 text-[10px] font-mono text-[var(--text-muted)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 10, className: "text-[var(--green)]" }),
                    solAccumulated.toFixed(6),
                    " SOL"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-muted)]/40", children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    solClaimed.toFixed(4),
                    " claimed"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-muted)]/40", children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 9 }),
                    formatDate(rs.added_at)
                  ] })
                ] }),
                isMe && rs.accumulated_lamports > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleClaim,
                    disabled: claiming,
                    className: "px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-[var(--green)]/15 text-[var(--green)] shadow-[0_0_12px_var(--green)] animate-pulse-dot disabled:opacity-40 transition-all hover:bg-[var(--green)] hover:text-black",
                    children: "Claim"
                  }
                )
              ] })
            ]
          },
          rs.recipient
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 pt-3 border-t border-[var(--text)]/5 text-[10px] font-mono text-[var(--text-muted)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: totalAccumulated > 0 ? `${(totalAccumulated / LAMPORTS).toFixed(6)} SOL unclaimed` : "No unclaimed revenue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Total claimed: ",
          (totalClaimedAllTime / LAMPORTS).toFixed(4),
          " SOL"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showAddModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setShowAddModal(false),
          className: "absolute inset-0 bg-black/60 backdrop-blur-md"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 },
          className: "relative w-full max-w-md bg-[var(--bg)]/90 border border-[var(--text)]/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl z-10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-bold text-[var(--text)]", children: "Add Revenue Recipient" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[var(--text-muted)] mt-0.5", children: "Permanent & immutable — cannot be edited or removed" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setShowAddModal(false),
                  className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Recipient Wallet Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: recipient,
                    onChange: (e) => setRecipient(e.target.value),
                    placeholder: "e.g. 7xKXtg2CW87d97TXJSDpbD5jBkh...",
                    className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Share Percentage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: percentage,
                    onChange: (e) => setPercentage(e.target.value),
                    placeholder: `Max ${(totalAvailableBps / 100).toFixed(2)}%`,
                    min: "0.01",
                    step: "0.01",
                    max: totalAvailableBps / 100,
                    className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-[var(--surface)] border border-[var(--text)]/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-mono mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-muted)]", children: "Currently allocated" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--text)]", children: [
                    (totalAllocatedBps / 100).toFixed(2),
                    "%"
                  ] })
                ] }),
                typedBps > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-mono mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent)]", children: "+ New allocation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--accent)]", children: [
                    (typedBps / 100).toFixed(2),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] font-mono pt-1.5 border-t border-[var(--text)]/5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-muted)]", children: "Creator keeps (unallocated)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-bold ${remainingAfterAdd === 0 ? "text-red-400" : "text-[var(--green)]"}`, children: [
                    (remainingAfterAdd / 100).toFixed(2),
                    "%"
                  ] })
                ] })
              ] }),
              typedBps > totalAvailableBps && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
                "Exceeds remaining allocation (",
                (totalAvailableBps / 100).toFixed(2),
                "% available)"
              ] }),
              remainingAfterAdd === 0 && typedBps > 0 && typedBps <= totalAvailableBps && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
                "This will allocate 100% — creator gets 0% of future swap fees. No more addresses can ever be added."
              ] }),
              isApproachingFull && remainingAfterAdd > 0 && typedBps > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
                "Approaching full allocation — only ",
                (remainingAfterAdd / 100).toFixed(2),
                "% will remain for the creator."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleAddRecipient,
                  disabled: addingShare || typedBps > totalAvailableBps || typedBps <= 0,
                  className: "w-full mt-2 py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-display font-bold text-sm hover:opacity-95 active:scale-[0.98] disabled:opacity-40 transition-all flex items-center justify-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14 }),
                    addingShare ? "Adding permanently..." : "Add Recipient (Permanent)"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-mono text-[var(--text-muted)] text-center leading-relaxed", children: "Once added, this allocation is locked forever by the smart contract. No editing. No removing. The rent cost is ≈ 0.00157 SOL." })
            ] })
          ]
        }
      )
    ] }) })
  ] });
}
function CreatorPanel({
  vault,
  onRefresh
}) {
  const { publicKey } = useWallet();
  const isCreator = publicKey && publicKey.toBase58().toLowerCase() === vault.creator.toLowerCase();
  const [showRevShareModal, setShowRevShareModal] = reactExports.useState(false);
  const [recipientAddress, setRecipientAddress] = reactExports.useState("");
  const [shareBps, setShareBps] = reactExports.useState("");
  const [showExtendModal, setShowExtendModal] = reactExports.useState(false);
  const [showRenounceModal, setShowRenounceModal] = reactExports.useState(false);
  const [extendDays, setExtendDays] = reactExports.useState("");
  const { addRevenueShare, loading: addingShare } = useAddRevenueShare();
  const { extendLock, loading: extendingLock } = useExtendLock();
  const { renounceVault, loading: renouncingVault } = useRenounceVault();
  if (!isCreator) return null;
  const lockDaysRemaining = vault.lock_type === "timed" && !vault.is_renounced ? Math.max(0, Math.floor((vault.lock_expiry * 1e3 - Date.now()) / 864e5)) : null;
  async function handleAddRevShare() {
    if (!recipientAddress || !shareBps) {
      toast.error("Please fill in both fields");
      return;
    }
    const bps = Math.round(Number(shareBps) * 100);
    if (bps <= 0 || bps > vault.unallocated_bps) {
      toast.error(
        `Invalid percentage. Max available: ${(vault.unallocated_bps / 100).toFixed(0)}%`
      );
      return;
    }
    const ok = await addRevenueShare(vault.pubkey, recipientAddress, bps);
    if (ok) {
      setRecipientAddress("");
      setShareBps("");
      setShowRevShareModal(false);
      onRefresh?.();
    }
  }
  async function handleExtendLock() {
    if (!extendDays) {
      toast.error("Please enter the number of days");
      return;
    }
    const days = Math.round(Number(extendDays));
    if (days < 1) {
      toast.error("Minimum extension is 1 day");
      return;
    }
    const seconds = days * 86400;
    const tx = await extendLock(vault.pubkey, seconds);
    if (tx) {
      setExtendDays("");
      setShowExtendModal(false);
      onRefresh?.();
    }
  }
  async function handleRenounce() {
    const tx = await renounceVault(vault.pubkey);
    if (tx) {
      setShowRenounceModal(false);
      onRefresh?.();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16, className: "text-[var(--accent)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-[var(--text)]", children: "Creator Controls" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-[var(--text)]/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }),
          "Lock Time"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-bold text-[var(--text)]", children: vault.is_renounced ? "Permanent" : lockDaysRemaining !== null ? `${lockDaysRemaining} days remaining` : "Unlocked" }),
          vault.lock_type === "timed" && !vault.is_renounced && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowExtendModal(true),
              className: "px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all",
              children: "Extend"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-[var(--text)]/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }),
          "Renounce Status"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-sm font-mono font-bold ${vault.is_renounced ? "text-[var(--green)]" : "text-[var(--text)]"}`,
              children: vault.is_renounced ? "Permanently Renounced" : "Not Renounced"
            }
          ),
          !vault.is_renounced && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowRenounceModal(true),
              className: "px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all",
              children: "Renounce"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-mono text-[var(--text-muted)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 14 }),
          "Revenue Shares"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-[var(--accent)]", children: [
            (vault.unallocated_bps / 100).toFixed(0),
            "% available"
          ] }),
          vault.unallocated_bps > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowRevShareModal(true),
              className: "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-all",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                "Add"
              ]
            }
          )
        ] })
      ] }),
      vault.revenue_shares.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-col gap-1.5", children: vault.revenue_shares.map((rs) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--surface-2)] text-xs font-mono",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 10, className: "text-[var(--text-muted)] flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--text)] truncate", children: [
                rs.recipient.slice(0, 6),
                "...",
                rs.recipient.slice(-4)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--accent)] font-bold flex-shrink-0", children: [
              (rs.share_bps / 100).toFixed(0),
              "%"
            ] })
          ]
        },
        rs.recipient
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showRevShareModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setShowRevShareModal(false),
          className: "absolute inset-0 bg-black/60 backdrop-blur-md"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 },
          className: "relative w-full max-w-md bg-[var(--bg)]/90 border border-[var(--text)]/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl z-10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-bold text-[var(--text)]", children: "Add Revenue Share" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-[var(--text-muted)]", children: [
                  (vault.unallocated_bps / 100).toFixed(0),
                  "% unallocated remaining"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setShowRevShareModal(false),
                  className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Recipient Wallet Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: recipientAddress,
                    onChange: (e) => setRecipientAddress(e.target.value),
                    placeholder: "e.g. 7xKXtg2CW87d97TXJSDpbD5jBkh...",
                    className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: [
                  "Share Percentage (max ",
                  (vault.unallocated_bps / 100).toFixed(0),
                  "%)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: shareBps,
                    onChange: (e) => setShareBps(e.target.value),
                    placeholder: "e.g. 10",
                    min: "1",
                    max: vault.unallocated_bps / 100,
                    className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleAddRevShare,
                  disabled: addingShare,
                  className: "w-full mt-2 py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-display font-bold text-sm hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2",
                  children: addingShare ? "Adding..." : "Add Revenue Share"
                }
              )
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showExtendModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setShowExtendModal(false),
          className: "absolute inset-0 bg-black/60 backdrop-blur-md"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 },
          className: "relative w-full max-w-md bg-[var(--bg)]/90 border border-[var(--text)]/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl z-10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-bold text-[var(--text)]", children: "Extend Lock Duration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[var(--text-muted)]", children: "Timed locks can only be extended, not shortened." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setShowExtendModal(false),
                  className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Additional Days to Lock" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    value: extendDays,
                    onChange: (e) => setExtendDays(e.target.value),
                    placeholder: "e.g. 30",
                    min: "1",
                    className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleExtendLock,
                  disabled: extendingLock,
                  className: "w-full mt-2 py-3 rounded-xl bg-[var(--accent)] text-white font-display font-bold text-sm hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2",
                  children: extendingLock ? "Extending..." : "Extend Lock Time"
                }
              )
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showRenounceModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setShowRenounceModal(false),
          className: "absolute inset-0 bg-black/60 backdrop-blur-md"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 },
          className: "relative w-full max-w-md bg-[var(--bg)]/90 border border-[var(--text)]/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl z-10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-bold text-red-500", children: "Renounce Vault?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-red-400", children: "WARNING: This action is permanent and irreversible." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setShowRenounceModal(false),
                  className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[var(--text-muted)] leading-relaxed font-mono", children: "Renouncing this vault will permanently lock all tokens inside forever. You will no longer be able to withdraw them, extend lock times, or manage vault options. Ensure this is exactly what you intend." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleRenounce,
                  disabled: renouncingVault,
                  className: "w-full mt-2 py-3 rounded-xl bg-red-500 text-white font-display font-bold text-sm hover:bg-red-600 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2",
                  children: renouncingVault ? "Renouncing..." : "I Understand, Renounce Permanently"
                }
              )
            ] })
          ]
        }
      )
    ] }) })
  ] });
}
function DepositSection({
  vault,
  onDepositSuccess
}) {
  const { connected } = useWallet();
  const { deposit, loading } = useDepositTokens();
  const [expanded, setExpanded] = reactExports.useState(false);
  const [selectedMint, setSelectedMint] = reactExports.useState(vault.tokens[0]?.mint || "");
  const [amount, setAmount] = reactExports.useState("");
  const selectedToken = vault.tokens.find((t) => t.mint === selectedMint);
  async function handleDeposit() {
    if (!selectedToken || !amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const tx = await deposit({
      vaultPubkey: vault.pubkey,
      tokenMint: selectedToken.mint,
      amount: Number(amount),
      decimals: selectedToken.decimals
    });
    if (tx) {
      setAmount("");
      onDepositSuccess?.();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setExpanded(!expanded),
        className: "flex items-center justify-between w-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownToLine, { size: 16, className: "text-[var(--accent)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-[var(--text)]", children: "Deposit Tokens" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[var(--text-muted)]", children: "Anyone can deposit" }),
            expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 16, className: "text-[var(--text-muted)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: "text-[var(--text-muted)]" })
          ] })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[var(--text-muted)]", children: "Deposit tokens to increase the vault's liquidity depth. This helps support swap availability." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Select Token" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: selectedMint,
            onChange: (e) => setSelectedMint(e.target.value),
            className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-sm outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)] appearance-none cursor-pointer",
            children: vault.tokens.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: t.mint, children: [
              t.symbol,
              " — ",
              formatNumber(t.vault_balance),
              " in vault"
            ] }, t.mint))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Amount to Deposit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            inputMode: "decimal",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            placeholder: "0",
            className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-lg font-bold outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
          }
        ),
        selectedToken && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: [
          "Current vault balance: ",
          formatNumber(selectedToken.vault_balance),
          " ",
          selectedToken.symbol
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleDeposit,
          disabled: !connected || loading || !amount || Number(amount) <= 0,
          className: "w-full py-3 rounded-xl font-display font-bold text-sm bg-[var(--green)]/15 text-[var(--green)] border border-[var(--green)]/20 hover:bg-[var(--green)]/25 hover:shadow-[0_0_20px_rgba(0,212,170,0.15)] transition-all disabled:opacity-40 disabled:cursor-not-allowed",
          children: loading ? "Depositing..." : !connected ? "Connect Wallet to Deposit" : `Deposit ${selectedToken?.symbol || "Tokens"}`
        }
      )
    ] })
  ] });
}
function CommentsSection({ vaultId }) {
  const { publicKey, connected } = useWallet();
  const [comments, setComments] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [content, setContent] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
      let username;
      let avatarUrl;
      try {
        const profile = await getUserProfile(walletAddr);
        username = profile?.username || void 0;
        avatarUrl = profile?.avatar_url || void 0;
      } catch {
      }
      const comment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        vault_id: vaultId,
        user_wallet: walletAddr,
        username,
        avatar_url: avatarUrl,
        content: content.trim(),
        created_at: (/* @__PURE__ */ new Date()).toISOString()
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 16, className: "text-[var(--accent)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-[var(--text)]", children: "Comments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]", children: comments.length })
    ] }),
    connected ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: content,
          onChange: (e) => setContent(e.target.value),
          placeholder: "Share your thoughts on this vault...",
          rows: 2,
          maxLength: 500,
          className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)] resize-none pr-12",
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleSubmit,
          disabled: submitting || !content.trim(),
          className: "absolute right-3 bottom-3 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 disabled:opacity-40 transition-all",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 })
        }
      )
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-3 mb-4 rounded-xl bg-[var(--surface-2)] text-xs font-mono text-[var(--text-muted)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 14, className: "inline mr-2" }),
      "Connect wallet to comment"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1", children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-xs font-mono text-[var(--text-muted)]", children: "Loading comments..." }),
      !loading && comments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-xs font-mono text-[var(--text-muted)]", children: "No comments yet. Be the first to share your thoughts!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: comments.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "flex gap-3 py-3 border-b border-[var(--text)]/5 last:border-0",
          children: [
            c.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: c.avatar_url,
                alt: c.username || "User",
                className: "w-8 h-8 rounded-full flex-shrink-0 object-cover border border-[var(--text)]/10"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-full flex-shrink-0",
                style: { background: gradientFromAddress(c.user_wallet) }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UserLink,
                  {
                    walletAddress: c.user_wallet,
                    truncateLen: 4,
                    className: "text-xs font-bold text-[var(--text)]"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: timeAgo(c.created_at) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap break-words", children: c.content })
            ] })
          ]
        },
        c.id
      )) })
    ] })
  ] });
}
function VaultDetailPage() {
  const {
    id
  } = Route.useParams();
  const {
    vault,
    swaps,
    refetch,
    addLocalSwap
  } = useVaultDetail(id);
  if (!vault) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen pb-40 flex items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold mb-3", children: "Vault not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-[var(--accent)] font-mono text-sm hover:underline", children: "← Back to discovery" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-12 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:col-span-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VaultHeader, { vault }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-8 flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TokenBalanceTable, { tokens: vault.tokens }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DepositSection, { vault, onDepositSuccess: refetch }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommentsSection, { vaultId: vault.id }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VaultSwapFeed, { swaps })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-4 flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SwapPanel, { vault, onSwapSuccess: (amount, tokenIn, tokenOut) => {
        addLocalSwap(amount, tokenIn, tokenOut);
        refetch();
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreatorPanel, { vault, onRefresh: refetch }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LockStatusCard, { vault }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RevenueShareCard, { vault, onRefresh: refetch })
    ] })
  ] }) });
}
export {
  VaultDetailPage as component
};
