## 🚧 Tasks That Need To Be Done

### Priority 0: URGENT - CRM & Backoffice Core Workflows (CLIENT PRIORITY)

These are critical missing features that block the core business operations. The client needs these FIRST before anything else.

---

#### Task 0.1: Implement Opportunity Status Management (Close Deals/Applications)
**High-Level Goal:** Allow TEAM/ADMIN users to change opportunity status (ACTIVE → INACTIVE → CONCLUDED) to manage the deal lifecycle and "close" applications.

**Current Problem:** 
- Opportunities have a `status` field in the database (ACTIVE, INACTIVE, CONCLUDED)
- Analytics dashboard depends on CONCLUDED status to track completed deals
- There is NO UI or API endpoint to change the status
- Admins cannot mark deals as closed/completed

**Technical Details:**
- **Location:** `src/features/opportunities/server/route.ts` and editor components

- **Add TRPC Mutations:**
  ```typescript
  // In mergerAndAcquisitionRouter
  updateStatus: adminProcedure
    .input(z.object({ 
      id: z.string(), 
      status: z.enum(['ACTIVE', 'INACTIVE', 'CONCLUDED'])
    }))
    .mutation(async ({ input }) => {
      return await prisma.mergerAndAcquisition.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
  
  // Same for realEstateRouter
  ```

- **Add React Hooks:**
  - `src/features/opportunities/hooks/use-m&a-opportunities.ts` - Add `useUpdateOpportunityStatus`
  - `src/features/opportunities/hooks/use-real-estate-opportunities.ts` - Add `useUpdateOpportunityStatus`

- **Update UI Components:**
  1. **Opportunity Editor Header** (`src/features/editor/components/m&a-editor-header.tsx` and `real-estate-editor-header.tsx`)
     - Add status badge showing current status
     - Add dropdown menu to change status
     - Add confirmation dialog for status changes
  
  2. **Opportunity List** (`src/features/opportunities/components/m&a-opportunities.tsx` and `real-estate-opportunities.tsx`)
     - Add status filter (All / Active / Inactive / Concluded)
     - Display status badge on each opportunity card
     - Add bulk status change action
  
  3. **Opportunity Detail/Viewer** (`src/features/viewer/components/*.tsx`)
     - Display current status prominently
     - Show status history/timeline (optional enhancement)

- **Add Localization:**
  - Add status labels to `src/locales/backoffice/mergers-and-acquisitions-create-page/en.ts` and `pt.ts`
  - Add confirmation messages for status changes

- **Business Logic:**
  - When status changes to CONCLUDED:
    - Trigger commission calculation (if implemented)
    - Send notification to account managers
    - Log status change in audit trail
  - Prevent changing from CONCLUDED back to ACTIVE without admin approval

**Files to Modify:**
1. `src/features/opportunities/server/route.ts` - Add updateStatus mutations
2. `src/features/opportunities/hooks/use-m&a-opportunities.ts` - Add hook
3. `src/features/opportunities/hooks/use-real-estate-opportunities.ts` - Add hook
4. `src/features/editor/components/m&a-editor-header.tsx` - Add status controls
5. `src/features/editor/components/real-estate-editor-header.tsx` - Add status controls
6. `src/features/opportunities/components/m&a-opportunities.tsx` - Add status filter
7. `src/features/opportunities/components/real-estate-opportunities.tsx` - Add status filter
8. `src/locales/backoffice/` - Add translations

**Dependencies:** None - THIS IS THE HIGHEST PRIORITY

---

#### Task 0.2: Complete CRM Dashboard with Lead Management
**High-Level Goal:** Build a functional CRM dashboard showing all investors/leads with proper filtering, sorting, and quick actions.

**Current Problem:**
- CRM page (`/crm/page.tsx`) only shows "CRM" heading - completely empty
- No way to view leads/investors in CRM context
- Missing lead assignment workflow
- Missing follow-up task management

**Technical Details:**
- **Location:** `src/app/[locale]/(protected)/(crm)/crm/page.tsx` and new CRM feature module

- **Create CRM Feature Module:**
  ```
  src/features/crm/
    components/
      crm-dashboard.tsx          - Main dashboard layout
      leads-table.tsx            - Investor leads table
      lead-card.tsx              - Individual lead card
      lead-filters.tsx           - Advanced filters
      quick-actions.tsx          - Quick action buttons
      follow-up-reminder.tsx     - Follow-up reminders widget
      recent-activity.tsx        - Recent activity feed
    server/
      route.ts                   - CRM-specific queries
    hooks/
      use-crm-leads.ts           - Lead queries
      use-lead-actions.ts        - Lead action mutations
  ```

- **CRM Dashboard Features:**
  1. **Lead List View:**
     - Show all investors with key info (name, company, last contact, status)
     - Filter by: Lead source, assigned to, department, last contact date
     - Sort by: Last contact, creation date, name, ticket size
     - Search by: Name, email, company
     - Quick actions: Assign, Add note, Schedule follow-up
  
  2. **Lead Status Pipeline:**
     - Visual pipeline: New → Contacted → Qualified → Proposal → Won/Lost
     - Drag-and-drop to change status (optional)
     - Status counts and conversion rates
  
  3. **Follow-up Reminders:**
     - List of leads needing follow-up
     - Overdue follow-ups highlighted
     - One-click to mark as contacted
  
  4. **Activity Feed:**
     - Recent notes added
     - Recent status changes
     - Recent opportunity interests
     - Recent access requests

- **Add Lead Status Field:**
  ```prisma
  // Add to User model
  leadStatus    LeadStatus @default(NEW)
  nextFollowUp  DateTime?
  
  enum LeadStatus {
    NEW
    CONTACTED
    QUALIFIED
    PROPOSAL_SENT
    WON
    LOST
  }
  ```

