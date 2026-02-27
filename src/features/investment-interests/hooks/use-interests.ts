"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

/**
 * Hook to get all interests for an M&A opportunity (Team/Admin only)
 */
export const useGetAllMergerAndAcquisitionInterests = (
  opportunityId: string
) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.userInterest.getAllMergerAndAcquisitionInterests.queryOptions({
      opportunityId,
    })
  );
};

/**
 * Hook to get all interests for a Real Estate opportunity (Team/Admin only)
 */
export const useGetAllRealEstateInterests = (opportunityId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.userInterest.getAllRealEstateInterests.queryOptions({
      opportunityId,
    })
  );
};
