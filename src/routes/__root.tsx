import { Buffer } from "buffer";
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { WalletContextProvider } from "@/components/layout/WalletContextProvider";
import { Header } from "@/components/layout/Header";
import { TickerStrip } from "@/components/layout/TickerStrip";
import { ClientOnly } from "@/components/layout/ClientOnly";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-[var(--text)]">404</h1>
        <h2 className="mt-4 text-xl font-display font-semibold text-[var(--text)]">
          Vault not found
        </h2>
        <p className="mt-2 text-sm font-mono text-[var(--text-muted)]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-display font-bold text-black"
          >
            Back to discovery
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display font-semibold text-[var(--text)]">
          Something broke on-chain
        </h1>
        <p className="mt-2 text-sm font-mono text-[var(--text-muted)]">
          Try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-display font-bold text-black"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full bg-[var(--surface-2)] px-5 py-2 text-sm font-display font-bold text-[var(--text)]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ther — Cross-Launchpad Token Vault Protocol" },
      {
        name: "description",
        content:
          "Group SPL tokens from every Solana launchpad into immutable vaults. Fixed 1:1 swaps generate real on-chain volume for every token simultaneously.",
      },
      { property: "og:title", content: "Ther — Token Vault Protocol on Solana" },
      {
        property: "og:description",
        content: "Cross-launchpad token vaults with fixed 1:1 swaps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ClientOnly fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
          <WalletContextProvider>
            <div className="relative min-h-screen bg-[var(--bg)]">
              <div className="fixed inset-0 -z-10 bg-ambient-dark dark:bg-ambient-dark [&:not(.dark_*)]:bg-ambient-light" />
              <div className="fixed inset-0 -z-10 bg-ambient-light dark:hidden" />
              <div className="fixed inset-0 -z-10 hidden dark:block bg-ambient-dark" />
              <Outlet />
              <TickerStrip />
              <Header />
              <Toaster />
            </div>
          </WalletContextProvider>
        </ClientOnly>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
