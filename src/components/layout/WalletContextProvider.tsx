import { useMemo, type ReactNode } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { RPC_ENDPOINT } from "@/lib/solana";

import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletContextProvider({ children }: { children: ReactNode }) {
  // Standard Wallets (Phantom, Solflare, Backpack, etc.) auto-register via Wallet Standard.
  const wallets = useMemo(() => [], []);
  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