- **Migration:** Run `bunx prisma migrate dev --name add_lead_status`

- **TRPC Endpoints:**
  ```typescript
  crmRouter.getLeads - Get leads with filters
  crmRouter.updateLeadStatus - Change lead status
  crmRouter.scheduleFollowUp - Set follow-up date
  crmRouter.getFollowUpReminders - Get overdue follow-ups
  crmRouter.getRecentActivity - Get activity feed
  ```

**Files to Create:**
1. `src/features/crm/components/crm-dashboard.tsx`
2. `src/features/crm/components/leads-table.tsx`
3. `src/features/crm/server/route.ts`
4. `src/features/crm/hooks/use-crm-leads.ts`
5. `src/app/[locale]/(protected)/(crm)/crm/page.tsx` - Replace empty placeholder
6. `src/locales/crm/dashboard/en.ts` and `pt.ts`

**Files to Modify:**
1. `prisma/schema.prisma` - Add leadStatus and nextFollowUp fields
2. `src/trpc/routers/_app.ts` - Add crm router

**Dependencies:** None - THIS IS CRITICAL FOR SALES OPERATIONS

---

#### Task 0.3: Enhance Access Request Workflow (Application Approval Process)
**High-Level Goal:** Add missing features to access request approval workflow so admins can properly onboard new investors.

**Current Problem:**
- Access requests can be APPROVED/REJECTED but nothing happens after approval
- No automatic user creation from approved requests
- No email notification to applicant about approval/rejection
- No way to convert approved request to investor account

**Technical Details:**
- **Location:** `src/features/auth/server/route.ts` and notifications page

- **Enhance updateStatus Mutation:**
  ```typescript
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
      sendEmail: z.boolean().default(true),
      createAccount: z.boolean().default(false), // For APPROVED
      rejectionReason: z.string().optional(), // For REJECTED
    }))
    .mutation(async ({ input }) => {
      const accessRequest = await prisma.accessRequest.update({
        where: { id: input.id },
        data: { status: input.status },
      });
      
      if (input.status === 'APPROVED' && input.createAccount) {
        // Create investor account
        // Send welcome email with credentials
      }
      
      if (input.status === 'APPROVED' && input.sendEmail) {
        // Send approval email
      }
      
      if (input.status === 'REJECTED' && input.sendEmail) {
        // Send rejection email (optional with reason)
      }
      
      return accessRequest;
    }),
  ```

- **Add Actions to Notifications Page:**
  1. "Approve & Create Account" button - Creates user immediately
  2. "Approve Only" button - Marks approved but doesn't create account
  3. "Reject" button - Shows dialog for optional rejection reason
  4. After approval, show "Create Account Now" button if not yet created

- **Create Email Templates:**
  - `src/lib/emails/access-approved.tsx` - Approval notification
  - `src/lib/emails/access-rejected.tsx` - Rejection notification
  - Include login credentials if account was created

- **Add to AccessRequest Schema:**
  ```prisma
  model AccessRequest {
    // ... existing fields
    rejectionReason  String?
    userCreated      Boolean @default(false)
    createdUserId    String?
    createdUser      User? @relation(fields: [createdUserId], references: [id])
  }
  ```

- **Migration:** Run `bunx prisma migrate dev --name enhance_access_requests`

- **UI Enhancements:**
  - Show "Account Created" badge when user was created
  - Show rejection reason in UI
  - Add quick action: "View Investor Profile" (if account created)
  - Add bulk approve/reject functionality

**Files to Modify:**
1. `src/features/auth/server/route.ts` - Enhanced updateStatus mutation
2. `src/app/[locale]/(protected)/(backoffice)/backoffice/notifications/page.tsx` - Enhanced UI
3. `prisma/schema.prisma` - Add new fields

**Files to Create:**
1. `src/lib/emails/access-approved.tsx`
2. `src/lib/emails/access-rejected.tsx`
3. `src/locales/backoffice/notifications/` - Add new translations

**Dependencies:** None - CRITICAL FOR INVESTOR ONBOARDING

---

#### Task 0.4: Add Account Manager Assignment Workflow
**High-Level Goal:** Make it easy to assign and reassign account managers to opportunities from the backoffice.

**Current Problem:**
- Account managers can be assigned during opportunity creation
- No way to add/remove account managers after creation
- No UI to see which opportunities an account manager handles
- No way to reassign opportunities when team members change

**Technical Details:**
- **Location:** `src/features/opportunities/server/route.ts` and editor components

- **Add TRPC Mutations:**
  ```typescript
  addAccountManager: adminProcedure
    .input(z.object({
      opportunityId: z.string(),
      opportunityType: z.enum(['MNA', 'REAL_ESTATE']),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Verify user is TEAM or ADMIN
      // Create OpportunityAccountManager record
    }),
  
  removeAccountManager: adminProcedure
    .input(z.object({
      opportunityId: z.string(),
      opportunityType: z.enum(['MNA', 'REAL_ESTATE']),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Remove OpportunityAccountManager record
    }),
  
  getAccountManagers: protectedProcedure
    .input(z.object({
      opportunityId: z.string(),
      opportunityType: z.enum(['MNA', 'REAL_ESTATE']),
    }))
    .query(async ({ input }) => {
      // Get list of account managers for opportunity
    }),
  ```

- **UI Components:**
  1. **Account Managers Section in Editor:**
     - Display current account managers with avatars
     - "Add Account Manager" button
     - Remove button for each manager
     - Modal to select team member from list
  
  2. **Account Manager Dashboard:**
     - Create `/backoffice/team/[userId]/page.tsx`
     - Show all opportunities assigned to team member
     - Quick stats (active, concluded, pending tasks)
     - Filter and search capabilities
  
  3. **Team Overview Page:**
     - Create `/backoffice/team/page.tsx`
     - List all TEAM/ADMIN users
     - Show opportunity counts per team member
     - Workload distribution chart

