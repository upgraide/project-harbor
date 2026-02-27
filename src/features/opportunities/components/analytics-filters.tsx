"use client";

import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type OpportunityType,
  type Period,
  useAnalyticsFilters,
} from "@/features/opportunities/context/analytics-filters";
import { useScopedI18n } from "@/locales/client";
import { useTRPC } from "@/trpc/client";

export const AnalyticsFilters = () => {
  const t = useScopedI18n("backoffice.analytics");
  const trpc = useTRPC();
  const { filters, setYear, setPeriod, setOpportunityType, resetFilters } =
    useAnalyticsFilters();

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

  const opportunityTypeOptions: Array<{
    value: OpportunityType;
    label: string;
  }> = [
    { value: "all", label: "All Opportunities" },
    { value: "mna", label: "M&A" },
    { value: "realEstate", label: "Real Estate" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <label className="font-medium text-sm">Year:</label>
        <Select
          onValueChange={(value) => {
            setYear(value);
          }}
          value={filters.year}
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
          <label className="font-medium text-sm">Period:</label>
          <Select
            onValueChange={(value) => setPeriod(value as Period)}
            value={filters.period}
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
        <label className="font-medium text-sm">View:</label>
        <Select
          onValueChange={(value) =>
            setOpportunityType(value as OpportunityType)
          }
          value={filters.opportunityType}
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
        className="ml-auto gap-2"
        onClick={resetFilters}
        size="sm"
        variant="ghost"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};
