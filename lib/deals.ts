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
  const pool = getPool();
  const result = await pool.query(
    `
      select
        id,
        organization_id,
        owner_user_id,
        name,
        borrower_name,
        scenario,
        created_at,
        updated_at
      from public.deals
      where owner_user_id = $1
      order by updated_at desc, created_at desc
    `,
    [session.userId],
  );

  return result.rows.map(mapDeal);
}

export async function getDealByIdForUser(session: SessionUser, dealId: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        id,
        organization_id,
        owner_user_id,
        name,
        borrower_name,
        scenario,
        created_at,
        updated_at
      from public.deals
      where id = $1
        and owner_user_id = $2
      limit 1
    `,
    [dealId, session.userId],
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
  const pool = getPool();
  const result = await pool.query(
    `
      update public.deals
      set name = $3,
          borrower_name = $4,
          scenario = $5,
          updated_at = timezone('utc', now())
      where id = $1
        and owner_user_id = $2
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
      session.userId,
      input.name.trim(),
      input.borrowerName.trim() || null,
      input.scenario.trim() || null,
    ],
  );

  const row = result.rows[0];

  return row ? mapDeal(row) : null;
}

export async function listDealNotesForDeal(
  session: SessionUser,
  dealId: string,
) {
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
      where notes.deal_id = $1
        and deals.owner_user_id = $2
      order by notes.created_at desc
    `,
    [dealId, session.userId],
  );

  return result.rows.map(mapNote);
}

export async function createDealNoteForDeal(
  session: SessionUser,
  dealId: string,
  noteBody: string,
) {
  const pool = getPool();
  const dealResult = await pool.query(
    `
      select id
      from public.deals
      where id = $1
        and owner_user_id = $2
      limit 1
    `,
    [dealId, session.userId],
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
    [dealId, session.userId, noteBody.trim()],
  );

  return mapNote(result.rows[0]);
}

export async function deleteDealNoteForDeal(
  session: SessionUser,
  dealId: string,
  noteId: string,
) {
  const pool = getPool();
  const result = await pool.query(
    `
      delete from public.deal_notes notes
      using public.deals deals
      where notes.id = $1
        and notes.deal_id = $2
        and deals.id = notes.deal_id
        and deals.owner_user_id = $3
      returning notes.id
    `,
    [noteId, dealId, session.userId],
  );

  return Boolean(result.rows[0]);
}