- **Add React Hooks:**
  - `useAccountManagers(opportunityId, type)` - Get managers
  - `useAddAccountManager()` - Add manager
  - `useRemoveAccountManager()` - Remove manager

**Files to Create:**
1. `src/features/opportunities/components/account-managers-section.tsx`
2. `src/features/opportunities/hooks/use-account-managers.ts`
3. `src/app/[locale]/(protected)/(backoffice)/backoffice/team/page.tsx`
4. `src/app/[locale]/(protected)/(backoffice)/backoffice/team/[userId]/page.tsx`

**Files to Modify:**
1. `src/features/opportunities/server/route.ts` - Add mutations
2. `src/features/editor/components/m&a-editor.tsx` - Add account managers section
3. `src/features/editor/components/real-estate-editor.tsx` - Add account managers section

**Dependencies:** None - IMPORTANT FOR TEAM MANAGEMENT

---

#### Task 0.5: Implement Bulk Actions for Opportunities
**High-Level Goal:** Allow admins to perform bulk operations on multiple opportunities at once.

**Current Problem:**
- Must edit opportunities one at a time
- No way to bulk update status, assignments, or other fields
- Time-consuming for large-scale management operations

**Technical Details:**
- **Location:** `src/features/opportunities/` components and server

- **Add TRPC Mutations:**
  ```typescript
  bulkUpdateStatus: adminProcedure
    .input(z.object({
      ids: z.array(z.string()),
      status: z.enum(['ACTIVE', 'INACTIVE', 'CONCLUDED']),
      type: z.enum(['MNA', 'REAL_ESTATE']),
    }))
    .mutation(async ({ input }) => {
      // Update multiple opportunities
    }),
  
  bulkAddAccountManager: adminProcedure
    .input(z.object({
      opportunityIds: z.array(z.string()),
      opportunityType: z.enum(['MNA', 'REAL_ESTATE']),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Add account manager to multiple opportunities
    }),
  
  bulkDelete: adminProcedure
    .input(z.object({
      ids: z.array(z.string()),
      type: z.enum(['MNA', 'REAL_ESTATE']),
    }))
    .mutation(async ({ input }) => {
      // Delete multiple opportunities (with confirmation)
    }),
  ```

- **UI Components:**
  1. Add checkbox selection to opportunity lists
  2. Bulk action toolbar appears when items selected
  3. Actions available:
     - Change status
     - Assign account manager
     - Delete (with confirmation)
     - Export selected
  4. Progress indicator for bulk operations
  5. Success/error summary after completion

**Files to Create:**
1. `src/features/opportunities/components/bulk-action-toolbar.tsx`
2. `src/features/opportunities/hooks/use-bulk-actions.ts`

**Files to Modify:**
1. `src/features/opportunities/server/route.ts` - Add bulk mutations
2. `src/features/opportunities/components/m&a-opportunities.tsx` - Add selection UI
3. `src/features/opportunities/components/real-estate-opportunities.tsx` - Add selection UI

**Dependencies:** Task 0.1 (status management) should be done first

---

#### Task 0.6: Add Quick Stats Dashboard for Backoffice Home
**High-Level Goal:** Replace the empty backoffice home page with useful overview stats and quick actions.

**Current Problem:**
- Backoffice home (`/backoffice/page.tsx`) shows minimal content
- No quick overview of business operations
- Have to navigate to different pages to see basic metrics

**Technical Details:**
- **Location:** `src/app/[locale]/(protected)/(backoffice)/backoffice/page.tsx`

- **Dashboard Widgets:**
  1. **Quick Stats Cards:**
     - Active Opportunities (M&A + Real Estate)
     - Pending Access Requests (with alert if > 5)
     - New Investor Interests (last 7 days)
     - Opportunities Concluded (this month)
     - Follow-ups Due Today (from CRM)
  
  2. **Recent Activity Feed:**
     - Last 10 activities across the platform
     - New opportunities created
     - Status changes
     - New access requests
     - New investor interests
  
  3. **Quick Actions:**
     - "Create M&A Opportunity" button
     - "Create Real Estate Opportunity" button
     - "Review Access Requests" button
     - "View All Investors" button
  
  4. **Upcoming Tasks:**
     - Follow-ups scheduled for today/this week
     - Opportunities needing attention
     - Unassigned opportunities

- **TRPC Endpoints:**
  ```typescript
  dashboard.getOverview - Get all quick stats
  dashboard.getRecentActivity - Get activity feed
  dashboard.getUpcomingTasks - Get tasks/reminders
  ```

**Files to Create:**
1. `src/features/dashboard/components/backoffice-dashboard.tsx`
2. `src/features/dashboard/components/quick-stats.tsx`
3. `src/features/dashboard/components/recent-activity.tsx`
4. `src/features/dashboard/components/upcoming-tasks.tsx`
5. `src/features/dashboard/server/route.ts`

**Files to Modify:**
1. `src/app/[locale]/(protected)/(backoffice)/backoffice/page.tsx` - Add dashboard
2. `src/trpc/routers/_app.ts` - Add dashboard router

**Dependencies:** Works better after Tasks 0.1-0.3, but can be done independently

---

### Priority 1: Critical Missing Features (Foundation)

#### Task 1.1: Add Commission Tracking Fields to Database Schema
**High-Level Goal:** Enable tracking of commission rates and calculations for investor deals.

**Technical Details:**
- **Location:** `prisma/schema.prisma`
- **Action:** Add commission-related fields to the `User` model
- **Specific Fields to Add:**
  ```prisma
  // Add to User model
  commissionRate           Float?    // Commission percentage (e.g., 2.5 for 2.5%)
  totalCommissionsEarned   Float?    // Lifetime commissions earned
  ```
