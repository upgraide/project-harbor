# 🔐 Security & Quality

> Covers the security model of Harbor Partners — how access is controlled, how secrets are managed, how the codebase stays consistent — and the quality toolchain that enforces standards.

---

## Authentication Architecture

### Better Auth

All authentication is handled by **Better Auth** (`src/lib/auth.ts`), initialized with:
- **Prisma adapter** — sessions and accounts stored in the same Postgres database
- **Email/password strategy** — no social login in current setup
- **Session signing** with `BETTER_AUTH_SECRET`
- **`onSignIn` hook** — checks if the user account is `disabled` and throws if so, preventing login for deactivated accounts

Session validation happens **per tRPC request** inside `createTRPCContext`. No request reaches a resolver without a validated session.

### Session Lifecycle

```
User submits credentials
    ↓
Better Auth validates email/password
    ↓
Prisma writes Session { token, userId, expiresAt, ip, userAgent }
    ↓
Session cookie set (scoped to BETTER_AUTH_URL domain)
    ↓
Each tRPC request → createTRPCContext reads cookie → Better Auth validates
    ↓
On logout / expiry → Session deleted from DB
```

### Cookie Security
- Session cookie is **httpOnly** and **scoped to the domain** defined by `BETTER_AUTH_URL`
- `BETTER_AUTH_URL` **must exactly match** the deployed domain — mismatches cause cookie drops and apparent random logouts
- Never use a localhost URL in production

---

## Authorization Model

### Role Hierarchy

```
ADMIN  ←── can do everything
  │
TEAM   ←── create/manage opportunities, CRM, assign leads
  │
USER   ←── browse opportunities, express interest, manage own profile
```

### tRPC Middleware Chain

Defined in `src/trpc/init.ts`:

| Middleware | What it enforces |
|------------|-----------------|
| `baseProcedure` | No auth required (e.g., `accessRequest.create`) |
| `protectedProcedure` | Valid Better Auth session required |
| `teamOrAdminProcedure` | `protectedProcedure` + `role === TEAM \|\| role === ADMIN` |
| `adminProcedure` | `protectedProcedure` + `role === ADMIN` |

Every procedure explicitly declares which middleware it uses. There is no implicit access — if a procedure uses `baseProcedure`, it's intentional.

### Error Handling
Always throw `new TRPCError` from procedures — never raw `Error`. This produces typed, predictable error codes for the client:

```typescript
throw new TRPCError({
  code: "UNAUTHORIZED",
  message: "You do not have permission to perform this action"
})
```

---

## Password Enforcement

Newly invited users receive a temporary password. The system enforces a change on first login:

1. User is created with `passwordChanged: false`
2. `PasswordChangeProvider` wraps all protected pages and checks this flag on every load
3. If `false` → non-dismissible dialog opens, blocking all interaction
4. On successful change → Better Auth updates credentials → `passwordChanged` set to `true` → cookie cleared

This pattern ensures compromised invitation emails cannot lead to long-term account access with weak credentials.

---

## Secrets Management

### Rules
- ✅ All secrets validated at build time by `@t3-oss/env-nextjs` in `src/lib/env.ts`
- ✅ `NEXT_PUBLIC_` prefix **only** for non-sensitive public config (Pusher cluster, API base URLs)
- ❌ Never log secrets in Sentry, console, or Inngest step payloads
- ❌ Never commit `.env` or `.env.local` — these are in `.gitignore`
- ❌ Never put secrets in `NEXT_PUBLIC_` variables

### What Goes Where

| Variable type | Location |
|--------------|----------|
| Secrets (API keys, signing secrets) | Server-only env vars |
| Public non-sensitive config | `NEXT_PUBLIC_` prefix |
| Production secrets | Vercel Environment Variables dashboard |
| Local development | `.env.local` (never committed) |

### Local Dev — Avoid Shell History Leaks

```bash
# Option A: direnv (auto-loads .env.local when entering the dir)
echo 'dotenv .env.local' > .envrc && direnv allow

# Option B: Doppler
doppler run -- bun dev
```

### Rotation Schedule

| Secret | Rotate | Reason |
|--------|--------|--------|
| `BETTER_AUTH_SECRET` | Quarterly | Signs all sessions |
| All API keys | Quarterly | General hygiene |
| `DATABASE_URL` credentials | On team member offboarding | DB access |
| Any secret | Immediately | On suspected compromise |

