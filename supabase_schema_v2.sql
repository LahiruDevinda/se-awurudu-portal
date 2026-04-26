-- UoK Awurudu Supabase Schema V2

-- 1. Profiles Table Update
-- If profiles already exists, we alter it. Otherwise, create it.
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  is_admin boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safely add is_admin if table already existed without it
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='is_admin') then
    alter table public.profiles add column is_admin boolean default false not null;
  end if;
end $$;

-- 2. System Settings Table (Master Toggles)
create table if not exists public.system_settings (
  id integer primary key default 1 check (id = 1), -- Only allow one row
  voting_active boolean default true not null,
  puzzle_active boolean default true not null,
  papol_active boolean default true not null,
  media_active boolean default true not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings row if not exists
insert into public.system_settings (id) values (1) on conflict (id) do nothing;

-- 3. Papol Guesses Table
create table if not exists public.papol_guesses (
  user_id uuid references auth.users(id) on delete cascade not null primary key,
  guess integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Media Uploads Table
create table if not exists public.media_uploads (
  user_id uuid references auth.users(id) on delete cascade not null primary key,
  file_url text not null,
  file_type text not null check (file_type in ('image', 'video')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Storage Bucket for Moments
insert into storage.buckets (id, name, public) 
values ('moments', 'moments', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'moments' );
create policy "Authenticated users can upload" on storage.objects for insert with check ( bucket_id = 'moments' and auth.role() = 'authenticated' );
create policy "Users can update their own uploads" on storage.objects for update using ( bucket_id = 'moments' and auth.uid() = owner );
create policy "Users can delete their own uploads" on storage.objects for delete using ( bucket_id = 'moments' and auth.uid() = owner );

-- Enable RLS
alter table public.system_settings enable row level security;
alter table public.papol_guesses enable row level security;
alter table public.media_uploads enable row level security;

-- DB Policies
create policy "Settings are viewable by everyone." on public.system_settings for select using (true);
create policy "Only admins can update settings." on public.system_settings for update using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Users can view their own papol guesses." on public.papol_guesses for select using (auth.uid() = user_id);
create policy "Users can insert their own papol guesses." on public.papol_guesses for insert with check (auth.uid() = user_id);
create policy "Users can update their own papol guesses." on public.papol_guesses for update using (auth.uid() = user_id);
create policy "Admins can view all papol guesses." on public.papol_guesses for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true)
);

create policy "Public can view all media uploads." on public.media_uploads for select using (true);
create policy "Users can insert their own media." on public.media_uploads for insert with check (auth.uid() = user_id);
create policy "Users can update their own media." on public.media_uploads for update using (auth.uid() = user_id);
