# Harbor Partners Web Application

Harbor Partners is a Lisbon-based investment advisory platform serving institutional and high-net-worth clients. This repository contains the internal web application that manages investor records, M&A and real-estate opportunities, CRM workflows, analytics, and client communications.

- **Framework:** Next.js App Router (15) + React 19 + TypeScript
- **Runtime & tooling:** Bun, Prisma, TRPC, Better Auth, Inngest, Uploadthing, Pusher, Resend, Biome
- **Locales:** Portuguese (default) and English powered by `next-international`

For a deeper architectural walk-through, see `docs/harbor-guide.md`.

## Feature Highlights

- Secure Better Auth email/password authentication with enforced password updates and granular role checks (USER, TEAM, ADMIN)
- Internationalized landing and dashboard experiences with locale-aware routing middleware
- Backoffice for managing mergers & acquisitions, real estate assets, investors, and analytics dashboards
- AI-assisted description translations through Inngest + Google Gemini
- Real-time access-request notifications over Pusher, transactional emails via Resend, and asset uploads through Uploadthing
- Prisma-powered Postgres schema with extensive investor/opportunity fields and auditing

## Prerequisites

- [Bun](https://bun.sh/) 1.1+
- Node.js 18+ (bundled with Bun but required for some tooling)
- PostgreSQL 15+ with a database accessible via `DATABASE_URL`
- Access tokens for Better Auth, Google Generative AI, Uploadthing, Resend, Inngest, and Pusher

## Environment Variables

Create `.env.local` (and `.env` for production) with the following keys:

| Name | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret used to sign Better Auth sessions |
| `BETTER_AUTH_URL` | Public URL served by Better Auth (e.g., `https://harborpartners.app`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | API key for Gemini used by Inngest translation jobs |
| `UPLOADTHING_TOKEN` | Uploadthing token for secure file uploads |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `INNGEST_EVENT_KEY` | Inngest event key for triggering background jobs |
| `PUSHER_APP_ID` / `PUSHER_KEY` / `PUSHER_SECRET` / `PUSHER_CLUSTER` | Pusher credentials for real-time notifications |
| `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` | Public Pusher config exposed to the client |

## Installation

```bash
git clone https://github.com/<org>/harbor001.git
cd harbor001
bun install
```

Generate the Prisma client after dependencies install:

```bash
bunx prisma generate
```

## Running Locally

```bash
# Apply migrations and start the dev server with Turbopack
bunx prisma migrate dev
bun dev
```

Visit `http://localhost:3000`. Locale-aware routes are automatically rewritten; append `/en` for English.

To run every supporting service (Next.js, Inngest dev server, etc.) in parallel:

```bash
bun dev:all
```

## Available Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Launch Next.js with Turbopack |
| `bun build` | Production build |
| `bun start` | Serve the production build |
| `bun lint` | Run Biome checks (formatting, lint, type-aware rules) |
| `bun format` | Apply Biome formatting fixes |
| `bun inngest:dev` | Start Inngest local worker for background jobs |
| `bun prisma:studio` | Open Prisma Studio |
| `bun dev:all` | Run the multiprocess profile defined in `mprocs.yaml` |

## Development Workflow

1. **Database migrations** – Use `bunx prisma migrate dev` to evolve the schema. Production deploys should run `bunx prisma migrate deploy`.
2. **Type safety** – Run `bunx tsc --noEmit` when working on libraries or API contracts (not wired into scripts by default).
3. **Linting & formatting** – `bun lint` (Biome) enforces the Ulracite ruleset; apply fixes via `bun format` or `bun x ultracite fix`.
4. **Internationalization** – Content lives under `src/locales`. Use scoped dictionaries and the `getScopedI18n` helper for new copy.
5. **File uploads** – Use the Uploadthing router under `src/app/api/uploadthing` and fetch config via `NextSSRPlugin`.
6. **Background jobs** – All AI translation work is queued through Inngest (`src/inngest/functions.ts`). Ensure the worker runs when testing translations.

## Testing & Quality

- **Biome** enforces formatting, linting, and stylistic conventions.
- **Prisma Client** provides compile-time validation on database access.
- **TRPC** routers (see `src/trpc/routers/_app.ts`) centralize API contracts with end-to-end types.
- **Sentry** is wired via `sentry.edge.config.ts` and `sentry.server.config.ts` for observability; configure DSNs via the Vercel dashboard.

## Deployment

1. Ensure all migrations are deployed: `bunx prisma migrate deploy`.
2. Build the app: `bun build`.
3. Start via `bun start` (Vercel/Node runtime). Set all environment variables in the hosting platform (Vercel recommended).
4. Inngest production functions should be deployed via `inngest deploy` (handled outside this repo) using the same event key.

## Documentation

- Architecture, domain concepts, and operational guidance live in `docs/harbor-guide.md`.
- Update both this README and the guide when new services or workflows are added to keep onboarding friction low.
