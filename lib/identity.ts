import { createHash } from "node:crypto";
import { getPool } from "@/lib/db";
import type { SessionUser } from "@/lib/auth/session";

export type SessionActor = {
  userId: string;
  email: string;
  brokerName: string | null;
  companyName: string;
  organizationId: string;
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

function deriveOrganizationIdFromUserId(userId: string) {
  return deriveStableUuid(`organization:${userId}`);
}

function deriveOrganizationName(email: string) {
  const localPart = email.split("@")[0] ?? "Broker";
  const normalized = localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return normalized ? `${normalized} Advisory` : "Broker Advisory";
}

function mapActor(row: {
  user_id: string;
  email: string;
  broker_name: string | null;
  company_name: string;
  organization_id: string;
}): SessionActor {
  return {
    userId: row.user_id,
    email: row.email,
    brokerName: row.broker_name,
    companyName: row.company_name,
    organizationId: row.organization_id,
  };
}

async function findActorByUserId(userId: string) {
  const pool = getPool();
  const result = await pool.query(
    `
      select
        users.id as user_id,
        users.email,
        users.full_name as broker_name,
        organizations.name as company_name,
        organizations.id as organization_id
      from public.users users
      inner join public.memberships memberships
        on memberships.user_id = users.id
      inner join public.organizations organizations
        on organizations.id = memberships.organization_id
      where users.id = $1
      order by memberships.created_at asc nulls last, memberships.id asc
      limit 1
    `,
    [userId],
  );

  const row = result.rows[0];

  return row ? mapActor(row) : null;
}

export async function ensureIdentityForEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("begin");

    let userResult = await client.query(
      `
        select id, email, full_name
        from public.users
        where email = $1
        limit 1
      `,
      [normalizedEmail],
    );

    if (!userResult.rows[0]) {
      userResult = await client.query(
        `
          insert into public.users (id, email)
          values ($1, $2)
          returning id, email, full_name
        `,
        [deriveStableUuid(`user:${normalizedEmail}`), normalizedEmail],
      );
    }

    const user = userResult.rows[0] as {
      id: string;
      email: string;
      full_name: string | null;
    };

    let actorResult = await client.query(
      `
        select
          users.id as user_id,
          users.email,
          users.full_name as broker_name,
          organizations.name as company_name,
          organizations.id as organization_id
        from public.users users
        inner join public.memberships memberships
          on memberships.user_id = users.id
        inner join public.organizations organizations
          on organizations.id = memberships.organization_id
        where users.id = $1
        order by memberships.created_at asc nulls last, memberships.id asc
        limit 1
      `,
      [user.id],
    );

    if (!actorResult.rows[0]) {
      const organizationId = deriveOrganizationIdFromUserId(user.id);
      const organizationName = deriveOrganizationName(user.email);

      await client.query(
        `
          insert into public.organizations (id, name)
          values ($1, $2)
          on conflict (id) do update
          set name = organizations.name
        `,
        [organizationId, organizationName],
      );
      await client.query(
        `
          insert into public.memberships (user_id, organization_id, role)
          values ($1, $2, 'member')
          on conflict (user_id, organization_id) do nothing
        `,
        [user.id, organizationId],
      );
      actorResult = await client.query(
        `
          select
            users.id as user_id,
            users.email,
            users.full_name as broker_name,
            organizations.name as company_name,
            organizations.id as organization_id
          from public.users users
          inner join public.memberships memberships
            on memberships.user_id = users.id
          inner join public.organizations organizations
            on organizations.id = memberships.organization_id
          where users.id = $1
          order by memberships.created_at asc nulls last, memberships.id asc
          limit 1
        `,
        [user.id],
      );
    }

    await client.query("commit");

    return mapActor(actorResult.rows[0]);
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function getSessionActor(session: SessionUser) {
  const actor = await findActorByUserId(session.userId);

  if (actor) {
    return actor;
  }

  return ensureIdentityForEmail(session.email);
}

export async function updateBrokerProfile(
  session: SessionUser,
  input: {
    brokerName: string;
    companyName: string;
    email: string;
  },
) {
  const actor = await getSessionActor(session);
  const pool = getPool();
  const client = await pool.connect();
  const email = input.email.trim().toLowerCase();
  const brokerName = input.brokerName.trim() || null;
  const companyName = input.companyName.trim();

  try {
    await client.query("begin");
    await client.query(
      `
        update public.users
        set email = $2,
            full_name = $3,
            updated_at = timezone('utc', now())
        where id = $1
      `,
      [actor.userId, email, brokerName],
    );
    await client.query(
      `
        update public.organizations
        set name = $2,
            updated_at = timezone('utc', now())
        where id = $1
      `,
      [actor.organizationId, companyName],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  return {
    userId: actor.userId,
    email,
    brokerName,
    companyName,
    organizationId: actor.organizationId,
  } satisfies SessionActor;
}
