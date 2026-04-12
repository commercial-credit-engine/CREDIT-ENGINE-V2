# AGENTS.md — Credit Engine V2

## Purpose

This repository builds a deal-first commercial lending platform.

The system must behave as a **deal compiler**, not a CRM.

All work must prioritize:
- structure
- correctness
- production realism
- simplicity

---

## Repository Structure (STRICT)

This is a **single Next.js app**, NOT a monorepo.

Valid structure:

- /app → Next.js App Router pages
- /components → UI components
- /lib → utilities (auth, db, helpers)
- /docs → documentation
- /supabase → migrations
- /tests → test files

❌ DO NOT CREATE:
- apps/
- packages/
- src/ (unless explicitly requested later)
- parallel architectures

---

## Core Rules

1. **Never invent files or claim files exist without creating them.**
2. **Never change repo structure without explicit instruction.**
3. **Always verify actual filesystem before reporting completion.**
4. **Always use real framework commands (no fake build scripts).**
5. **All work must be runnable locally.**

---

## Build Rules

- `npm install` must succeed
- `npm run dev` must run Next.js
- `npm run build` must run `next build`

❌ DO NOT replace build with mock scripts

---

## Development Approach

Work in batches.

### Batch rules:

- Complete the batch fully before moving on
- Do not skip missing pieces
- Do not partially implement features
- Do not introduce future-phase complexity early

---

## Batch Priorities

### Batch 1
- App routes
- Layout
- Deal workspace shell
- Navigation

### Batch 2
- Auth + session
- Database + migrations
- RLS enforcement

### Batch 3
- Deal data model
- CRUD
- Mapping logic

---

## Auth Rules

- Use simple session-based auth first
- No external auth providers unless requested
- Protect routes using server-side checks

---

## Database Rules

- All schema changes must be migrations
- Migrations must be additive and ordered
- Never overwrite previous migrations

---

## Testing Rules

- Add minimal tests for:
  - auth
  - protected routes
  - core logic

---

## Documentation Rules

After each batch:
- Update `/docs/progress.md`
- Update `/docs/migrations.md`

---

## Forbidden Behavior

❌ No fake file listings  
❌ No duplicate architectures  
❌ No rewriting earlier batches silently  
❌ No skipping build/test verification  
❌ No introducing tools not required  

---

## Definition of Done

A batch is complete ONLY if:

- Files exist in the repo
- App runs locally
- Build passes
- Tests pass
- Docs updated

---

## Final Principle

> Simplicity beats cleverness.  
> Working code beats theoretical design.  
> Verified files beat generated summaries.