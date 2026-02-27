# 🗃️ Domain & Data Model

> Everything about the business domain: what entities exist, what they mean, how they relate, and how the Prisma schema encodes them.

---

## Business Domain Overview

Harbor Partners operates in **investment advisory**. The platform has three user classes interacting with two types of investment opportunities through a structured CRM, commission tracking, and onboarding pipeline.

```
ADMIN / TEAM ─── manage ──→ Opportunities (M&A + Real Estate)
                                │
INVESTOR (USER) ──── views, expresses interest ───┘
                │
                └── managed via CRM (leads, commissions, contacts, follow-ups)

PROSPECT ──── submits AccessRequest ──→ (approved) ──→ becomes INVESTOR
```

---

## Entities & Glossary

### People

| Term | Prisma Model | Role | Description |
|------|-------------|------|-------------|
| **Investor** | `User` | `USER` | High-net-worth or institutional client. Can browse opportunities, express interest, manage profile. |
| **Team Member** | `User` | `TEAM` | Internal Harbor Partners staff. Can create/manage opportunities and be assigned as account manager. |
| **Admin** | `User` | `ADMIN` | Full platform access. Manages users, approves/rejects access requests, accesses all backoffice sections. |
| **Lead** | `User` | Any | An investor assigned to a team member via `leadResponsibleId` / `leadMainContactId`. Tracked in CRM with status, priority, and score. |
| **Prospect** | `AccessRequest` | — | Person who submitted a request-access form. Not yet a `User`. Status: `PENDING` → `APPROVED` / `REJECTED`. |
| **Account Manager** | `OpportunityAccountManager` | `TEAM`/`ADMIN` | Team member assigned to a specific opportunity for investor relationship management. |

---

### Opportunities

| Term | Prisma Model | Description |
|------|-------------|-------------|
| **M&A Opportunity** | `MergerAndAcquisition` | A company sale/acquisition deal. Includes multilingual descriptions, financial metrics (EBITDA ranges, CAGR, EV/EBITDA entry/exit), graph data, and co-investment terms. |
| **Real Estate Opportunity** | `RealEstate` | A property investment deal. Includes location, area, NOI, yield, occupancy, licensing info, and co-investment structure. |
| **Opportunity Status** | Enum `OpportunityStatus` | `ACTIVE` (visible to investors), `INACTIVE` (hidden), `CONCLUDED` (deal closed). |

**Financial Terms on M&A:**

| Term | Meaning |
|------|---------|
| **EBITDA** | Earnings Before Interest, Taxes, Depreciation and Amortization — key profitability metric. Stored as enum range (`EbitdaRange`). |
| **EV/EBITDA** | Enterprise Value / EBITDA — valuation multiple. Separate entry and exit fields (`evDashEbitdaEntry`, `evDashEbitdaExit`). |
| **CAGR** | Compound Annual Growth Rate — separate `salesCAGR` and `ebitdaCAGR` fields. |
| **Sales range** | Revenue band of the target company. Stored as enum (`SalesRange`), not numeric. |

**Financial Terms on Real Estate:**

| Term | Meaning |
|------|---------|
| **NOI** | Net Operating Income — annual income minus operating expenses |
| **Yield** | Return on investment as a percentage |
| **Occupancy** | Multiple fields: `occupancyLastYear`, `occupancyRate`, `breakEvenOccupancy`, `vacancyRate` |
| **Co-investment** | Structure where multiple investors co-participate in the same asset — multiple fields for GP equity, IRR, hold period, etc. |

---

### Investor Profile Data

