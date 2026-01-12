"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientInsightsFilters } from "@/features/opportunities/context/client-insights-filters";
import { useAdvisors, useAvailableRegions } from "@/features/opportunities/hooks/use-client-insights";
import { useScopedI18n } from "@/locales/client";

export const ClientInsightsFilters = () => {
  const t = useScopedI18n("backoffice.analytics.clientInsights.filters");
  const {
    filters,
    setAdvisorId,
    setClientType,
    setRegion,
    setInvestmentRange,
    resetFilters,
  } = useClientInsightsFilters();

  const { data: advisors, isLoading: isLoadingAdvisors } = useAdvisors();
  const { data: availableRegions, isLoading: isLoadingRegions } = useAvailableRegions();

  // Define client types (from schema: InvestorClientType enum)
  const clientTypes = [
    { value: "FAMILY_OFFICE", label: "Family Office" },
    { value: "PRIVATE_EQUITY_FUND", label: "Private Equity Fund" },
    { value: "VENTURE_CAPITAL_FUND", label: "Venture Capital Fund" },
    { value: "DEBT_FUND", label: "Debt Fund" },
    { value: "FUND_OF_FUND", label: "Fund of Fund" },
    { value: "PENSION_FUND", label: "Pension Fund" },
    { value: "WEALTH_MANAGER", label: "Wealth Manager" },
    { value: "ASSET_MANAGER", label: "Asset Manager" },
    { value: "ANGEL_INVESTOR", label: "Angel Investor" },
    { value: "INVESTOR", label: "Investor" },
    { value: "SMALL_INVESTOR", label: "Small Investor" },
    { value: "PRIVATE_DEBT_INVESTOR", label: "Private Debt Investor" },
    { value: "ADVISOR", label: "Advisor" },
    { value: "BANK", label: "Bank" },
    { value: "BROKER", label: "Broker" },
    { value: "BUSINESS", label: "Business" },
    { value: "DEVELOPER", label: "Developer" },
    { value: "CONSTRUCTION_COMPANY", label: "Construction Company" },
    { value: "OTHER", label: "Other" },
  ];

  // Investment ranges (from schema: InvestorType enum)
  const investmentRanges = [
    { value: "LESS_THAN_10M", label: "< €10M" },
    { value: "BETWEEN_10M_100M", label: "€10M - €100M" },
    { value: "GREATER_THAN_100M", label: "> €100M" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Advisor Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t("advisor")}</label>
        <Select
          value={filters.advisorId ?? "all"}
          onValueChange={(value) => setAdvisorId(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("advisorPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("advisorPlaceholder")}</SelectItem>
            {isLoadingAdvisors ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              advisors?.map((advisor) => (
                <SelectItem key={advisor.id} value={advisor.id}>
                  {advisor.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Client Type Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t("clientType")}</label>
        <Select
          value={filters.clientType ?? "all"}
          onValueChange={(value) => setClientType(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("clientTypePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("clientTypePlaceholder")}</SelectItem>
            {clientTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Region Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t("region")}</label>
        <Select
          value={filters.region ?? "all"}
          onValueChange={(value) => setRegion(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("regionPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("regionPlaceholder")}</SelectItem>
            {isLoadingRegions ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              availableRegions?.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Investment Range Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">{t("investmentRange")}</label>
        <Select
          value={filters.investmentRange ?? "all"}
          onValueChange={(value) =>
            setInvestmentRange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("investmentRangePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("investmentRangePlaceholder")}</SelectItem>
            {investmentRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium invisible">Reset</label>
        <Button variant="outline" size="icon" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
