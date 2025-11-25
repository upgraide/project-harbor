# Harbor Partners Architecture & Operations Guide

This document explains how the Harbor Partners web application is structured, how major domains and services interact, and what engineers need to know to operate the platform confidently.

---

## 1. System Overview

- **Audience:** Internal developers and operators responsible for CRM tooling, investor relations, and opportunity workflows.
- **Goals:** Centralize investor data, surface M&A and real-estate opportunities, manage analytics, and streamline access/onboarding flows.
- **Technology stack:** Next.js 15 + React 19, TRPC, Prisma/Postgres, Better Auth, Inngest, Google Gemini, Uploadthing, Pusher, Resend, Sentry, Bun runtime, Biome + Ultracite linting.

High-level request flow:
1. A locale-aware Next.js UI (Portuguese default) renders dashboards and public pages.
2. Client components talk to TRPC endpoints, which enforce Better Auth sessions and role checks.
3. Data persists in Postgres via Prisma models (users, investors, opportunities, analytics, access requests, etc.).
4. Background work (e.g., translating opportunity descriptions) runs through Inngest workers backed by Google Generative AI APIs.
5. Notifications travel via Resend (email) and Pusher (real-time admin alerts).

---

## 2. Application Layers

### 2.1 Presentation (App Router)
- Public marketing/auth flows live under `src/app/[locale]/(public)`.
- Authenticated dashboards/backoffice reside under the `(protected)` segments (`dashboard`, `backoffice`, `crm`, `settings`).
- `src/components/providers.tsx` wires global providers: language (`LanguageProvider`), theming (`next-themes`), TRPC, Uploadthing SSR, Sonner toasts, Nuqs query syncing, and the password-change watchdog.
- `middleware.ts` uses `next-international` to rewrite URLs and persist the locale.

### 2.2 API Layer (TRPC)
- `src/trpc/init.ts` builds the base router, adds `protectedProcedure` (Better Auth session) and `adminProcedure` (Role.ADMIN guard).
- Routers live alongside features (e.g., `features/opportunities/server/route.ts`, `features/users/server/route.ts`) and are composed in `src/trpc/routers/_app.ts`.
- Input validation relies on Zod schemas; responses inherit Prisma types thanks to TRPC’s end-to-end inference.

### 2.3 Data & Integrations
- **Prisma models:** Defined in `prisma/schema.prisma`. Key tables include `User`, `Account`, `Session`, `MergerAndAcquisition`, `RealEstate`, `OpportunityAnalytics`, `OpportunityAccountManager`, `AccessRequest`, and multiple enums (roles, investor segments, opportunity types, etc.).
- **Database access:** `src/lib/db.ts` exports a cached Prisma client for edge vs. node runtimes.
- **Third parties:** Better Auth (identity), Uploadthing (files), Pusher (realtime), Resend (emails), Inngest + Google Gemini (AI tasks), Sentry (observability), Pusher (notifications).

---

## 3. Domain Model Highlights

### 3.1 Users & Roles
- Stored in `User` with core profile fields plus investor-specific metadata (ticket sizes, strategies, segments, locations).
- Roles (`Role` enum) drive authorization: `USER` (default investors), `TEAM` (internal staff), `ADMIN` (platform owners).
- Additional flags: `passwordChanged`, marketing consent, assignment relationships for leads and opportunities.

### 3.2 Investors & Leads
- The CRM captures contact context (company, representative, phone, segments, strategies) and links them to team owners (`leadResponsibleId`, `leadMainContactId`).
- Commission rates and notes are tracked on the `User` entity so that investor commission dashboards can reuse shared data.

### 3.3 Opportunities
- **Merger & Acquisition (`MergerAndAcquisition`):** Contains multilingual descriptions, financial metrics (sales, EBITDA ranges, CAGR, EV/EBITDA), growth KPIs, asset notes, and co-investment terms.
- **Real Estate (`RealEstate`):** Tracks asset metadata (location, area, NOI, yields, rents), licensing info, co-investment structure, and occupancy metrics.
- Both models link to `OpportunityAnalytics` (view counters) and assignment tables (`OpportunityAccountManager`) for accountability.

