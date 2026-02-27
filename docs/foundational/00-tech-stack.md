# 🧱 Complete Tech Stack Reference

> **Project:** Harbor Partners is a Lisbon-based investment advisory internal platform managing investor records, M&A and real-estate opportunities, CRM workflows, analytics, and client communications.
> 
> 
> **Stack:** Next.js 15 + React 19 + TypeScript, running on Bun, deployed to Vercel.
> 

---

## 🗺️ Full Stack Interaction Map

| Layer | Tool | Talks To |
| --- | --- | --- |
| **Framework** | Next.js 15 App Router + React 19 | Everything |
| **Runtime** | Bun | Next.js, Prisma, Inngest |
| **API Layer** | tRPC + Zod | Better Auth, Prisma, Pusher, Inngest |
| **Auth** | Better Auth | Prisma (sessions/users), Resend (invites) |
| **Database** | Prisma + PostgreSQL | All server-side services |
| **Background Jobs / AI** | Inngest + Vercel AI SDK (`@ai-sdk/google`) + Google Gemini | Prisma, Sentry, Resend |
| **Email** | Resend | Triggered by Inngest / tRPC routes |
| **File Storage** | UploadThing | Prisma (save URLs), Next.js API |
| **Real-time** | Pusher | Next.js API routes → browser |
| **Observability** | Sentry | Inngest jobs, edge/server runtimes |
| **UI Primitives** | Radix UI + Tailwind CSS | All frontend components |
| **i18n** | next-international | App Router middleware, all pages |
| **Config Validation** | @t3-oss/env-nextjs + Zod | Build-time env validation |
| **Code Quality** | Biome + Ultracite + Lefthook | All source files, pre-commit hooks |
| **Public Config** | `NEXT_PUBLIC_` env vars | Browser-side (Pusher client, API URLs) |

---

## ⚙️ Inngest — Durable Background Jobs

**Role in project:** Runs durable background jobs: `opportunity/translate-description` translates Portuguese descriptions to English for both M&A and Real Estate opportunities via the Vercel AI SDK + Google Gemini; `opportunity/active` notifies investors by email when an opportunity goes active. Functions retry automatically per step on failure.

**Key concepts:** `inngest.createFunction`, `step.run`, `step.ai.wrap`, `bun inngest:dev` for local dev. Functions are registered in `src/app/api/inngest/route.ts` via the `serve()` call.

