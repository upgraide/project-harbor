# 🚀 Deployment & Operations

> Everything about deploying Harbor Partners to production, managing environments, monitoring, incident response, and rollback procedures.

---

## Environments

| Environment | Hosting | Database | Notes |
|-------------|---------|----------|-------|
| **Development** | Local (Bun) | Local Postgres or remote dev DB | `.env.local`, `bun dev` |
| **Preview / Staging** | Vercel Preview | Staging Postgres | Auto-deployed on PRs; env vars from Vercel dashboard |
| **Production** | Vercel (Edge-friendly) | Managed Postgres | `bunx prisma migrate deploy` required before each deploy |

---

## Release Checklist

Run through this before every production deploy:

- [ ] **1.** All feature branches merged and conflicts resolved
- [ ] **2.** `bun lint` passes with no errors
- [ ] **3.** `bunx tsc --noEmit` passes (no TypeScript errors)
- [ ] **4.** `bun build` succeeds locally
- [ ] **5.** `bunx prisma migrate deploy` applied to production DB
- [ ] **6.** All new environment variables added to Vercel dashboard
- [ ] **7.** Push to `main` → Vercel builds and deploys automatically
- [ ] **8.** If background job code changed: redeploy Inngest functions via `inngest deploy` (functions are registered in `src/app/api/inngest/route.ts`)
- [ ] **9. Smoke test** critical flows:
  - Login with a test account
  - Submit request-access form → confirm admin receives Pusher notification
  - Create a test M&A opportunity → confirm Inngest translation job completes
  - Change an opportunity to ACTIVE → confirm investor email notifications sent
  - Upload an avatar → confirm UploadThing URL saves to DB
  - Send a test invitation email → confirm Resend delivers it

---

## Deployment Commands

```bash
# Production database migration (run before git push)
bunx prisma migrate deploy

# Production build check (run locally first)
bun build

# Deploy Inngest functions (if functions.ts changed)
inngest deploy

# Rollback Vercel to previous build
# → Vercel Dashboard → Deployments → select previous build → Promote to Production

# Rollback a database migration (emergency only)
bunx prisma migrate resolve --rolled-back <migration-name>
```

---

## CI/CD (Recommended Setup)

Configure GitHub Actions or Vercel checks to run on every PR:

```yaml
# .github/workflows/ci.yml
steps:
  - run: bun install
  - run: bunx prisma generate
  - run: bun lint
  - run: bunx tsc --noEmit
  - run: bun build
```

Optional drift check:
```bash
bunx prisma migrate diff --from-empty --to-schema-datamodel
```

---

## Third-Party Service Dashboards

Bookmark these for operations:

| Service | Dashboard URL | What to check |
|---------|-------------|---------------|
| **Vercel** | vercel.com/dashboard | Build logs, env vars, deployment history |
| **Inngest** | app.inngest.com | Function runs, event history, queue depth, failures |
| **Sentry** | sentry.io | Error rates, translation job failures, session errors |
| **Pusher** | dashboard.pusher.com | Event delivery, connection counts, debug console |
| **Resend** | resend.com/emails | Email delivery rates, bounces, domain health |
| **UploadThing** | uploadthing.com/dashboard | Storage usage, allowed origins, file keys |
| **Google AI Studio** | aistudio.google.com | Gemini API quota, usage, key management |

---

## Observability

### Sentry

Configured in `sentry.server.config.ts` and `sentry.edge.config.ts`. Captures:
- Unhandled exceptions in all server/edge routes
- Inngest job step failures (via `Sentry.logger`)
- tRPC procedure errors

**DSNs** are stored as environment variables in Vercel. Keep server and edge DSNs in sync.

```typescript
// Pattern used in Inngest jobs
Sentry.logger.info("Translation step started", { opportunityId })
Sentry.logger.error("Gemini call failed", { error, opportunityId })
```

### Inngest Dashboard

The Inngest dashboard gives step-level visibility into every background job run:
- Event payload received
- Each `step.run` / `step.ai.wrap` execution + duration
- Retry attempts and failure reasons
- Queue depth and concurrency

---

## Incident Runbooks

### 🔴 Translations Not Appearing

