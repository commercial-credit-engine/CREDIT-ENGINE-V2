# Credit Engine V2 Migrations

## Batch 2

### Added migrations
- `20260412193000_create_users.sql`
- `20260412193100_create_organizations.sql`
- `20260412193200_create_memberships.sql`
- `20260412193300_create_deals.sql`
- `20260412193400_create_deal_notes.sql`

### Scope
- Adds the foundation tables for users, organizations, memberships, deals, and deal notes.
- Establishes deal ownership with `owner_user_id` and `organization_id`.
- Enables row-level security on `deals` and `deal_notes`.
- Keeps note access derived from the parent deal ownership policy.

### Notes
- These migrations are additive and ordered.
- RLS currently assumes authenticated database access will map to `auth.uid()` in later integration work.
- Local app auth is currently cookie-session based and separate from database authentication.

## Batch 5

### Added migrations
- `20260412214000_create_deal_parties.sql`

### Scope
- Adds a minimal `deal_parties` table for one bounded persisted workspace section.
- Stores simple borrower and guarantor party records against a deal.
- Keeps access derived from the parent deal for the new table's RLS foundation.

### Notes
- The app currently uses organization-scoped access checks when loading and mutating parties.
- The table is intentionally minimal and does not model complex relationships yet.
