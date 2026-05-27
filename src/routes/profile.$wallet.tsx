import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Layers,
  ArrowLeftRight,
  Coins,
  Wallet,
  Activity,
  Calendar,
  Edit3,
  AtSign,
  Globe,
  MessageSquare,
  Send,
  X,
  Upload,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { VaultCard } from "@/components/vault/VaultCard";
import { formatNumber, gradientFromAddress, timeAgo, truncateAddress, cn } from "@/lib/utils";
import { useVaults } from "@/hooks/useVaults";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRevenueShare } from "@/hooks/useTherProgram";
import { getUserProfile, saveUserProfile, uploadAvatar, getUserSwaps, type UserProfile } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/profile/$wallet")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.wallet.slice(0, 6)}... — Ther Profile` },
      { name: "description", content: "Public Ther wallet profile and activity." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { wallet } = Route.useParams();
  const [tab, setTab] = useState<"vaults" | "swaps" | "revenue">("vaults");
  const { publicKey } = useWallet();
  const { claim, loading: claiming } = useRevenueShare();
  
  const isOwner = publicKey ? publicKey.toBase58().toLowerCase() === wallet.toLowerCase() : false;

  const { vaults: allVaults } = useVaults();

  // Filter vaults created by this profile wallet
  const vaults = allVaults.filter((v) => v.creator.toLowerCase() === wallet.toLowerCase());

  // Find all revenue shares belonging to this wallet across all vaults
  const userRevenueShares = allVaults
    .map((v) => {
      const share = v.revenue_shares.find((rs) => rs.recipient.toLowerCase() === wallet.toLowerCase());
      return share ? { vault: v, share } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const displayVaults = vaults;
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loadingSwaps, setLoadingSwaps] = useState(true);
  const totalVolume = displayVaults.reduce((acc, v) => acc + v.total_volume_sol, 0);

  // Profile data state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editTwitter, setEditTwitter] = useState("");
  const [editDiscord, setEditDiscord] = useState("");
  const [editTelegram, setEditTelegram] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoadingProfile(true);
      try {
        const data = await getUserProfile(wallet);
        if (data) {
          setProfile(data);
          setEditUsername(data.username || "");
          setEditBio(data.bio || "");
          setEditAvatarUrl(data.avatar_url || "");
          setEditWebsite(data.website || "");
          setEditTwitter(data.twitter || "");
          setEditDiscord(data.discord || "");
          setEditTelegram(data.telegram || "");
          if (data.username) {
            document.title = `${data.username} — Ther Profile`;
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoadingProfile(false);
      }

      setLoadingSwaps(true);
      try {
        const data = await getUserSwaps(wallet);
        setSwaps(data);
      } catch (err) {
        console.error("Error loading user swaps:", err);
      } finally {
        setLoadingSwaps(false);
      }
    }
    loadProfile();
  }, [wallet]);

  const [isDragActive, setIsDragActive] = useState(false);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processUploadFile(file);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadFile(file);
  }

  async function processUploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB");
      return;
    }

    setUploadingFile(true);
    const uploadToast = toast.loading("Uploading avatar image...");

    try {
      const publicUrl = await uploadAvatar(file, wallet);
      if (publicUrl) {
        setEditAvatarUrl(publicUrl);
        toast.success("Avatar successfully uploaded!");
      } else {
        toast.error("Failed to upload avatar image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred during file upload.");
    } finally {
      toast.dismiss(uploadToast);
      setUploadingFile(false);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    const updatedRecord: UserProfile = {
      wallet_address: wallet,
      username: editUsername,
      bio: editBio,
      avatar_url: editAvatarUrl,
      website: editWebsite,
      twitter: editTwitter,
      discord: editDiscord,
      telegram: editTelegram,
    };
    try {
      const ok = await saveUserProfile(updatedRecord);
      if (ok) {
        setProfile(updatedRecord);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving profile.");
    } finally {
      setSaving(false);
    }
  }

  const TABS = [
    { id: "vaults", label: "Created Vaults", icon: Layers },
    { id: "swaps", label: "Swap History", icon: ArrowLeftRight },
    { id: "revenue", label: "Revenue Earned", icon: Coins },
  ] as const;

  return (
    <main className="min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-8">
      <GlassCard className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6 flex-wrap flex-1 min-w-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username || "Avatar"}
                className="w-20 h-20 rounded-full flex-shrink-0 object-cover border-2 border-[var(--text)]/10 shadow-lg"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex-shrink-0"
                style={{ background: gradientFromAddress(wallet) }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                {profile?.username ? (
                  <h2 className="text-2xl font-display font-bold text-[var(--text)]">
                    {profile.username}
                  </h2>
                ) : (
                  <h2 className="text-xl font-display font-semibold text-[var(--text-muted)]">
                    {truncateAddress(wallet, 6)}
                  </h2>
                )}

                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    title="Edit Profile"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
              
              {profile?.bio && (
                <p className="text-sm font-mono text-[var(--text-muted)] mb-3 max-w-xl line-clamp-2">
                  {profile.bio}
                </p>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--text)]/5">
                  <Wallet size={12} className="text-[var(--text-muted)]" />
                  <span className="font-mono text-xs text-[var(--text)]">
                    {truncateAddress(wallet, 6)}
                  </span>
                </div>

                {/* Social links */}
                <div className="flex items-center gap-2">
                  {profile?.twitter && (
                    <a
                      href={`https://x.com/${profile.twitter}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all"
                      title="Twitter"
                    >
                      <AtSign size={15} />
                    </a>
                  )}
                  {profile?.telegram && (
                    <a
                      href={profile.telegram.startsWith("http") ? profile.telegram : `https://t.me/${profile.telegram}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all"
                      title="Telegram"
                    >
                      <Send size={15} />
                    </a>
                  )}
                  {profile?.discord && (
                    <span
                      className="p-1.5 rounded-full text-[var(--text-muted)] flex items-center gap-1.5 text-xs font-mono"
                      title={`Discord: ${profile.discord}`}
                    >
                      <MessageSquare size={15} />
                      <span className="hidden sm:inline text-xs">{profile.discord}</span>
                    </span>
                  )}
                  {profile?.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all"
                      title="Website"
                    >
                      <Globe size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 border-t md:border-t-0 md:border-l border-[var(--text)]/5 pt-4 md:pt-0 md:pl-6">
            <Stat icon={<Activity size={14} />} label="Volume" value={`${totalVolume.toFixed(1)} SOL`} />
            <Stat icon={<Layers size={14} />} label="Vaults" value={`${vaults.length}`} />
            <Stat icon={<Calendar size={14} />} label="Created" value={profile?.created_at ? timeAgo(profile.created_at) : "Just now"} />
          </div>
        </div>
      </GlassCard>

      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] backdrop-blur-xl mb-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-medium transition-all",
                active
                  ? "bg-[var(--text)] text-[var(--bg)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]",
              )}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "vaults" && (
        displayVaults.length === 0 ? (
          <div className="text-center py-16 bg-[var(--surface)]/20 rounded-3xl border border-[var(--text)]/5 backdrop-blur-2xl">
            <p className="text-sm font-mono text-[var(--text-muted)]">No on-chain vaults created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[260px]">
            {displayVaults.map((v) => (
              <VaultCard key={v.id} vault={v} />
            ))}
          </div>
        )
      )}

      {tab === "swaps" && (
        swaps.length === 0 ? (
          <div className="text-center py-16 bg-[var(--surface)]/20 rounded-3xl border border-[var(--text)]/5 backdrop-blur-2xl">
            <p className="text-sm font-mono text-[var(--text-muted)]">No swaps recorded yet.</p>
          </div>
        ) : (
          <GlassCard>
            <div className="flex flex-col gap-2">
              {swaps.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--surface-2)] text-xs font-mono">
                  <span className="text-[var(--accent)]">{s.vault_name}</span>
                  <span>
                    {s.token_in_symbol} → {s.token_out_symbol}
                  </span>
                  <span className="font-bold">{formatNumber(s.amount)}</span>
                  <span className="text-[var(--text-muted)]">{timeAgo(s.timestamp)}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )
      )}

      {tab === "revenue" && (
        <GlassCard>
          <div className="flex flex-col gap-3">
            {userRevenueShares.length > 0 ? (
              userRevenueShares.map(({ vault, share }) => {
                const solUnclaimed = (share.accumulated_lamports / 1_000_000_000).toFixed(4);
                const solClaimed = (share.total_claimed_lamports / 1_000_000_000).toFixed(3);
                return (
                  <div
                    key={vault.id + share.recipient}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[var(--text)]/5 last:border-0 gap-3"
                  >
                    <div>
                      <div className="font-display font-medium text-[var(--text)]">{vault.name}</div>
                      <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                        <span>{(share.share_bps / 100).toFixed(0)}% share</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]/40" />
                        <span className="text-[var(--text-muted)]">{solClaimed} SOL claimed historically</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="font-mono text-sm font-bold text-[var(--text)]">
                        {solUnclaimed} SOL unclaimed
                      </div>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => claim(vault.pubkey)}
                          disabled={claiming || share.accumulated_lamports === 0}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[var(--green)]/15 text-[var(--green)] transition-all disabled:opacity-40 ${
                            share.accumulated_lamports > 0
                              ? "shadow-[0_0_12px_var(--green)] animate-pulse-dot"
                              : ""
                          }`}
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-sm font-mono text-[var(--text-muted)]">No revenue shares or claims found.</p>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Edit Profile Modal Overlay */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[var(--bg)]/90 border border-[var(--text)]/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh] z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-[var(--text)]">Edit Profile</h3>
                  <p className="text-xs font-mono text-[var(--text-muted)]">Customize your off-chain display metadata</p>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Display Name</label>
                  <input
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="e.g. Satoshi"
                    className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-display text-sm outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Biography</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    placeholder="Tell us about yourself or your team..."
                    className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-display text-sm outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors resize-none text-[var(--text)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 items-center justify-center py-4">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">Avatar / Logo</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      "relative w-28 h-28 rounded-full overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-300 group",
                      isDragActive 
                        ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-105 shadow-[0_0_20px_rgba(0,229,255,0.2)]" 
                        : "border-[var(--text)]/15 bg-[var(--surface-2)] hover:border-[var(--accent)]/50"
                    )}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      className="absolute inset-0 opacity-0 cursor-pointer z-30"
                      onChange={handleFileChange}
                    />
                    
                    {editAvatarUrl ? (
                      <img 
                        src={editAvatarUrl} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
                        style={{ background: gradientFromAddress(wallet) }}
                      />
                    )}

                    {/* Premium Hover/Drag Overlay */}
                    <div className={cn(
                      "absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-white pointer-events-none",
                      isDragActive && "opacity-100 bg-black/50"
                    )}>
                      <Upload size={18} className="animate-pulse" />
                      <span className="text-[9px] font-display font-bold uppercase tracking-wider">
                        {uploadingFile ? "Uploading..." : isDragActive ? "Drop here" : "Upload Image"}
                      </span>
                      <span className="text-[8px] font-mono text-white/60">Drag & Drop</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] mt-2 text-center">
                    Drag and drop your logo file here or click the circle to select one.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Twitter / X handle</label>
                    <input
                      value={editTwitter}
                      onChange={(e) => setEditTwitter(e.target.value)}
                      placeholder="username"
                      className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Telegram handle/link</label>
                    <input
                      value={editTelegram}
                      onChange={(e) => setEditTelegram(e.target.value)}
                      placeholder="username or t.me/link"
                      className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Discord handle</label>
                    <input
                      value={editDiscord}
                      onChange={(e) => setEditDiscord(e.target.value)}
                      placeholder="username"
                      className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Website URL</label>
                    <input
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full mt-4 py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-display font-bold text-sm hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--accent)]">{icon}</span>
      <div>
        <div className="font-mono font-bold text-sm text-[var(--text)]">{value}</div>
        <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}
