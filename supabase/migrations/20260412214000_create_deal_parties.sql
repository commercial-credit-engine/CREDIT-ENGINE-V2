create table if not exists public.deal_parties (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  party_name text not null,
  party_type text not null check (party_type in ('borrower', 'guarantor')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists deal_parties_deal_id_idx on public.deal_parties (deal_id);
create index if not exists deal_parties_organization_id_idx on public.deal_parties (organization_id);

alter table public.deal_parties enable row level security;

create policy "deal_parties_select_via_parent_deal"
on public.deal_parties
for select
using (
  exists (
    select 1
    from public.deals
    where public.deals.id = public.deal_parties.deal_id
      and public.deals.owner_user_id = auth.uid()
  )
);

create policy "deal_parties_insert_via_parent_deal"
on public.deal_parties
for insert
with check (
  exists (
    select 1
    from public.deals
    where public.deals.id = public.deal_parties.deal_id
      and public.deals.owner_user_id = auth.uid()
      and public.deals.organization_id = public.deal_parties.organization_id
  )
);
