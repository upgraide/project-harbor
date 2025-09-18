import type { OpportunityData } from "../constants/opportunity-constants";

interface FieldHandlers {
  onEdit: (field: string, value: any) => void;
  onDelete: (field: string, label: string) => void;
}

export const createPreNDAData = (opportunity: OpportunityData, handlers?: FieldHandlers) =>
  [
    { label: "Type (Buy In/Buy Out)", value: opportunity.type, suffix: "", field: "type" },
    { label: "Type Details", value: opportunity.typeDetails, suffix: "", field: "typeDetails" },
    { label: "Industry", value: opportunity.industry, suffix: "", field: "industry" },
    { label: "Sub Industry", value: opportunity.subIndustry, suffix: "", field: "subIndustry" },
    { label: "Dimension", isHeader: true as const },
    { label: "Sales", value: opportunity.sales, suffix: "M€", field: "sales" },
    { label: "EBITDA (Range)", value: opportunity.ebitda, suffix: "M€", field: "ebitda" },
    {
      label: "EBITDA (Normalized)",
      value: opportunity.ebitdaNormalized,
      suffix: "M€",
      field: "ebitdaNormalized",
    },
    { label: "Net Debt", value: opportunity.netDebt, suffix: "M€", field: "netDebt" },
    { label: "CAGR", isHeader: true as const },
    { label: "Sales", value: opportunity.salesCAGR, suffix: "%", field: "salesCAGR" },
    { label: "EBITDA", value: opportunity.ebitdaCAGR, suffix: "%", field: "ebitdaCAGR" },
    { label: "Asset", isHeader: true as const },
    {
      label: "Asset Included",
      value: opportunity.assetIncluded ? "Yes" : "No",
      suffix: "",
      field: "assetIncluded",
    },
    { label: "Asset Value", value: opportunity.assetValue, suffix: "M€", field: "assetValue" },
  ].map((item) => ({
    ...item,
    onEdit: "isHeader" in item ? undefined : handlers ? () => handlers.onEdit(item.field, item.value) : undefined,
    onDelete: "isHeader" in item ? undefined : handlers ? () => handlers.onDelete(item.field, item.label) : undefined,
  }));

export const createPostNDAData = (opportunity: OpportunityData, handlers?: FieldHandlers) =>
  [
    {
      label: "Entreprive Value",
      value: opportunity.entrepriveValue,
      suffix: "M€",
      field: "entrepriveValue",
    },
    { label: "Equity Value", value: opportunity.equityValue, suffix: "M€", field: "equityValue" },
    {
      label: "EV/EBITDA (Entry)",
      value: opportunity.evDashEbitdaEntry,
      suffix: "x",
      field: "evDashEbitdaEntry",
    },
    {
      label: "EV/EBITDA (Exit)",
      value: opportunity.evDashEbitdaExit,
      suffix: "x",
      field: "evDashEbitdaExit",
    },
    { label: "EBITDA Margin", value: opportunity.ebitdaMargin, suffix: "%", field: "ebitdaMargin" },
    {
      label: "Free Cash Flow (FCF)",
      value: opportunity.freeCashFlow,
      suffix: "M€",
      field: "freeCashFlow",
    },
    {
      label: "Net Debt/EBITDA",
      value: opportunity.netDebtDashEbitda,
      suffix: "",
      field: "netDebtDashEbitda",
    },
    {
      label: "Capex Intensity",
      value: opportunity.capexIntensity,
      suffix: "%",
      field: "capexIntensity",
    },
    {
      label: "Working Capital Needs",
      value: opportunity.workingCapitalNeeds,
      suffix: "M€",
      field: "workingCapitalNeeds",
    },
  ].map((item) => ({
    ...item,
    onEdit: "isHeader" in item ? undefined : handlers ? () => handlers.onEdit(item.field, item.value) : undefined,
    onDelete: "isHeader" in item ? undefined : handlers ? () => handlers.onDelete(item.field, item.label) : undefined,
  }));