| Field | Meaning |
|-------|---------|
| **Investor Client Type** | Category of investor (e.g., family office, PE fund, bank). Stored as `InvestorClientType` enum. |
| **Investment Strategy** | Investor's preferred approach (up to 3: `strategy1`, `strategy2`, `strategy3`). Stored as `InvestorStrategy` enum. |
| **Investor Segment** | Sector preference (up to 3: `segment1`, `segment2`, `segment3`). Stored as `InvestorSegment` enum. |
| **Preferred Locations** | Up to 3 locations (`location1`, `location2`, `location3`). Free text. |
| **Ticket Size** | Min/max investment amount (`minTicketSize`, `maxTicketSize`). |
| **Target Return IRR** | Expected internal rate of return. |
| **Commission Rate** | % commission applicable to this investor. Surfaced in commission dashboards. |
| **Marketing Consent** | GDPR consent flag (`acceptMarketingList Boolean?`). |
| **Department** | `MNA`, `CRE`, or `MNA_AND_CRE`. |

---

## Prisma Schema — All Models

### `User`
Central entity for all platform users (investors + internal staff).

```
User {
  id                  String          (PK)
  name                String
  email               String          (unique)
  emailVerified       Boolean         (default: false)
  role                Role            USER | TEAM | ADMIN
  disabled            Boolean         (default: false)
  passwordChanged     Boolean         (default: false, true after first change)
  image               String?         (UploadThing avatar URL)
  createdAt           DateTime
  updatedAt           DateTime

  // Investor classification
  investorType        InvestorType?
  preferredLocation   String?

  // Extended profile fields
  companyName         String?
  representativeName  String?
  phoneNumber         String?
  type                InvestorClientType?
  strategy1/2/3       InvestorStrategy?     (up to 3 strategies)
  segment1/2/3        InvestorSegment?      (up to 3 segments)
  location1/2/3       String?               (up to 3 locations)
  minTicketSize       Float?
  maxTicketSize       Float?
  targetReturnIRR     Float?
  physicalAddress     String?
  website             String?
  lastContactDate     DateTime?
  acceptMarketingList Boolean?
  otherFacts          String?
  lastNotes           String?
  personalNotes       String?
  department          Department?

  // Lead management (FK → User)
  leadResponsibleId   String?
  leadMainContactId   String?
  leadResponsibleTeam TeamMember?     (enum, not FK)
  leadMainContactTeam TeamMember?     (enum, not FK)

  // CRM fields
  leadSource          LeadSource?
  leadStatus          LeadStatus?     (default: NEW)
  leadPriority        LeadPriority?   (default: MEDIUM)
  tags                String[]        (default: [])
  nextFollowUpDate    DateTime?
  leadScore           Int?            (default: 0)
  convertedAt         DateTime?
  lostReason          String?
  lostAt              DateTime?
  commissionRate      Float?
  commissionNotes     String?

  // Relations
  accounts            Account[]
  sessions            Session[]
  mergerAndAcquisitionInterests  UserMergerAndAcquisitionInterest[]
  realEstateInterests            UserRealEstateInterest[]
  accountManagerAssignments      OpportunityAccountManager[]
  clientAcquisitionerMergerAndAcquisitions  MergerAndAcquisition[]
  clientAcquisitionerRealEstates            RealEstate[]
  clientOriginatorMergerAndAcquisitions     MergerAndAcquisition[]
  clientOriginatorRealEstates               RealEstate[]
  investedPersonDeals   OpportunityAnalytics[]
  followupPersonDeals   OpportunityAnalytics[]
  notes                 UserNote[]
  createdNotes          UserNote[]
  lastFollowUps         LastFollowUp[]
  activities            LeadActivity[]
  commissions           Commission[]
  notifications         Notification[]
}
```

### `Account`, `Session` & `Verification`
Managed entirely by **Better Auth**. Do not write to these directly.
- `Account` — credential/OAuth account linked to a User
- `Session` — active session with token, expiry, IP, user agent
- `Verification` — email verification tokens

