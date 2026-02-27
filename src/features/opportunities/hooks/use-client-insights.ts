import { useQuery } from "@tanstack/react-query";
import { useClientInsightsFilters } from "@/features/opportunities/context/client-insights-filters";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to get list of advisors for filtering
 */
export const useAdvisors = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getAdvisors.queryOptions());
};

/**
 * Hook to get available regions from database
 */
export const useAvailableRegions = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getAvailableRegions.queryOptions());
};

/**
 * Hook to get client insights statistics
 */
export const useClientInsightsStats = () => {
  const trpc = useTRPC();
  const { filters } = useClientInsightsFilters();
  return useQuery(
    trpc.analytics.getClientInsightsStats.queryOptions({
      advisorId: filters.advisorId,
      clientType: filters.clientType,
      region: filters.region,
      investmentRange: filters.investmentRange,
    })
  );
};

/**
 * Hook to get clients by region
 */
export const useClientsByRegion = () => {
  const trpc = useTRPC();
  const { filters } = useClientInsightsFilters();
  return useQuery(
    trpc.analytics.getClientsByRegion.queryOptions({
      advisorId: filters.advisorId,
      clientType: filters.clientType,
      investmentRange: filters.investmentRange,
    })
  );
};

/**
 * Hook to get client acquisition trend
 */
export const useClientAcquisitionTrend = () => {
  const trpc = useTRPC();
  const { filters } = useClientInsightsFilters();
  return useQuery(
    trpc.analytics.getClientAcquisitionTrend.queryOptions({
      advisorId: filters.advisorId,
      clientType: filters.clientType,
      region: filters.region,
      investmentRange: filters.investmentRange,
    })
  );
};

/**
 * Hook to get clients by investment range
 */
export const useClientsByInvestmentRange = () => {
  const trpc = useTRPC();
  const { filters } = useClientInsightsFilters();
  return useQuery(
    trpc.analytics.getClientsByInvestmentRange.queryOptions({
      advisorId: filters.advisorId,
      clientType: filters.clientType,
      region: filters.region,
    })
  );
};

/**
 * Hook to get clients per advisor
 */
export const useClientsPerAdvisor = () => {
  const trpc = useTRPC();
  const { filters } = useClientInsightsFilters();
  return useQuery(
    trpc.analytics.getClientsPerAdvisor.queryOptions({
      clientType: filters.clientType,
      region: filters.region,
      investmentRange: filters.investmentRange,
    })
  );
};

/**
 * Hook to get client type distribution
 */
export const useClientTypeDistribution = () => {
  const trpc = useTRPC();
  const { filters } = useClientInsightsFilters();
  return useQuery(
    trpc.analytics.getClientTypeDistribution.queryOptions({
      advisorId: filters.advisorId,
      region: filters.region,
      investmentRange: filters.investmentRange,
    })
  );
};
