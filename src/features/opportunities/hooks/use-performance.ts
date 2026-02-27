import { useQuery } from "@tanstack/react-query";
import { usePerformanceFilters } from "@/features/opportunities/context/performance-filters";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to get list of lead responsibles for filtering
 */
export const useLeadResponsibles = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getLeadResponsibles.queryOptions());
};

/**
 * Hook to get client activity with performance filters
 */
export const useClientActivityFiltered = () => {
  const trpc = useTRPC();
  const { filters } = usePerformanceFilters();
  return useQuery(
    trpc.analytics.getClientActivity.queryOptions({
      leadResponsibleId: filters.leadResponsibleId,
    })
  );
};
