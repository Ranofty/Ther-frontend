import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDark = useThemeStore((s) => s.isDark);
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [isDark]);
  return <>{children}</>;
}
