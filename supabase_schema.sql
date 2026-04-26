-- UoK Awurudu Supabase Schema

-- 1. Profiles Table (Optional, we will rely on Supabase Auth, but good to have extra fields)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. OTP Requests Table (If using custom OTP flow)
create table public.otp_requests (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  otp text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Contestants Table
create table public.contestants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null check (category in ('Kumara', 'Kumariya')),
  photo_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Votes Table
create table public.votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  contestant_id uuid references public.contestants(id) on delete cascade not null,
  category text not null check (category in ('Kumara', 'Kumariya')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, category) -- Unique constraint: 1 vote per user per category
);

-- 5. Game Scores Table
create table public.game_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  moves integer not null,
  time_taken_seconds integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) setup
alter table public.profiles enable row level security;
alter table public.otp_requests enable row level security;
alter table public.contestants enable row level security;
alter table public.votes enable row level security;
alter table public.game_scores enable row level security;

-- Policies
create policy "Public contestants are viewable by everyone." on public.contestants for select using (true);
create policy "Users can view their own votes." on public.votes for select using (auth.uid() = user_id);
create policy "Users can insert their own votes." on public.votes for insert with check (auth.uid() = user_id);
create policy "Users can view their own game scores." on public.game_scores for select using (auth.uid() = user_id);
create policy "Users can insert their own game scores." on public.game_scores for insert with check (auth.uid() = user_id);
create policy "Users can view their own profile." on public.profiles for select using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed Data for Testing
insert into public.contestants (name, category, bio, photo_url) values
  ('Kasun Perera', 'Kumara', 'A traditional dancer from the Faculty of Science.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80'),
  ('Nuwan Silva', 'Kumara', 'Sports captain and cultural enthusiast.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'),
  ('Amali Fernando', 'Kumariya', 'Loves playing the Rabana and making Kavum.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'),
  ('Sanduni Wijesinghe', 'Kumariya', 'President of the Arts Society.', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80');