### `MergerAndAcquisition`
```
MergerAndAcquisition {
  id                    String          (cuid, PK)
  name                  String
  description           String?         (Portuguese — written by user)
  englishDescription    String?         (auto-filled by Inngest + Gemini)
  images                String[]        (UploadThing URLs)
  status                OpportunityStatus  (default: ACTIVE)
  hidden                Boolean         (default: false)
  userId                String          (who created it)
  createdAt             DateTime
  updatedAt             DateTime

  // Classification
  type                  Type?           (BUY_IN | BUY_OUT | BUY_IN_BUY_OUT)
  typeDetails           TypeDetails?    (MAIORITARIO | MINORITARIO | FULL_OWNERSHIP)
  industry              Industry?
  industrySubsector     IndustrySubsector?

  // Financial metrics (Pre-NDA)
  sales                 SalesRange?     (enum, not Float)
  ebitda                EbitdaRange?    (enum, not Float)
  ebitdaNormalized      Float?
  netDebt               Float?
  salesCAGR             Float?
  ebitdaCAGR            Float?
  assetIncluded         Boolean?
  estimatedAssetValue   Float?
  preNDANotes           String?

  // Graph data
  graphRows             Json[]          (array of { year, revenue, ebitda, ebitdaMargin })
  graphUnit             String          (default: "millions")

  // Post-NDA Fields
  shareholderStructure  String[]        (file paths/URLs)
  im                    String?
  entrepriseValue       Float?
  equityValue           Float?
  evDashEbitdaEntry     Float?
  evDashEbitdaExit      Float?
  ebitdaMargin          Float?
  fcf                   Float?
  netDebtDashEbitda     Float?
  capexItensity         Float?
  workingCapitalNeeds   Float?
  postNDANotes          String?

  // Co-Investment Fields
  coInvestment          Boolean?
  equityContribution    Float?
  grossIRR              Float?
  netIRR                Float?
  moic                  Float?
  cashOnCashReturn      Float?
  cashConvertion        Float?
  entryMultiple         Float?
  exitExpectedMultiple  Float?
  holdPeriod            Float?

  // Client relations
  clientAcquisitionerId String?         (FK → User)
  clientOriginatorId    String?         (FK → User)

  // Relations
  analytics             OpportunityAnalytics?
  userInterests         UserMergerAndAcquisitionInterest[]
}
```

### `RealEstate`
```
RealEstate {
  id                    String          (cuid, PK)
  name                  String
  description           String?         (Portuguese — written by user)
  englishDescription    String?         (auto-filled by Inngest + Gemini)
  images                String[]        (UploadThing URLs)
  status                OpportunityStatus  (default: ACTIVE)
  hidden                Boolean         (default: false)
  createdBy             String          (who created it)
  createdAt             DateTime
  updatedAt             DateTime

  // Asset type
  asset                 RealEstateAssetType?

  // Pre-NDA Fields
  location              String?
  area                  Float?
  value                 Float?
  yield                 Float?
  rent                  Float?
  noi                   Float?
  occupancyLastYear     Float?
  walt                  Float?
  nRoomsLastYear        Int?
  nBeds                 Int?
  investment            RealEstateInvestmentType?
  subRent               Float?
  rentPerSqm            Float?
  subYield              Float?
  capex                 Float?
  capexPerSqm           Float?
  sale                  Float?
  salePerSqm            Float?
  gcaAboveGround        Float?
  gcaBelowGround        Float?

  // Post-NDA Fields
  license               String?
  licenseStage          String?
  irr                   Float?
  coc                   Float?
  holdingPeriod         Float?
  breakEvenOccupancy    Float?
  vacancyRate           Float?
  estimatedRentValue    Float?
  occupancyRate         Float?
  moic                  Float?
  price                 Float?
  totalInvestment       Float?
  profitOnCost          Float?
  profit                Float?
  sofCosts              Float?
  sellPerSqm            Float?
  gdv                   Float?
  wault                 Float?
  debtServiceCoverageRatio Float?
  expectedExitYield     Float?
  ltv                   Float?
  ltc                   Float?
  yieldOnCost           Float?

  // Co-Investment Fields
  coInvestment                   Boolean?
  gpEquityValue                  Float?
  gpEquityPercentage             Float?
  totalEquityRequired            Float?
  sponsorPresentation            String?
  promoteStructure               String?
  projectIRR                     Float?
  investorIRR                    Float?
  coInvestmentHoldPeriod         Float?
  coInvestmentBreakEvenOccupancy Float?

  // Client relations
  clientAcquisitionerId String?         (FK → User)
  clientOriginatorId    String?         (FK → User)

  // Relations
  analytics             OpportunityAnalytics?
  userInterests         UserRealEstateInterest[]
}
```

