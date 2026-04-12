import { createHash } from "node:crypto";
import { getPool } from "@/lib/db";
import type { SessionUser } from "@/lib/auth/session";

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

function deriveStableUuid(value: string) {
  const hash = createHash("sha256").update(value).digest("hex");

  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    hash.slice(12, 16),
    hash.slice(16, 20),
    hash.slice(20, 32),
  ].join("-");
}

function deriveOrganizationId(email: string) {
  return deriveStableUuid(`organization:${email.trim().toLowerCase()}`);
}

function deriveOrganizationName(email: string) {
  const localPart = email.split("@")[0] ?? "Broker";
  const normalized = localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return normalized ? `${normalized} Advisory` : "Broker Advisory";
}

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

async function ensureActorContext(session: SessionUser) {
  const pool = getPool();
  const client = await pool.connect();
  const organizationId = deriveOrganizationId(session.email);
  const organizationName = deriveOrganizationName(session.email);

  try {
    await client.query("begin");
    await client.query(
      `
        insert into public.users (id, email)
        values ($1, $2)
        on conflict (id) do update
        set email = excluded.email,
            updated_at = timezone('utc', now())
      `,
      [session.userId, session.email],
    );
    await client.query(
      `
        insert into public.organizations (id, name)
        values ($1, $2)
        on conflict (id) do update
        set name = excluded.name,
            updated_at = timezone('utc', now())
      `,
      [organizationId, organizationName],
    );
    await client.query(
      `
        insert into public.memberships (user_id, organization_id, role)
        values ($1, $2, 'member')
        on conflict (user_id, organization_id) do nothing
      `,
      [session.userId, organizationId],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  return organizationId;
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
  const organizationId = await ensureActorContext(session);
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
      organizationId,
      session.userId,
      input.name.trim(),
      input.borrowerName.trim() || null,
      input.scenario.trim() || null,
    ],
  );

  return mapDeal(result.rows[0]);
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
  await ensureActorContext(session);
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
