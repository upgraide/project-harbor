import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to get analytics for a Merger & Acquisition opportunity
 */
export const useMnaAnalytics = (opportunityId: string) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.analytics.getMnaAnalytics.queryOptions({ opportunityId })
  );
};

/**
 * Hook to get analytics for a Real Estate opportunity
 */
export const useRealEstateAnalytics = (opportunityId: string) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.analytics.getRealEstateAnalytics.queryOptions({ opportunityId })
  );
};

/**
 * Hook to get aggregated analytics across all opportunities
 */
export const useAggregatedAnalytics = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getAggregatedAnalytics.queryOptions());
};

/**
 * Hook to get top viewed opportunities
 */
export const useTopViewedOpportunities = (
  limit = 10,
  type: "all" | "mna" | "realEstate" = "all"
) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.analytics.getTopViewed.queryOptions({
      limit,
      type,
    })
  );
};

/**
 * Hook to increment view count for a Merger & Acquisition opportunity
 */
export const useIncrementMnaViews = () => {
  const trpc = useTRPC();
  return useMutation(trpc.analytics.incrementMnaViews.mutationOptions());
};

/**
 * Hook to increment view count for a Real Estate opportunity
 */
export const useIncrementRealEstateViews = () => {
  const trpc = useTRPC();
  return useMutation(trpc.analytics.incrementRealEstateViews.mutationOptions());
};
