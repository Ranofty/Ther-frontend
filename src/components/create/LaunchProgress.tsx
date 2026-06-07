import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ExternalLink, Loader2 } from "lucide-react";
import { LAUNCHPAD_LOGOS } from "./LaunchpadLogos";

export interface LaunchStep {
  label: string;
  status: "pending" | "active" | "done" | "error";
  /** Optional platform ID to display a badge */
  platformId?: string;
  /** Optional platform display name */
  platformName?: string;
}

export interface LaunchResultEntry {
  mintAddress: string;
  txSignatures: string[];
  platformId?: string;
  platformName?: string;
}

interface LaunchProgressProps {
  steps: LaunchStep[];
  error?: string;
  results?: LaunchResultEntry[];
  /** @deprecated Use results[] instead */
  result?: {
    mintAddress: string;
    txSignatures: string[];
  };
}

export function LaunchProgress({ steps, error, results, result }: LaunchProgressProps) {
  // Support legacy single result
  const allResults: LaunchResultEntry[] = results ?? (result ? [{ ...result }] : []);

  return (
    <div className="w-full bg-[var(--surface)] backdrop-blur-2xl rounded-2xl p-6 border border-[var(--text)]/5 flex flex-col gap-6">
      <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--text)] text-center border-b border-[var(--text)]/10 pb-3">
        Token Launch Progress
      </h3>

      <div className="flex flex-col gap-3">
        {steps.map((step, idx) => {
          const isPending = step.status === "pending";
          const isActive = step.status === "active";
          const isDone = step.status === "done";
          const isError = step.status === "error";

          const LogoComponent = step.platformId ? LAUNCHPAD_LOGOS[step.platformId] : null;

          return (
            <div key={idx} className="flex items-center gap-3">
              {/* Step indicator */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[var(--accent)]/20"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[10px] border-2 z-10 transition-all ${
                    isDone
                      ? "bg-[var(--green)] border-[var(--green)] text-black"
                      : isError
                      ? "bg-red-500 border-red-500 text-white"
                      : isActive
                      ? "bg-[var(--accent)] border-[var(--accent)] text-black"
                      : "bg-[var(--surface-2)] border-transparent text-[var(--text-muted)]"
                  }`}
                >
                  {isDone ? (
                    <Check size={12} />
                  ) : isError ? (
                    <X size={12} />
                  ) : isActive ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    idx + 1
                  )}
                </div>
              </div>

              {/* Platform badge + label */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {LogoComponent && (
                  <div className="flex-shrink-0">
                    <LogoComponent size={18} />
                  </div>
                )}
                {step.platformName && !LogoComponent && (
                  <span className="flex-shrink-0 text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 uppercase tracking-wider">
                    {step.platformName}
                  </span>
                )}
                <p
                  className={`font-mono text-xs uppercase tracking-wide transition-colors truncate ${
                    isActive
                      ? "text-[var(--accent)] font-bold"
                      : isDone
                      ? "text-[var(--green)]"
                      : isError
                      ? "text-red-400"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono leading-relaxed"
          >
            <div className="font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <X size={12} /> Launch Failed
            </div>
            {error}
          </motion.div>
        )}

        {allResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            {allResults.map((res, rIdx) => {
              const ResLogo = res.platformId ? LAUNCHPAD_LOGOS[res.platformId] : null;
              return (
                <div
                  key={`${res.mintAddress}-${rIdx}`}
                  className="p-4 rounded-xl bg-[var(--green)]/10 border border-[var(--green)]/20 flex flex-col gap-3"
                >
                  <div className="text-[var(--green)] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Check size={12} />
                    {res.platformName && (
                      <span className="flex items-center gap-1.5">
                        {ResLogo && <ResLogo size={16} />}
                        {res.platformName} —
                      </span>
                    )}
                    Launched Successfully!
                  </div>
                  
                  <div className="flex flex-col gap-1.5 font-mono text-xs">
                    <div className="flex justify-between items-center text-[var(--text-muted)]">
                      <span>Mint Address:</span>
                      <a
                        href={`https://solscan.io/token/${res.mintAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline flex items-center gap-1 font-bold"
                      >
                        {res.mintAddress.slice(0, 6)}...{res.mintAddress.slice(-6)}
                        <ExternalLink size={10} />
                      </a>
                    </div>

                    {res.txSignatures.map((sig, sIdx) => (
                      <div key={sig} className="flex justify-between items-center text-[var(--text-muted)]">
                        <span>Tx {sIdx + 1}:</span>
                        <a
                          href={`https://solscan.io/tx/${sig}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--text-muted)] hover:text-[var(--text)] hover:underline flex items-center gap-1"
                        >
                          {sig.slice(0, 6)}...{sig.slice(-6)}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="text-center font-mono text-[10px] text-[var(--green)] uppercase tracking-wider animate-pulse">
              {allResults.length === 1
                ? "Token added to your vault list!"
                : `${allResults.length} tokens added to your vault list!`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
