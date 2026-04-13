import { getPool } from "@/lib/db";
import type { SessionUser } from "@/lib/auth/session";
import { getSessionActor } from "@/lib/identity";

export type DealPartyRecord = {
  id: string;
  dealId: string;
  organizationId: string;
  partyName: string;
  partyType: "borrower" | "guarantor";
  createdAt: string;
  updatedAt: string;
};

function mapParty(row: {
  id: string;
  deal_id: string;
  organization_id: string;
  party_name: string;
  party_type: "borrower" | "guarantor";
  created_at: Date | string;
  updated_at: Date | string;
}): DealPartyRecord {
  return {
    id: row.id,
    dealId: row.deal_id,
    organizationId: row.organization_id,
    partyName: row.party_name,
    partyType: row.party_type,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function listDealPartiesForDeal(
  session: SessionUser,
  dealId: string,
) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const result = await pool.query(
    `
      select
        parties.id,
        parties.deal_id,
        parties.organization_id,
        parties.party_name,
        parties.party_type,
        parties.created_at,
        parties.updated_at
      from public.deal_parties parties
      inner join public.deals deals
        on deals.id = parties.deal_id
      inner join public.memberships memberships
        on memberships.organization_id = deals.organization_id
      where parties.deal_id = $1
        and deals.organization_id = $2
        and memberships.user_id = $3
      order by parties.created_at asc
    `,
    [dealId, actor.organizationId, actor.userId],
  );

  return result.rows.map(mapParty);
}

export async function createDealPartyForDeal(
  session: SessionUser,
  dealId: string,
  input: {
    partyName: string;
    partyType: "borrower" | "guarantor";
  },
) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const accessResult = await pool.query(
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

  if (!accessResult.rows[0]) {
    return null;
  }

  const result = await pool.query(
    `
      insert into public.deal_parties (
        deal_id,
        organization_id,
        party_name,
        party_type
      )
      values ($1, $2, $3, $4)
      returning
        id,
        deal_id,
        organization_id,
        party_name,
        party_type,
        created_at,
        updated_at
    `,
    [dealId, actor.organizationId, input.partyName, input.partyType],
  );

  return mapParty(result.rows[0]);
}
