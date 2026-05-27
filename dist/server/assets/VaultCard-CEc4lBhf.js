import { U as reactExports, L as jsxRuntimeExports } from "./server-CNVNdsAu.js";
import { o as createLucideIcon, f as Link, p as formatNumber, D as timeAgo } from "./router-B3y7OxSE.js";
import { B as BadgeTag, S as SparkProgress, A as Activity, U as Users, C as Calendar } from "./BadgeTag-CjMQMAjM.js";
import { S as ShieldCheck } from "./shield-check-DZJlMfEF.js";
import { b as Clock, C as CircleCheck, a as CircleX } from "./clock-YOZa94Gt.js";
import { C as Coins } from "./coins-Dl6FejNz.js";
import { L as Lock } from "./lock-skwwkfdN.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
      key: "1slcih"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
function VaultCard({ vault, trending }) {
  const [fav, setFav] = reactExports.useState(false);
  const avgDepth = vault.tokens.reduce((acc, t) => acc + t.vault_balance / t.initial_deposit, 0) / vault.tokens.length * 100;
  const launchpads = Array.from(new Set(vault.tokens.map((t) => t.launchpad)));
  const allMintRevoked = vault.tokens.every((t) => t.mint_revoked);
  const allFreezeRevoked = vault.tokens.every((t) => t.freeze_revoked);
  const lockLabel = vault.is_renounced ? "Permanent" : vault.lock_type === "timed" ? `${Math.max(0, Math.floor((vault.lock_expiry * 1e3 - Date.now()) / (1e3 * 60 * 60 * 24)))}d lock` : "Unlocked";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/vault/$id",
      params: { id: vault.id },
      className: "group relative overflow-hidden rounded-3xl cursor-pointer min-h-[220px] flex flex-col justify-end transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--accent)]/20 block",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: vault.image_url,
            alt: vault.name,
            className: "absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-700",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.preventDefault();
              setFav((f) => !f);
            },
            className: `absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xl transition-all duration-300 ${fav ? "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent)]" : "bg-[var(--bg)]/30 text-[var(--text)]"}`,
            "aria-label": "Favorite",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 14, fill: fav ? "currentColor" : "none" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5", children: [
          vault.is_renounced && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-7 h-7 rounded-full flex items-center justify-center bg-[var(--green)]/20 border border-[var(--green)]/50 text-[var(--green)]",
              title: "Permanently renounced",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 })
            }
          ),
          !vault.is_renounced && vault.lock_type === "timed" && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { variant: "accent-2", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 9 }), children: lockLabel }),
          trending && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { variant: "accent-2", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 9 }), className: "font-bold", children: "HOT" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display font-bold text-[var(--text)] truncate", children: vault.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-[var(--accent)]", children: [
                  vault.tokens.length,
                  " Tokens"
                ] }),
                launchpads.map((lp) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)]",
                    children: lp
                  },
                  lp
                ))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-mono text-[var(--text)]", children: formatNumber(vault.total_swaps) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono text-[var(--text-muted)]", children: "24h Swaps" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[var(--bg)]/20 backdrop-blur-2xl rounded-2xl p-3 shadow-lg mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 11 }),
                "Vault Depth"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono font-bold text-[var(--accent)] drop-shadow-[0_0_8px_var(--accent)]", children: [
                avgDepth.toFixed(0),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SparkProgress, { percentage: avgDepth })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap mb-2", children: [
            allMintRevoked && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 9, className: "text-[var(--green)]" }), children: "Mint Revoked" }),
            allFreezeRevoked ? /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 9, className: "text-[var(--green)]" }), children: "Freeze Revoked" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 9, className: "text-[var(--red)]" }), children: "Freeze Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeTag, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 9 }), children: lockLabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 10 }),
              vault.total_volume_sol.toFixed(1),
              " SOL"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 10 }),
              formatNumber(vault.unique_wallets)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10 }),
              timeAgo(vault.created_at)
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Flame as F,
  VaultCard as V
};