**Rotation procedure:**
1. Generate new credentials in vendor dashboard
2. Update Vercel env vars
3. Redeploy app
4. Invalidate old credentials
5. Announce in `#eng-ops` — note which services need restarts

---

## File Upload Security

- UploadThing file deletion is enforced **server-side** — clients cannot delete files directly
- `deleteFromUploadthing()` is always called server-side when a DB record referencing a file is deleted
- Uploadthing dashboard must have the current domain in **allowed origins** — otherwise uploads are blocked by CORS
- File keys are stored in the DB; mismatched keys are the most common cause of failed deletions

---

## Input Validation

All tRPC procedure inputs are validated with **Zod** before any business logic runs:

- Phone numbers must match **E.164 format** (validated on `AccessRequest.phone`)
- Required string fields are validated as `z.string().min(1)` — no empty strings
- Enum fields use `z.nativeEnum(MyEnum)` — invalid values fail at the API boundary
- Optional fields use `.optional()` or `.nullable()` explicitly

This means malformed data never reaches Prisma — type errors are caught at the API layer.

---

## Code Quality Toolchain

### Biome

Biome is the single tool for linting and formatting (replaces ESLint + Prettier). It runs 451 built-in rules covering TypeScript, React, JSX, accessibility, and import ordering.

```bash
bun lint       # Check all files
bun format     # Auto-fix all files
```

Configuration lives in `biome.json`. The Ultracite ruleset is applied on top for opinionated conventions.

### Lefthook (Pre-commit Hooks)

Configured in `lefthook.yml`. On every `git commit`:
1. `bun x ultracite fix` — auto-formats staged files
2. Biome lint checks run on staged files only (fast, not full project)

You cannot commit unformatted or lint-failing code without explicitly bypassing hooks (`--no-verify`, which is discouraged).

### TypeScript Strictness

- `tsconfig.json` extends Next.js strict defaults
- Path aliases (`@/features/...`, `@/lib/...`, `@/trpc/...`) used throughout — no relative `../../` chains
- `bunx tsc --noEmit` for full type checking — run before PRs
- Avoid `any` — tRPC's end-to-end type inference breaks silently if `any` is introduced in procedure responses

### Prisma Compile-Time Safety

Prisma Client provides compile-time validation on all database access:
- Invalid field names fail at TypeScript compilation, not at runtime
- `Prisma.<Model>GetPayload<...>` helpers for typed partial selects
- Always update payload helpers when modifying models used by tRPC routers

---

## Accessibility (a11y)

The Ultracite Biome ruleset includes accessibility rules that enforce:
- No positive `tabIndex` values
- All `<button>` elements must have a `type` attribute
- SVG elements should have `<title>` for screen readers
- Interactive elements must be keyboard-navigable

These are caught at lint time, not just in browser testing.

---

## Observability & Error Tracking (Sentry)

Sentry is configured for both server and edge runtimes:

| Config file | Runtime |
|-------------|---------|
| `sentry.server.config.ts` | Node.js (API routes, tRPC, Inngest) |
| `sentry.edge.config.ts` | Edge (middleware, edge API routes) |

### Logging Conventions

Follow this pattern in all Inngest functions and complex server logic:

```typescript
// Good — structured, with context
Sentry.logger.info("Translation started", { opportunityId, step: "gemini-call" })
Sentry.logger.error("Translation failed", { error: e.message, opportunityId })

// Bad — no context
console.log("done")
```

DSNs are stored in Vercel environment variables. Keep server and edge DSNs synchronized across environments.

---

## Testing Strategy

### Current State
- No automated test suite (unit or integration)
- Quality is enforced via TypeScript, Prisma compile-time checks, Biome lint, and manual smoke tests

### Recommended Future Approach

| Test type | Tool | What to test |
|-----------|------|-------------|
| Unit tests | `bun test` (Jest-compatible) | tRPC procedure logic, analytics helpers, Zod schemas |
| Integration tests | `bun test` + test database | Full tRPC procedure → Prisma → DB round trips |
| E2E tests | Playwright | Critical user flows: login, create opportunity, access request |

### Recommended Priority Order
1. `trpc.accessRequest.create` — public-facing, high-impact
2. `trpc.mergerAndAcquisition.create` — triggers Inngest, complex side effects
3. `trpc.users.invite` — auth-critical, email side effect
4. Analytics helpers — pure functions, easy to unit test

### Adding Tests
```bash
# Create test file alongside the module
src/features/users/server/route.test.ts

# Run tests
bun test

# Run with watch mode
bun test --watch
```
