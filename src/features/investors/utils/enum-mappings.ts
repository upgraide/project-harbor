import type {
  Department,
  InvestorClientType,
  InvestorSegment,
  InvestorStrategy,
  LeadPriority,
  LeadSource,
  LeadStatus,
  TeamMember,
} from "@/generated/prisma";

export const investorClientTypeLabels: Record<InvestorClientType, string> = {
  ADVISOR: "Advisor",
  ANGEL_INVESTOR: "Angel Investor",
  BANK: "Bank",
  BRAND: "Brand",
  BROKER: "Broker",
  BUSINESS: "Business",
  CLUB_DEAL_SYNDICATOR: "Club Deal Syndicator",
  DEBT_FUND: "Debt Fund",
  DEVELOPER: "Developer",
  FAMILY_OFFICE: "Family Office",
  FUND_OF_FUND: "Fund of Fund",
  SEARCH_FUND: "Search Fund",
  INVESTOR: "Investor",
  PENSION_FUND: "Pension Fund",
  PRIVATE_DEBT_INVESTOR: "Private Debt Investor",
  PRIVATE_EQUITY_FUND: "Private Equity Fund",
  SMALL_INVESTOR: "Small Investor",
  START_UP: "Start Up",
  TEAM_MEMBER: "Team Member",
  VENTURE_CAPITAL_FUND: "Venture Capital Fund",
  WEALTH_MANAGER: "Wealth Manager",
  CONSTRUCTION_COMPANY: "Construction Company",
  ASSET_MANAGER: "Asset Manager",
  PARTNER: "Partner",
  ARCHITECT: "Architect",
  CONSULTANT: "Consultant",
  PROMOTER: "Promoter",
  OTHER: "Other",
};

export const investorStrategyLabels: Record<InvestorStrategy, string> = {
  AGNOSTIC: "Agnostic",
  MAJORITY_STAKES: "Majority Stakes",
  MINORITY_STAKES: "Minority Stakes",
  GROWTH: "Growth",
  BUSINESS_OPERATOR: "Business Operator",
  BUY_AND_HOLD: "Buy & Hold",
  CONSOLIDATION: "Consolidation",
  LEASE_AND_OPERATE: "Lease and operate",
  SALE_AND_LEASEBACK: "Sale & Leaseback",
  CORE: "Core",
  FIX_AND_FLIP: "Fix&Flip",
  REFURBISHMENT: "Refurbishment",
  VALUE_ADD: "Value-add",
  OPPORTUNISTIC: "Opportunistic",
  DEVELOPMENT: "Development",
  LONG_TERM_DEBT: "Long Term Debt",
  MEZZ_BRIDGE_DEBT: "Mezz/Bridge Debt",
};

export const investorSegmentLabels: Record<InvestorSegment, string> = {
  AGNOSTIC: "Agnostic",
  BUSINESS_SERVICES: "Business Services",
  CONSTRUCTION_AND_REAL_ESTATE: "Construction & Real Estate",
  CONSTRUCTION_INDUSTRY: "Construction Industry",
  CONSUMER_AND_RETAIL: "Consumer & Retail",
  DATA_CENTER: "Data Center",
  ENERGY_AND_INFRASTRUCTURE: "Energy & Infrastructure",
  FINANCIAL_SERVICES: "Financial Services",
  FITNESS: "Fitness",
  FOOD_INDUSTRY: "Food Industry",
  FOOD_RETAIL: "Food Retail",
  HEALTHCARE_AND_PHARMACEUTICALS: "Healthcare & Pharmaceuticals",
  IT: "IT",
  TMT: "TMT (Technology, Media & Telecom)",
  TRADING: "Trading",
  TRANSFORMATION_INDUSTRY: "Transformation Industry",
  TRANSPORTS: "Transports",
  MIXED: "Mixed",
  HOSPITALITY: "Hospitality",
  LOGISTICS_AND_INDUSTRIAL: "Logistics & Industrial",
  OFFICE: "Office",
  RESIDENTIAL: "Residential",
  SENIOR_LIVING: "Senior Living",
  SHOPPING_CENTERS: "Shopping Centers",
  STREET_RETAIL: "Street Retail",
  STUDENT_HOUSING: "Student Housing",
  DEBT: "Debt",
};

export const teamMemberLabels: Record<TeamMember, string> = {
  MAS: "MAS",
  FB: "FB",
  FC: "FC",
  FRS: "FRS",
  GBA: "GBA",
  JV: "JV",
  JDV: "JDV",
  JG: "JG",
  LM: "LM",
  RS: "RS",
  RA: "RA",
  SM: "SM",
  TE: "TE",
  JCM: "JCM",
};

export const departmentLabels: Record<Department, string> = {
  MNA: "M&A",
  CRE: "CRE",
  MNA_AND_CRE: "M&A + CRE",
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  MEETING_SCHEDULED: "Meeting Scheduled",
  PROPOSAL_SENT: "Proposal Sent",
  NEGOTIATION: "Negotiation",
  CONVERTED: "Converted",
  LOST: "Lost",
  ON_HOLD: "On Hold",
  NURTURE: "Nurture",
};

export const leadPriorityLabels: Record<LeadPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const leadSourceLabels: Record<LeadSource, string> = {
  WEBSITE: "Website",
  REFERRAL: "Referral",
  COLD_OUTREACH: "Cold Outreach",
  NETWORKING_EVENT: "Networking Event",
  LINKEDIN: "LinkedIn",
  EMAIL_CAMPAIGN: "Email Campaign",
  PARTNER: "Partner",
  EXISTING_CLIENT: "Existing Client",
  ACCESS_REQUEST: "Access Request",
  OTHER: "Other",
};

export const investorClientTypeOptions = Object.entries(
  investorClientTypeLabels
).map(([value, label]) => ({ value: value as InvestorClientType, label }));

export const investorStrategyOptions = Object.entries(
  investorStrategyLabels
).map(([value, label]) => ({ value: value as InvestorStrategy, label }));

export const investorSegmentOptions = Object.entries(investorSegmentLabels).map(
  ([value, label]) => ({ value: value as InvestorSegment, label })
);

export const teamMemberOptions = Object.entries(teamMemberLabels).map(
  ([value, label]) => ({ value: value as TeamMember, label })
);

export const departmentOptions = Object.entries(departmentLabels).map(
  ([value, label]) => ({ value: value as Department, label })
);
