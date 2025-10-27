import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
 * Automatically invalidates analytics queries on success
 */
export const useIncrementMnaViews = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.analytics.incrementMnaViews.mutationOptions({
      onSuccess: () => {
        // Invalidate all analytics queries to refetch with updated data
        queryClient.invalidateQueries(
          trpc.analytics.getTopViewed.queryOptions({ limit: 5, type: "all" })
        );
        queryClient.invalidateQueries(
          trpc.analytics.getAggregatedAnalytics.queryOptions()
        );
      },
    })
  );
};

/**
 * Hook to increment view count for a Real Estate opportunity
 * Automatically invalidates analytics queries on success
 */
export const useIncrementRealEstateViews = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.analytics.incrementRealEstateViews.mutationOptions({
      onSuccess: () => {
        // Invalidate all analytics queries to refetch with updated data
        queryClient.invalidateQueries(
          trpc.analytics.getTopViewed.queryOptions({ limit: 5, type: "all" })
        );
        queryClient.invalidateQueries(
          trpc.analytics.getAggregatedAnalytics.queryOptions()
        );
      },
    })
  );
};