1. Check `bun inngest:dev` is running (local) or Inngest worker is deployed (production)
2. Confirm the event was emitted: Inngest dashboard → Events → search `opportunity/translate-description`
3. Check Sentry for Gemini errors (quota exceeded, API key invalid)
4. Manually re-trigger:
   ```bash
   inngest trigger opportunity/translate-description      --json '{"opportunityId":"<id>","description":"<pt text>"}'
   ```
5. If job logs success but `englishDescription` is still null → open Prisma Studio and confirm column exists. Missing column = migration not deployed.

### 🔴 Access Requests Not Notifying Admins

1. Prisma Studio: confirm `AccessRequest` record was created
2. Check server logs for Pusher errors in `sendAccessRequestNotification`
3. Verify `PUSHER_*` environment variables match Pusher dashboard credentials
4. Check browser console for blocked WebSocket connections (corporate firewalls)
5. Pusher dashboard → Debug Console → confirm events arrive on `notifications` channel
6. Recurring 401 errors = stale or incorrect `PUSHER_SECRET`

### 🔴 Authentication Failures

1. Confirm `BETTER_AUTH_URL` matches the deployed domain exactly (cookie scope)
2. Check for reverse proxy stripping cookies or auth headers
3. Test with `curl -b "session=..." https://app.domain/api/trpc/users.me`
4. If sessions randomly expire: check for domain mismatches in proxy config
5. Last resort: rotate `BETTER_AUTH_SECRET` + redeploy + notify team (all sessions invalidated)

### 🔴 Database Migration Failing

1. `bunx prisma validate` — check schema syntax
2. Inspect the failed migration SQL: `prisma/migrations/<name>/migration.sql`
3. `pg_dump` the database BEFORE any manual intervention
4. If already partially applied: `bunx prisma migrate resolve --applied <name>`
5. Detect drift: `bunx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-url "$DATABASE_URL"`
6. Never edit historical migration SQL — create a follow-up corrective migration

### 🔴 File Upload Issues

1. Check `UPLOADTHING_TOKEN` is valid and not expired
2. Confirm UploadThing dashboard has the current domain in allowed origins
3. Browser Network tab: look for CORS errors on upload requests
4. For orphaned files: run a script comparing DB UploadThing URLs against storage
5. For stuck deletions: log `deleteFromUploadthing` return value — mismatched file keys are the most common cause

---

## Secrets Management

### Rotation Procedure

1. Generate new credentials in the vendor dashboard
2. Update Vercel environment variables (production + preview)
3. Update Inngest secrets dashboard (if applicable)
4. Redeploy the app
5. Invalidate old credentials in the vendor dashboard
6. Announce in `#eng-ops` — record which services need restarting

### Local Development

Never put real secrets in shell history. Use:

```bash
# Option A: direnv
echo 'dotenv .env.local' > .envrc && direnv allow

# Option B: Doppler
doppler run -- bun dev
```

### Rotation Schedule

| Secret | Rotate Every |
|--------|-------------|
| `BETTER_AUTH_SECRET` | Quarterly |
| `RESEND_API_KEY` | Quarterly |
| `INNGEST_EVENT_KEY` | Quarterly |
| `INNGEST_SIGNING_KEY` | Quarterly |
| `PUSHER_SECRET` | Quarterly |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Quarterly or on suspected compromise |
| `GOOGLE_API` | Quarterly or on suspected compromise |
| `UPLOADTHING_TOKEN` | Quarterly |
| `DATABASE_URL` | On team member offboarding |

---

## Database Backups

- Use the managed Postgres provider's automated backups
- Document restore procedures with retention policy
- Before any destructive migration: `pg_dump -Fc mydb > backup_$(date +%Y%m%d).dump`
- Restore: `pg_restore -d mydb backup_<date>.dump`

---

## Rollback Procedures

### Application Rollback
1. Vercel Dashboard → Deployments → select previous stable build → **Promote to Production**
2. No code changes needed

### Database Rollback
1. Only possible if migration was additive (no dropped columns)
2. Re-deploy previous Vercel build first
3. `bunx prisma migrate resolve --rolled-back <migration>` to mark as unapplied
4. For destructive migrations: restore from `pg_dump` backup

### Inngest Rollback
1. Disable malfunctioning functions via Inngest dashboard (pause, don't delete)
2. Re-deploy previous function code via `inngest deploy` with previous Git SHA
