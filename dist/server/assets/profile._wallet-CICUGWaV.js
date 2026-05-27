import { U as reactExports, L as jsxRuntimeExports } from "./server-CNVNdsAu.js";
import { G as GlassCard } from "./GlassCard-CvLPIS28.js";
import { V as VaultCard } from "./VaultCard-CEc4lBhf.js";
import { o as createLucideIcon, i as Route, I as useWallet, w as gradientFromAddress, G as truncateAddress, L as Layers, D as timeAgo, a as ArrowLeftRight, l as cn, p as formatNumber, A as AnimatePresence, x as motion, X, F as toast } from "./router-B3y7OxSE.js";
import { p as useVaults, c as getUserProfile, d as getUserSwaps, f as saveUserProfile, u as uploadAvatar } from "./useVaults-DNOt5NPY.js";
import { e as useRevenueShare, W as Wallet } from "./useTherProgram-HHTMB16I.js";
import { A as AtSign, S as Send, G as Globe } from "./send-DvLw6O4a.js";
import { M as MessageSquare } from "./message-square-DZkxSgK4.js";
import { A as Activity, C as Calendar } from "./BadgeTag-CjMQMAjM.js";
import { C as Coins } from "./coins-Dl6FejNz.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./shield-check-DZJlMfEF.js";
import "./clock-YOZa94Gt.js";
import "./lock-skwwkfdN.js";
import "buffer";
import "util";
import "http";
import "https";
import "stream";
import "url";
import "zlib";
import "fs";
import "assert";
import "path";
const __iconNode$1 = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function ProfilePage() {
  const {
    wallet
  } = Route.useParams();
  const [tab, setTab] = reactExports.useState("vaults");
  const {
    publicKey
  } = useWallet();
  const {
    claim,
    loading: claiming
  } = useRevenueShare();
  const isOwner = publicKey ? publicKey.toBase58().toLowerCase() === wallet.toLowerCase() : false;
  const {
    vaults: allVaults
  } = useVaults();
  const vaults = allVaults.filter((v) => v.creator.toLowerCase() === wallet.toLowerCase());
  const userRevenueShares = allVaults.map((v) => {
    const share = v.revenue_shares.find((rs) => rs.recipient.toLowerCase() === wallet.toLowerCase());
    return share ? {
      vault: v,
      share
    } : null;
  }).filter((x) => x !== null);
  const displayVaults = vaults;
  const [swaps, setSwaps] = reactExports.useState([]);
  const [loadingSwaps, setLoadingSwaps] = reactExports.useState(true);
  const totalVolume = displayVaults.reduce((acc, v) => acc + v.total_volume_sol, 0);
  const [profile, setProfile] = reactExports.useState(null);
  const [loadingProfile, setLoadingProfile] = reactExports.useState(true);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editUsername, setEditUsername] = reactExports.useState("");
  const [editBio, setEditBio] = reactExports.useState("");
  const [editAvatarUrl, setEditAvatarUrl] = reactExports.useState("");
  const [editWebsite, setEditWebsite] = reactExports.useState("");
  const [editTwitter, setEditTwitter] = reactExports.useState("");
  const [editDiscord, setEditDiscord] = reactExports.useState("");
  const [editTelegram, setEditTelegram] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [uploadingFile, setUploadingFile] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
  const [isDragActive, setIsDragActive] = reactExports.useState(false);
  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }
  async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processUploadFile(file);
  }
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadFile(file);
  }
  async function processUploadFile(file) {
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
    const updatedRecord = {
      wallet_address: wallet,
      username: editUsername,
      bio: editBio,
      avatar_url: editAvatarUrl,
      website: editWebsite,
      twitter: editTwitter,
      discord: editDiscord,
      telegram: editTelegram
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
  const TABS = [{
    id: "vaults",
    label: "Created Vaults",
    icon: Layers
  }, {
    id: "swaps",
    label: "Swap History",
    icon: ArrowLeftRight
  }, {
    id: "revenue",
    label: "Revenue Earned",
    icon: Coins
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen pb-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 flex-wrap flex-1 min-w-0", children: [
        profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profile.avatar_url, alt: profile.username || "Avatar", className: "w-20 h-20 rounded-full flex-shrink-0 object-cover border-2 border-[var(--text)]/10 shadow-lg" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full flex-shrink-0", style: {
          background: gradientFromAddress(wallet)
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap mb-1", children: [
            profile?.username ? /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-[var(--text)]", children: profile.username }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-semibold text-[var(--text-muted)]", children: truncateAddress(wallet, 6) }),
            isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsEditing(true), className: "p-1.5 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors", title: "Edit Profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 14 }) })
          ] }),
          profile?.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)] mb-3 max-w-xl line-clamp-2", children: profile.bio }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--text)]/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 12, className: "text-[var(--text-muted)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-[var(--text)]", children: truncateAddress(wallet, 6) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              profile?.twitter && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://x.com/${profile.twitter}`, target: "_blank", rel: "noreferrer", className: "p-1.5 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all", title: "Twitter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AtSign, { size: 15 }) }),
              profile?.telegram && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: profile.telegram.startsWith("http") ? profile.telegram : `https://t.me/${profile.telegram}`, target: "_blank", rel: "noreferrer", className: "p-1.5 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all", title: "Telegram", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 15 }) }),
              profile?.discord && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "p-1.5 rounded-full text-[var(--text-muted)] flex items-center gap-1.5 text-xs font-mono", title: `Discord: ${profile.discord}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 15 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-xs", children: profile.discord })
              ] }),
              profile?.website && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: profile.website, target: "_blank", rel: "noreferrer", className: "p-1.5 rounded-full hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all", title: "Website", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 15 }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-6 border-t md:border-t-0 md:border-l border-[var(--text)]/5 pt-4 md:pt-0 md:pl-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }), label: "Volume", value: `${totalVolume.toFixed(1)} SOL` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 14 }), label: "Vaults", value: `${vaults.length}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }), label: "Created", value: profile?.created_at ? timeAgo(profile.created_at) : "Just now" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface)] backdrop-blur-xl mb-6", children: TABS.map((t) => {
      const Icon = t.icon;
      const active = tab === t.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTab(t.id), className: cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-medium transition-all", active ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14 }),
        " ",
        t.label
      ] }, t.id);
    }) }),
    tab === "vaults" && (displayVaults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16 bg-[var(--surface)]/20 rounded-3xl border border-[var(--text)]/5 backdrop-blur-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)]", children: "No on-chain vaults created yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[260px]", children: displayVaults.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(VaultCard, { vault: v }, v.id)) })),
    tab === "swaps" && (swaps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16 bg-[var(--surface)]/20 rounded-3xl border border-[var(--text)]/5 backdrop-blur-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)]", children: "No swaps recorded yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: swaps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--surface-2)] text-xs font-mono", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent)]", children: s.vault_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        s.token_in_symbol,
        " → ",
        s.token_out_symbol
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: formatNumber(s.amount) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-muted)]", children: timeAgo(s.timestamp) })
    ] }, s.id)) }) })),
    tab === "revenue" && /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: userRevenueShares.length > 0 ? userRevenueShares.map(({
      vault,
      share
    }) => {
      const solUnclaimed = (share.accumulated_lamports / 1e9).toFixed(4);
      const solClaimed = (share.total_claimed_lamports / 1e9).toFixed(3);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[var(--text)]/5 last:border-0 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-medium text-[var(--text)]", children: vault.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono text-[var(--text-muted)] flex items-center gap-2 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              (share.share_bps / 100).toFixed(0),
              "% share"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[var(--text-muted)]/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--text-muted)]", children: [
              solClaimed,
              " SOL claimed historically"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm font-bold text-[var(--text)]", children: [
            solUnclaimed,
            " SOL unclaimed"
          ] }),
          isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => claim(vault.pubkey), disabled: claiming || share.accumulated_lamports === 0, className: `px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[var(--green)]/15 text-[var(--green)] transition-all disabled:opacity-40 ${share.accumulated_lamports > 0 ? "shadow-[0_0_12px_var(--green)] animate-pulse-dot" : ""}`, children: "Claim" })
        ] })
      ] }, vault.id + share.recipient);
    }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[var(--text-muted)]", children: "No revenue shares or claims found." }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, onClick: () => setIsEditing(false), className: "absolute inset-0 bg-black/60 backdrop-blur-md" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.95,
        y: 20
      }, animate: {
        opacity: 1,
        scale: 1,
        y: 0
      }, exit: {
        opacity: 0,
        scale: 0.95,
        y: 20
      }, className: "relative w-full max-w-lg bg-[var(--bg)]/90 border border-[var(--text)]/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh] z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display font-bold text-[var(--text)]", children: "Edit Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[var(--text-muted)]", children: "Customize your off-chain display metadata" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsEditing(false), className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text)]/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Display Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: editUsername, onChange: (e) => setEditUsername(e.target.value), placeholder: "e.g. Satoshi", className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-display text-sm outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Biography" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: editBio, onChange: (e) => setEditBio(e.target.value), rows: 3, placeholder: "Tell us about yourself or your team...", className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-display text-sm outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors resize-none text-[var(--text)]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 items-center justify-center py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2", children: "Avatar / Logo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onDragEnter: handleDrag, onDragOver: handleDrag, onDragLeave: handleDrag, onDrop: handleDrop, className: cn("relative w-28 h-28 rounded-full overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-300 group", isDragActive ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-105 shadow-[0_0_20px_rgba(0,229,255,0.2)]" : "border-[var(--text)]/15 bg-[var(--surface-2)] hover:border-[var(--accent)]/50"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", id: "avatar-upload", className: "absolute inset-0 opacity-0 cursor-pointer z-30", onChange: handleFileChange }),
              editAvatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: editAvatarUrl, alt: "Avatar Preview", className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex flex-col items-center justify-center p-3 text-center", style: {
                background: gradientFromAddress(wallet)
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-white pointer-events-none", isDragActive && "opacity-100 bg-black/50"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 18, className: "animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-display font-bold uppercase tracking-wider", children: uploadingFile ? "Uploading..." : isDragActive ? "Drop here" : "Upload Image" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-mono text-white/60", children: "Drag & Drop" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[var(--text-muted)] mt-2 text-center", children: "Drag and drop your logo file here or click the circle to select one." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Twitter / X handle" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: editTwitter, onChange: (e) => setEditTwitter(e.target.value), placeholder: "username", className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Telegram handle/link" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: editTelegram, onChange: (e) => setEditTelegram(e.target.value), placeholder: "username or t.me/link", className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Discord handle" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: editDiscord, onChange: (e) => setEditDiscord(e.target.value), placeholder: "username", className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]", children: "Website URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: editWebsite, onChange: (e) => setEditWebsite(e.target.value), placeholder: "https://...", className: "w-full bg-[var(--surface-2)] rounded-xl px-4 py-2.5 font-mono text-xs outline-none border border-transparent focus:border-[var(--accent)]/50 transition-colors text-[var(--text)]" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSaveProfile, disabled: saving, className: "w-full mt-4 py-3 rounded-xl bg-[var(--text)] text-[var(--bg)] font-display font-bold text-sm hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg", children: saving ? "Saving..." : "Save Changes" })
        ] })
      ] })
    ] }) })
  ] });
}
function Stat({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent)]", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-sm text-[var(--text)]", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider", children: label })
    ] })
  ] });
}
export {
  ProfilePage as component
};
