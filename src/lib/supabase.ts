import { createClient } from "@supabase/supabase-js";
import type { SwapEvent, VaultComment } from "@/types";

export interface VaultMetadata {
  id: string; // The Vault's Solana PDA public key
  name: string;
  description: string;
  image_url: string;
  twitter?: string;
  website?: string;
  telegram?: string;
  creator: string;
  tokens_data?: any[];
  created_at?: string;
}

export interface UserProfile {
  wallet_address: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  created_at?: string;
  updated_at?: string;
}

const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || "";

const isRealSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isRealSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isRealSupabaseConfigured && typeof window !== "undefined") {
  console.log(
    "%c[Ther Supabase Backend] Running in Local Storage Sandbox mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect a real database.",
    "color: #00E5FF; font-weight: bold; font-family: monospace;"
  );
}

const LOCAL_STORAGE_KEY = "ther_vaults_metadata";

function getLocalStorageVaults(): Record<string, VaultMetadata> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLocalStorageVault(vault: VaultMetadata) {
  if (typeof window === "undefined") return;
  try {
    const vaults = getLocalStorageVaults();
    vaults[vault.id] = {
      ...vault,
      created_at: vault.created_at || new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vaults));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

/**
 * Save vault metadata off-chain to Supabase (or localStorage fallback).
 */
export async function saveVaultMetadata(data: Omit<VaultMetadata, "created_at">): Promise<boolean> {
  const record: VaultMetadata = {
    ...data,
    created_at: new Date().toISOString(),
  };

  // Always sync to local storage for double-safeguard and sandbox compatibility
  saveLocalStorageVault(record);

  if (supabase) {
    try {
      const { error } = await supabase.from("vaults").upsert(record);
      if (error) {
        console.error("Supabase upsert error:", error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Supabase connection error:", e);
      return false;
    }
  }

  return true;
}

/**
 * Retrieve metadata for a specific vault off-chain.
 */
export async function getVaultMetadata(id: string): Promise<VaultMetadata | null> {
  // Try real Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("vaults")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        return data as VaultMetadata;
      }
    } catch (e) {
      console.error("Supabase fetch error for id:", id, e);
    }
  }

  // Fallback to local storage
  const vaults = getLocalStorageVaults();
  return vaults[id] || null;
}

/**
 * Retrieve all off-chain vault records.
 */
export async function getAllVaultsMetadata(): Promise<VaultMetadata[]> {
  // Try real Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("vaults")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        return data as VaultMetadata[];
      }
    } catch (e) {
      console.error("Supabase fetch all vaults error:", e);
    }
  }

  // Fallback to local storage
  const vaults = getLocalStorageVaults();
  return Object.values(vaults).sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

const LOCAL_STORAGE_PROFILES_KEY_PREFIX = "ther_profile_";

function getLocalStorageProfile(walletAddress: string): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY_PREFIX + walletAddress);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveLocalStorageProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      LOCAL_STORAGE_PROFILES_KEY_PREFIX + profile.wallet_address,
      JSON.stringify({
        ...profile,
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.error("Local storage profile save error:", e);
  }
}

/**
 * Retrieve off-chain profile for a specific wallet address.
 */
export async function getUserProfile(walletAddress: string): Promise<UserProfile | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single();
      if (!error && data) {
        return data as UserProfile;
      }
    } catch (e) {
      console.error("Supabase fetch profile error:", e);
    }
  }

  // Fallback to local storage
  return getLocalStorageProfile(walletAddress);
}

/**
 * Save user profile off-chain to Supabase (or localStorage fallback).
 */
