# 🧩 Feature Modules

> A complete map of every feature in Harbor Partners — what it does, where it lives, which tRPC procedures it exposes, what role is required, and how it connects to other parts of the system.

---

## Module Overview

Each module lives under `src/features/<name>/` and follows this structure:

```
features/<name>/
├── components/       UI components
├── hooks/            Custom React hooks (tRPC wrappers, local state)
├── server/
│   └── route.ts      tRPC router for this feature
├── params.ts         Nuqs URL search param definitions (optional)
└── prefetch.ts       Server-side prefetch (optional)
```

---

## Route Map

```
src/app/[locale]/
├── (public)/
│   ├── page.tsx                                 Landing page
│   └── (auth)/
│       ├── login/                               Login
│       ├── register/                            Registration
│       └── request-access/                      Prospect form
└── (protected)/
    ├── (dashboard)/
    │   └── dashboard/
    │       ├── page.tsx                          Investor home
    │       ├── m&a/[opportunityId]/              M&A opportunity detail (investor view)
    │       └── real-estate/[opportunityId]/      Real Estate detail (investor view)
    ├── (backoffice)/
    │   └── backoffice/
    │       ├── page.tsx                          Backoffice home
    │       ├── m&a/                              M&A list (TEAM/ADMIN)
    │       │   ├── create/                       Create form
    │       │   └── [opportunityId]/              View/edit + interests subpage
    │       │       └── interests/
    │       ├── real-estate/                      Real Estate list (TEAM/ADMIN)
    │       │   ├── create/                       Create form
    │       │   └── [opportunityId]/              View/edit + interests subpage
    │       │       └── interests/
    │       ├── investors/                        Investor list (ADMIN)
    │       │   └── [id]/                         Investor profile
    │       ├── users/                            User management (ADMIN)
    │       │   └── [id]/edit/                    Edit user
    │       ├── analytics/                        View analytics dashboard
    │       ├── notifications/                    Access request inbox
    │       ├── investment-interests/             Interest overview
    │       └── close-opportunities/              Deal closing
    ├── (crm)/
    │   └── crm/
    │       ├── page.tsx                          CRM home
    │       ├── leads/                            Lead management
    │       │   └── [id]/                         Lead detail
    │       └── commissions/                      Commission management
    │           ├── [id]/                         Commission detail
    │           ├── employee/[userId]/            Per-employee view
    │           └── resolve/[opportunityId]/      Commission resolution
    └── (user)/
        └── settings/                             User profile settings
```

---

## Module 1: Opportunities — M&A

**Feature folder:** `src/features/opportunities/`
**Routes:** `/backoffice/m&a/`, `/dashboard/m&a/[opportunityId]`
**Required role:** TEAM/ADMIN to create/edit; USER to view

### tRPC Procedures (`trpc.mergerAndAcquisition.*`)

| Procedure | Type | Role | Description |
|-----------|------|------|-------------|
| `getAll` | query | TEAM/ADMIN | List all opportunities with filters |
| `getById` | query | TEAM/ADMIN | Get by internal ID |
| `create` | mutation | protected | Create + emit Inngest translation event |
| `update` | mutation | protected | Update + re-emit translation if description changed |
| `delete` | mutation | ADMIN | Delete + clean up UploadThing files |

### Side Effects on `create`/`update`
1. Prisma writes the record
2. Inngest event `opportunity/translate-description` sent with `opportunityId` + `description`
3. Inngest worker calls Gemini via Vercel AI SDK → writes `englishDescription` back asynchronously

### File Uploads
- `images[]`: gallery, UploadThing
- On `delete`: `deleteFromUploadthing()` is called for all file keys

### Key Fields
- `description` — Portuguese text written by user
- `englishDescription` — written by Inngest/Gemini (never edited directly)
- `graphRows` — stored as JSON array (chart data)
- `status` — `ACTIVE` | `INACTIVE` | `CONCLUDED`

---

## Module 2: Opportunities — Real Estate

**Feature folder:** `src/features/opportunities/` (shared with M&A)
**Routes:** `/backoffice/real-estate/`, `/dashboard/real-estate/[opportunityId]`
**Required role:** TEAM/ADMIN to create/edit; USER to view

### tRPC Procedures (`trpc.realEstate.*`)

Same CRUD pattern as M&A. Translation is also wired — the `translateDescription` Inngest function handles both M&A and Real Estate opportunities.

### Key Fields Unique to Real Estate
- `location`, `area`, `noi`, `yield`, `rent`, `occupancyLastYear`
- `license`, `licenseStage`
- Co-investment fields: `gpEquityValue`, `gpEquityPercentage`, `totalEquityRequired`, `projectIRR`, `investorIRR`, etc.
- `asset` — `RealEstateAssetType` enum
- `investment` — `RealEstateInvestmentType` enum

---

## Module 3: Users

**Feature folder:** `src/features/users/`
**Routes:** `/settings/`
**Required role:** Any authenticated user for own profile

### tRPC Procedures (`trpc.users.*`)