### `OpportunityAnalytics`
View tracking + deal closing data. One row per opportunity, lazily created on first view.

```
OpportunityAnalytics {
  id                        String
  mergerAndAcquisitionId    String?     (FK → MergerAndAcquisition, unique)
  realEstateId              String?     (FK → RealEstate, unique)
  views                     Int         (default: 0)

  // Final deal values (when CONCLUDED)
  closed_at                 DateTime?
  final_amount              Float?
  profit_amount             Float?
  commissionable_amount     Float?

  // Persons involved in deal closing
  invested_person_id        String?     (FK → User)
  followup_person_id        String?     (FK → User)

  createdAt                 DateTime
  updatedAt                 DateTime
}
```

### `OpportunityAccountManager`
Join table — assigns a team member to an opportunity (polymorphic).

```
OpportunityAccountManager {
  id              String          (cuid, PK)
  opportunityId   String          (polymorphic — references M&A or RE by ID)
  opportunityType OpportunityType (MNA | REAL_ESTATE)
  userId          String          (FK → User)
  createdAt       DateTime

  @@unique([opportunityId, opportunityType, userId])
}
```

### `AccessRequest`
Public prospect form submissions.

```
AccessRequest {
  id        String
  name      String
  email     String
  company   String              (required)
  phone     String
  position  String
  message   String
  status    AccessRequestStatus  PENDING | APPROVED | REJECTED
  createdAt DateTime
  updatedAt DateTime
}
```

### Interest Tables
Two join tables for investor engagement:

| Table | Links |
|-------|-------|
| `UserMergerAndAcquisitionInterest` | User ↔ MergerAndAcquisition |
| `UserRealEstateInterest` | User ↔ RealEstate |

Each has:
- `interested Boolean` (default: false) — true = interested, false = not interested
- `notInterestedReason String?` — reason for declining
- `ndaSigned Boolean` (default: false) — NDA tracking
- `processed Boolean` (default: false) — whether someone has reviewed this interest
- `createdAt`, `updatedAt`
- Unique constraint on `[userId, opportunityId]`

### `UserNote`
Notes attached to an investor by team members.

```
UserNote {
  id        String
  userId    String      (FK → User — the investor)
  note      String
  createdBy String      (FK → User — the author)
  createdAt DateTime
  updatedAt DateTime
}
```

### `LastFollowUp`
Tracks follow-up interactions with investors.

```
LastFollowUp {
  id                String
  userId            String      (FK → User)
  followUpDate      DateTime
  description       String      (text)
  contactedById     String      (FK → User — team member who made contact)
  personContactedId String      (FK → User — person contacted)
  createdAt         DateTime
  updatedAt         DateTime
}
```

### `LeadActivity`
Activity log for CRM lead tracking.

```
LeadActivity {
  id            String
  userId        String          (FK → User)
  activityType  ActivityType    (CALL | EMAIL | MEETING | NOTE | TASK | DEAL_VIEWED | ...)
  title         String
  description   String?
  relatedUserId String?
  metadata      Json?
  createdAt     DateTime
}
```

### Commission System

Four models manage the commission workflow:

**`Commission`** — A user's commission role and rate.
```
Commission {
  id                    String
  userId                String          (FK → User)
  roleType              CommissionRole  (ACCOUNT_MANAGER | CLIENT_ACQUISITION | CLIENT_ORIGINATOR | DEAL_SUPPORT)
  commissionPercentage  Float           (default: 0)
  commissionValues      CommissionValue[]
  @@unique([userId, roleType])
}
```