- **Migration:** Run `bunx prisma migrate dev --name add_commission_fields`
- **Update Files:**
  - `src/features/investors/server/route.ts` - Add fields to invite/update mutations
  - `src/features/investors/components/*` - Add commission fields to forms
  - Regenerate Prisma client: `bunx prisma generate`

**Dependencies:** None (can be done immediately)

---

#### Task 1.2: Create Commission Dashboard/Report Feature
**High-Level Goal:** Build a dashboard for TEAM/ADMIN users to view and manage commission data.

**Technical Details:**
- **Location:** Create new feature module at `src/features/commissions/`
- **Files to Create:**
  1. `src/features/commissions/server/route.ts` - TRPC router for commission queries
  2. `src/features/commissions/components/commission-dashboard.tsx` - Main dashboard UI
  3. `src/features/commissions/components/commission-table.tsx` - Table of commissions
  4. `src/features/commissions/hooks/use-commissions.ts` - React Query hooks
  5. `src/app/[locale]/(protected)/(backoffice)/backoffice/commissions/page.tsx` - Page route
  6. `src/locales/backoffice/commissions/en.ts` and `pt.ts` - Translations

- **TRPC Endpoints to Implement:**
  - `commissions.getAll` - Get all commission records with filters
  - `commissions.getByUser` - Get commissions for a specific investor
  - `commissions.getTotals` - Get aggregated commission totals
  - `commissions.calculateProjected` - Calculate projected commissions based on active deals

- **UI Components Needed:**
  - Commission overview cards (total earned, pending, this month, this quarter)
  - Filterable table (by user, date range, opportunity type)
  - Export to CSV functionality
  - Detail view for individual commission records

- **Integration Points:**
  - Link from investor detail page to their commission history
  - Add commission display to opportunity detail pages
  - Include in analytics dashboard

**Dependencies:** Task 1.1 must be completed first

---

#### Task 1.3: Implement Commission Calculation Logic
**High-Level Goal:** Automatically calculate commissions when opportunities are marked as CONCLUDED.

**Technical Details:**
- **Location:** `src/features/opportunities/server/route.ts` and new `src/lib/commissions.ts`

- **Create Helper Functions:**
  ```typescript
  // src/lib/commissions.ts
  export async function calculateCommission(opportunityId: string, type: 'MNA' | 'REAL_ESTATE')
  export async function recordCommission(userId: string, amount: number, opportunityId: string)
  ```

- **Modify Existing Mutations:**
  - `mergerAndAcquisitionRouter.update` - When status changes to CONCLUDED
  - `realEstateRouter.update` - When status changes to CONCLUDED
  - Add commission calculation trigger
  - Create commission records for client acquisitioner and account managers

- **Create Commission Records Table:**
  ```prisma
  model Commission {
    id            String   @id @default(cuid())
    userId        String
    user          User     @relation(fields: [userId], references: [id])
    opportunityId String
    opportunityType OpportunityType
    amount        Float
    percentage    Float
    status        CommissionStatus @default(PENDING)
    paidAt        DateTime?
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt
  }

  enum CommissionStatus {
    PENDING
    PAID
    CANCELLED
  }
  ```

- **Migration:** Run `bunx prisma migrate dev --name add_commission_records`

**Dependencies:** Task 1.1 must be completed first

---

### Priority 2: Data Enhancement & Business Logic

#### Task 2.1: Add Real Estate Translation Support
**High-Level Goal:** Extend AI translation to Real Estate descriptions (currently only M&A is translated).

**Technical Details:**
- **Location:** `src/features/opportunities/server/route.ts` (Real Estate router)
- **Action:** Add translation event emission in Real Estate create/update mutations
- **Files to Modify:**
  1. Real Estate `create` mutation - Add after Prisma create:
     ```typescript
     if (description) {
       await inngest.send({
         name: "opportunity/translate-description",
         data: {
           opportunityId: realEstate.id,
           description,
         },
       });
     }
     ```
  2. Real Estate `update` mutation - Add same logic when description changes
  3. Test with sample Real Estate opportunity creation

**Dependencies:** None (inngest function already handles both types)

---

#### Task 2.2: Enhance Investor Filtering in CRM
**High-Level Goal:** Add more advanced filtering options for investors in the CRM view.

**Technical Details:**
- **Location:** `src/features/investors/server/route.ts` and related components
- **Add New Filter Parameters:**
  - Commission rate range (min/max)
  - Last contact date range
  - Department filter (MNA, CRE, BOTH)
  - Lead responsible filter
  - Strategy and segment multi-select
  - Marketing list opt-in status

- **Files to Modify:**
  1. `src/features/investors/server/route.ts` - Add filters to `getMany` query
  2. `src/features/investors/params.ts` - Add URL parameters for new filters
  3. `src/features/investors/components/*` - Update filter UI components
  4. `src/locales/backoffice/investors/` - Add translations for new filters

**Dependencies:** None

---

#### Task 2.3: Implement Bulk Operations for Investors
**High-Level Goal:** Allow TEAM/ADMIN users to perform bulk operations on selected investors.

**Technical Details:**
- **Location:** Create new mutations in `src/features/investors/server/route.ts`
- **Mutations to Add:**
  - `bulkUpdateLeadResponsible` - Assign lead responsible to multiple investors
  - `bulkUpdateDepartment` - Update department for multiple investors
  - `bulkExport` - Export selected investors to CSV
  - `bulkDelete` - Delete multiple investor accounts (ADMIN only)

- **UI Components:**
  - Add checkbox selection to investor table
  - Bulk action dropdown menu
  - Confirmation dialogs for destructive actions

**Dependencies:** None

---

### Priority 3: Advanced Analytics & Reporting

