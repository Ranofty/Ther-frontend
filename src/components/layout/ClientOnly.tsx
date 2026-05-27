import { useEffect, useState, type ReactNode } from "react";

/** Renders children only after client mount — avoids SSR window/localStorage errors. */
export function ClientOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback ?? null}</>;
  return <>{children}</>;
}
