# ⚙️ Developer Operations

> Everything you need to set up, run, develop, and maintain Harbor Partners locally. Covers environment setup, available scripts, database workflows, code quality tools, and day-to-day development patterns.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Bun** | ≥ 1.1 | `curl -fsSL https://bun.sh/install \| bash` |
| **PostgreSQL** | ≥ 15 | Local install or Docker |
| **Inngest CLI** | Latest | `bunx inngest-cli@latest` |
| **Node.js** | ≥ 18 | Bundled with Bun, but needed for some tooling |

---

## First-Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/<org>/harbor001.git
cd harbor001

# 2. Install dependencies
bun install

# 3. Copy environment template and fill in secrets
cp .env.example .env.local
# → Fill in all values (see Environment Variables section below)

# 4. Generate Prisma client
bunx prisma generate

# 5. Apply database migrations
bunx prisma migrate dev

# 6. Start the app
bun dev          # Next.js only
bun inngest:dev  # Inngest worker (separate terminal)
# OR
bun dev:all      # Both via mprocs (one command)
```

Visit `http://localhost:3000` (PT) or `http://localhost:3000/en` (EN).
Inngest Dev UI: `http://localhost:8288`

---

## Environment Variables

Create `.env.local` with all of the following:

| Variable | Service | Secret? | Description |
|----------|---------|---------|-------------|
| `DATABASE_URL` | PostgreSQL | ✅ | Full connection string incl. `?connection_limit=` |
| `BETTER_AUTH_SECRET` | Better Auth | ✅ | Signs sessions — rotate quarterly |
| `BETTER_AUTH_URL` | Better Auth | ❌ | Public app URL (e.g. `http://localhost:3000`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini | ✅ | For Inngest translation jobs (via Vercel AI SDK) |
| `GOOGLE_API` | Google | ✅ | Additional Google API key |
| `UPLOADTHING_TOKEN` | UploadThing | ✅ | File upload authorization |
| `RESEND_API_KEY` | Resend | ✅ | Transactional email sending |
| `EMAIL_FROM` | Resend | ❌ | Sender address (default: `onboarding@resend.dev`) |
| `INNGEST_EVENT_KEY` | Inngest | ✅ | Event emission authentication |
| `INNGEST_SIGNING_KEY` | Inngest | ✅ | Signs Inngest requests |
| `PUSHER_APP_ID` | Pusher | ✅ | Server-side Pusher auth |
| `PUSHER_KEY` | Pusher | ✅ | Server-side Pusher auth |
| `PUSHER_SECRET` | Pusher | ✅ | Server-side Pusher auth |
| `PUSHER_CLUSTER` | Pusher | ✅ | Server-side Pusher cluster |
| `NEXT_PUBLIC_PUSHER_KEY` | Pusher | ❌ | Client-side (browser) Pusher key |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Pusher | ❌ | Client-side (browser) cluster |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps | ❌ | Client-side Google Maps API key |

> ⚠️ `@t3-oss/env-nextjs` in `src/lib/env.ts` validates all variables at **build time**. A missing variable crashes the build immediately — this is intentional.

---

## Available Scripts

| Command | What it does |
|---------|-------------|
| `bun dev` | Start Next.js with Turbopack (fast refresh) |
| `bun build` | Production build — fails on type/lint errors |
| `bun start` | Serve the production build |
| `bun inngest:dev` | Start Inngest local worker + Dev UI on port 8288 |
| `bun dev:all` | Run Next.js + Inngest in parallel via `mprocs` |
| `bun lint` | Run Biome checks (lint + format + type-aware rules) |
| `bun format` | Apply Biome auto-fixes |
| `bun prisma:studio` | Open Prisma Studio (DB browser) on port 5555 |

---

## Database Workflow

### Making a Schema Change

```bash
# 1. Edit prisma/schema.prisma
# 2. Generate and apply migration
bunx prisma migrate dev --name describe-your-change

# 3. Inspect the generated SQL before committing
cat prisma/migrations/<timestamp>_describe-your-change/migration.sql

# 4. Regenerate Prisma client (auto-done by migrate dev, but explicit if needed)
bunx prisma generate
```

### Production Deploy

```bash
bunx prisma migrate deploy   # Apply pending migrations (non-interactive)
```

### Rules

- ✅ Always commit both `schema.prisma` AND the generated migration SQL
- ✅ Review the SQL for destructive operations (DROP COLUMN, etc.) before committing
- ✅ Add `?connection_limit=` to `DATABASE_URL` in production for pooling
- ❌ Never edit historical migration files — create a corrective follow-up migration
- ❌ Never run `prisma migrate dev` in production — use `prisma migrate deploy`

### Useful Commands

```bash
bunx prisma studio                          # Visual DB browser
bunx prisma validate                        # Validate schema syntax
bunx prisma migrate diff   --from-schema-datamodel prisma/schema.prisma   --to-url "$DATABASE_URL"                  # Detect schema drift
bunx tsc --noEmit                           # Type-check without building
```

---

## Code Quality Toolchain

### Biome + Ultracite

Biome replaces both ESLint and Prettier in a single, fast tool. Ultracite is an opinionated ruleset applied on top.

```bash
bun lint      # Check everything (lint + format + types)
bun format    # Auto-fix formatting issues
```

Rules cover: TypeScript best practices, React hooks, accessibility (a11y), import ordering, and style consistency.

### Lefthook (Git Hooks)

Defined in `lefthook.yml`. On every `git commit`:

1. Staged files are auto-formatted via `bun x ultracite fix`
2. Biome checks run on changed files only (fast)

This means you should **never push unformatted code** — it's caught pre-commit.

### TypeScript

```bash
bunx tsc --noEmit    # Full type check — run before PRs
```

The project uses strict TypeScript with path aliases (`@/features/...`, `@/lib/...`). Avoid `any` — tRPC relies on end-to-end inference to work.

---

## Development Patterns

### Adding a New tRPC Procedure

1. Open (or create) `src/features/<feature>/server/route.ts`
2. Add your procedure using `protectedProcedure` or `adminProcedure`
3. Define Zod input schema inline
4. Register the router in `src/trpc/routers/_app.ts`
5. Use the hook in client components: `trpc.<namespace>.<procedure>.useQuery()`

```typescript
// Example procedure
export const myFeatureRouter = router({
  getAll: protectedProcedure
    .input(z.object({ filter: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.myModel.findMany({ where: { ... } })
    }),
})
```

### Adding a New Page

1. Create route segment under `src/app/[locale]/(protected)/<feature>/page.tsx`
2. Add i18n keys to `src/locales/pt.ts` + `src/locales/en.ts`
3. Add server-side prefetch in `src/features/<feature>/prefetch.ts` if needed
4. Wire navigation link in `crm-sidebar.tsx` or relevant nav component

### Adding a New Background Job

1. Define event name: `"<domain>/<action>"`
2. Create function in `src/inngest/functions.ts` using `inngest.createFunction`
3. Register the function in `src/app/api/inngest/route.ts` (add it to the `functions` array in the `serve()` call)
4. Emit the event from the relevant tRPC router using `inngest.send()`
5. Wrap all external calls in `step.run()` or `step.ai.wrap()`
6. Add `Sentry.logger` calls at each step
7. Test via Inngest Dev UI: `http://localhost:8288`

---

## Multi-Process Development

`mprocs.yaml` defines a profile that starts all long-running processes at once:

```bash
bun dev:all
# Starts:
#   - Next.js dev server (port 3000) — via bun
#   - Inngest dev worker (port 8288) — via pnpm (note: uses pnpm, not bun)
```

> **Note:** The Inngest process in `mprocs.yaml` uses `pnpm run inngest:dev`, not `bun`. This is intentional — ensure pnpm is available.

Recommended terminal setup for full local stack:
- **Terminal 1:** `bun dev:all`
- **Terminal 2:** `bun prisma:studio` (when needed — not included in mprocs)

---

## Internationalization Workflow

When adding new UI copy:

1. Add key + Portuguese text to the appropriate namespace in `src/locales/pt.ts`
2. Add the same key + English text to `src/locales/en.ts`
3. Use `getScopedI18n("namespace")` in Server Components
4. Use `useScopedI18n("namespace")` in Client Components
5. QA: visit `/en/<route>` to confirm English renders correctly

> TypeScript will throw a type error if a key exists in one language but not the other.
