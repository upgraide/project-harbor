# Elena Vasquez (Code Reviewer) - Persistent Memory

_Last updated: 2026-02-27_

## Project Stack
- Next.js with TRPC, Prisma ORM, Inngest for async jobs
- Email: Resend + @react-email/components
- Monitoring: Sentry (logger + captureException)
- Env validation: @t3-oss/env-nextjs with Zod
- Auth: BetterAuth (roles: USER, TEAM, ADMIN)

## Key Patterns
- Inngest client at `src/inngest/client.ts` -- no typed event schemas defined
- Inngest functions registered in `src/app/api/inngest/route.ts`
- Email templates live in `src/lib/emails/` (tsx component + send helper pairs)
- Environment variables accessed via `env` from `@/lib/env`, NOT `process.env`
- Opportunity models: MergerAndAcquisition, RealEstate -- both default to ACTIVE status
- `acceptMarketingList` on User is `Boolean?` (nullable) -- null means not opted in

## Recurring Findings
- Inngest client lacks typed event schemas -- all event.data is untyped (`as` casts)
- `process.env` used directly in some places instead of validated `env` helper
- Inngest step.run closures: variables mutated inside steps don't survive replay; always return values from steps

## Open Questions
- Should investors with `acceptMarketingList: null` be treated as opted-in or out?
- Is Portuguese the correct default language for all investor communications?
