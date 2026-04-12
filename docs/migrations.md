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
