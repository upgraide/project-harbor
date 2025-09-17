import type { OpportunityData } from "../constants/opportunity-constants";
import { ACTION_HANDLERS } from "../constants/opportunity-constants";

export const createPreNDAData = (opportunity: OpportunityData) =>
  [
    { label: "Type (Buy In/Buy Out)", value: opportunity.type, suffix: "" },
    { label: "Type Details", value: opportunity.typeDetails, suffix: "" },
    { label: "Industry", value: opportunity.industry, suffix: "" },
    { label: "Sub Industry", value: opportunity.subIndustry, suffix: "" },
    { label: "Dimension", isHeader: true as const },
    { label: "Sales", value: opportunity.sales, suffix: "M€" },
    { label: "EBITDA (Range)", value: opportunity.ebitda, suffix: "M€" },
    {
      label: "EBITDA (Normalized)",
      value: opportunity.ebitdaNormalized,
      suffix: "M€",
    },
    { label: "Net Debt", value: opportunity.netDebt, suffix: "M€" },
    { label: "CAGR", isHeader: true as const },
    { label: "Sales", value: opportunity.salesCAGR, suffix: "%" },
    { label: "EBITDA", value: opportunity.ebitdaCAGR, suffix: "%" },
    { label: "Asset", isHeader: true as const },
    {
      label: "Asset Included",
      value: opportunity.assetIncluded ? "Yes" : "No",
      suffix: "",
    },
    { label: "Asset Value", value: opportunity.assetValue, suffix: "M€" },
  ].map((item) => ({
    ...item,
    onEdit: "isHeader" in item ? undefined : ACTION_HANDLERS.editMetric,
    onDelete: "isHeader" in item ? undefined : ACTION_HANDLERS.deleteMetric,
  }));

export const createPostNDAData = (opportunity: OpportunityData) =>
  [
    {
      label: "Entreprive Value",
      value: opportunity.entrepriveValue,
      suffix: "M€",
    },
    { label: "Equity Value", value: opportunity.equityValue, suffix: "M€" },
    {
      label: "EV/EBITDA (Entry)",
      value: opportunity.evDashEbitdaEntry,
      suffix: "x",
    },
    {
      label: "EV/EBITDA (Exit)",
      value: opportunity.evDashEbitdaExit,
      suffix: "x",
    },
    { label: "EBITDA Margin", value: opportunity.ebitdaMargin, suffix: "%" },
    {
      label: "Free Cash Flow (FCF)",
      value: opportunity.freeCashFlow,
      suffix: "M€",
    },
    {
      label: "Net Debt/EBITDA",
      value: opportunity.netDebtDashEbitda,
      suffix: "",
    },
    {
      label: "Capex Intensity",
      value: opportunity.capexIntensity,
      suffix: "%",
    },
    {
      label: "Working Capital Needs",
      value: opportunity.workingCapitalNeeds,
      suffix: "M€",
    },
  ].map((item) => ({
    ...item,
    onEdit: ACTION_HANDLERS.editMetric,
    onDelete: ACTION_HANDLERS.deleteMetric,
  }));
