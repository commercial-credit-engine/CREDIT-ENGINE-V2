import { getPool } from "@/lib/db";
import type { SessionUser } from "@/lib/auth/session";
import { getSessionActor } from "@/lib/identity";

export type DealRecord = {
  id: string;
  organizationId: string;
  ownerUserId: string;
  name: string;
  borrowerName: string | null;
  scenario: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DealNoteRecord = {
  id: string;
  dealId: string;
  authorUserId: string;
  noteBody: string;
  createdAt: string;
  updatedAt: string;
};

function mapDeal(row: {
  id: string;
  organization_id: string;
  owner_user_id: string;
  name: string;
  borrower_name: string | null;
  scenario: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}): DealRecord {
  return {
    id: row.id,
    organizationId: row.organization_id,
    ownerUserId: row.owner_user_id,
    name: row.name,
    borrowerName: row.borrower_name,
    scenario: row.scenario,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapNote(row: {
  id: string;
  deal_id: string;
  author_user_id: string;
  note_body: string;
  created_at: Date | string;
  updated_at: Date | string;
}): DealNoteRecord {
  return {
    id: row.id,
    dealId: row.deal_id,
    authorUserId: row.author_user_id,
    noteBody: row.note_body,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function listDealsForUser(session: SessionUser) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const result = await pool.query(
    `
      select
        deals.id,
        deals.organization_id,
        deals.owner_user_id,
        deals.name,
        deals.borrower_name,
        deals.scenario,
        deals.created_at,
        deals.updated_at
      from public.deals deals
      inner join public.memberships memberships
        on memberships.organization_id = deals.organization_id
      where deals.organization_id = $1
        and memberships.user_id = $2
      order by deals.updated_at desc, deals.created_at desc
    `,
    [actor.organizationId, actor.userId],
  );

  return result.rows.map(mapDeal);
}

export async function getDealByIdForUser(session: SessionUser, dealId: string) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const result = await pool.query(
    `
      select
        deals.id,
        deals.organization_id,
        deals.owner_user_id,
        deals.name,
        deals.borrower_name,
        deals.scenario,
        deals.created_at,
        deals.updated_at
      from public.deals deals
      inner join public.memberships memberships
        on memberships.organization_id = deals.organization_id
      where deals.id = $1
        and deals.organization_id = $2
        and memberships.user_id = $3
      limit 1
    `,
    [dealId, actor.organizationId, actor.userId],
  );

  const row = result.rows[0];

  return row ? mapDeal(row) : null;
}

export async function createDealForUser(
  session: SessionUser,
  input: {
    name: string;
    borrowerName: string;
    scenario: string;
  },
) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const result = await pool.query(
    `
      insert into public.deals (
        organization_id,
        owner_user_id,
        name,
        borrower_name,
        scenario
      )
      values ($1, $2, $3, $4, $5)
      returning
        id,
        organization_id,
        owner_user_id,
        name,
        borrower_name,
        scenario,
        created_at,
        updated_at
    `,
    [
      actor.organizationId,
      actor.userId,
      input.name.trim(),
      input.borrowerName.trim() || null,
      input.scenario.trim() || null,
    ],
  );

  return mapDeal(result.rows[0]);
}

export async function updateDealOverviewForUser(
  session: SessionUser,
  dealId: string,
  input: {
    name: string;
    borrowerName: string;
    scenario: string;
  },
) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const result = await pool.query(
    `
      update public.deals deals
      set name = $3,
          borrower_name = $4,
          scenario = $5,
          updated_at = timezone('utc', now())
      where id = $1
        and organization_id = $2
        and exists (
          select 1
          from public.memberships
          where public.memberships.organization_id = deals.organization_id
            and public.memberships.user_id = $6
        )
      returning
        id,
        organization_id,
        owner_user_id,
        name,
        borrower_name,
        scenario,
        created_at,
        updated_at
    `,
    [
      dealId,
      actor.organizationId,
      input.name.trim(),
      input.borrowerName.trim() || null,
      input.scenario.trim() || null,
      actor.userId,
    ],
  );

  const row = result.rows[0];

  return row ? mapDeal(row) : null;
}

export async function listDealNotesForDeal(
  session: SessionUser,
  dealId: string,
) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const result = await pool.query(
    `
      select
        notes.id,
        notes.deal_id,
        notes.author_user_id,
        notes.note_body,
        notes.created_at,
        notes.updated_at
      from public.deal_notes notes
      inner join public.deals deals
        on deals.id = notes.deal_id
      inner join public.memberships memberships
        on memberships.organization_id = deals.organization_id
      where notes.deal_id = $1
        and deals.organization_id = $2
        and memberships.user_id = $3
      order by notes.created_at desc
    `,
    [dealId, actor.organizationId, actor.userId],
  );

  return result.rows.map(mapNote);
}

export async function createDealNoteForDeal(
  session: SessionUser,
  dealId: string,
  noteBody: string,
) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const dealResult = await pool.query(
    `
      select deals.id
      from public.deals deals
      inner join public.memberships memberships
        on memberships.organization_id = deals.organization_id
      where deals.id = $1
        and deals.organization_id = $2
        and memberships.user_id = $3
      limit 1
    `,
    [dealId, actor.organizationId, actor.userId],
  );

  if (!dealResult.rows[0]) {
    return null;
  }

  const result = await pool.query(
    `
      insert into public.deal_notes (
        deal_id,
        author_user_id,
        note_body
      )
      values ($1, $2, $3)
      returning
        id,
        deal_id,
        author_user_id,
        note_body,
        created_at,
        updated_at
    `,
    [dealId, actor.userId, noteBody.trim()],
  );

  return mapNote(result.rows[0]);
}

export async function deleteDealNoteForDeal(
  session: SessionUser,
  dealId: string,
  noteId: string,
) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const result = await pool.query(
    `
      delete from public.deal_notes notes
      using public.deals deals, public.memberships memberships
      where notes.id = $1
        and notes.deal_id = $2
        and deals.id = notes.deal_id
        and deals.organization_id = $3
        and memberships.organization_id = deals.organization_id
        and memberships.user_id = $4
      returning notes.id
    `,
    [noteId, dealId, actor.organizationId, actor.userId],
  );

  return Boolean(result.rows[0]);
}