**`CommissionValue`** — Calculated commission for a specific opportunity.
```
CommissionValue {
  id                    String
  opportunityId         String
  opportunityType       OpportunityType
  totalCommissionValue  Float?
  commissionId          String          (FK → Commission)
  payments              CommissionPayment[]
  @@unique([opportunityId, opportunityType, commissionId])
}
```

**`CommissionPayment`** — Individual payment installments.
```
CommissionPayment {
  id                String
  commissionValueId String          (FK → CommissionValue)
  installmentNumber Int
  percentage        Float?
  paymentDate       DateTime?
  paymentAmount     Float?
  isPaid            Boolean         (default: false)
  paidAt            DateTime?
  @@unique([commissionValueId, installmentNumber])
}
```

**`OpportunityCommissionSchedule`** — Payment plan template for an opportunity.
```
OpportunityCommissionSchedule {
  id              String
  opportunityId   String
  opportunityType OpportunityType
  isResolved      Boolean         (default: false)
  resolvedAt      DateTime?
  resolvedBy      String?
  paymentPlans    OpportunityPaymentPlan[]
  @@unique([opportunityId, opportunityType])
}
```

### `Notification`
In-app notification system.

```
Notification {
  id              String
  userId          String              (FK → User)
  type            NotificationType    (ACCESS_REQUEST | OPPORTUNITY_INTEREST | OPPORTUNITY_CONCLUDED | COMMISSION_RESOLVED | ...)
  title           String
  message         String
  read            Boolean             (default: false)
  readAt          DateTime?
  opportunityId   String?
  opportunityType OpportunityType?
  relatedUserId   String?
  createdAt       DateTime
  updatedAt       DateTime
}
```

---

## All Enums

### Core Enums

| Enum | Values |
|------|--------|
| `Role` | `USER`, `TEAM`, `ADMIN` |
| `AccessRequestStatus` | `PENDING`, `APPROVED`, `REJECTED` |
| `OpportunityStatus` | `ACTIVE`, `INACTIVE`, `CONCLUDED` |
| `OpportunityType` | `MNA`, `REAL_ESTATE` |

### M&A Classification Enums

| Enum | Values |
|------|--------|
| `Type` | `BUY_IN`, `BUY_OUT`, `BUY_IN_BUY_OUT` |
| `TypeDetails` | `MAIORITARIO`, `MINORITARIO`, `FULL_OWNERSHIP` |
| `Industry` | `SERVICES`, `TRANSFORMATION_INDUSTRY`, `TRADING`, `ENERGY_INFRASTRUCTURE`, `FITNESS`, `HEALTHCARE_PHARMACEUTICALS`, `IT`, `TMT`, `TRANSPORTS` |
| `IndustrySubsector` | `BUSINESS_SERVICES`, `FINANCIAL_SERVICES`, `CONSTRUCTION_MATERIALS`, `FOOD_BEVERAGES`, `OTHERS` |
| `SalesRange` | `RANGE_0_5`, `RANGE_5_10`, `RANGE_10_15`, `RANGE_20_30`, `RANGE_30_PLUS` |
| `EbitdaRange` | `RANGE_1_2`, `RANGE_2_3`, `RANGE_3_5`, `RANGE_5_PLUS` |

### Real Estate Enums

| Enum | Values |
|------|--------|
| `RealEstateAssetType` | `AGNOSTIC`, `MIXED`, `HOSPITALITY`, `LOGISTICS_AND_INDUSTRIAL`, `OFFICE`, `RESIDENTIAL`, `SENIOR_LIVING`, `SHOPPING_CENTER`, `STREET_RETAIL`, `STUDENT_HOUSING` |
| `RealEstateInvestmentType` | `LEASE_AND_OPERATION`, `S_AND_L`, `CORE`, `FIX_AND_FLIP`, `REFURBISHMENT`, `VALUE_ADD`, `OPPORTUNISTIC`, `DEVELOPMENT` |