| Procedure | Role | Description |
|-----------|------|-------------|
| `me` | USER+ | Get current user's profile |
| `updateAvatar` | USER+ | Upload new avatar via UploadThing |
| `changePassword` | USER+ | Update password via Better Auth |
| `getPasswordChangedStatus` | USER+ | Returns `passwordChanged` boolean |

---

## Module 4: Investors

**Feature folder:** `src/features/investors/`
**Routes:** `/backoffice/investors/`, `/backoffice/users/`
**Required role:** ADMIN for management

### tRPC Procedures (`trpc.investors.*`)

Handles investor/user management as a separate feature from the user self-service module. Includes:
- Listing all investors with filters and search
- Viewing investor profiles with full detail
- Editing investor profile fields
- Inviting new investors (creates User + sends Resend email)
- Deleting investors
- Managing investor notes and follow-ups

### Invitation Flow
1. Admin fills in name, email, role
2. `auth.api.signUpEmail` → Prisma creates User with `passwordChanged: false`
3. Resend sends credentials email via `src/lib/emails/invite-email.tsx`
4. New user logs in → `PasswordChangeProvider` enforces password change

### Key Components
- `investors-container.tsx` — main list view
- `investor-detail-container.tsx` — full investor profile
- `invite-investor-dialog.tsx` — invitation modal
- `edit-investor-dialog.tsx` — profile editing
- `investor-notes.tsx` / `investor-notes-dialog.tsx` — notes management
- `investor-last-followups.tsx` — follow-up tracking
- `investor-activities.tsx` — activity timeline
- `investor-interests.tsx` — interest tracking per investor

---

## Module 5: Authentication & Access Requests

**Feature folder:** `src/features/auth/`
**Routes:** `/login`, `/register`, `/request-access/` (public), `/backoffice/notifications/` (admin)
**Required role:** Public for submission; ADMIN for management

### tRPC Procedures (`trpc.accessRequest.*`)

| Procedure | Role | Description |
|-----------|------|-------------|
| `create` | Public | Submit access request form; triggers Pusher notification |
| `getAll` | ADMIN | List all access requests with status filter |
| `updateStatus` | ADMIN | Approve or reject a request |

### Real-Time Notification Flow
On `create`:
1. Prisma inserts `AccessRequest` with `status: PENDING`
2. `sendAccessRequestNotification()` triggers Pusher on:
   - Channel `notifications` — all admins subscribed
   - Channel `user-{adminEmail}` — per-admin targeted channel (hardcoded admin emails in `src/lib/pusher.ts`)

### PasswordChangeProvider
Lives in `src/components/auth/password-change-provider.tsx`, wired via `src/components/providers.tsx`. Runs on every protected page:
1. Calls `trpc.users.getPasswordChangedStatus`
2. If `false` → opens a non-dismissible dialog
3. On success → clears cookie + sets `passwordChanged: true`

---

## Module 6: Investment Interests

**Feature folder:** `src/features/investment-interests/`
**Routes:** Embedded in opportunity detail pages and investor profiles; also `/backoffice/investment-interests/`
**Required role:** USER to express interest; TEAM/ADMIN to view all

### tRPC Procedures (`trpc.investmentInterests.*`)

| Procedure | Role | Description |
|-----------|------|-------------|
| `setInterest` | USER+ | Create/update interest record for an opportunity |
| `getInterestsByOpportunity` | TEAM/ADMIN | All investor interests for a specific deal |
| `getInterestsByUser` | ADMIN | All interests for a specific investor |

### Interest Data Model
- `interested Boolean` — `true` = interested, `false` = not interested
- `notInterestedReason String?` — reason for declining (when `interested: false`)
- `ndaSigned Boolean` — NDA tracking
- `processed Boolean` — whether someone has reviewed this interest

### Tables Used
- `UserMergerAndAcquisitionInterest`
- `UserRealEstateInterest`

---

## Module 7: Analytics

**Feature folder:** `src/features/opportunities/server/analytics.ts`
**Library:** `src/lib/analytics.ts`
**Routes:** `/backoffice/analytics/`
**Required role:** TEAM/ADMIN

### How It Works
Every time a user views an opportunity detail page:
1. Component calls `incrementMnaViews(opportunityId)` or `incrementRealEstateViews(opportunityId)`
2. Prisma upserts `OpportunityAnalytics` — creates row on first view, increments `views` thereafter
3. Backoffice analytics dashboard queries `OpportunityAnalytics` to display view counts per deal

### Key Helpers (`src/lib/analytics.ts`)
- `incrementMnaViews(id)` — upserts analytics record for M&A
- `incrementRealEstateViews(id)` — upserts analytics record for Real Estate
- `getMnaAnalytics(id)` — fetches view count for a specific M&A opportunity
- `getRealEstateAnalytics(id)` — fetches view count for a specific Real Estate opportunity

---

## Module 8: CRM

**Feature folder:** `src/features/crm/`
**Routes:** `/crm/`, `/crm/leads/`, `/crm/leads/[id]`
**Required role:** TEAM/ADMIN