### 3.4 Interests & Matching
- `UserMergerAndAcquisitionInterest`, `UserRealEstateInterest`, and `UserOpportunityInterest` tables connect investors to specific deals, capturing status and rationale (e.g., “not interested” reasons).
- Feature modules under `src/features/investment-interests` expose UI and API logic for tracking engagement.

### 3.5 Access Requests & Notifications
- `AccessRequest` (managed by `features/auth/server/route.ts`) stores prospect data. Creation triggers Pusher events so admins receive instant notifications.
- Admins can change statuses (pending, approved, rejected) via TRPC mutations, providing a lightweight onboarding pipeline.

---

## 4. Core Services & Workflows

### 4.1 Authentication & Password Hygiene
- `src/lib/auth.ts` initializes Better Auth with the Prisma adapter and email/password strategy.
- `protectedProcedure` reads the Better Auth session from request headers; `usersRouter.changePassword` and `PasswordChangeProvider` enforce mandatory password updates via dialog prompts and cookies.
- Invitations create users through `auth.api.signUpEmail` and email credentials using Resend templates.

### 4.2 Internationalization
- Localized copy lives in `src/locales` with dictionaries split by feature (`auth`, `backoffice`, `dashboard`, etc.).
- Use `getScopedI18n` for server components and `useScopedI18n` for client components to avoid loading unused namespaces.
- Middleware rewrites `/path` (Portuguese) and `/en/path` (English), ensuring SEO-friendly canonical URLs defined in `site.ts`.

### 4.3 File & Media Handling
- Uploadthing routers under `src/app/api/uploadthing` set the rules. `NextSSRPlugin` injects the client-side config, while `usersRouter.updateAvatar` and opportunity forms manage uploads/deletions via `deleteFromUploadthing`.

### 4.4 Emails & Realtime Notifications
- **Resend:** `src/lib/emails` contains templates (e.g., invite email) invoked after user creation.
- **Pusher:** `src/lib/pusher.ts` broadcasts `access-request` events to a public `notifications` channel and per-user channels (`user-{email}`) for admin dashboards. Configure keys in the environment to avoid silent failures.

### 4.5 Background Jobs & AI Translations
- `src/inngest/functions.ts` defines:
  - `execute/ai`: sample Gemini integration.
  - `opportunity/translate-description`: listens for events when a Portuguese description is saved, calls Gemini Flash via `step.ai.wrap`, and persists the English translation back to Prisma.
- `features/opportunities/server/route.ts` emits events after create/update mutations, guaranteeing translations stay in sync.
- Run `bun inngest:dev` locally to process events; production deployments should register the function via `inngest deploy`.

### 4.6 Analytics & Metrics
- `src/lib/analytics.ts` offers helper functions to increment and fetch `OpportunityAnalytics` records, ensuring both historical deals and new ones expose the same interface. Integrate these helpers wherever a user views an opportunity detail page.

### 4.7 Observability & Error Handling
- Sentry is configured in `sentry.server.config.ts` / `sentry.edge.config.ts`; background jobs log every translation step for traceability.
- Follow the example logger usage in Inngest functions when adding new jobs.

---

## 5. Repository Layout & Developer Experience

| Path | Purpose |
| --- | --- |
| `src/app` | Next.js routes grouped by locale + segment (public, dashboard, backoffice, crm, settings). Layout nesting mirrors access control boundaries. |
| `src/features/*` | Feature-specific UI + server routers; keeps domain logic modular. Each folder typically contains components, hooks, params/prefetch helpers, and a TRPC router. |
| `src/components` | Shared UI (headers, hero, CRM sidebar, index page, theme switcher, etc.). Client/server boundaries are explicit via the `"use client"` pragma. |
| `src/components/ui` | Primitive design system built atop Radix UI + Tailwind utilities (buttons, inputs, dropdowns). |
| `src/lib` | Cross-cutting libraries (auth, db, env validation, analytics, emails, pusher, uploadthing, utils). |
| `src/trpc` | Router initialization, React Query provider, and shared TRPC client. |
| `src/locales` | i18n dictionaries per feature plus helper utilities (`server.ts`, `client.ts`). |
| `src/inngest` | Event client definition and background function implementations. |
| `src/generated/prisma` | Generated Prisma client; do not hand-edit. |
| `prisma` | Schema and migrations (history reflects recent opportunity enhancements). |
| `docs` | Long-form documentation (this guide and onboarding supplements). |

