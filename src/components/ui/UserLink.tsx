import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { getUserProfile, type UserProfile } from "@/lib/supabase";
import { truncateAddress } from "@/lib/utils";

// Simple in-memory cache to prevent redundant database fetches
const profileCache: Record<
  string,
  {
    profile: UserProfile | null;
    loading: boolean;
    callbacks: ((profile: UserProfile | null) => void)[];
  }
> = {};

export function useUserProfile(walletAddress: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    // Check cache
    if (profileCache[walletAddress]) {
      if (profileCache[walletAddress].loading) {
        profileCache[walletAddress].callbacks.push(setProfile);
      } else {
        setProfile(profileCache[walletAddress].profile);
      }
      return;
    }

    // Initialize cache entry
    profileCache[walletAddress] = {
      profile: null,
      loading: true,
      callbacks: [setProfile],
    };

    getUserProfile(walletAddress)
      .then((data) => {
        profileCache[walletAddress].profile = data;
        profileCache[walletAddress].loading = false;
        profileCache[walletAddress].callbacks.forEach((cb) => cb(data));
        profileCache[walletAddress].callbacks = [];
      })
      .catch((err) => {
        console.error("Error fetching user profile for cache:", err);
        profileCache[walletAddress].loading = false;
        profileCache[walletAddress].callbacks.forEach((cb) => cb(null));
        profileCache[walletAddress].callbacks = [];
      });
  }, [walletAddress]);

  return profile;
}

export function useProfileName(walletAddress: string) {
  const profile = useUserProfile(walletAddress);
  return profile?.username || null;
}

interface UserLinkProps {
  walletAddress: string;
  truncateLen?: number;
  className?: string;
  showIcon?: boolean;
}

export function UserLink({
  walletAddress,
  truncateLen = 4,
  className = "",
  showIcon = false,
}: UserLinkProps) {
  const username = useProfileName(walletAddress);
  const displayName = username || truncateAddress(walletAddress, truncateLen);

  return (
    <Link
      to="/profile/$wallet"
      params={{ wallet: walletAddress }}
      className={`font-mono hover:text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 transition-colors ${className}`}
    >
      {showIcon && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
      )}
      <span>{displayName}</span>
    </Link>
  );
}
