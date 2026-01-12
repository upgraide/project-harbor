"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyticsFilters, type OpportunityType, type Period } from "@/features/opportunities/context/analytics-filters";
import { useScopedI18n } from "@/locales/client";
import { RotateCcw } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const AnalyticsFilters = () => {
  const t = useScopedI18n("backoffice.analytics");
  const trpc = useTRPC();
  const {
    filters,
    setYear,
    setPeriod,
    setOpportunityType,
    resetFilters,
  } = useAnalyticsFilters();

  // Fetch available years dynamically
  const { data: availableYears } = useQuery(
    trpc.analytics.getAvailableYears.queryOptions()
  );

  const periodOptions: Array<{ value: Period; label: string }> = [
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "q1", label: "Q1" },
    { value: "q2", label: "Q2" },
    { value: "q3", label: "Q3" },
    { value: "q4", label: "Q4" },
    { value: "full", label: "Full Year" },
  ];

  const opportunityTypeOptions: Array<{ value: OpportunityType; label: string }> = [
    { value: "all", label: "All Opportunities" },
    { value: "mna", label: "M&A" },
    { value: "realEstate", label: "Real Estate" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Year:</label>
        <Select
          value={filters.year}
          onValueChange={(value) => {
            setYear(value);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears?.map((year) => (
              <SelectItem key={year} value={year}>
                {year === "allTime" ? "All Time" : year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.year !== "allTime" && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Period:</label>
          <Select
            value={filters.period}
            onValueChange={(value) => setPeriod(value as Period)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">View:</label>
        <Select
          value={filters.opportunityType}
          onValueChange={(value) => setOpportunityType(value as OpportunityType)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {opportunityTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={resetFilters}
        className="ml-auto gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};