Tooling notes:
- **Biome / Ultracite** enforce style rules defined in `biome.json`; git hooks are orchestrated via `lefthook.yml`.
- **Bun** is the package manager and runtime. Prefer `bun`/`bunx` commands over `npm`/`pnpm`.
- **mprocs** (`mprocs.yaml`) can run multiple long-lived processes (Next, Inngest, Prisma Studio) during development.
- **Lint-staged & Lefthook** ensure staged files are auto-formatted (`bun x ultracite fix`) before commit.
- **Sentry** configs at the repo root capture both edge and server runtimes; keep DSNs synced across environments.
- **tsconfig** extends Next.js defaults; prefer path aliases (e.g., `@/features/...`) for imports.

---

## 6. Development & QA Workflows

1. **Setup:** `bun install`, create `.env.local`, run `bunx prisma generate`.
2. **Database changes:** Update `prisma/schema.prisma`, run `bunx prisma migrate dev --name <change>`, commit both the schema and generated migration SQL.
3. **Seed/Test Data:** Use Prisma Studio (`bun prisma:studio`) or write seed scripts under `prisma/seed.ts` (to be added) to populate dev data.
4. **Running locally:** `bun dev` for the app, `bun inngest:dev` for workers (or `bun dev:all`).
5. **Linting:** `bun lint` before pushing; CI should run `bun lint` + type checks.
6. **Type checks:** `bunx tsc --noEmit` (add as needed) keeps TRPC contracts honest even without an explicit script.
7. **Internationalization QA:** Add new keys to both `en` and `pt` dictionaries, then verify via `/en/...` routes.
8. **Accessibility:** Follow the Ultracite a11y rules (e.g., avoid positive `tabIndex`, ensure button `type` attributes, supply SVG titles).

---

## 7. Operations & Deployment

### 7.1 Environments
- **Development:** Local Bun runtime with Postgres (Docker or remote). Environment variables live in `.env.local`.
- **Preview/Staging:** Vercel previews inherit environment variables from the Vercel dashboard; Prisma should point to a staging database with `prisma migrate deploy`.
- **Production:** Hosted on Vercel (edge-friendly). Set all secrets in Vercel + Inngest dashboards. Prisma runs against the managed Postgres instance.

### 7.2 Release Checklist
1. Ensure migrations are up-to-date (`bunx prisma migrate deploy`).
2. Build the app (`bun build`) to catch compile errors.
3. Deploy to Vercel (git push) and monitor `vercel build` logs.
4. Deploy Inngest functions (CLI or dashboard) if background job code changed.
5. Smoke test critical flows: login, request access, opportunity creation, translation job completion, notification delivery.

### 7.3 Observability & Incident Response
- **Sentry:** Check both server and edge DSNs; translation jobs use `Sentry.logger` extensively.
- **Pusher / Inngest dashboards:** Validate event delivery if admins stop receiving alerts or translations stall.
- **Prisma / Database:** For failed migrations, inspect the SQL under `prisma/migrations/*` to understand schema drift.

### 7.4 Security Considerations
- Never log secrets. Use Bun’s `.env` loading plus the `@t3-oss/env-nextjs` validation in `src/lib/env.ts`.
- Better Auth secrets must remain in secure storage; rotate regularly.
- Uploadthing file deletion is enforced server-side to prevent orphaned files.
- Password-change prompts rely on cookies; clear them upon success as implemented in `PasswordChangeProvider`.

---

## 8. Future Enhancements (Suggested)

- Expand automated tests (unit + integration) around TRPC routers and Prisma data access.
- Add a seeding strategy for demo environments (investors, opportunities).
- Document manual runbooks for AI translation failures (retry via admin UI or CLI).
- Automate translations for real-estate descriptions (currently M&A focused).
- Integrate role-based dashboards per department (MNA vs. CRE).

---

## 9. References

