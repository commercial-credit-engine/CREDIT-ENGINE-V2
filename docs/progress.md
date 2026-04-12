# Credit Engine V2 Progress

## Batch 1

### What Batch 1 built
- Replaced the default Next.js starter home page with a Credit Engine V2 product introduction.
- Updated the main app layout with a reusable header and primary navigation.
- Added app router pages for dashboard, sign-in, settings, new deal intake, and deal workspace.
- Built a deal workspace shell with interactive tab-like navigation and visible placeholder content for each section.
- Added a simple dashboard shell with mock deal cards and routing into individual deal workspaces.

### Files created
- `app/dashboard/page.tsx`
- `app/deals/[id]/page.tsx`
- `app/deals/new/page.tsx`
- `app/page.tsx`
- `app/settings/page.tsx`
- `app/sign-in/page.tsx`
- `components/deal/workspace-tabs.tsx`
- `components/layout/header.tsx`
- `docs/progress.md`

### Current status
- Batch 1 UI foundation is implemented in the single root Next.js app.
- No backend, auth, database, or persistence was introduced in this batch.

## Batch 2

### What Batch 2 built
- Added local cookie-based session auth with sign-in and sign-out API routes.
- Added server-side protected route checks for `/dashboard`, `/settings`, and `/deals/[id]`.
- Created auth utilities for reading and requiring the current session from server code.
- Added initial Supabase migrations for users, organizations, memberships, deals, and deal notes.
- Added simple row-level security policies for deals and deal notes based on ownership through the parent deal.

### Files created
- `app/api/auth/sign-in/route.ts`
- `app/api/auth/sign-out/route.ts`
- `docs/migrations.md`
- `lib/auth/require-session.ts`
- `lib/auth/session.ts`
- `supabase/migrations/20260412193000_create_users.sql`
- `supabase/migrations/20260412193100_create_organizations.sql`
- `supabase/migrations/20260412193200_create_memberships.sql`
- `supabase/migrations/20260412193300_create_deals.sql`
- `supabase/migrations/20260412193400_create_deal_notes.sql`

### Current status
- Batch 2 foundation is in place for local auth, protected routes, and initial schema ownership groundwork.
- Sign-in currently accepts any non-empty email and password pair for local foundation work.
- The database migrations and RLS policies are additive and ready for later data model expansion.

## Batch 3

### What Batch 3 built
- Added real deal persistence backed by the current Postgres schema foundation.
- Wired the new deal intake form to save deals with owner and organization linkage.
- Replaced mock dashboard cards with live persisted deals plus an empty state.
- Updated the deal workspace to load the real persisted deal and show live overview data.
- Added simple deal note persistence with create and read support for the current deal owner.

### Files created
- `app/deals/new/actions.ts`
- `app/deals/[id]/actions.ts`
- `lib/db.ts`
- `lib/deals.ts`

### Current status
- Deal and deal note persistence now runs against `DATABASE_URL` using the existing schema.
- Auth and protected route behavior remain simple and unchanged from Batch 2.
- The workspace overview tab shows persisted deal content, while other tabs remain UI shells for later batches.
