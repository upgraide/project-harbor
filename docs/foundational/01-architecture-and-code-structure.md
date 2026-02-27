# 🏗️ Architecture & Code Structure

> Harbor Partners is a full-stack Next.js 15 application using the App Router, built on a modern TypeScript-first stack. This document covers how the application is layered, where code lives, and how all the pieces connect.

---

## System Overview

The application serves as an internal platform for a Lisbon-based investment advisory firm. It manages investor records, M&A and real estate opportunities, CRM workflows, analytics, and client communications.

**High-level request flow:**

```
Browser (React 19)
    │
    ├── Public pages: landing, sign-in, request-access
    └── Protected pages: dashboard, backoffice, CRM, settings
            │
            ▼
    tRPC (type-safe API layer)
            │
            ├── Better Auth session validation
            ├── Role guard (USER / TEAM / ADMIN)
            ├── Zod input validation
            └── Prisma (PostgreSQL)
                    │
                    ├── Side effects:
                    │     ├── Pusher (real-time notifications)
                    │     ├── Inngest (background jobs)
                    │     └── Resend (transactional email)
                    └── Inngest → Google Gemini (AI translation)
```

---

## Application Layers

### Layer 1 — Presentation (Next.js App Router)

All routes live under `src/app/[locale]/`, split into two segments:

| Segment | Path | Access |
|---------|------|--------|
| `(public)/(auth)` | `/login`, `/register`, `/request-access` | Anyone |
| `(public)` | `/` (landing) | Anyone |
| `(protected)/(dashboard)` | `/dashboard`, `/dashboard/m&a/[opportunityId]`, `/dashboard/real-estate/[opportunityId]` | Authenticated users |
| `(protected)/(backoffice)` | `/backoffice/*` (M&A, Real Estate, investors, users, analytics, notifications, etc.) | TEAM/ADMIN |
| `(protected)/(crm)` | `/crm/*` (leads, commissions) | TEAM/ADMIN |
| `(protected)/(user)` | `/settings` | Authenticated users |

- **Locale routing** is handled by `middleware.ts` using `next-international`. Portuguese is the default (no prefix); English uses `/en/` prefix.
- **Global providers** are wired in `src/components/providers.tsx`: `LanguageProvider`, `next-themes`, tRPC, UploadThing SSR plugin, Sonner toasts, Nuqs query syncing, and `PasswordChangeProvider`.
- **Layout nesting** mirrors access control boundaries — protected layouts validate sessions at the layout level.

### Layer 2 — API (tRPC)

All client-server communication goes through tRPC. There is no REST API.

- **`src/trpc/init.ts`** — defines base procedures and middleware chain
- **`src/trpc/routers/_app.ts`** — composes all feature routers into the root router
- **`src/trpc/client.tsx`** — exports React Query hooks and `TRPCReactProvider` for client components
- **`createTRPCContext`** — builds the request context per call (currently a stub; session validation happens in middleware)

Middleware chain per procedure call:
```
Request
  → createTRPCContext
  → baseProcedure (no auth required, e.g. accessRequest.create)
  → protectedProcedure (Better Auth session validation)
  → teamOrAdminProcedure (role guard, TEAM or ADMIN)
  → adminProcedure (role guard, ADMIN only)
  → Zod validation
  → Resolver (domain logic + Prisma)
  → Side effects (Pusher / Inngest / Resend)
  → Response (typed Prisma payload)
```

### Layer 3 — Data (Prisma + PostgreSQL)

- **`prisma/schema.prisma`** — single source of truth for all data models
- **`src/lib/db.ts`** — exports a cached Prisma client, safe for both Node and edge runtimes
- **`src/generated/prisma/`** — auto-generated client, never hand-edited

### Layer 4 — Background Services

| Service | Role | Triggered By |
|---------|------|-------------|
| **Inngest** | Durable background jobs (translation, investor email notifications) | tRPC mutations (event emit) |
| **Google Gemini** | AI translation (PT → EN) for M&A + Real Estate | Inngest worker via Vercel AI SDK |
| **Pusher** | Real-time WebSocket events | tRPC mutations |
| **Resend** | Transactional email | tRPC mutations (invitations) |
| **Sentry** | Error tracking + observability | All layers (server + edge) |

---

## Repository Layout