- `README.md` – quickstart, environment setup, and scripts.
- `src/features/*` – feature-specific modules referenced in this guide.
- `prisma/schema.prisma` – authoritative data contracts.
- `docs/harbor-guide.md` – keep this guide updated when architecture or workflows change.

---

## 10. Engineer Onboarding Checklist

1. **Machine setup**
   - Install Bun ≥1.1 and ensure `bun --version` matches the team baseline.
   - Install PostgreSQL locally or obtain credentials for the shared dev database.
   - Install the Inngest CLI (`bunx inngest-cli@latest`).
2. **Clone & bootstrap**
   - `git clone` the repo, run `bun install`, then `bunx prisma generate`.
   - Copy `.env.example` (if provided) to `.env.local` and fill in secrets.
3. **Run the app**
   - Start Postgres, run `bunx prisma migrate dev`, then `bun dev`.
   - In a second terminal, run `bun inngest:dev` or `bun dev:all` (mprocs).
4. **Verify integrations**
   - Use the request-access form to emit a Pusher notification (watch logs).
   - Create a sample opportunity and confirm the Inngest translation workflow logs a completion event.
5. **Knowledge ramp-up**
   - Read this guide plus `src/features` modules relevant to your squad (backoffice, investors, etc.).
   - Pair with an existing engineer to walk through TRPC router additions and deployment steps.

---

## 11. Example End-to-End Flows

### 11.1 Opportunity Creation → Translation → Analytics
1. A TEAM/ADMIN user opens `/[locale]/backoffice/m&a/create` which renders `features/opportunities/components/m&a-opportunities.tsx`.
2. The form submits via `trpc.mergerAndAcquisition.create`. `protectedProcedure` injects the Better Auth session and writes the record with Prisma.
3. After the mutation, the router emits an Inngest event `opportunity/translate-description` whenever a Portuguese description exists.
4. The Inngest worker (`translateDescription` in `src/inngest/functions.ts`) calls Gemini, stores the English description, and logs success/failure via Sentry.
5. When any user views the opportunity page, the viewer component calls `incrementMnaViews` which lazily creates or updates `OpportunityAnalytics` rows to track engagement.

### 11.2 Access Request Intake
1. Visitors land on `/[locale]/request-access` which renders `request-access-form.tsx`.
2. The form hits `trpc.accessRequest.create` with validated data (Zod schema ensures E.164 phone format).
3. Prisma inserts the record and `sendAccessRequestNotification` broadcasts two Pusher events: a general `notifications` channel and user-specific channels for known admin emails.
4. Admins monitoring `/backoffice/notifications` receive the real-time update and can change the status via `trpc.accessRequest.updateStatus`.

### 11.3 Password Change Enforcement
1. Newly invited users receive credentials via Resend and log in using Better Auth.
2. `PasswordChangeProvider` runs on every protected page, calls `trpc.users.getPasswordChangedStatus`, and opens a dialog if the flag is `false`.
3. Once the user successfully changes the password (`trpc.users.changePassword` + Better Auth API), the backend flips `passwordChanged` to `true`, and the provider clears the reminder cookie.

---

## 12. Third-Party Integrations & Secrets

| Integration | Files / Modules | Notes |
| --- | --- | --- |
| **Better Auth** | `src/lib/auth.ts`, `src/features/users/server/route.ts` | Requires `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`. Session validation occurs per request; keep adapters aligned with Prisma schema changes. |
| **Prisma / Postgres** | `prisma/schema.prisma`, `src/lib/db.ts` | `DATABASE_URL` must include `?connection_limit=` tuning for production. Use `prisma migrate deploy` in CI/CD. |
| **Inngest + Gemini** | `src/inngest/*`, `src/features/opportunities/server/route.ts` | Needs `INNGEST_EVENT_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY`. Gemini usage is wrapped inside `step.ai.wrap` for telemetry. |
| **Uploadthing** | `src/app/api/uploadthing`, `src/components/providers.tsx`, `usersRouter.updateAvatar` | `UPLOADTHING_TOKEN` controls file storage; remember to delete files via `deleteFromUploadthing` when records change. |
| **Pusher** | `src/lib/pusher.ts`, `features/auth/server/route.ts` | Requires both server and `NEXT_PUBLIC_*` keys. Channels follow `notifications` and `user-{email}` naming. |
| **Resend** | `src/lib/emails/*`, invite flows | Emails come from `RESEND_API_KEY`. Make sure templates honor localization if needed. |
| **Sentry** | `sentry.*.config.ts`, `src/inngest/functions.ts` | DSNs stored in hosting provider. Use `Sentry.logger` for structured logs inside background jobs. |

