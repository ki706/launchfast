-- Enable pgvector for AI features
create extension if not exists vector;

-- Profiles (extends Supabase auth.users)
create table public.launchfast_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text default 'free',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text default 'inactive',
  subscription_period_end timestamptz,
  ai_tokens_used_this_month int default 0,
  ai_tokens_reset_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Stripe Webhook Events (Idempotency)
create table public.launchfast_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text unique not null,
  type text not null,
  processed boolean default false,
  error text,
  created_at timestamptz default now()
);

-- AI Usage Tracking
create table public.launchfast_ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.launchfast_profiles(id) on delete cascade,
  model text not null,
  tokens_in int default 0,
  tokens_out int default 0,
  cost_usd decimal(10,6) default 0,
  endpoint text,
  created_at timestamptz default now()
);

-- Vector Documents for RAG
create table public.launchfast_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.launchfast_profiles(id) on delete cascade,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- API Keys
create table public.launchfast_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.launchfast_profiles(id) on delete cascade,
  name text not null,
  key_hash text not null unique,
  key_prefix text not null,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Audit Log
create table public.launchfast_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.launchfast_profiles(id) on delete cascade,
  action text not null,
  resource text,
  metadata jsonb default '{}',
  ip_address text,
  created_at timestamptz default now()
);

-- RLS Enablement
alter table public.launchfast_profiles enable row level security;
alter table public.launchfast_webhook_events enable row level security;
alter table public.launchfast_ai_usage enable row level security;
alter table public.launchfast_documents enable row level security;
alter table public.launchfast_api_keys enable row level security;
alter table public.launchfast_audit_log enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.launchfast_profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.launchfast_profiles for update using (auth.uid() = id);

create policy "Users can view own AI usage" on public.launchfast_ai_usage for select using (auth.uid() = user_id);

create policy "Users can manage own documents" on public.launchfast_documents for all using (auth.uid() = user_id);

create policy "Users can manage own API keys" on public.launchfast_api_keys for all using (auth.uid() = user_id);

-- Triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.launchfast_profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop first because CREATE OR REPLACE doesn't exist for triggers
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Vector Match Function
create or replace function match_launchfast_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.launchfast_documents d
  where d.user_id = p_user_id
    and 1 - (d.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