```
harbor001/
├── src/
│   ├── app/                    # Next.js routes
│   │   ├── [locale]/
│   │   │   ├── (public)/       # Landing, login, register, request-access
│   │   │   │   └── (auth)/     # Auth-specific pages
│   │   │   └── (protected)/
│   │   │       ├── (backoffice)/  # M&A, Real Estate, investors, users, analytics, notifications
│   │   │       ├── (dashboard)/   # Investor-facing dashboard + opportunity detail
│   │   │       ├── (crm)/        # Lead management + commissions
│   │   │       └── (user)/       # User settings
│   │   └── api/
│   │       ├── inngest/        # Inngest serve endpoint
│   │       ├── trpc/           # tRPC HTTP handler
│   │       └── uploadthing/    # UploadThing file router
│   │
│   ├── features/               # Feature modules (domain logic)
│   │   ├── opportunities/      # M&A + Real Estate create/edit/list + analytics + user interest
│   │   ├── users/              # User profile, password, avatar
│   │   ├── investors/          # Investor management, invitations, notes, follow-ups
│   │   ├── auth/               # Access requests, auth flows
│   │   ├── investment-interests/ # Investor interest tracking
│   │   ├── crm/                # Lead management
│   │   ├── commissions/        # Commission management + payments
│   │   └── notifications/      # In-app notification system
│   │
│   ├── components/             # Shared UI components
│   │   ├── ui/                 # Design system (Radix + Tailwind)
│   │   ├── auth/               # PasswordChangeProvider
│   │   ├── language/           # LanguageProvider
│   │   ├── theme/              # ThemeProvider
│   │   └── providers.tsx       # Global React providers composition
│   │
│   ├── lib/                    # Cross-cutting utilities
│   │   ├── auth.ts             # Better Auth configuration
│   │   ├── db.ts               # Prisma client (cached)
│   │   ├── env.ts              # @t3-oss/env-nextjs validation
│   │   ├── analytics.ts        # OpportunityAnalytics helpers
│   │   ├── pusher.ts           # Pusher server client + access request notifications
│   │   ├── emails/             # Resend email templates (invite + opportunity-active)
│   │   └── utils.ts            # cn(), misc helpers
│   │
│   ├── trpc/                   # tRPC setup
│   │   ├── init.ts             # Base router + middleware (baseProcedure, protectedProcedure, teamOrAdminProcedure, adminProcedure)
│   │   ├── routers/_app.ts     # Root router composition
│   │   └── client.tsx          # React Query client hooks + TRPCReactProvider
│   │
│   ├── inngest/                # Background job functions
│   │   ├── client.ts           # Inngest client instance
│   │   └── functions.ts        # translateDescription, notifyInvestorsOnOpportunityActive, execute
│   │
│   ├── locales/                # i18n dictionaries
│   │   ├── pt.ts               # Portuguese (default)
│   │   ├── en.ts               # English
│   │   ├── server.ts           # getScopedI18n
│   │   └── client.ts           # useScopedI18n
│   │
│   ├── middleware.ts           # Locale routing middleware (next-international)
│   │
│   └── generated/
│       └── prisma/             # Auto-generated Prisma client (do not edit)
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history (SQL)
│
├── docs/
│   └── harbor-guide.md         # Architecture & operations guide
│
├── sentry.server.config.ts     # Sentry — Node runtime
├── sentry.edge.config.ts       # Sentry — Edge runtime
├── biome.json                  # Biome linter/formatter config
├── lefthook.yml                # Git hook definitions
├── mprocs.yaml                 # Multi-process dev runner
└── .env.local                  # Local secrets (never commit)
```

---

## Feature Module Structure

Each feature under `src/features/<name>/` follows this convention:

```
features/<feature>/
├── components/         # React components for this feature
├── hooks/              # Custom hooks (tRPC query wrappers, state)
├── server/
│   └── route.ts        # tRPC router for this feature
├── params.ts           # Nuqs URL search param definitions
└── prefetch.ts         # Server-side prefetch helpers (HydrateClient)
```

This keeps domain logic self-contained and prevents cross-feature coupling. Shared logic belongs in `src/lib/`.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **tRPC over REST** | End-to-end TypeScript types — no manual API typing, no OpenAPI |
| **Feature folders** | Domain logic co-located with UI; easier to find, easier to delete |
| **Prisma over raw SQL** | Type-safe queries, auto-migrations, IDE autocomplete |
| **Inngest over serverless cron** | Durable step functions — retries, observability, no timeout limits |
| **Bun over Node/npm** | Faster installs, faster test runs, unified runtime |
| **Biome over ESLint+Prettier** | Single tool for lint + format, 50x faster, zero config conflicts |
| **Better Auth over NextAuth** | More control, Prisma adapter, no vendor lock-in |

---

## How Providers Are Wired

`src/components/providers.tsx` wraps the entire app and initializes:

1. `LanguageProvider` — `next-international` locale context
2. `ThemeProvider` — `next-themes` (light/dark/system)
3. `TRPCReactProvider` — tRPC + React Query context
4. `NextSSRPlugin` — UploadThing server-side config injection
5. `Toaster` — Sonner toast notifications
6. `NuqsAdapter` — URL search param state management
7. `PasswordChangeProvider` — Forced password change watchdog (runs on every protected page load)
