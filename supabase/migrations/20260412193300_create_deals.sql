create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  owner_user_id uuid not null references public.users(id) on delete restrict,
  name text not null,
  borrower_name text,
  scenario text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists deals_owner_user_id_idx on public.deals (owner_user_id);
create index if not exists deals_organization_id_idx on public.deals (organization_id);

alter table public.deals enable row level security;

create policy "deals_select_own"
on public.deals
for select
using (auth.uid() = owner_user_id);

create policy "deals_insert_own"
on public.deals
for insert
with check (auth.uid() = owner_user_id);

create policy "deals_update_own"
on public.deals
for update
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

create policy "deals_delete_own"
on public.deals
for delete
using (auth.uid() = owner_user_id);