#### Task 3.1: Add Financial Metrics to Analytics
**High-Level Goal:** Track financial performance metrics in the analytics dashboard.

**Technical Details:**
- **Location:** `src/features/opportunities/server/analytics.ts`
- **New Analytics Queries to Add:**
  - Total deal value (sum of equity/enterprise values for CONCLUDED opportunities)
  - Average deal size by type (M&A vs Real Estate)
  - IRR analysis (average expected vs actual)
  - Geographic breakdown (by location)
  - Investment strategy breakdown
  - Monthly revenue projections

- **Schema Additions:**
  ```prisma
  model OpportunityAnalytics {
    // Add financial tracking
    dealValue       Float?
    commissionValue Float?
    closedDate      DateTime?
    actualIRR       Float?
  }
  ```

- **Migration:** Run `bunx prisma migrate dev --name add_financial_analytics`

- **UI Components:**
  - Revenue dashboard card
  - Deal size comparison chart
  - Geographic heatmap (using react-leaflet already installed)
  - Strategy performance comparison

**Dependencies:** None, but works better after Task 1.3

---

#### Task 3.2: Build Investor Activity Dashboard
**High-Level Goal:** Create dashboard showing investor engagement metrics.

**Technical Details:**
- **Location:** Create `src/features/dashboard/components/investor-activity.tsx`
- **Metrics to Track:**
  - Most active investors (by views, interests, NDAs)
  - Recently registered investors
  - Investors with no activity (need follow-up)
  - Interest conversion rate (views → interests → NDAs)
  - Average time to NDA signature

- **TRPC Endpoints:**
  - `analytics.getInvestorActivity` - Get activity metrics
  - `analytics.getEngagementFunnel` - Views → Interests → NDAs conversion
  - `analytics.getInactiveInvestors` - List investors needing follow-up

- **Page Route:** `src/app/[locale]/(protected)/(backoffice)/backoffice/analytics/investors/page.tsx`

**Dependencies:** None

---

#### Task 3.3: Add Export Functionality for Analytics
**High-Level Goal:** Allow exporting analytics data to CSV/Excel for external reporting.

**Technical Details:**
- **Location:** Add export utilities at `src/lib/export-utils.ts`
- **Export Functions Needed:**
  - `exportOpportunitiesToCSV` - All opportunities with filters
  - `exportAnalyticsToCSV` - Analytics data by date range
  - `exportInvestorsToCSV` - Investor list with interests
  - `exportCommissionsToCSV` - Commission report

- **UI Integration:**
  - Add export button to analytics page header
  - Add export button to opportunity tables
  - Add export button to investor tables
  - Export configuration modal (date range, fields selection)

- **Implementation Notes:**
  - Use server action or API route to generate files
  - Consider using `xlsx` package for Excel format: `bun add xlsx`
  - Add rate limiting to prevent abuse

**Dependencies:** None

---

### Priority 4: User Experience Improvements

#### Task 4.1: Implement Advanced Search Across All Entities
**High-Level Goal:** Global search functionality to find opportunities, investors, and records quickly.

**Technical Details:**
- **Location:** Create `src/features/search/` module
- **Search Scope:**
  - Opportunities (M&A and Real Estate) by name, description, industry
  - Investors by name, email, company
  - Access requests by name, email, company
  - Notes content

- **Implementation Approach:**
  1. Create unified search TRPC endpoint: `search.global`
  2. Add search component to header/navigation
  3. Use keyboard shortcut (Cmd/Ctrl + K) to open search
  4. Display results categorized by entity type
  5. Quick navigation to result detail pages

- **Files to Create:**
  - `src/features/search/server/route.ts` - Search router
  - `src/features/search/components/global-search.tsx` - Search modal
  - `src/features/search/components/search-results.tsx` - Results display

- **Consider:** Using PostgreSQL full-text search or Algolia for better performance

**Dependencies:** None

---

#### Task 4.2: Add Notification Center
**High-Level Goal:** Centralized notification system for all user alerts.

**Technical Details:**
- **Location:** Create `src/features/notifications/` module
- **Notification Types:**
  - New access requests (already partially implemented)
  - Opportunity status changes
  - New investor interests
  - NDA signatures
  - Translation job completions
  - System announcements

- **Schema Addition:**
  ```prisma
  model Notification {
    id        String   @id @default(cuid())
    userId    String
    user      User     @relation(fields: [userId], references: [id])
    type      NotificationType
    title     String
    message   String
    link      String?
    read      Boolean  @default(false)
    createdAt DateTime @default(now())
  }

  enum NotificationType {
    ACCESS_REQUEST
    OPPORTUNITY_STATUS
    INVESTOR_INTEREST
    NDA_SIGNED
    TRANSLATION_COMPLETE
    SYSTEM
  }
  ```

- **Migration:** Run `bunx prisma migrate dev --name add_notifications`

- **Components:**
  - Notification bell icon in header with badge count
  - Notification dropdown list
  - Notification preferences page
  - Mark as read/unread functionality

- **Integration:**
  - Update existing Pusher events to also create notification records
  - Add notification creation to relevant mutations

**Dependencies:** None

---

#### Task 4.3: Improve Mobile Responsiveness
**High-Level Goal:** Optimize all pages for mobile and tablet devices.

**Technical Details:**
- **Pages to Audit:**
  - Opportunity list and detail pages
  - Investor CRM tables
  - Analytics charts
  - Forms (create/edit opportunities, investors)

- **Improvements Needed:**
  - Convert tables to mobile-friendly card layouts below md breakpoint
  - Optimize chart sizing for small screens
  - Improve form layouts for mobile input
  - Add mobile-specific navigation patterns
  - Test on actual devices (iOS Safari, Android Chrome)

