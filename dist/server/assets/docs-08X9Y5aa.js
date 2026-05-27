import { L as jsxRuntimeExports } from "./server-CNVNdsAu.js";
import { G as GlassCard } from "./GlassCard-CvLPIS28.js";
import { b as BookOpen, a as ArrowLeftRight } from "./router-B3y7OxSE.js";
import { C as Coins } from "./coins-Dl6FejNz.js";
import { L as Lock } from "./lock-skwwkfdN.js";
import { S as ShieldCheck } from "./shield-check-DZJlMfEF.js";
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
function DocsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pt-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 28, className: "text-[var(--accent)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold", children: "Docs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 18 }), title: "What is Ther?", children: "Ther is not a launchpad. It is a protocol that sits on top of every launchpad. Token creators group multiple SPL tokens from different launchpads into shared immutable vaults." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { size: 18 }), title: "Fixed 1:1 swaps", children: "Put in 1,000,000 Token A — get out exactly 1,000,000 Token B. Always. Market cap, price, and dollar value are irrelevant. Every swap generates real on-chain volume for every token in the vault simultaneously." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18 }), title: "Immutable lock types", children: "Vaults are either timed-locked (withdrawals open after expiry) or permanently renounced (locked forever). Either choice is irreversible." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 18 }), title: "Safety primitives", children: "Every token added to a vault must have mint authority and freeze authority revoked. Vault depth is observable on-chain. Revenue shares are immutable once set." })
  ] });
}
function Section({
  icon,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { className: "mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 text-[var(--accent)]", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-[var(--text)]", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)] leading-relaxed", children })
  ] });
}
export {
  DocsPage as component
};