### Investor Enums

| Enum | Values |
|------|--------|
| `InvestorType` | `LESS_THAN_10M`, `BETWEEN_10M_100M`, `GREATER_THAN_100M` |
| `InvestorClientType` | `ADVISOR`, `ANGEL_INVESTOR`, `BANK`, `BRAND`, `BROKER`, `BUSINESS`, `CLUB_DEAL_SYNDICATOR`, `DEBT_FUND`, `DEVELOPER`, `FAMILY_OFFICE`, `FUND_OF_FUND`, `SEARCH_FUND`, `INVESTOR`, `PENSION_FUND`, `PRIVATE_DEBT_INVESTOR`, `PRIVATE_EQUITY_FUND`, `SMALL_INVESTOR`, `START_UP`, `TEAM_MEMBER`, `VENTURE_CAPITAL_FUND`, `WEALTH_MANAGER`, `CONSTRUCTION_COMPANY`, `ASSET_MANAGER`, `PARTNER`, `ARCHITECT`, `CONSULTANT`, `PROMOTER`, `OTHER` |
| `InvestorStrategy` | `AGNOSTIC`, `MAJORITY_STAKES`, `MINORITY_STAKES`, `GROWTH`, `BUSINESS_OPERATOR`, `BUY_AND_HOLD`, `CONSOLIDATION`, `LEASE_AND_OPERATE`, `SALE_AND_LEASEBACK`, `CORE`, `FIX_AND_FLIP`, `REFURBISHMENT`, `VALUE_ADD`, `OPPORTUNISTIC`, `DEVELOPMENT`, `LONG_TERM_DEBT`, `MEZZ_BRIDGE_DEBT` |
| `InvestorSegment` | `AGNOSTIC`, `BUSINESS_SERVICES`, `CONSTRUCTION_AND_REAL_ESTATE`, `CONSTRUCTION_INDUSTRY`, `CONSUMER_AND_RETAIL`, `DATA_CENTER`, `ENERGY_AND_INFRASTRUCTURE`, `FINANCIAL_SERVICES`, `FITNESS`, `FOOD_INDUSTRY`, `FOOD_RETAIL`, `HEALTHCARE_AND_PHARMACEUTICALS`, `IT`, `TMT`, `TRADING`, `TRANSFORMATION_INDUSTRY`, `TRANSPORTS`, `MIXED`, `HOSPITALITY`, `LOGISTICS_AND_INDUSTRIAL`, `OFFICE`, `RESIDENTIAL`, `SENIOR_LIVING`, `SHOPPING_CENTERS`, `STREET_RETAIL`, `STUDENT_HOUSING`, `DEBT` |
| `TeamMember` | `MAS`, `FB`, `FC`, `FRS`, `GBA`, `JV`, `JDV`, `JG`, `LM`, `RS`, `RA`, `SM`, `TE`, `JCM` |
| `Department` | `MNA`, `CRE`, `MNA_AND_CRE` |

### CRM Enums

