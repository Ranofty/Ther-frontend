import { L as jsxRuntimeExports } from "./server-CNVNdsAu.js";
import { l as cn } from "./router-B3y7OxSE.js";
function GlassCard({
  children,
  className,
  blur = "2xl",
  ...rest
}) {
  const blurClass = blur === "3xl" ? "backdrop-blur-3xl" : blur === "xl" ? "backdrop-blur-xl" : "backdrop-blur-2xl";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "bg-[var(--bg)]/30 rounded-3xl p-5 sm:p-6 shadow-[0_8px_48px_rgba(0,0,0,0.08)]",
        blurClass,
        className
      ),
      ...rest,
      children
    }
  );
}
export {
  GlassCard as G
};