### Purpose
Manages the relationship between investors and team members. Key capabilities:
- View and filter all investors/leads with status, priority, and score
- Assign `leadResponsibleId` and `leadMainContactId` to investors
- Track lead lifecycle: `NEW` → `CONTACTED` → `QUALIFIED` → `CONVERTED` / `LOST`
- Manage follow-ups, activities, and notes
- Track commission rates per investor

### Key Fields (on `User` model)
- `leadResponsibleId` — FK to the team member responsible for this lead
- `leadMainContactId` — FK to the main contact person for this lead
- `leadSource` — where the lead came from (enum)
- `leadStatus` — current pipeline stage (enum)
- `leadPriority` — LOW / MEDIUM / HIGH / URGENT
- `leadScore` — numeric lead quality score
- `commissionRate` — percentage commission for this investor
- `companyName`, `representativeName`, `phoneNumber` — contact metadata

---

## Module 9: Commissions

**Feature folder:** `src/features/commissions/`
**Routes:** `/crm/commissions/`, `/crm/commissions/[id]`, `/crm/commissions/employee/[userId]`, `/crm/commissions/resolve/[opportunityId]`
**Required role:** TEAM/ADMIN

### tRPC Procedures (`trpc.commissions.*`)

Manages the full commission lifecycle for concluded deals.

### Key Components
- `commissions-container.tsx` — main commissions view
- `commission-management.tsx` — manage commission entries
- `commission-detail.tsx` — detailed commission breakdown
- `commission-resolution.tsx` — resolve commissions for a deal
- `admin-overview.tsx` — admin-level overview
- `employee-commissions.tsx` — per-employee commission view
- `my-commissions.tsx` — self-service view for team members
- `resolved-commissions-list.tsx` — list of resolved commissions

### Data Model
- `Commission` — links a user to a commission role + percentage
- `CommissionValue` — calculated commission for a specific opportunity
- `CommissionPayment` — individual payment installments with status tracking
- `OpportunityCommissionSchedule` — payment plan template per opportunity

---

## Module 10: Notifications

**Feature folder:** `src/features/notifications/`
**Routes:** `/backoffice/notifications/`
**Required role:** TEAM/ADMIN

### tRPC Procedures (`trpc.notifications.*`)

In-app notification system. Also provides server-side helpers used by other modules:
- `createNotifications()` — create notifications for specified users
- `getOpportunityInvolvedUsers()` — get all users involved with an opportunity
- `notifyAdmins()` — send notifications to all admin users

### Data Model
- `Notification` — per-user notifications with type, read status, and optional entity links

---

## tRPC Router Registry

All routers composed in `src/trpc/routers/_app.ts`:

| Router Key | Feature | Source |
|------------|---------|--------|
| `mergerAndAcquisition` | M&A CRUD | `src/features/opportunities/server/route.ts` |
| `realEstate` | Real Estate CRUD | `src/features/opportunities/server/route.ts` |
| `opportunities` | Shared opportunity logic | `src/features/opportunities/server/route.ts` |
| `analytics` | View tracking | `src/features/opportunities/server/analytics.ts` |
| `userInterest` | User interest tracking | `src/features/opportunities/server/user-interest.ts` |
| `users` | User self-service | `src/features/users/server/route.ts` |
| `investors` | Investor management | `src/features/investors/server/route.ts` |
| `investmentInterests` | Investment interest CRUD | `src/features/investment-interests/server/route.ts` |
| `accessRequest` | Access requests | `src/features/auth/server/route.ts` |
| `crm` | CRM / lead management | `src/features/crm/server/route.ts` |
| `commissions` | Commission management | `src/features/commissions/server/route.ts` |
| `notifications` | In-app notifications | `src/features/notifications/server/route.ts` |

---

## Shared Components

| Component | Location | Used In |
|-----------|----------|---------|
| Providers | `src/components/providers.tsx` | All pages |
| PasswordChangeProvider | `src/components/auth/password-change-provider.tsx` | Protected pages |
| LanguageProvider | `src/components/language/language-provider.tsx` | All pages |
| ThemeProvider | `src/components/theme/theme-provider.tsx` | All pages |
| Toast (Sonner) | `src/components/ui/sonner.tsx` | All pages |
| Upload Button | UploadThing client | Avatars, opportunity images |
| Design system | `src/components/ui/` | Everywhere |

---

## Adding a New Feature Module — Checklist

- [ ] Create `src/features/<name>/server/route.ts` with tRPC router
- [ ] Add router to `src/trpc/routers/_app.ts`
- [ ] Create `src/features/<name>/components/` for UI
- [ ] Create `src/features/<name>/hooks/` for tRPC query wrappers
- [ ] Add i18n keys to `src/locales/pt.ts` + `src/locales/en.ts`
- [ ] Add route under `src/app/[locale]/(protected)/<group>/<name>/`
- [ ] Add navigation link in relevant nav component
- [ ] Update this doc
