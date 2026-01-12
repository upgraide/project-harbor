import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useAnalyticsFilters } from "@/features/opportunities/context/analytics-filters";

/**
 * Hook to get available years from actual data
 */
export const useAvailableYears = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getAvailableYears.queryOptions());
};

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

/**
 * Hook to get backoffice KPIs for analytics overview
 */
export const useBackofficeKPIs = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getBackofficeKPIs.queryOptions());
};

/**
 * Hook to get backoffice KPIs with quarter-over-quarter trends
 */
export const useBackofficeKPIsWithTrends = () => {
  const trpc = useTRPC();
  const { filters } = useAnalyticsFilters();
  return useQuery(
    trpc.analytics.getBackofficeKPIsWithTrends.queryOptions({
      year: filters.year,
      period: filters.period,
      opportunityType: filters.opportunityType,
    })
  );
};

/**
 * Hook to get assets transacted growth by month (last 12 months)
 */
export const useAssetsTransactedByMonth = () => {
  const trpc = useTRPC();
  const { filters } = useAnalyticsFilters();
  return useQuery(
    trpc.analytics.getAssetsTransactedByMonth.queryOptions({
      year: filters.year,
      period: filters.period,
      opportunityType: filters.opportunityType,
    })
  );
};

/**
 * Hook to get AUM growth by month (last 12 months)
 */
export const useAumByMonth = () => {
  const trpc = useTRPC();
  const { filters } = useAnalyticsFilters();
  return useQuery(
    trpc.analytics.getAumByMonth.queryOptions({
      year: filters.year,
      period: filters.period,
      opportunityType: filters.opportunityType,
    })
  );
};

/**
 * Hook to get deal pipeline funnel data
 */
export const usePipelineFunnel = () => {
  const trpc = useTRPC();
  const { filters } = useAnalyticsFilters();
  return useQuery(
    trpc.analytics.getPipelineFunnel.queryOptions({
      year: filters.year,
      period: filters.period,
      opportunityType: filters.opportunityType,
    })
  );
};

/**
 * Hook to get client segmentation by investor type
 */
export const useClientSegmentation = () => {
  const trpc = useTRPC();
  const { filters } = useAnalyticsFilters();
  return useQuery(
    trpc.analytics.getClientSegmentation.queryOptions({
      year: filters.year,
      period: filters.period,
      opportunityType: filters.opportunityType,
    })
  );
};

/**
 * Hook to get sector breakdown
 */
export const useSectorBreakdown = () => {
  const trpc = useTRPC();
  const { filters } = useAnalyticsFilters();
  return useQuery(
    trpc.analytics.getSectorBreakdown.queryOptions({
      year: filters.year,
      period: filters.period,
      opportunityType: filters.opportunityType,
    })
  );
};

/**
 * Hook to get pipeline value (deals in progress)
 */
export const usePipelineValue = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getPipelineValue.queryOptions());
};

/**
 * Hook to get average deal size
 */
export const useAverageDealSize = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getAverageDealSize.queryOptions());
};

/**
 * Hook to get client activity (no contact for >30 days)
 */
export const useClientActivity = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getClientActivity.queryOptions());
};

/**
 * Hook to get advisor performance metrics
 */
export const useAdvisorPerformance = () => {
  const trpc = useTRPC();
  return useQuery(trpc.analytics.getAdvisorPerformance.queryOptions());
};

