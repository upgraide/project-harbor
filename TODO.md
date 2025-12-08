# Project Status & Roadmap

## 1. System Definitions

### Backoffice ("The Engine Room")
**Purpose:** Platform Administration & Product Management.
**Users:** Admins, Team Members.
**Key Functions:**
- **Opportunity Management:** Creating, editing, translating, and closing M&A and Real Estate deals.
- **User Management:** Managing system access, roles, and team assignments.
- **Platform Operations:** Handling access requests, system settings, and global analytics.
- **Content Control:** Ensuring data quality and proper localization of deal flows.

### CRM ("The Sales Floor")
**Purpose:** Investor Relations & Lead Management.
**Users:** Sales Representatives, Account Managers.
**Key Functions:**
- **Lead Pipeline:** Tracking investors from "New" to "Converted".
- **Relationship Management:** Logging notes, scheduling follow-ups, and tracking interests.
- **Deal Matching:** Connecting investors to specific opportunities.
- **Performance Tracking:** Monitoring conversion rates and commissions.

---

## 2. Current Project State

### ✅ Implemented & Working
- **Authentication:** Secure login/signup with role-based access (User, Team, Admin).
- **Data Model:** Comprehensive schema for Users, Opportunities (M&A/Real Estate), and Analytics.
- **Basic Backoffice:** Structure exists for listing and editing opportunities.
- **Infrastructure:** Database, TRPC API, and background job systems (Inngest) are set up.

### 🚧 Partially Implemented
- **CRM:** The section exists but the dashboard is empty. Lead management logic is in the database but lacks a UI.
- **Opportunity Lifecycle:** Deals can be created but not easily "closed" or managed through a status workflow in the UI.
- **Access Requests:** Backend logic exists, but the approval-to-account-creation workflow is incomplete.

### ❌ Missing / To Do
- **Lead Management UI:** No interface for sales reps to manage their pipeline.
- **Commission System:** No tracking of earnings or commission logic.
- **Advanced Workflows:** Bulk actions, automated notifications, and deep analytics are missing.

---

## 3. Roadmap & User Stories

### Priority 0: Client Requests (Immediate Focus)

#### Story 0.1: CRM Backend Foundation (The Base)
**As a** Developer,
**I want to** ensure the CRM data models and API endpoints are robust and complete,
**So that** all future CRM features (Dashboard, Pipeline, Mobile) have a solid foundation to build upon.

*   **Acceptance Criteria:**
    *   **Database:** Verify `User` model supports all Lead fields (Status, Source, Priority, Tags, Notes).
    *   **API (TRPC):** Create/Update `crmRouter` with endpoints to:
        *   `getLeads`: Fetch investors with pagination, sorting, and filtering.
        *   `updateLeadStatus`: Move leads through the pipeline (New -> Contacted -> Qualified).
        *   `addNote`: Append interaction notes to a lead.
    *   **Migration:** Ensure all necessary schema changes are applied and documented.

#### Story 0.2: Opportunity Closure & Real Values
**As an** Admin,
**I want to** mark an opportunity as "Concluded" and record the final financial details,
**So that** I can track actual revenue and distinguish between active and closed business.

*   **Acceptance Criteria:**
    *   **Status Workflow:** UI allows changing status from `ACTIVE` to `CONCLUDED`.
    *   **Closure Modal:** When selecting "Concluded", a modal prompts for "Real Values":
        *   Final Sale Price / Deal Value.
        *   Commission Rate (%) and Final Commission Amount.
        *   Closing Date.
    *   **Data Persistence:** These values are saved to the database (e.g., `OpportunityAnalytics` or new fields).
    *   **Visibility:** Concluded deals are visually distinct and removed from the "Active" pipeline.

### Priority 1: Core Operations (Next Steps)

#### Story 1.1: CRM Dashboard & Lead List (UI)
**As a** Sales Representative,
**I want to** view a dashboard of all my assigned leads and investors,
**So that** I can prioritize my follow-ups and manage my pipeline.

*   **Acceptance Criteria:**
    *   CRM Page displays a table/list of investors (consuming the API from Story 0.1).
    *   List includes key columns: Name, Company, Status, Last Contact, Assigned To.
    *   Filters available for: Lead Status, Lead Source, and Assigned Team Member.
    *   Search functionality by name or company.

#### Story 1.2: Investor Onboarding (Access Requests)
**As an** Admin,
**I want to** approve an access request and automatically create a user account for them,
**So that** I can onboard new investors seamlessly without manual data entry.

*   **Acceptance Criteria:**
    *   Notification/Request list shows pending requests.
    *   "Approve" action triggers an email notification to the user.
    *   "Approve & Create" action automatically generates a User account and sends credentials.
    *   "Reject" action allows entering a reason and notifying the user.

#### Story 1.3: Backoffice Overview Dashboard
**As an** Admin,
**I want to** see a high-level overview of platform activity upon logging in,
**So that** I can quickly identify urgent tasks and business health.

*   **Acceptance Criteria:**
    *   Dashboard displays cards for: Active Opportunities, Pending Requests, New Leads (Week).
    *   Activity Feed shows recent system events (logins, updates, creations).
    *   Quick Action buttons for common tasks (Create Opportunity, View Leads).

---

### Priority 2: Team & Workflow Efficiency

#### Story 2.1: Account Manager Assignment
**As an** Admin,
**I want to** assign specific Account Managers to opportunities,
**So that** ownership is clear and the right team member handles inquiries.
### Priority 3: Financials & Analytics

#### Story 3.1: Financial Analytics (Aggregated)
**As an** Admin,
**I want to** view aggregated financial data (Deal Volume, Potential Revenue),
**So that** I can make informed strategic decisions.

*   **Acceptance Criteria:**
    *   Analytics page includes charts for Deal Value over time.
    *   Breakdown by Opportunity Type (M&A vs Real Estate).
    *   Geographic heatmap of deal locations.
**As a** Sales Rep or Admin,
**I want to** track commission rates and earned amounts for closed deals,
**So that** compensation is transparent and accurate.

*   **Acceptance Criteria:**
    *   User profile includes "Commission Rate" field.
    *   System calculates commission amount when a deal is marked "Concluded".
    *   Commission Dashboard shows Total Earned, Pending, and Paid amounts.

#### Story 3.2: Financial Analytics
**As an** Admin,
**I want to** view aggregated financial data (Deal Volume, Potential Revenue),
**So that** I can make informed strategic decisions.

*   **Acceptance Criteria:**
    *   Analytics page includes charts for Deal Value over time.
    *   Breakdown by Opportunity Type (M&A vs Real Estate).
    *   Geographic heatmap of deal locations.

---

### Priority 4: Platform Enhancements

#### Story 4.1: Notification Center
**As a** User,
**I want to** receive in-app notifications for important events,
**So that** I don't miss updates on my deals or requests.

*   **Acceptance Criteria:**
    *   Notification bell icon in the header.
    *   List of unread notifications (Status changes, New assignments).
    *   Ability to mark notifications as read.

#### Story 4.2: Global Search
**As a** User,
**I want to** search across the entire platform (Deals, Investors, Notes),
**So that** I can find information quickly without navigating menus.

*   **Acceptance Criteria:**
    *   Global search bar (Cmd+K).
    *   Results categorized by type (Opportunity, Investor, Note).
    *   Clicking a result navigates to the detail page.
