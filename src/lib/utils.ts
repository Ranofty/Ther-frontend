import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(addr: string, chars = 4): string {
  if (!addr) return "";
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function formatNumber(n: number, decimals = 2): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(decimals)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

export function timeAgo(iso: string): string {
  const ts = new Date(iso).getTime();
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function gradientFromAddress(addr: string): string {
  let h1 = 0, h2 = 0;
  for (let i = 0; i < addr.length; i++) {
    h1 = (h1 + addr.charCodeAt(i) * (i + 1)) % 360;
    h2 = (h2 + addr.charCodeAt(i) * (i + 3)) % 360;
  }
  return `linear-gradient(135deg, hsl(${h1}, 80%, 55%), hsl(${h2}, 80%, 55%))`;
}
