"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";

export type OpportunityType = "all" | "mna" | "realEstate";
export type Period = "q1" | "q2" | "q3" | "q4" | "full" | "last7days" | "last30days";

export interface AnalyticsFilters {
  year: string; // "2025", "2026", "allTime"
  period: Period;
  advisorId?: string;
  opportunityType: OpportunityType;
  clientType?: string;
}

interface AnalyticsFiltersContextType {
  filters: AnalyticsFilters;
  setYear: (year: string) => void;
  setPeriod: (period: Period) => void;
  setAdvisorId: (advisorId: string | undefined) => void;
  setOpportunityType: (type: OpportunityType) => void;
  setClientType: (type: string | undefined) => void;
  resetFilters: () => void;
}

const AnalyticsFiltersContext = createContext<
  AnalyticsFiltersContextType | undefined
>(undefined);

const DEFAULT_FILTERS: AnalyticsFilters = {
  year: "2026",
  period: "q1",
  advisorId: undefined,
  opportunityType: "all",
  clientType: undefined,
};

export const AnalyticsFiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_FILTERS);

  const setYear = useCallback((year: string) => {
    setFilters((prev) => ({ ...prev, year }));
  }, []);

  const setPeriod = useCallback((period: Period) => {
    setFilters((prev) => ({ ...prev, period }));
  }, []);

  const setAdvisorId = useCallback((advisorId: string | undefined) => {
    setFilters((prev) => ({ ...prev, advisorId }));
  }, []);

  const setOpportunityType = useCallback((type: OpportunityType) => {
    setFilters((prev) => ({ ...prev, opportunityType: type }));
  }, []);

  const setClientType = useCallback((type: string | undefined) => {
    setFilters((prev) => ({ ...prev, clientType: type }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return (
    <AnalyticsFiltersContext.Provider
      value={{
        filters,
        setYear,
        setPeriod,
        setAdvisorId,
        setOpportunityType,
        setClientType,
        resetFilters,
      }}
    >
      {children}
    </AnalyticsFiltersContext.Provider>
  );
};

export const useAnalyticsFilters = () => {
  const context = useContext(AnalyticsFiltersContext);
  if (context === undefined) {
    throw new Error(
      "useAnalyticsFilters must be used within AnalyticsFiltersProvider"
    );
  }
  return context;
};
