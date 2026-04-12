create table if not exists public.deal_notes (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  author_user_id uuid not null references public.users(id) on delete restrict,
  note_body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists deal_notes_deal_id_idx on public.deal_notes (deal_id);
create index if not exists deal_notes_author_user_id_idx on public.deal_notes (author_user_id);

alter table public.deal_notes enable row level security;

create policy "deal_notes_select_via_parent_deal"
on public.deal_notes
for select
using (
  exists (
    select 1
    from public.deals
    where public.deals.id = public.deal_notes.deal_id
      and public.deals.owner_user_id = auth.uid()
  )
);

create policy "deal_notes_insert_via_parent_deal"
on public.deal_notes
for insert
with check (
  exists (
    select 1
    from public.deals
    where public.deals.id = public.deal_notes.deal_id
      and public.deals.owner_user_id = auth.uid()
  )
  and author_user_id = auth.uid()
);

create policy "deal_notes_update_via_parent_deal"
on public.deal_notes
for update
using (
  exists (
    select 1
    from public.deals
    where public.deals.id = public.deal_notes.deal_id
      and public.deals.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.deals
    where public.deals.id = public.deal_notes.deal_id
      and public.deals.owner_user_id = auth.uid()
  )
  and author_user_id = auth.uid()
);

create policy "deal_notes_delete_via_parent_deal"
on public.deal_notes
for delete
using (
  exists (
    select 1
    from public.deals
    where public.deals.id = public.deal_notes.deal_id
      and public.deals.owner_user_id = auth.uid()
  )
);
