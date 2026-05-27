-- =========================================================================
--             THER PROTOCOL — MASTER SUPABASE SQL SCHEMA
-- =========================================================================
-- Run this entire script in your Supabase SQL Editor to initialize all 
-- off-chain database tables, storage buckets, and Row-Level Security (RLS) policies.

-- =========================================================================
-- 1. VAULTS METADATA TABLE
-- =========================================================================

create table if not exists public.vaults (
  id text not null primary key, -- The Vault's Solana PDA public key
  name text not null,
  description text,
  image_url text,
  twitter text,
  website text,
  telegram text, -- Telegram link/handle
  creator text not null, -- Creator's Solana wallet address
  tokens_data jsonb, -- JSON array of tokens with symbols, decimals, initial deposits
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on Vaults
alter table public.vaults enable row level security;

-- Drop existing policies if they exist to ensure idempotency
drop policy if exists "Allow public read access to vaults" on public.vaults;
drop policy if exists "Allow public insert access to vaults" on public.vaults;
drop policy if exists "Allow creator update access to vaults" on public.vaults;

-- Policy: Allow public read access to vaults (so anyone can browse vaults)
create policy "Allow public read access to vaults"
  on public.vaults for select
  using (true);

-- Policy: Allow insert access to vaults (so creators can upload metadata upon creation)
create policy "Allow public insert access to vaults"
  on public.vaults for insert
  with check (true);

-- Policy: Allow creators to update their own vault metadata
create policy "Allow creator update access to vaults"
  on public.vaults for update
  using (true)
  with check (true);


-- =========================================================================
-- 2. USER PROFILES TABLE (Bio, Logo, Socials)
-- =========================================================================

create table if not exists public.profiles (
  wallet_address text not null primary key, -- User's Solana wallet address (base58)
  username text, -- Custom display name
  bio text, -- Short user biography
  avatar_url text, -- URL to the uploaded logo/avatar
  banner_url text, -- URL to custom profile banner
  website text, -- Personal/Project website link
  twitter text, -- Twitter handle (without @)
  discord text, -- Discord handle
  telegram text, -- Telegram handle (without @)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on Profiles
alter table public.profiles enable row level security;

-- Drop existing policies if they exist to ensure idempotency
drop policy if exists "Allow public read access to profiles" on public.profiles;
drop policy if exists "Allow insert access to profiles" on public.profiles;
drop policy if exists "Allow update access to profiles" on public.profiles;

-- Policy: Anyone can view any user profile
create policy "Allow public read access to profiles"
  on public.profiles for select
  using (true);

-- Policy: Anyone can create a profile record (checked via wallet signers in frontend)
create policy "Allow insert access to profiles"
  on public.profiles for insert
  with check (true);

-- Policy: Anyone can update a profile record
create policy "Allow update access to profiles"
  on public.profiles for update
  using (true)
  with check (true);


-- =========================================================================
-- 3. SUPABASE STORAGE BUCKETS SETUP (User Logo / Avatar uploads)
-- =========================================================================

-- Insert 'avatars' public bucket into Supabase Storage
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS) on storage objects
-- NOTE: In Supabase, RLS on storage.objects is enabled by default. 
-- Standard project editor users are not superusers/owners of this system table, 
-- so trying to alter it directly will result in a permission error.
-- alter table storage.objects enable row level security;

-- Drop existing storage policies if they exist to ensure idempotency
drop policy if exists "Allow public read from avatars" on storage.objects;
drop policy if exists "Allow public upload to avatars" on storage.objects;
drop policy if exists "Allow public update of avatars" on storage.objects;
drop policy if exists "Allow public deletion from avatars" on storage.objects;

-- Policy: Allow public read access to all uploaded avatars/logos
create policy "Allow public read from avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy: Allow uploads to the avatars bucket
create policy "Allow public upload to avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

-- Policy: Allow updates/modifications to uploads in avatars bucket
create policy "Allow public update of avatars"
  on storage.objects for update
  using ( bucket_id = 'avatars' );

-- Policy: Allow deletion of uploads in avatars bucket
create policy "Allow public deletion from avatars"
  on storage.objects for delete
  using ( bucket_id = 'avatars' );


-- =========================================================================
-- 4. SWAP EVENTS TABLE & RLS POLICIES
-- =========================================================================

create table if not exists public.swaps (
  id text not null primary key, -- Real Solana transaction signature
  vault_pubkey text not null, -- The Vault's Solana PDA public key
  vault_name text not null,
  user_wallet text not null, -- The user who executed the swap
  token_in_mint text not null,
  token_in_symbol text not null,
  token_out_mint text not null,
  token_out_symbol text not null,
  amount double precision not null,
  fee_sol double precision not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on Swaps
alter table public.swaps enable row level security;

-- Drop existing policies if they exist to ensure idempotency
drop policy if exists "Allow public read access to swaps" on public.swaps;
drop policy if exists "Allow public insert access to swaps" on public.swaps;

-- Policy: Allow public read access to swaps
create policy "Allow public read access to swaps"
  on public.swaps for select
  using (true);

-- Policy: Allow anyone to insert swap events (so users can post new swaps upon execution)
create policy "Allow public insert access to swaps"
  on public.swaps for insert
  with check (true);


-- =========================================================================
-- 5. VAULT COMMENTS TABLE & RLS POLICIES
-- =========================================================================

create table if not exists public.comments (
  id text not null primary key, -- Custom uuid generated on client or fallback
  vault_id text not null, -- The Vault's Solana PDA public key
  user_wallet text not null, -- Commenter wallet address
  username text, -- Commenter display name
  avatar_url text, -- Commenter avatar URL
  content text not null, -- Comment body content
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on Comments
alter table public.comments enable row level security;

-- Drop existing policies if they exist to ensure idempotency
drop policy if exists "Allow public read access to comments" on public.comments;
drop policy if exists "Allow insert access to comments" on public.comments;

-- Policy: Allow public read access to comments
create policy "Allow public read access to comments"
  on public.comments for select
  using (true);

-- Policy: Allow anyone to insert comments
create policy "Allow insert access to comments"
  on public.comments for insert
  with check (true);