- **Testing Checklist:**
  - [ ] Test all forms on mobile (320px width minimum)
  - [ ] Verify tables/cards are scrollable and readable
  - [ ] Ensure touch targets are at least 44x44px
  - [ ] Test navigation menu on mobile
  - [ ] Verify charts render correctly

**Dependencies:** None

---

### Priority 5: Testing & Documentation

#### Task 5.1: Add Automated Tests
**High-Level Goal:** Implement comprehensive test coverage for critical features.

**Technical Details:**
- **Testing Framework:** Set up Vitest (compatible with Bun)
  ```bash
  bun add -d vitest @vitest/ui
  ```

- **Test Categories:**
  1. **Unit Tests:**
     - `src/lib/analytics.ts` - Analytics helper functions
     - `src/lib/generate-password.ts` - Password generation
     - Commission calculation logic (once implemented)

  2. **Integration Tests:**
     - TRPC routers (opportunity CRUD, investor CRUD)
     - Better Auth flows
     - Inngest functions (translation)

  3. **E2E Tests:** (Optional - using Playwright)
     - User login flow
     - Create opportunity flow
     - Investor invitation flow
     - Analytics dashboard loading

- **Files to Create:**
  - `vitest.config.ts` - Vitest configuration
  - `src/**/__tests__/` - Test files alongside source
  - `.github/workflows/test.yml` - CI/CD test workflow

- **Scripts to Add to package.json:**
  ```json
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
  ```

**Dependencies:** None, but should be ongoing throughout development

---

#### Task 5.2: Create Comprehensive API Documentation
**High-Level Goal:** Document all TRPC endpoints for team reference.

**Technical Details:**
- **Location:** Create `docs/api-reference.md`
- **Document Each Router:**
  - Opportunities (M&A and Real Estate)
  - Investors
  - Users
  - Analytics
  - Investment Interests
  - Access Requests
  - Commissions (once implemented)

- **Documentation Format for Each Endpoint:**
  ```markdown
  ### `router.procedureName`
  **Type:** Query | Mutation
  **Auth:** Public | Protected | Admin
  **Input Schema:** (Zod schema description)
  **Returns:** (Return type description)
  **Example Usage:**
  ```typescript
  const { data } = trpc.router.procedureName.useQuery({ ... })
  ```
  **Notes:** Any special considerations or business logic
  ```

- **Auto-Generate:** Consider using a tool to auto-generate from TRPC schema

**Dependencies:** None

---

#### Task 5.3: Update Environment Setup Documentation
**High-Level Goal:** Make it easier for new developers to set up the project.

**Technical Details:**
- **Location:** Update `README.md` and create `docs/setup-guide.md`
- **Add Missing Information:**
  - Step-by-step local database setup (PostgreSQL with Docker)
  - How to get API keys for all services (Inngest, Pusher, Resend, etc.)
  - Common setup issues and troubleshooting
  - How to seed the database with test data
  - Development best practices

- **Create Docker Compose File:**
  ```yaml
  # docker-compose.yml
  version: '3.8'
  services:
    postgres:
      image: postgres:15
      environment:
        POSTGRES_USER: harbor
        POSTGRES_PASSWORD: harbor
        POSTGRES_DB: harbor
      ports:
        - "5432:5432"
      volumes:
        - postgres_data:/var/lib/postgresql/data
  ```

- **Create Seed Script:**
  - `prisma/seed.ts` - Script to create sample data
  - Sample users (ADMIN, TEAM, USER roles)
  - Sample M&A opportunities
  - Sample Real Estate opportunities
  - Sample interests and analytics

**Dependencies:** None

---

### Priority 6: Production Readiness

#### Task 6.1: Add Database Backup Strategy
**High-Level Goal:** Implement automated database backups and disaster recovery plan.

**Technical Details:**
- **Documentation Needed:** `docs/backup-and-recovery.md`
- **Backup Strategy:**
  - Automated daily backups of PostgreSQL
  - Point-in-time recovery capability
  - Backup retention policy (30 days minimum)
  - Geographic redundancy

- **If Using Vercel Postgres:**
  - Configure automatic backups in Vercel dashboard
  - Document restoration procedure

- **If Self-Hosted:**
  - Set up `pg_dump` cron job
  - Store backups in S3 or similar
  - Create restoration script and test it

**Dependencies:** None, but critical before production

---

#### Task 6.2: Implement Monitoring and Alerting
**High-Level Goal:** Set up comprehensive monitoring for production issues.

**Technical Details:**
- **Tools Already Configured:**
  - Sentry for error tracking ✅

- **Additional Monitoring Needed:**
  1. **Uptime Monitoring:**
     - Consider Vercel Analytics or UptimeRobot
     - Monitor API endpoints health

  2. **Performance Monitoring:**
     - Database query performance (slow query log)
     - TRPC endpoint response times
     - Inngest job execution times

  3. **Alerts to Configure:**
     - 5xx error rate threshold
     - Database connection failures
     - Inngest job failures (translation errors)
     - Pusher connection issues
     - Email delivery failures (Resend)

  4. **Dashboard Setup:**
     - Create Grafana or Datadog dashboard
     - Key metrics: Request rate, error rate, latency, database connections

- **Documentation:** `docs/monitoring.md`

**Dependencies:** None, but should be done before production launch

---

#### Task 6.3: Security Audit and Hardening
**High-Level Goal:** Ensure application security best practices are implemented.

**Technical Details:**
- **Security Checklist:**
  - [ ] All API routes require authentication (check protectedProcedure usage)
  - [ ] Admin routes require admin role (check adminProcedure usage)
  - [ ] Input validation on all user inputs (Zod schemas)
  - [ ] SQL injection prevention (Prisma protects, but verify raw queries)
  - [ ] XSS prevention (React escapes by default, check dangerouslySetInnerHTML)
  - [ ] CSRF protection (Better Auth handles session cookies securely)
  - [ ] Rate limiting on auth endpoints
  - [ ] File upload size limits (Uploadthing)
  - [ ] Environment variables never exposed to client (check NEXT_PUBLIC_ vars)
  - [ ] Dependency vulnerability scan (`bun audit`)

