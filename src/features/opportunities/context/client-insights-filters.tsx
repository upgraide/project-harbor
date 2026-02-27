"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

export type ClientInsightsFilters = {
  advisorId: string | null;
  clientType: string | null;
  region: string | null;
  investmentRange: string | null;
};

type ClientInsightsFiltersContextType = {
  filters: ClientInsightsFilters;
  setAdvisorId: (advisorId: string | null) => void;
  setClientType: (clientType: string | null) => void;
  setRegion: (region: string | null) => void;
  setInvestmentRange: (range: string | null) => void;
  resetFilters: () => void;
};

const ClientInsightsFiltersContext = createContext<
  ClientInsightsFiltersContextType | undefined
>(undefined);

const defaultFilters: ClientInsightsFilters = {
  advisorId: null,
  clientType: null,
  region: null,
  investmentRange: null,
};

export const ClientInsightsFiltersProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [filters, setFilters] = useState<ClientInsightsFilters>(defaultFilters);

  const setAdvisorId = (advisorId: string | null) => {
    setFilters((prev) => ({ ...prev, advisorId }));
  };

  const setClientType = (clientType: string | null) => {
    setFilters((prev) => ({ ...prev, clientType }));
  };

  const setRegion = (region: string | null) => {
    setFilters((prev) => ({ ...prev, region }));
  };

  const setInvestmentRange = (range: string | null) => {
    setFilters((prev) => ({ ...prev, investmentRange: range }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <ClientInsightsFiltersContext.Provider
      value={{
        filters,
        setAdvisorId,
        setClientType,
        setRegion,
        setInvestmentRange,
        resetFilters,
      }}
    >
      {children}
    </ClientInsightsFiltersContext.Provider>
  );
};

export const useClientInsightsFilters = () => {
  const context = useContext(ClientInsightsFiltersContext);
  if (context === undefined) {
    throw new Error(
      "useClientInsightsFilters must be used within a ClientInsightsFiltersProvider"
    );
  }
  return context;
};