export async function saveUserProfile(profile: UserProfile): Promise<boolean> {
  const record: UserProfile = {
    ...profile,
    created_at: profile.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Always sync to local storage
  saveLocalStorageProfile(record);

  if (supabase) {
    try {
      const { error } = await supabase.from("profiles").upsert(record);
      if (error) {
        console.error("Supabase upsert profile error:", error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Supabase connection profile error:", e);
      return false;
    }
  }

  return true;
}

/**
 * Upload avatar/logo file to Supabase Storage (or base64 fallback in local sandbox).
 */
export async function uploadAvatar(file: File, walletAddress: string): Promise<string | null> {
  // If real Supabase is configured
  if (supabase) {
    try {
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `${walletAddress}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (e) {
      console.error("Upload avatar connection error:", e);
      return null;
    }
  }

  // Local storage sandbox mode: convert to Base64 Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload vault metadata and cover image to IPFS using the pump.fun API.
 */
export async function uploadToIPFS(payload: {
  name: string;
  description: string;
  twitter: string;
  telegram: string;
  website: string;
  imageBlob: Blob;
}): Promise<{ metadataUri: string; ipfsImageUrl: string } | null> {
  try {
    const form = new FormData();
    form.append("file", payload.imageBlob, "cover.png");
    form.append("name", payload.name);
    form.append("symbol", payload.name.slice(0, 4).toUpperCase());
    form.append("description", payload.description);
    form.append("twitter", payload.twitter);
    form.append("telegram", payload.telegram);
    form.append("website", payload.website);
    form.append("showName", "true");

    let uploadUrl = "https://pump.fun/api/ipfs";
    let headers: Record<string, string> = {};

    if (isRealSupabaseConfigured && supabaseUrl && supabaseAnonKey) {
      uploadUrl = `${supabaseUrl}/functions/v1/upload-to-ipfs`;
      headers = {
        "apikey": supabaseAnonKey,
      };
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers,
      body: form,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("IPFS upload failed status:", response.status, text);
      return null;
    }

    const data = await response.json();
    return {
      metadataUri: data.metadataUri,
      ipfsImageUrl: data.metadata?.image || "",
    };
  } catch (e) {
    console.error("Error uploading to IPFS:", e);
    return null;
  }
}

const LOCAL_STORAGE_SWAPS_KEY = "ther_swaps_metadata";

function getLocalStorageSwaps(): Record<string, SwapEvent> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_SWAPS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLocalStorageSwap(swap: SwapEvent) {
  if (typeof window === "undefined") return;
  try {
    const swaps = getLocalStorageSwaps();
    swaps[swap.id] = {
      ...swap,
      timestamp: swap.timestamp || new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_SWAPS_KEY, JSON.stringify(swaps));
  } catch (e) {
    console.error("Local storage swap error:", e);
  }
}

/**
 * Save a swap event off-chain to Supabase (or localStorage fallback).
 */
export async function saveSwapEvent(data: Omit<SwapEvent, "timestamp">): Promise<boolean> {
  const record: SwapEvent = {
    ...data,
    timestamp: new Date().toISOString(),
  };

  // Sync to local storage for sandboxed compatibility
  saveLocalStorageSwap(record);

  if (supabase) {
    try {
      const { error } = await supabase.from("swaps").insert(record);
      if (error) {
        console.error("Supabase swap insert error:", error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Supabase connection error for swap:", e);
      return false;
    }
  }
  return true;
}

/**
 * Retrieve swap history for a specific vault off-chain.
 */
export async function getVaultSwaps(vaultPubkey: string): Promise<SwapEvent[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("swaps")
        .select("*")
        .eq("vault_pubkey", vaultPubkey)
        .order("timestamp", { ascending: false });
      if (!error && data) {
        return data as SwapEvent[];
      }
    } catch (e) {
      console.error("Supabase fetch vault swaps error:", e);
    }
  }

  // Fallback to local storage
  const swaps = getLocalStorageSwaps();
  return Object.values(swaps)
    .filter((s) => s.vault_pubkey === vaultPubkey)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Retrieve swap history for a specific user wallet off-chain.
 */
export async function getUserSwaps(userWalletAddress: string): Promise<SwapEvent[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("swaps")
        .select("*")
        .eq("user_wallet", userWalletAddress)
        .order("timestamp", { ascending: false });
      if (!error && data) {
        return data as SwapEvent[];
      }
    } catch (e) {
      console.error("Supabase fetch user swaps error:", e);
    }
  }

  // Fallback to local storage
  const swaps = getLocalStorageSwaps();
  return Object.values(swaps)
    .filter((s) => s.user_wallet === userWalletAddress)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Retrieve all swaps for global feed.
 */
export async function getGlobalSwaps(limit = 12): Promise<SwapEvent[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("swaps")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(limit);
      if (!error && data) {
        return data as SwapEvent[];
      }
    } catch (e) {
      console.error("Supabase fetch global swaps error:", e);
    }
  }

  // Fallback to local storage
  const swaps = getLocalStorageSwaps();
  return Object.values(swaps)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

const LOCAL_STORAGE_COMMENTS_KEY = "ther_comments_metadata";

function getLocalStorageComments(): Record<string, VaultComment> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLocalStorageComment(comment: VaultComment) {
  if (typeof window === "undefined") return;
  try {
    const comments = getLocalStorageComments();
    comments[comment.id] = comment;
    localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error("Local storage comment error:", e);
  }
}

/**
 * Save a vault comment off-chain.
 */
export async function saveVaultComment(data: VaultComment): Promise<boolean> {
  saveLocalStorageComment(data);

  if (supabase) {
    try {
      const { error } = await supabase.from("comments").insert(data);
      if (error) {
        console.error("Supabase comment insert error:", error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Supabase connection error for comment:", e);
      return false;
    }
  }
  return true;
}

/**
 * Retrieve all comments for a vault.
 */
export async function getVaultComments(vaultId: string): Promise<VaultComment[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("vault_id", vaultId)
        .order("created_at", { ascending: false });
      if (!error && data) {
        return data as VaultComment[];
      }
    } catch (e) {
      console.error("Supabase fetch vault comments error:", e);
    }
  }

  const comments = getLocalStorageComments();
  return Object.values(comments)
    .filter((c) => c.vault_id === vaultId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