- **Security Features to Add:**
  1. **Rate Limiting:**
     - Add rate limiting middleware for login/signup
     - Consider using Vercel Edge Middleware for global rate limiting

  2. **Audit Logging:**
     - Log all admin actions (user creation, opportunity deletion, etc.)
     - Create audit log table:
       ```prisma
       model AuditLog {
         id        String   @id @default(cuid())
         userId    String
         action    String
         entityType String
         entityId  String
         changes   Json?
         ipAddress String?
         createdAt DateTime @default(now())
       }
       ```

  3. **Content Security Policy:**
     - Configure CSP headers in `next.config.ts`
     - Restrict script sources, frame ancestors, etc.

**Dependencies:** None, critical for production

---

### Priority 7: Nice-to-Have Features

#### Task 7.1: Add Email Digest Notifications
**High-Level Goal:** Send daily/weekly email summaries to investors and team members.

**Technical Details:**
- **Location:** Create `src/inngest/functions/email-digest.ts`
- **Digest Types:**
  - Investor digest: New opportunities matching their interests
  - Team digest: New access requests, investor interests, opportunity updates
  - Admin digest: Platform metrics, errors, activity summary

- **Implementation:**
  - Create Inngest cron job (runs daily at 9 AM)
  - Query relevant data based on user preferences
  - Generate HTML email using React Email templates
  - Send via Resend API

- **User Preferences:**
  - Add email preferences to User model
  - Allow users to opt in/out of digests
  - Choose digest frequency (daily, weekly, never)

**Dependencies:** None

---

#### Task 7.2: Implement Document Management System
**High-Level Goal:** Allow uploading and organizing multiple documents per opportunity.

**Technical Details:**
- **Schema Addition:**
  ```prisma
  model Document {
    id            String   @id @default(cuid())
    name          String
    fileKey       String   // Uploadthing file key
    fileUrl       String
    fileSize      Int
    mimeType      String
    category      DocumentCategory
    
    // Polymorphic relation
    mergerAndAcquisitionId String?
    mergerAndAcquisition   MergerAndAcquisition? @relation(fields: [mergerAndAcquisitionId], references: [id])
    
    realEstateId String?
    realEstate   RealEstate? @relation(fields: [realEstateId], references: [id])
    
    uploadedBy   String
    uploader     User @relation(fields: [uploadedBy], references: [id])
    createdAt    DateTime @default(now())
  }

  enum DocumentCategory {
    FINANCIAL_STATEMENT
    PRESENTATION
    NDA
    CONTRACT
    REPORT
    OTHER
  }
  ```

- **Features:**
  - Upload multiple documents per opportunity
  - Categorize documents by type
  - Version history
  - Access control based on NDA status
  - Document search

**Dependencies:** None

---

#### Task 7.3: Add Comparison Tool for Opportunities
**High-Level Goal:** Allow investors to compare multiple opportunities side-by-side.

**Technical Details:**
- **Location:** Create `src/features/opportunities/components/comparison-tool.tsx`
- **Functionality:**
  - Select 2-4 opportunities to compare
  - Display key metrics in table format:
    - Financial metrics (sales, EBITDA, IRR)
    - Location/industry
    - Investment requirements
    - Expected returns
  - Highlight differences
  - Export comparison to PDF

- **UI/UX:**
  - Add "Add to Compare" button on opportunity cards
  - Comparison floating button with selected count
  - Full-page comparison view
  - Print-friendly layout

**Dependencies:** None

---

## Implementation Order Recommendation

Based on dependencies and business value, here's the recommended implementation order:

### 🚨 PHASE 0: CRITICAL CRM & BACKOFFICE (Week 1) - CLIENT PRIORITY
**These MUST be done first - they block core business operations!**

1. **Task 0.1: Opportunity Status Management** (2-3 days)
   - Allow closing deals/marking as concluded
   - Critical for analytics and commission tracking
   
2. **Task 0.3: Access Request Workflow Enhancement** (1-2 days)
   - Complete the investor onboarding process
   - Auto-create accounts from approvals
   
3. **Task 0.2: Complete CRM Dashboard** (2-3 days)
   - Build functional lead management system
   - Critical for sales team operations

4. **Task 0.6: Backoffice Home Dashboard** (1 day)
   - Quick overview of operations
   - Quick win for better UX

### Phase 1: Complete Team Management (Week 2)
5. **Task 0.4: Account Manager Assignment Workflow** (2 days)
   - Manage team assignments
   - Team workload visibility

6. **Task 0.5: Bulk Actions for Opportunities** (1-2 days)
   - Speed up administrative tasks
   - Depends on Task 0.1

7. **Task 2.1: Add Real Estate translation support** (1 day - quick win)
   - Already mostly implemented
   - Just needs triggering

### Phase 2: Financial Tracking (Weeks 3-4)
8. **Task 1.1: Add commission tracking fields** (1 day)
   - Database schema foundation

9. **Task 1.3: Implement commission calculation logic** (3 days)
   - Automatic commission on deal close
   - Depends on Task 0.1 and Task 1.1

10. **Task 1.2: Create commission dashboard** (3-4 days)
    - View and manage commissions
    - Depends on Task 1.1 and Task 1.3

### Phase 3: Enhanced CRM & Analytics (Weeks 5-6)
11. **Task 2.2: Enhance investor filtering** (2 days)
    - Better CRM filtering options

12. **Task 3.1: Add financial metrics to analytics** (2-3 days)
    - Enhanced analytics dashboard

