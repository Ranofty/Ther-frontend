import { o as createLucideIcon, l as cn } from "./router-B3y7OxSE.js";
import { L as jsxRuntimeExports } from "./server-CNVNdsAu.js";
const __iconNode$2 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function SparkProgress({ percentage, className }) {
  const pct = Math.max(0, Math.min(100, percentage));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("relative w-full h-1.5 rounded-full bg-[var(--surface-2)]", className), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "relative h-full rounded-full bg-[var(--accent)] transition-all duration-700",
      style: { width: `${pct}%`, boxShadow: pct > 5 ? "0 0 8px var(--accent)" : void 0 },
      children: pct > 20 && Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "spark",
          style: {
            right: -2,
            top: 0,
            animationDelay: `${i * 0.1}s`,
            "--tx": `${(Math.random() * 12 + 4).toFixed(1)}px`,
            "--ty": `${(Math.random() * 12 - 6).toFixed(1)}px`
          }
        },
        i
      ))
    }
  ) });
}
function BadgeTag({ children, icon, variant = "default", className }) {
  const variants = {
    default: "bg-white/5 border-white/5 text-[var(--text-muted)]",
    accent: "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30",
    "accent-2": "bg-[var(--accent-2)]/15 text-[var(--accent-2)] border-[var(--accent-2)]/30",
    green: "bg-[var(--green)]/15 text-[var(--green)] border-[var(--green)]/30",
    red: "bg-[var(--red)]/15 text-[var(--red)] border-[var(--red)]/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 border rounded px-1.5 py-0.5 text-[9px] font-mono",
        variants[variant],
        className
      ),
      children: [
        icon,
        children
      ]
    }
  );
}
export {
  Activity as A,
  BadgeTag as B,
  Calendar as C,
  SparkProgress as S,
  Users as U
};
