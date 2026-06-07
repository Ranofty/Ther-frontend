import React from "react";
import {
  ImageIcon,
  Tag,
  FileText,
  AtSign,
  Globe,
  Send,
  XCircle,
  Coins,
} from "lucide-react";

interface TokenLaunchFormProps {
  name: string;
  onNameChange: (val: string) => void;
  symbol: string;
  onSymbolChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  imageFile: File | null;
  imagePreview: string;
  onImageChange: (file: File) => void;
  onImageClear: () => void;
  twitter: string;
  onTwitterChange: (val: string) => void;
  telegram: string;
  onTelegramChange: (val: string) => void;
  website: string;
  onWebsiteChange: (val: string) => void;
  devBuySOL: number;
  onDevBuyChange: (val: number) => void;
  disabled?: boolean;
}

function Section({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
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

export function TokenLaunchForm({
  name,
  onNameChange,
  symbol,
  onSymbolChange,
  description,
  onDescriptionChange,
  imageFile,
  imagePreview,
  onImageChange,
  onImageClear,
  twitter,
  onTwitterChange,
  telegram,
  onTelegramChange,
  website,
  onWebsiteChange,
  devBuySOL,
  onDevBuyChange,
  disabled,
}: TokenLaunchFormProps) {
  const devBuyChips = [0, 0.1, 0.5, 1.0, 2.0];

  return (
    <div className="flex flex-col gap-4 w-full">
      <Section icon={<ImageIcon size={14} />} label="Token Logo *">
        {imagePreview ? (
          <div className="relative w-full h-40 rounded-xl overflow-hidden group border border-[var(--text)]/10">
            <img src={imagePreview} alt="token logo" className="w-full h-full object-cover" />
            <button
              type="button"
              disabled={disabled}
              onClick={onImageClear}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-sm transition-colors disabled:opacity-50"
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <label className={`border-2 border-dashed border-[var(--text)]/20 rounded-2xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-[var(--accent)]/50 transition-colors bg-[var(--surface-2)]/30 w-full ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            <ImageIcon size={28} className="text-[var(--text-muted)] animate-pulse" />
            <span className="font-mono text-xs text-[var(--text-muted)]">
              Click to choose logo image
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]/60">
              Supports JPG, PNG, GIF (Max 5MB)
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImageChange(file);
                }
              }}
              className="hidden"
            />
          </label>
        )}
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section icon={<Tag size={14} />} label="Token Name *">
          <input
            value={name}
            disabled={disabled}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Bonk Titan"
            className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </Section>

        <Section icon={<Coins size={14} />} label="Ticker / Symbol *">
          <input
            value={symbol}
            disabled={disabled}
            onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
            placeholder="e.g. BTITAN"
            className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </Section>
      </div>

      <Section icon={<FileText size={14} />} label="Description *">
        <textarea
          value={description}
          disabled={disabled}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          placeholder="Describe your project..."
          className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40 resize-none"
        />
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Section icon={<AtSign size={14} />} label="Twitter (Optional)">
          <input
            value={twitter}
            disabled={disabled}
            onChange={(e) => onTwitterChange(e.target.value)}
            placeholder="Username"
            className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </Section>

        <Section icon={<Send size={14} />} label="Telegram (Optional)">
          <input
            value={telegram}
            disabled={disabled}
            onChange={(e) => onTelegramChange(e.target.value)}
            placeholder="Invite link or group"
            className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </Section>

        <Section icon={<Globe size={14} />} label="Website (Optional)">
          <input
            value={website}
            disabled={disabled}
            onChange={(e) => onWebsiteChange(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          />
        </Section>
      </div>

      <Section icon={<Coins size={14} />} label="Dev Buy (SOL)">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono text-[var(--text-muted)] leading-normal">
            Initial purchase in SOL to prevent snipers. Set to 0 if you don&apos;t want to buy at creation.
          </span>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              step="0.01"
              value={devBuySOL}
              disabled={disabled}
              onChange={(e) => onDevBuyChange(parseFloat(e.target.value) || 0)}
              className="w-32 bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
            />
            <span className="font-mono text-sm text-[var(--text)]">SOL</span>
            <div className="flex flex-wrap gap-2 ml-auto">
              {devBuyChips.map((val) => {
                const isSelected = devBuySOL === val;
                return (
                  <button
                    key={val}
                    type="button"
                    disabled={disabled}
                    onClick={() => onDevBuyChange(val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[var(--accent)] text-black font-bold"
                        : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {val === 0 ? "None" : `${val} SOL`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
