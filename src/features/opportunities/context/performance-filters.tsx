"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

export type PerformanceFilters = {
  leadResponsibleId: string | null;
};

type PerformanceFiltersContextType = {
  filters: PerformanceFilters;
  setLeadResponsibleId: (id: string | null) => void;
  resetFilters: () => void;
};

const PerformanceFiltersContext = createContext<
  PerformanceFiltersContextType | undefined
>(undefined);

const defaultFilters: PerformanceFilters = {
  leadResponsibleId: null,
};

export const PerformanceFiltersProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [filters, setFilters] = useState<PerformanceFilters>(defaultFilters);

  const setLeadResponsibleId = (id: string | null) => {
    setFilters((prev) => ({ ...prev, leadResponsibleId: id }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <PerformanceFiltersContext.Provider
      value={{
        filters,
        setLeadResponsibleId,
        resetFilters,
      }}
    >
      {children}
    </PerformanceFiltersContext.Provider>
  );
};

export const usePerformanceFilters = () => {
  const context = useContext(PerformanceFiltersContext);
  if (context === undefined) {
    throw new Error(
      "usePerformanceFilters must be used within a PerformanceFiltersProvider"
    );
  }
  return context;
};