| Enum | Values |
|------|--------|
| `LeadSource` | `WEBSITE`, `REFERRAL`, `COLD_OUTREACH`, `NETWORKING_EVENT`, `LINKEDIN`, `EMAIL_CAMPAIGN`, `PARTNER`, `EXISTING_CLIENT`, `ACCESS_REQUEST`, `OTHER` |
| `LeadStatus` | `NEW`, `CONTACTED`, `QUALIFIED`, `MEETING_SCHEDULED`, `PROPOSAL_SENT`, `NEGOTIATION`, `CONVERTED`, `LOST`, `ON_HOLD`, `NURTURE` |
| `LeadPriority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `ActivityType` | `CALL`, `EMAIL`, `MEETING`, `NOTE`, `TASK`, `DEAL_VIEWED`, `DEAL_INTERESTED`, `DEAL_NOT_INTERESTED`, `STATUS_CHANGE`, `ASSIGNMENT_CHANGE`, `FOLLOW_UP_SCHEDULED`, `OTHER` |
| `CommissionRole` | `ACCOUNT_MANAGER`, `CLIENT_ACQUISITION`, `CLIENT_ORIGINATOR`, `DEAL_SUPPORT` |
| `NotificationType` | `ACCESS_REQUEST`, `OPPORTUNITY_INTEREST`, `OPPORTUNITY_NOT_INTERESTED`, `OPPORTUNITY_NDA_SIGNED`, `OPPORTUNITY_CONCLUDED`, `OPPORTUNITY_STATUS_CHANGE`, `COMMISSION_RESOLVED`, `LEAD_STATUS_CHANGE`, `LEAD_FOLLOW_UP`, `NEW_USER_REGISTERED` |

---

## Entity Relationship Overview

```
User ──────────────────────────────────────────────────────────┐
 ├── Account[]              (Better Auth)                      │
 ├── Session[]              (Better Auth)                      │
 ├── UserMnaInterest[]      ──────────────→ MergerAndAcquisition
 ├── UserREInterest[]       ──────────────→ RealEstate
 ├── OpportunityAccountManager[] ──→ M&A / RE (polymorphic)    │
 ├── clientAcquisitioner[]  ──→ M&A / RE (who brought the deal)│
 ├── clientOriginator[]     ──→ M&A / RE (who originated)      │
 ├── UserNote[]             (notes about this investor)        │
 ├── LastFollowUp[]         (follow-up interactions)           │
 ├── LeadActivity[]         (CRM activity log)                 │
 ├── Commission[]           ──→ CommissionValue[] ──→ CommissionPayment[]
 └── Notification[]         (in-app notifications)

MergerAndAcquisition ──→ OpportunityAnalytics  (1:1)
RealEstate           ──→ OpportunityAnalytics  (1:1)
OpportunityAnalytics ──→ invested_person (User), followup_person (User)

OpportunityCommissionSchedule ──→ OpportunityPaymentPlan[] (payment plan template)

AccessRequest          (standalone, no FK to User — prospect only)
Verification           (Better Auth — email verification tokens)
```

---

## Key End-to-End Flows

### Flow 1: Opportunity Creation → Translation → Analytics
1. TEAM/ADMIN creates opportunity via tRPC mutation → Prisma writes record
2. Router emits `opportunity/translate-description` Inngest event
3. Inngest worker calls Gemini via Vercel AI SDK → writes `englishDescription` back via Prisma (handles both M&A and Real Estate)
4. Investor views detail page → `incrementMnaViews` / `incrementRealEstateViews` upserts `OpportunityAnalytics`

### Flow 2: Opportunity Goes Active → Email Notification
1. Opportunity status changes to `ACTIVE`
2. Router emits `opportunity/active` Inngest event
3. Inngest fetches all investors with `acceptMarketingList: true`
4. Sends opportunity notification email to each via Resend

### Flow 3: Access Request → Admin Notification → Onboarding
1. Prospect submits form → `AccessRequest` created with `status: PENDING`
2. `sendAccessRequestNotification` triggers Pusher events to all admins
3. Admin approves → `trpc.accessRequest.updateStatus` → `status: APPROVED`
4. Admin creates `User` via invite → Resend sends credentials email
5. New user logs in → `PasswordChangeProvider` enforces password change

### Flow 4: Investor Interest Tracking
1. Investor views opportunity detail page → view count incremented
2. Investor clicks "I'm interested" → `trpc.investmentInterests.setInterest`
3. Prisma upserts `UserMergerAndAcquisitionInterest` with `interested: true`
4. TEAM users can view all interests per opportunity in the backoffice

### Flow 5: Deal Conclusion → Commission Resolution
1. Opportunity marked as `CONCLUDED` → `OpportunityAnalytics` records deal values
2. Admin resolves commission schedule via `OpportunityCommissionSchedule`
3. `CommissionValue` calculated for each involved user based on `CommissionRole`
4. `CommissionPayment` installments created per the payment plan
