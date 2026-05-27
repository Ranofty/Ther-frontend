import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon, Tag, FileText, AtSign, Globe, Plus, Trash2, Clock, ShieldCheck,
  CheckCircle2, XCircle, AlertTriangle, PieChart as PieIcon, Wallet, Coins, ChevronRight, Send,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useWallet } from "@solana/wallet-adapter-react";
import { StepIndicator } from "@/components/create/StepIndicator";
import { GlassToggle } from "@/components/ui/GlassToggle";
import { useCreateVault } from "@/hooks/useTherProgram";
import { usePlatformConfig } from "@/hooks/useVaults";
import { truncateAddress } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";
import { connection } from "@/lib/solana";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Vault — Ther" },
      { name: "description", content: "Group SPL tokens into an immutable Ther vault." },
    ],
  }),
  component: CreatePage,
});

interface TokenDraft {
  mint: string;
  symbol: string;
  name: string;
  supply: number;
  decimals: number;
  deposit: number;
  mint_revoked: boolean;
  freeze_revoked: boolean;
}

interface ShareDraft {
  address: string;
  bps: number;
}

const PIE_COLORS = ["var(--accent)", "var(--accent-2)", "var(--green)", "#8B5CF6", "#EC4899"];

function CreatePage() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { createVault, loading } = useCreateVault();
  const { config: platformConfig } = usePlatformConfig();
  const [step, setStep] = useState(0);

  // Step 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  const [telegram, setTelegram] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Step 2
  const [tokens, setTokens] = useState<TokenDraft[]>([]);
  const [mintInput, setMintInput] = useState("");

  // Step 3
  const [lockType, setLockType] = useState<"timed" | "permanent">("timed");
  const [duration, setDuration] = useState<string>("30"); // days
  const [confirmRenounce, setConfirmRenounce] = useState(false);

  // Step 4
  const [shares, setShares] = useState<ShareDraft[]>([]);
  const [shareAddr, setShareAddr] = useState("");
  const [sharePct, setSharePct] = useState("");

  const totalAllocatedBps = shares.reduce((acc, s) => acc + s.bps, 0);
  const remainingBps = 10000 - totalAllocatedBps;

  const [verifying, setVerifying] = useState(false);

  async function addToken() {
    if (!mintInput) return;

    let mintPubkey: PublicKey;
    try {
      mintPubkey = new PublicKey(mintInput);
    } catch {
      toast.error("Invalid Solana public key format");
      return;
    }

    if (tokens.some((t) => t.mint === mintInput)) {
      toast.error("Token is already added");
      return;
    }

    setVerifying(true);
    const loadingToast = toast.loading("Verifying token on-chain...");

    try {
      const mintInfo = await getMint(connection, mintPubkey);
      const decimals = mintInfo.decimals;
      const rawSupply = Number(mintInfo.supply);
      const supply = rawSupply / Math.pow(10, decimals);
      const mint_revoked = mintInfo.mintAuthority === null;
      const freeze_revoked = mintInfo.freezeAuthority === null;

      const symbol = mintInput.slice(0, 4).toUpperCase();
      const name = `Token ${tokens.length + 1} (${symbol})`;

      setTokens((t) => [
        ...t,
        {
          mint: mintInput,
          symbol,
          name,
          supply,
          decimals,
          deposit: 0,
          mint_revoked,
          freeze_revoked,
        },
      ]);
      setMintInput("");
      toast.success(`Token ${symbol} successfully verified!`);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to verify token mint. Make sure it exists on devnet.");
    } finally {
      toast.dismiss(loadingToast);
      setVerifying(false);
    }
  }

  function addShare() {
    const pct = Number(sharePct);
    if (!shareAddr || !pct || pct <= 0) return;
    const bps = Math.floor(pct * 100);
    if (bps > remainingBps) return;
    setShares((s) => [...s, { address: shareAddr, bps }]);
    setShareAddr("");
    setSharePct("");
  }

  async function submit() {
    const res = await createVault({
      name, description, image, twitter, website, telegram, coverFile,
      tokens, lockType, duration, shares,
    });
    if (res) navigate({ to: "/vault/$id", params: { id: res.id } });
  }

  const pieData = [
    ...shares.map((s) => ({ name: truncateAddress(s.address, 3), value: s.bps })),
    { name: "Creator", value: remainingBps },
  ];

  const canNext =
    (step === 0 && name && description) ||
    (step === 1 &&
      tokens.length >= 2 &&
      tokens.every((t) => t.mint_revoked && t.freeze_revoked && t.deposit >= Math.floor(t.supply * 0.01))) ||
    (step === 2 && (lockType === "timed" ? Number(duration) > 0 : confirmRenounce)) ||
    step === 3 ||
    step === 4;

  return (
    <main className="min-h-screen pb-40 max-w-lg mx-auto px-4 pt-10">
      <h1 className="text-2xl font-display font-bold text-center mb-2">Create a Vault</h1>
      <p className="text-center text-xs font-mono text-[var(--text-muted)] mb-8">
        Group SPL tokens into one immutable cross-launchpad pool
      </p>
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <Section icon={<Tag size={14} />} label="Vault Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Meme Titans"
                  className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-display outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                />
              </Section>
              <Section icon={<FileText size={14} />} label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="What does this vault represent?"
                  className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-display outline-none focus:ring-2 focus:ring-[var(--accent)]/40 resize-none"
                />
              </Section>
              <Section icon={<ImageIcon size={14} />} label="Cover Image">
                {image ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden group border border-[var(--text)]/10">
                    <img src={image} alt="cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImage("");
                        setCoverFile(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[var(--text)]/20 rounded-2xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-[var(--accent)]/50 transition-colors bg-[var(--surface-2)]/30 w-full">
                    <ImageIcon size={28} className="text-[var(--text-muted)] animate-pulse" />
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      Click to choose image file
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]/60">
                      Supports JPG, PNG, GIF (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCoverFile(file);
                          setImage(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </Section>
              <Section icon={<AtSign size={14} />} label="Twitter / X">
                <input
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="memetitans"
                  className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none"
                />
              </Section>
              <Section icon={<Globe size={14} />} label="Website">
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none"
                />
              </Section>
              <Section icon={<Send size={14} />} label="Telegram">
                <input
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="memetitans"
                  className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none"
                />
              </Section>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <Section icon={<Plus size={14} />} label="Add Token by Mint">
                <div className="flex gap-2">
                  <input
                    value={mintInput}
                    onChange={(e) => setMintInput(e.target.value)}
                    placeholder="Token mint address"
                    className="flex-1 bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none"
                  />
                  <button
                    type="button"
                    disabled={verifying}
                    onClick={addToken}
                    className="px-4 py-3 rounded-xl bg-[var(--accent)] text-black font-bold font-display text-sm disabled:opacity-50"
                  >
                    {verifying ? "Adding..." : "Add"}
                  </button>
                </div>
              </Section>

              {tokens.map((t, idx) => {
                const okBoth = t.mint_revoked && t.freeze_revoked;
                const minDeposit = Math.floor(t.supply * 0.01);
                const belowMin = t.deposit > 0 && t.deposit < minDeposit;
                return (
                  <div
                    key={idx}
                    className="bg-[var(--surface)] backdrop-blur-2xl rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-[10px] font-mono font-bold text-black">
                        {t.symbol.slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-medium truncate">{t.name}</div>
                        <div className="font-mono text-xs text-[var(--accent)]">{t.symbol}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTokens((tk) => tk.filter((_, i) => i !== idx))}
                        className="text-[var(--text-muted)] hover:text-[var(--red)]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <SafetyRow label="Mint Authority" ok={t.mint_revoked} />
                    <SafetyRow label="Freeze Authority" ok={t.freeze_revoked} />
                    {!okBoth && (
                      <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[var(--red)]">
                        <XCircle size={12} />
                        Token cannot be added — revoke this authority first
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 text-xs font-mono">
                      <span className="text-[var(--text-muted)]">
                        Supply: {t.supply.toLocaleString()}
                      </span>
                      <span className="text-[var(--accent)]">
                        Min deposit (1%): {minDeposit.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="number"
                      disabled={!okBoth}
                      value={t.deposit || ""}
                      onChange={(e) =>
                        setTokens((tk) =>
                          tk.map((x, i) =>
                            i === idx ? { ...x, deposit: Number(e.target.value) } : x,
                          ),
                        )
                      }
                      placeholder="Deposit amount"
                      className={`w-full mt-2 bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-lg outline-none border-2 transition-colors ${
                        belowMin
                          ? "border-[var(--red)]"
                          : t.deposit >= minDeposit
                            ? "border-[var(--green)]"
                            : "border-transparent"
                      }`}
                    />
                    {belowMin && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-[var(--red)]">
                        <AlertTriangle size={10} /> Below 5% minimum
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addToken}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-[var(--text)]/20 hover:border-[var(--accent)]/50 flex items-center justify-center gap-2 transition-colors font-display text-[var(--text-muted)] text-sm"
              >
                <Plus size={14} /> Add Another Token
              </button>

              {tokens.length >= 2 &&
                new Set(tokens.map((t) => t.deposit)).size > 1 &&
                tokens.every((t) => t.deposit > 0) && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--accent-2)]/10 text-xs font-mono text-[var(--accent-2)]">
                    <AlertTriangle size={12} />
                    Token deposit quantities differ — swaps are 1:1 by quantity regardless
                  </div>
                )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLockType("timed")}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 bg-[var(--surface)] backdrop-blur-2xl border-2 ${
                    lockType === "timed"
                      ? "border-[var(--accent)] shadow-[0_0_20px_rgba(0,229,255,0.1)]"
                      : "border-transparent"
                  }`}
                >
                  <Clock size={20} className="text-[var(--accent)] mb-2" />
                  <div className="font-display font-bold mb-1">Timed Lock</div>
                  <div className="text-xs font-mono text-[var(--text-muted)]">
                    Tokens withdrawable after expiry
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setLockType("permanent")}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 bg-[var(--surface)] backdrop-blur-2xl border-2 ${
                    lockType === "permanent"
                      ? "border-[var(--red)] shadow-[0_0_20px_rgba(255,68,68,0.1)]"
                      : "border-transparent"
                  }`}
                >
                  <ShieldCheck size={20} className="text-[var(--red)] mb-2" />
                  <div className="font-display font-bold mb-1">Permanent</div>
                  <div className="text-xs font-mono text-[var(--red)]/70">
                    Locked forever — no withdrawals
                  </div>
                </button>
              </div>

              {lockType === "timed" && (
                <div className="bg-[var(--surface)] rounded-2xl p-4 backdrop-blur-2xl">
                  <div className="text-xs font-mono text-[var(--text-muted)] mb-3 uppercase tracking-wider">
                    Lock duration
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { l: "1 Day", v: "1" },
                      { l: "1 Week", v: "7" },
                      { l: "1 Month", v: "30" },
                      { l: "6 Months", v: "180" },
                      { l: "1 Year", v: "365" },
                    ].map((p) => (
                      <button
                        key={p.v}
                        type="button"
                        onClick={() => setDuration(p.v)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                          duration === p.v
                            ? "bg-[var(--accent)] text-black"
                            : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
                        }`}
                      >
                        {p.l}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full mt-3 bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono outline-none"
                    placeholder="Days"
                  />
                  <div className="flex items-center gap-2 mt-3 text-xs font-mono text-[var(--text-muted)]">
                    <Clock size={12} />
                    Unlocks{" "}
                    {new Date(Date.now() + Number(duration) * 86400000).toLocaleDateString()}
                  </div>
                </div>
              )}

              {lockType === "permanent" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--red)]/5">
                  <GlassToggle checked={confirmRenounce} onChange={setConfirmRenounce} />
                  <span className="text-xs font-mono">
                    I understand this is permanent and irreversible
                  </span>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)]">
                <div className="flex items-center gap-2 min-w-0">
                  <Wallet size={14} className="text-[var(--text-muted)]" />
                  <span className="font-mono text-sm truncate">
                    {publicKey ? truncateAddress(publicKey.toBase58()) : "Connect wallet"}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">(creator)</span>
                </div>
                <span className="font-mono text-sm font-bold text-[var(--accent)]">
                  {(remainingBps / 100).toFixed(0)}%
                </span>
              </div>

              <div className="text-center">
                <PieIcon size={28} className="text-[var(--accent)] mx-auto" />
                <div className="text-4xl font-display font-bold text-[var(--accent)] mt-1">
                  {(remainingBps / 100).toFixed(0)}%
                </div>
                <div className="text-xs font-mono text-[var(--text-muted)]">
                  Remaining to allocate
                </div>
              </div>

              <div className="h-[200px]" style={{ minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex gap-2">
                <input
                  value={shareAddr}
                  onChange={(e) => setShareAddr(e.target.value)}
                  placeholder="Wallet address"
                  className="flex-1 bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none"
                />
                <input
                  type="number"
                  value={sharePct}
                  onChange={(e) => setSharePct(e.target.value)}
                  placeholder="%"
                  className="w-20 bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={addShare}
                  disabled={remainingBps === 0}
                  className="px-4 rounded-xl bg-[var(--accent)] text-black disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>

              {shares.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)]"
                >
                  <span className="font-mono text-xs truncate">{truncateAddress(s.address)}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[var(--accent)]">
                      {(s.bps / 100).toFixed(0)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setShares((sh) => sh.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 size={12} className="text-[var(--red)]" />
                    </button>
                  </div>
                </div>
              ))}

              {remainingBps < 1000 && remainingBps > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--accent-2)]/10 text-xs font-mono text-[var(--accent-2)]">
                  <AlertTriangle size={12} />
                  Only {(remainingBps / 100).toFixed(0)}% remaining
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <ShieldCheck size={36} className="text-[var(--accent)] mx-auto" />
              <h2 className="font-display font-bold text-2xl text-center">Review Your Vault</h2>

              <div className="bg-[var(--surface)] rounded-2xl p-4 backdrop-blur-2xl">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Identity</div>
                <div className="font-display font-bold">{name || "—"}</div>
                <div className="text-xs font-mono text-[var(--text-muted)] mt-1">{description}</div>
              </div>
              <div className="bg-[var(--surface)] rounded-2xl p-4 backdrop-blur-2xl">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Tokens</div>
                {tokens.map((t) => (
                  <div key={t.mint} className="flex justify-between font-mono text-xs py-1">
                    <span>{t.symbol}</span>
                    <span className="text-[var(--text-muted)]">{t.deposit.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[var(--surface)] rounded-2xl p-4 backdrop-blur-2xl">
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-2">Lock</div>
                <div className="font-mono text-sm">
                  {lockType === "permanent"
                    ? "Permanent — Renounced"
                    : `Timed — ${duration} days`}
                </div>
              </div>

              <div className="bg-[var(--surface-2)] rounded-2xl p-4 font-mono text-sm">
                <div className="flex justify-between">
                  <span>Vault Creation Fee</span>
                  <span>{((platformConfig?.creationFee) ?? 0.050).toFixed(3)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Rent (est.)</span>
                  <span>~0.011 SOL</span>
                </div>
                <div className="border-t border-[var(--text)]/10 mt-2 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>~{(((platformConfig?.creationFee) ?? 0.050) + 0.011).toFixed(3)} SOL</span>
                </div>
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-display font-bold text-black text-lg bg-[var(--accent)] shadow-[0_4px_24px_rgba(0,229,255,0.25)] hover:shadow-[0_8px_32px_rgba(0,229,255,0.35)] transition-all disabled:opacity-50"
              >
                {loading ? "Creating vault..." : "Create Vault"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8 gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex-1 py-3 rounded-2xl bg-[var(--surface-2)] font-display font-bold text-sm disabled:opacity-40"
        >
          Back
        </button>
        {step < 4 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={!canNext}
            className="flex-1 py-3 rounded-2xl bg-[var(--accent)] text-black font-display font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-1"
          >
            Continue <ChevronRight size={14} />
          </button>
        )}
      </div>
    </main>
  );
}

function Section({
  icon, label, children,
}: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] backdrop-blur-2xl rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-3">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function SafetyRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-xs font-mono">
      <span className="text-[var(--text-muted)]">{label}</span>
      {ok ? (
        <span className="flex items-center gap-1 text-[var(--green)]">
          <CheckCircle2 size={12} /> Revoked
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[var(--red)]">
          <XCircle size={12} /> Active
        </span>
      )}
    </div>
  );
}