Secrets handling guidelines:
- Never commit `.env` files. Use Vercel’s environment variable dashboard plus Inngest’s secret storage.
- Rotate keys quarterly; add reminders to the ops calendar.
- For local development, use `direnv` or `doppler run -- bun dev` to avoid leaking credentials into shell history.

---

## 13. Troubleshooting & Runbooks

### 13.1 Translations Not Appearing
1. Verify `bun inngest:dev` (or production worker) is running by checking Inngest logs.
2. Confirm the event was emitted (`inngest events list --name opportunity/translate-description` locally).
3. Check Sentry for translation errors (authentication issues, Gemini quota, etc.).
4. Manually re-trigger by calling `inngest trigger opportunity/translate-description --json '{"opportunityId":"…","description":"…"}'`.

### 13.2 Access Requests Not Notifying Admins
1. Inspect the `access_request` table via Prisma Studio to confirm record creation.
2. Tail server logs for Pusher errors (`sendAccessRequestNotification` catches and logs).
3. Ensure `PUSHER_*` keys match the dashboard and the frontend subscribes to the correct cluster.
4. Check browser console for blocked WebSocket connections (corporate firewalls).

### 13.3 Prisma Migrations Failing
1. Run `bunx prisma validate` to ensure schema syntax is correct.
2. If a migration fails in production, use `prisma migrate resolve --applied <migration>` to sync state only after manual fixes.
3. Avoid editing historical migration SQL; create a follow-up migration instead.

### 13.4 Authentication Failures
1. Inspect Better Auth dashboards/logs for rate limits or secret mismatches.
2. Ensure `BETTER_AUTH_URL` matches the deployed domain (needed for cookie scopes).
3. If sessions randomly expire, check for reverse proxy domain mismatches causing cookie drops.

### 13.5 File Upload Issues
1. Confirm Uploadthing router exports match routes configured in `Providers`.
2. Ensure the Uploadthing dashboard includes the local/dev domain as an allowed origin.
3. Delete orphaned files by calling `trpc.users.deleteUploadedFile` or running a script that walks DB records vs. remote storage.

---

## 14. Deployment & Release Management Details

1. **CI/CD (recommended)** – Configure GitHub Actions or Vercel checks to run:
   - `bun lint`
   - `bunx prisma migrate diff --from-empty --to-schema-datamodel` (optional drift check)
   - `bun build`
2. **Feature flags** – Currently none; if needed, use environment variables or a future LaunchDarkly integration.
3. **Database backups** – Use the managed Postgres provider’s automated backups. Document restore procedures with timestamps and retention policy.
4. **Rollbacks** – If a release must be reverted:
   - Re-deploy the previous Vercel build from the dashboard.
   - Run `prisma migrate resolve --rolled-back <migration>` if schema changes caused issues.
   - Disable Inngest functions temporarily via the dashboard if they malfunction after release.
5. **Monitoring dashboard** – Pin Sentry issues, Pusher health, and Inngest queue metrics to the shared Notion for quick reference.

---

## 15. Appendix: Key Commands & Shortcuts

```bash
# Install deps
bun install

# Generate prisma client / run migrations
bunx prisma generate
bunx prisma migrate dev --name <change>

# Start services
bun dev
bun inngest:dev
bun dev:all          # Runs both via mprocs (update cmds if Bun-only)

# Quality gates
bun lint
bun format
bunx tsc --noEmit

# Database tools
bun prisma:studio    # opens Prisma Studio
```

For daily development, keep `bun dev`, `bun inngest:dev`, and `bun prisma:studio` in separate terminals or rely on `mprocs` once the commands are updated to Bun equivalents.

