-- UoK Awurudu Supabase Schema V3

-- 1. Contestants Table
create table if not exists public.contestants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null check (category in ('Kumara', 'Kumariya')),
  number text not null,
  photo_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Update System Settings for Secret Stranger
alter table public.system_settings add column if not exists secret_stranger_active boolean default true not null;

-- 3. Secret Stranger Table
create table if not exists public.secret_stranger (
  user_id uuid references auth.users(id) on delete cascade not null primary key,
  guess_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contestants enable row level security;
alter table public.secret_stranger enable row level security;

-- Policies
create policy "Contestants are viewable by everyone." on public.contestants for select using (true);
create policy "Only admins can manage contestants." on public.contestants for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Users can manage their own secret stranger guesses." on public.secret_stranger for all using (auth.uid() = user_id);
create policy "Admins can view all secret stranger guesses." on public.secret_stranger for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);
