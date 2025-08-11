# PM Handoff Prompt - Harbor Partners Investment Platform

## Context
You are taking over as Product Manager for the Harbor Partners Investment Platform project. A comprehensive Project Brief has been created (see `/docs/project-brief.md`). The project has an aggressive timeline with an October 2025 MVP deadline.

## Your Immediate Mission
Before any development begins, you must work with Rodrigo (lead developer) to ensure all requirements are validated with Harbor Partners. This validation-first approach will prevent costly rework and ensure on-time delivery.

## Step 1: Create Validation Questions List (Tomorrow)
Work with Rodrigo to review the Project Brief and create a comprehensive list of questions for Harbor Partners. Focus on:

### User Flow Validations
- What happens when an investor clicks "Not Interested"? How detailed should the feedback form be?
- Can investors save opportunities to review later? 
- Should investors see opportunities they previously rejected?
- How long do NDAs remain valid? One-time sign or expiration period?
- Can investors download documents or only view online?
- What happens if an investor's profile changes? Retroactive access changes?

### Business Rules Clarifications
- Commission calculation: What happens when multiple team members share a role?
- Commission conflicts: How to handle disputes or overlapping claims?
- Opportunity lifecycle: When is an opportunity considered "closed" or "expired"?
- Investor limits: Maximum opportunities shown per investor at once?
- Document versioning: How to handle updated documents on live opportunities?

### CRM Specifics
- Exact pipeline stages for M&A vs Real Estate deals - are they different?
- What triggers a lead to move between stages?
- Which fields are mandatory vs optional for each opportunity type?
- How should duplicate investor detection work?
- What constitutes an "active" vs "inactive" investor?

### Permission Matrix
- Exactly what can Team Members do vs Admins?
- Who can delete/archive opportunities?
- Who can modify commission percentages?
- Who can export data and reports?
- Who can send mass emails to investors?

### Technical Validations
- Maximum file sizes for different document types?
- How many documents typically per opportunity?
- Expected response time for NDA signing?
- Backup and recovery requirements?
- Data retention policies for archived opportunities?

### Analytics Priorities
- Top 5 most important metrics for the dashboard?
- Frequency of report generation (real-time, daily, weekly)?
- Which reports need export functionality?
- Custom report builder needed or fixed reports sufficient?

### Email Communications
- Templates needed for each trigger event?
- Unsubscribe handling for marketing vs transactional emails?
- Approval workflow for mass communications?
- Personalization requirements?

## Step 2: Client Validation Meeting
- Schedule within next 2-3 days
- Include Rodrigo and designer if possible
- Record meeting for reference
- Get written confirmation on critical decisions

## Step 3: Design Phase Coordination
After validation meeting:
- Brief designer on validated requirements
- Ensure mockups cover all user types and workflows
- Include error states and edge cases
- Plan for responsive design across devices

## Step 4: Mockup Review Process
- Internal review with Rodrigo first
- Identify any technical constraints
- Present to Harbor Partners for approval
- Document all feedback and change requests
- Get written approval before proceeding

## Step 5: PRD Creation
Only after mockup approval:
- Transform validated requirements into detailed user stories
- Include acceptance criteria for each feature
- Define API contracts and data models
- Specify integration requirements in detail
- Create test scenarios for QA

## Critical Success Factors
1. **No assumptions** - Validate everything with the client
2. **Written approvals** - Document all decisions
3. **Design-first** - Mockups before code
4. **Iterative validation** - Show progress early and often
5. **Risk mitigation** - Flag concerns immediately

## Key Risks to Address in Validation
- 2-month timeline feasibility with single developer
- Integration complexity with OneDrive/Box Sign
- Performance with 500+ users and large documents
- Data migration approach and timing
- Training and change management plan

## Communication Protocol
- Daily standups with Rodrigo during development
- Weekly status updates to Harbor Partners
- Immediate escalation of blockers
- All decisions documented in writing

## Resources
- Project Brief: `/docs/project-brief.md`
- Harbor Partners contacts: [Provided separately]
- API documentation: [OneDrive, Box Sign links]
- Design system: [To be provided by Harbor Partners]

## Your Success Metrics
- Zero requirements changes after development starts
- Client approval on first mockup iteration: >80%
- Development rework: <10% of effort
- On-time delivery: October 2025

Remember: The path to successful delivery is through thorough validation, not rushed development. Take the time upfront to get it right.