# 🌀 Ther Protocol — Frontend

Ther is a next-generation decentralized asset velocity and liquidity management portal built on the Solana blockchain. This repository contains the premium, high-performance web application interface that allows users to create 1:1 token swap vaults, deposit time-locked assets, and claim real-time revenue splits.

![Ther Protocol Preview](https://img.shields.io/badge/Solana-DeFi-purple?style=for-the-badge&logo=solana)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## ✨ Features

*   **⚡ Zero-Slippage 1:1 Swaps:** A clean, glassmorphic trading interface supporting direct token swaps against dedicated time-locked liquidity pools with zero price impact.
*   **🔒 Programmable Lock-up Vaults:** A multi-step flow to configure and deploy secure token vaults, featuring timed lock-ups, deposit thresholds, and permanent vault renouncing.
*   **💸 Real-time Revenue Claims:** A secure dashboard that automatically tracks and displays fee-distribution shares, allowing eligible creators and recipients to claim earnings instantly.
*   **📊 Dynamic UI & Visuals:** Live terminal feeds showing real-time on-chain events, interactive charts, and sleek countdown animations tailored in a harmonious dark mode theme.

---

## 🛠️ Tech Stack

*   **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (lightning-fast HMR and bundling)
*   **Routing:** [TanStack Router](https://tanstack.com/router/latest) (type-safe, filesystem-based routing)
*   **Styling:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) (fully customized glassmorphism design system)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (lightweight, reactive global store)
*   **Solana Integration:** [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/), [@coral-xyz/anchor](https://www.anchor-lang.com/) for compiling, calling instructions, and decoding IDLs.
*   **Backend & Cache:** [Supabase](https://supabase.com/) for caching off-chain metadata (IPFS uploads) and serverless synchronization.

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your local system (recommended package manager for this project).

```bash
# Verify bun installation
bun --version
```

### ⚙️ Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd Ther-frontend
   ```

2. Install the project dependencies:
   ```bash
   bun install
   ```

3. Configure your local environment:
   Create a `.env` file in the root of the `Ther-frontend` folder (or copy `.env.example` if available) and add your credentials:
   ```env
   VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### 💻 Running Locally

Start the local development server:
```bash
bun run dev
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser to view the application.

### 📦 Building for Production

Compile the production bundle and optimize assets:
```bash
bun run build
```
The optimized output will be generated inside the `/dist` directory, fully prepared for serverless edge deployment (Cloudflare Pages, Vercel, Netlify).

---

## 📁 Repository Structure

```
Ther-frontend/
├── src/
│   ├── components/         # Modular React components
│   │   ├── create/         # Step-by-step vault creation flow
│   │   ├── home/           # Dashboard landing, live feed & stats
│   │   ├── layout/         # Navigation, header, providers & theme
│   │   ├── ui/             # Reusable design system primitives (shadcn)
│   │   └── vault/          # Swap panel, lock cards, comments & details
│   ├── hooks/              # Custom React hooks (useTherProgram, useVaults)
│   ├── lib/                # Utility modules, Solana PDAs, and Supabase integration
│   ├── routes/             # Client-side routes (TanStack Router)
│   ├── store/              # Zustand global state stores
│   └── styles.css          # Core styles and design tokens
├── supabase/               # Edge functions and migration configurations
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite build configuration
```

---

## 🔒 Security & On-Chain Integrity

The underlying smart contracts of Ther Protocol are designed under rigorous Solana security standards:
*   **Verification:** On-chain code is fully compiled with `anchor build --verifiable` to ensure transparency.
*   **Audit-Ready:** Includes built-in support for `security.txt` to streamline white-hat disclosure.
*   **Non-Custodial:** Vault creators have sole authorization over withdrawals *only* after timed locks expire, unless they renounce ownership to lock funds forever.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