| Type | Resource |
| --- | --- |
| 📖 Docs | [inngest.com/docs](https://www.inngest.com/docs) |
| 🎬 Background Jobs in Next.js | [youtube.com/watch?v=Uq9QwouPZeA](https://www.youtube.com/watch?v=Uq9QwouPZeA) |
| 🎬 AI Jobs + Inngest (Production) | [youtube.com/watch?v=JChTYLB-TTQ](https://www.youtube.com/watch?v=JChTYLB-TTQ) |
| 🐳 Docker image | [hub.docker.com/r/inngest/inngest](https://hub.docker.com/r/inngest/inngest) |

---

## 🗄️ Prisma — ORM + PostgreSQL

**Role in project:** Single source of truth for all data. Key models: `User`, `MergerAndAcquisition`, `RealEstate`, `OpportunityAnalytics`, `OpportunityAccountManager`, `AccessRequest`, `Session`, `Account`, `Verification`, `UserNote`, `LastFollowUp`, `LeadActivity`, `Commission`, `CommissionValue`, `CommissionPayment`, `OpportunityCommissionSchedule`, `OpportunityPaymentPlan`, `Notification`, and interest join tables. `src/lib/db.ts` exports a cached client, and `bunx prisma migrate dev` manages schema evolution.

**Key concepts:** `schema.prisma` model definitions, `prisma migrate dev/deploy`, Prisma Studio (`bun prisma:studio`), Prisma Accelerate for connection pooling.

| Type | Resource |
| --- | --- |
| 📖 Docs | [prisma.io/docs](https://www.prisma.io/docs) |
| 🎬 Prisma Crash Course | [youtube.com/watch?v=RebA5J-rlwg](https://www.youtube.com/watch?v=RebA5J-rlwg) |
| 🎬 Prisma + Next.js App Router | [youtube.com/watch?v=QXxy8Uv1LnQ](https://www.youtube.com/watch?v=QXxy8Uv1LnQ) |

---

## 🔗 tRPC — End-to-End Type-Safe API

**Role in project:** All client-server communication goes through tRPC. `protectedProcedure` and `adminProcedure` enforce Better Auth sessions and role checks (`USER`, `TEAM`, `ADMIN`). Feature routers live in `src/features/**/server/route.ts` and are composed in `src/trpc/routers/_app.ts`.

**Key concepts:** `initTRPC`, `protectedProcedure`, `adminProcedure`, `createTRPCContext`, `HydrateClient` for server-side hydration with TanStack Query, Zod input validation, `TRPCError` for typed errors.

| Type | Resource |
| --- | --- |
| 📖 Docs | [trpc.io/docs](https://trpc.io/docs) |
| 🎬 tRPC + Next.js App Router | [youtube.com/watch?v=qCLV0Iaq9zU](https://www.youtube.com/watch?v=qCLV0Iaq9zU) |
| 🎬 tRPC + Next.js 15 App Router | [youtube.com/watch?v=FdfVxQFZxPc](https://www.youtube.com/watch?v=FdfVxQFZxPc) |
| 📄 Blog — tRPC with Next.js 15 | [wisp.blog/blog/how-to-use-trpc-with-nextjs-15-app-router](https://www.wisp.blog/blog/how-to-use-trpc-with-nextjs-15-app-router) |

---

## 🔐 Better Auth — Authentication

**Role in project:** Handles all auth: email/password login, session management, role-based access, password-change enforcement, and user invitations via Resend. `src/lib/auth.ts` initializes it with the Prisma adapter.

**Key concepts:** `betterAuth()`, `protectedProcedure` via session validation, `passwordChanged` flag enforcement, `auth.api.signUpEmail` for invitations, `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL`.

| Type | Resource |
| --- | --- |
| 📖 Docs | [better-auth.com/docs](https://www.better-auth.com/docs) |
| 🎬 Better Auth Full Setup | [youtube.com/watch?v=jvPkzO4XxHw](https://www.youtube.com/watch?v=jvPkzO4XxHw) |
| 🎬 Better Auth + Next.js + Prisma | [youtube.com/watch?v=EaFYSSXlmGI](https://www.youtube.com/watch?v=EaFYSSXlmGI) |

---

## 📧 Resend — Transactional Email

**Role in project:** Sends transactional emails: invitation emails when admins create new users, and opportunity notification emails when deals go active (`src/lib/emails`). Templates are React components built with `react-email`.

**Key concepts:** `resend.emails.send()`, `react-email` templates, domain verification (DKIM/SPF), `RESEND_API_KEY`.

| Type | Resource |
| --- | --- |
| 📖 Docs | [resend.com/docs](https://resend.com/docs) |
| 🎬 Resend + Next.js | [youtube.com/watch?v=kBxSucKFqm4](https://www.youtube.com/watch?v=kBxSucKFqm4) |
| 📖 react-email | [react.email](https://react.email/) |

---

## 📁 UploadThing — File Uploads

**Role in project:** Manages file/avatar uploads via `src/app/api/uploadthing`. `usersRouter.updateAvatar` and opportunity forms invoke `deleteFromUploadthing` on record changes to prevent orphaned files. `NextSSRPlugin` injects client-side config.

**Key concepts:** `createUploadthing()` FileRouter, `onUploadComplete` callback for saving URLs to Prisma, `<UploadButton>` / `<UploadDropzone>`, `UPLOADTHING_TOKEN`.

| Type | Resource |
| --- | --- |
| 📖 Docs | [docs.uploadthing.com](https://docs.uploadthing.com/) |
| 🎬 UploadThing V7 in Next.js | [youtube.com/watch?v=aQuu_-R2Pwg](https://www.youtube.com/watch?v=aQuu_-R2Pwg) |
| 🎬 Drag & Drop + Prisma | [youtube.com/watch?v=ohXb62KwTak](https://www.youtube.com/watch?v=ohXb62KwTak) |

---

## 🔔 Pusher — Real-Time Notifications

**Role in project:** Broadcasts `access-request` events to a public `notifications` channel and per-user channels (`user-{email}`) when new access requests arrive, giving admins instant in-app alerts.

**Key concepts:** `pusher.trigger(channel, event, data)`, `pusher-js` client subscriptions, public vs. private channels, `NEXT_PUBLIC_PUSHER_KEY` + `NEXT_PUBLIC_PUSHER_CLUSTER` for client-side use.

| Type | Resource |
| --- | --- |
| 📖 Docs | [pusher.com/docs](https://pusher.com/docs) |
| 📄 Blog — Pusher + Next.js | [obytes.com/blog/pusher-nextjs](https://www.obytes.com/blog/pusher-nextjs) |
| 📄 Blog — Pub/sub notifications | [tryzero.com/blog/use-pusher-to-implement-real-time-notifications](https://tryzero.com/blog/use-pusher-to-implement-real-time-notifications) |

---

## 🤖 Google Gemini — AI Translations

**Role in project:** Called inside Inngest's `opportunity/translate-description` worker via `step.ai.wrap` to translate Portuguese opportunity descriptions to English for both M&A and Real Estate. Wrapped in a step for automatic telemetry and retry logic.

**Key concepts:** `@ai-sdk/google` (Vercel AI SDK Google provider) + `generateText` from the `ai` package, `step.ai.wrap` for Inngest telemetry, `GOOGLE_GENERATIVE_AI_API_KEY`, `gemini-2.5-flash` model for cost-efficient translations.

| Type | Resource |
| --- | --- |
| 📖 Docs | [ai.google.dev/docs](https://ai.google.dev/docs) |
| 🎬 Gemini API Quickstart | [youtube.com/watch?v=pCbJl7E7QEY](https://www.youtube.com/watch?v=pCbJl7E7QEY) |
| 📖 Inngest `step.ai` docs | [inngest.com/docs/features/inngest-functions/steps-workflows/step-ai-orchestration](https://www.inngest.com/docs/features/inngest-functions/steps-workflows/step-ai-orchestration) |

---

## 🐛 Sentry — Observability & Error Tracking

**Role in project:** Configured in `sentry.server.config.ts` and `sentry.edge.config.ts`. Background jobs use `Sentry.logger` extensively to trace each translation step and report failures. DSNs are set in the Vercel dashboard.

**Key concepts:** `Sentry.captureMessage`, `Sentry.logger` for structured logs in Inngest jobs, edge vs. server DSNs, alerting on translation failures.

| Type | Resource |
| --- | --- |
| 📖 Docs — Next.js integration | [docs.sentry.io/platforms/javascript/guides/nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/) |
| 🎬 Sentry + Next.js setup | [youtube.com/watch?v=p2bLxbPfMoE](https://www.youtube.com/watch?v=p2bLxbPfMoE) |

---

## 🚀 Bun — Runtime & Package Manager

**Role in project:** Replaces Node.js + npm entirely. `bun install` is up to 30x faster than npm thanks to a global cache.  All scripts use `bun`/`bunx` instead of `npx`. `mprocs.yaml` orchestrates parallel dev processes.

**Key concepts:** `bun install`, `bunx <pkg>`, `bun dev` / `bun build` / `bun start`, built-in TypeScript/JSX support with no transpilation step, `bun test` (Jest-compatible).

| Type | Resource |
| --- | --- |
| 📖 Docs | [bun.com/docs](https://bun.com/docs) |
| 🎬 Bun Crash Course | [youtube.com/watch?v=U4JVw8K19uY](https://www.youtube.com/watch?v=U4JVw8K19uY) |
| 📄 Blog — Bun for Node.js Users | [betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users](https://betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users/) |

---

## 🧹 Biome + Ultracite — Linting & Formatting

**Role in project:** Replaces ESLint + Prettier in a single tool.  Ultracite is an opinionated Biome ruleset applied project-wide. `bun lint` runs all checks; `bun format` applies fixes. Lefthook runs `ultracite fix` automatically on staged files before every commit.

**Key concepts:** `biome.json` config, `bun lint` / `bun format`, `bun x ultracite fix`, Lefthook + lint-staged integration, 451 built-in rules covering JS/TS/JSX/CSS.

| Type | Resource |
| --- | --- |
| 📖 Biome Docs | [biomejs.dev](https://biomejs.dev/) |
| 📄 Migrate from ESLint/Prettier | [biomejs.dev/guides/migrate-eslint-prettier](https://biomejs.dev/guides/migrate-eslint-prettier/) |

---

## 🌐 next-international — i18n

**Role in project:** Powers locale-aware routing (`/pt` default, `/en` prefix). `middleware.ts` rewrites URLs; `getScopedI18n` (server) and `useScopedI18n` (client) load only the needed translation namespace. Dictionaries are split by feature under `src/locales`.

**Key concepts:** `createI18nMiddleware`, `getScopedI18n`, `useScopedI18n`, locale dictionaries, SEO-friendly canonical URLs.

| Type | Resource |
| --- | --- |
| 📖 Docs | [next-international.vercel.app](https://next-international.vercel.app/) |
| 🎬 i18n in Next.js App Router | [youtube.com/watch?v=4FBPFzDQSHw](https://www.youtube.com/watch?v=4FBPFzDQSHw) |

---

## 🎨 Radix UI + Tailwind CSS — UI Primitives

**Role in project:** `src/components/ui` houses a design system built on Radix UI primitives (accessible, unstyled) styled with Tailwind utility classes. `next-themes` manages dark/light mode. `Sonner` powers toast notifications.

**Key concepts:** Radix primitives (`Dialog`, `DropdownMenu`, `Select`…), Tailwind config, `cn()` utility for conditional classes, `next-themes`, `Sonner` toasts.

| Type | Resource |
| --- | --- |
| 📖 Radix UI Docs | [radix-ui.com/primitives/docs](https://www.radix-ui.com/primitives/docs/overview/introduction) |
| 📖 Tailwind CSS Docs | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| 🎬 Radix UI + Tailwind | [youtube.com/watch?v=1JnwJBtg4VA](https://www.youtube.com/watch?v=1JnwJBtg4VA) |

---

## 🔒 Zod + @t3-oss/env-nextjs — Validation & Env Safety

**Role in project:** Zod validates all tRPC inputs with type-safe schemas. `@t3-oss/env-nextjs` (in `src/lib/env.ts`) validates that all required environment variables are present at **build time**, failing fast if a secret is missing.]

**Key concepts:** `z.object()` schemas for tRPC inputs, `createEnv()` from `@t3-oss/env-nextjs`, `server` vs. `client` env separation, build-time crash on missing secrets.

| Type | Resource |
| --- | --- |
| 📖 Zod Docs | [zod.dev](https://zod.dev/) |
| 📖 @t3-oss/env-nextjs | [env.t3.gg](https://env.t3.gg/) |
| 🎬 Zod Crash Course | [youtube.com/watch?v=L6BE-U3oy80](https://www.youtube.com/watch?v=L6BE-U3oy80) |

---

## 💡 Suggested Learning Order

> Follow this sequence to build foundational understanding before tackling complex integrations.
> 
1. **Bun** — understand the runtime and package manager before running anything
2. **Prisma + PostgreSQL** — get the data model solid first
3. **tRPC + Zod** — learn the API layer and input validation
4. **Better Auth** — wire up auth on top of the tRPC context
5. **Resend** — add email flows (invitations, notifications)
6. **UploadThing** — add file upload to forms
7. **Inngest + Gemini** — layer in async AI workflows
8. **Pusher** — add real-time notifications last
9. **Biome/Sentry/i18n** — operational tooling throughout