13. **Task 3.2: Build investor activity dashboard** (2-3 days)
    - Track investor engagement

14. **Task 2.3: Implement bulk operations for investors** (2 days)
    - Bulk investor management

### Phase 4: User Experience Improvements (Week 7)
15. **Task 4.2: Add notification center** (3 days)
    - Centralized notifications

16. **Task 4.1: Implement advanced search** (2-3 days)
    - Global search functionality

17. **Task 4.3: Improve mobile responsiveness** (2-3 days)
    - Mobile optimization

### Phase 5: Stability & Documentation (Week 8)
18. **Task 5.3: Update environment setup documentation** (1 day)
    - Better onboarding for developers

19. **Task 5.2: Create API documentation** (2 days)
    - Complete API reference

20. **Task 3.3: Add export functionality** (2 days)
    - Export reports and data

### Phase 6: Production Readiness (Week 9) - BEFORE LAUNCH
21. **Task 6.3: Security audit and hardening** (3 days)
    - Critical security review

22. **Task 6.1: Add database backup strategy** (1 day)
    - Disaster recovery

23. **Task 6.2: Implement monitoring and alerting** (2 days)
    - Production monitoring

### Phase 7: Testing & Quality (Week 10)
24. **Task 5.1: Add automated tests** (4-5 days ongoing)
    - Test coverage for critical paths

### Phase 8: Optional Enhancements (Week 11+)
25. **Task 7.1: Email digest notifications** (2-3 days)
26. **Task 7.2: Document management system** (4-5 days)
27. **Task 7.3: Comparison tool** (2-3 days)

---

## 🎯 First Week Action Plan (PRIORITY 0)

### Day 1-2: Opportunity Status Management (Task 0.1)
- Add updateStatus mutation to TRPC
- Add status controls to editor headers
- Add status filters to lists
- Test status workflow

### Day 3: Access Request Enhancements (Task 0.3)
- Enhance approval workflow
- Add email notifications
- Add account creation on approval

### Day 4-5: CRM Dashboard (Task 0.2)
- Build CRM lead list
- Add lead filters and search
- Add lead status pipeline
- Add follow-up reminders

### Day 6: Backoffice Dashboard (Task 0.6)
- Build quick stats cards
- Add recent activity feed
- Add quick actions

**End of Week 1:** Core CRM and backoffice workflows functional ✅

---

## Notes for Developer

### Quick Start Guide
1. **Understand the architecture** - Read `docs/harbor-guide.md` thoroughly
2. **Set up local environment** - Follow README.md setup instructions
3. **Explore the codebase** - Start with `src/features/` to understand feature organization
4. **Check existing patterns** - Look at how opportunities are implemented before adding new features
5. **Test locally** - Use `bun dev` and `bun inngest:dev` for development
6. **Use Prisma Studio** - Run `bun prisma:studio` to inspect and modify database

### Key Files to Understand
- `prisma/schema.prisma` - Database schema (source of truth)
- `src/trpc/init.ts` - TRPC setup with auth middleware
- `src/lib/auth.ts` - Better Auth configuration
- `src/inngest/functions.ts` - Background jobs (translation)
- `src/features/*/server/route.ts` - TRPC routers for each feature

### Development Best Practices
- Always create migrations for schema changes: `bunx prisma migrate dev --name descriptive_name`
- Use TRPC for all client-server communication (type-safe)
- Follow existing patterns for new features (consistency)
- Add localization keys for all user-facing text
- Test on both Portuguese and English locales
- Use protectedProcedure for authenticated routes, adminProcedure for admin-only

### Common Pitfalls to Avoid
- Don't edit migration SQL files directly (create new migrations instead)
- Don't skip `bunx prisma generate` after schema changes
- Don't expose sensitive data in client components
- Don't forget to invalidate TRPC queries after mutations
- Don't commit `.env.local` file

### Getting Help
- Architecture questions: See `docs/harbor-guide.md` section 2-7
- TRPC patterns: Check existing routers in `src/features/*/server/`
- UI components: See `src/components/ui/` (Radix + shadcn)
- Prisma queries: Check `src/features/*/server/route.ts` examples

---

## Success Criteria

### Minimum Viable Product (Week 1 - CLIENT PRIORITY)
Before showing to client or going to limited production:
- [ ] **Task 0.1** - Admins can close deals (change status to CONCLUDED)
- [ ] **Task 0.3** - Access requests can be approved and auto-create investor accounts
- [ ] **Task 0.2** - CRM dashboard shows all leads with filtering and search
- [ ] **Task 0.6** - Backoffice home shows overview stats and quick actions
- [ ] All PRIORITY 0 features are tested and working
- [ ] Access request to investor account workflow tested end-to-end
- [ ] Opportunity creation to closure workflow tested end-to-end

### Phase 1 Complete (Week 2)
- [ ] **Task 0.4** - Account managers can be assigned/reassigned
- [ ] **Task 0.5** - Bulk operations work for opportunities
- [ ] Team workload is visible and manageable
- [ ] Real Estate translations working automatically

### Before Production Launch (Week 9)
- [ ] All Priority 0, 1, and 2 tasks are completed
- [ ] All Priority 6 tasks (Production Readiness) are completed
- [ ] Application is tested on multiple browsers and devices
- [ ] Documentation is up-to-date
- [ ] All environment variables are documented
- [ ] Database backup and recovery procedures are tested
- [ ] Monitoring and alerting is configured
- [ ] Security audit findings are addressed
- [ ] Key features have automated tests
- [ ] Commission tracking is functional
- [ ] Mobile responsiveness is adequate
- [ ] Performance is acceptable under expected load

---

*Last Updated: November 28, 2024*
*Project: Harbor Partners (harbor001)*
*Developer: External contractor taking over from previous developer*
