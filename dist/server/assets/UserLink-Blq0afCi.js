import { o as createLucideIcon, G as truncateAddress, f as Link } from "./router-B3y7OxSE.js";
import { U as reactExports, L as jsxRuntimeExports } from "./server-CNVNdsAu.js";
import { c as getUserProfile } from "./useVaults-DNOt5NPY.js";
const __iconNode = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
const profileCache = {};
function useUserProfile(walletAddress) {
  const [profile, setProfile] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!walletAddress) return;
    if (profileCache[walletAddress]) {
      if (profileCache[walletAddress].loading) {
        profileCache[walletAddress].callbacks.push(setProfile);
      } else {
        setProfile(profileCache[walletAddress].profile);
      }
      return;
    }
    profileCache[walletAddress] = {
      profile: null,
      loading: true,
      callbacks: [setProfile]
    };
    getUserProfile(walletAddress).then((data) => {
      profileCache[walletAddress].profile = data;
      profileCache[walletAddress].loading = false;
      profileCache[walletAddress].callbacks.forEach((cb) => cb(data));
      profileCache[walletAddress].callbacks = [];
    }).catch((err) => {
      console.error("Error fetching user profile for cache:", err);
      profileCache[walletAddress].loading = false;
      profileCache[walletAddress].callbacks.forEach((cb) => cb(null));
      profileCache[walletAddress].callbacks = [];
    });
  }, [walletAddress]);
  return profile;
}
function useProfileName(walletAddress) {
  const profile = useUserProfile(walletAddress);
  return profile?.username || null;
}
function UserLink({
  walletAddress,
  truncateLen = 4,
  className = "",
  showIcon = false
}) {
  const username = useProfileName(walletAddress);
  const displayName = username || truncateAddress(walletAddress, truncateLen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/profile/$wallet",
      params: { wallet: walletAddress },
      className: `font-mono hover:text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 transition-colors ${className}`,
      children: [
        showIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[var(--accent)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: displayName })
      ]
    }
  );
}
export {
  Settings as S,
  UserLink as U,
  useUserProfile as u
};
